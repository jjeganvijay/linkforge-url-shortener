const Link = require('../models/Link');
const Visit = require('../models/Visit');
const { encrypt, decrypt } = require('../utils/encrypt');
const { generateShortCode, isValidUrl, normalizeUrl } = require('../utils/generateShortCode');
const { baseUrl } = require('../config/env');
const QRCode = require('qrcode');

const formatLink = (link) => ({
  id: link._id,
  shortCode: link.shortCode,
  shortUrl: `${baseUrl}/${link.shortCode}`,
  originalUrl: decrypt(link.encryptedUrl, link.urlIv, link.urlAuthTag),
  customAlias: link.customAlias,
  expiresAt: link.expiresAt,
  isActive: link.isActive,
  clickCount: link.clickCount,
  createdAt: link.createdAt,
});

const createUniqueShortCode = async (preferredCode = null) => {
  if (preferredCode) {
    const alias = preferredCode.trim().toLowerCase();
    if (!/^[a-z0-9-_]{3,20}$/.test(alias)) {
      throw new Error('Custom alias must be 3-20 characters (letters, numbers, -, _)');
    }
    const exists = await Link.findOne({ shortCode: alias });
    if (exists) throw new Error('Custom alias already taken');
    return alias;
  }

  let code;
  let exists = true;
  let attempts = 0;
  while (exists && attempts < 10) {
    code = generateShortCode();
    exists = await Link.findOne({ shortCode: code });
    attempts++;
  }
  if (exists) throw new Error('Could not generate unique short code');
  return code;
};

const createLink = async (req, res) => {
  try {
    const { url, customAlias, expiresAt } = req.body;
    const normalized = normalizeUrl(url);

    if (!isValidUrl(normalized)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid URL' });
    }

    let shortCode;
    try {
      shortCode = await createUniqueShortCode(customAlias);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { encryptedUrl, urlIv, urlAuthTag } = encrypt(normalized);

    const link = await Link.create({
      userId: req.user._id,
      shortCode,
      encryptedUrl,
      urlIv,
      urlAuthTag,
      customAlias: customAlias || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    res.status(201).json({
      success: true,
      message: 'Short link created successfully',
      data: { link: formatLink(link) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create short link' });
  }
};

const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: { links: links.map(formatLink), total: links.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch links' });
  }
};

const deleteLink = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    await Visit.deleteMany({ linkId: link._id });
    await link.deleteOne();

    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete link' });
  }
};

const updateLink = async (req, res) => {
  try {
    const { url, expiresAt } = req.body;
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    if (url) {
      const normalized = normalizeUrl(url);
      if (!isValidUrl(normalized)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid URL' });
      }
      const encrypted = encrypt(normalized);
      link.encryptedUrl = encrypted.encryptedUrl;
      link.urlIv = encrypted.urlIv;
      link.urlAuthTag = encrypted.urlAuthTag;
    }

    if (expiresAt !== undefined) {
      link.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    await link.save();

    res.json({
      success: true,
      message: 'Link updated successfully',
      data: { link: formatLink(link) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update link' });
  }
};

const getQRCode = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    const shortUrl = `${baseUrl}/${link.shortCode}`;
    const qrDataUrl = await QRCode.toDataURL(shortUrl, { width: 300, margin: 2 });

    res.json({
      success: true,
      data: { qrCode: qrDataUrl, shortUrl },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate QR code' });
  }
};

module.exports = { createLink, getLinks, deleteLink, updateLink, getQRCode, formatLink };
