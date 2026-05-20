const Link = require('../models/Link');
const Visit = require('../models/Visit');
const { encrypt, decrypt } = require('../utils/encrypt');
const {
  generateShortCode,
  isValidUrl,
  normalizeUrl,
  isReservedCode,
} = require('../utils/generateShortCode');
const { baseUrl } = require('../config/env');
const QRCode = require('qrcode');

const formatLink = (link) => ({
  id: link._id.toString(),
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
    if (isReservedCode(alias)) {
      throw new Error('This short code is reserved');
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
    if (isReservedCode(code)) continue;
    exists = await Link.findOne({ shortCode: code });
    attempts++;
  }
  if (exists) throw new Error('Could not generate unique short code');
  return code;
};

const createLinkRecord = async (userId, url, customAlias = null, expiresAt = null) => {
  const normalized = normalizeUrl(url);
  if (!isValidUrl(normalized)) {
    throw new Error('Please provide a valid URL');
  }
  const shortCode = await createUniqueShortCode(customAlias);
  const { encryptedUrl, urlIv, urlAuthTag } = encrypt(normalized);
  return Link.create({
    userId,
    shortCode,
    encryptedUrl,
    urlIv,
    urlAuthTag,
    customAlias: customAlias || null,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  });
};

const createLink = async (req, res) => {
  try {
    const { url, customAlias, expiresAt } = req.body;
    let link;
    try {
      link = await createLinkRecord(req.user._id, url, customAlias, expiresAt);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    res.status(201).json({
      success: true,
      message: 'Short link created successfully',
      data: { link: formatLink(link) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create short link' });
  }
};

const bulkCreateLinks = async (req, res) => {
  try {
    const { csv } = req.body;
    if (!csv || typeof csv !== 'string') {
      return res.status(400).json({ success: false, message: 'CSV content is required' });
    }

    const lines = csv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      return res.status(400).json({ success: false, message: 'No URLs found in CSV' });
    }
    if (lines.length > 50) {
      return res.status(400).json({ success: false, message: 'Maximum 50 URLs per bulk upload' });
    }

    const created = [];
    const failed = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      const url = parts[0];
      const alias = parts[1] || null;
      try {
        const link = await createLinkRecord(req.user._id, url, alias);
        created.push(formatLink(link));
      } catch (err) {
        failed.push({ line: i + 1, input: lines[i], reason: err.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${created.length} link(s), ${failed.length} failed`,
      data: {
        created,
        failed,
        summary: { total: lines.length, success: created.length, failed: failed.length },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Bulk upload failed' });
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
    const { url, expiresAt, isActive } = req.body;
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

    if (isActive !== undefined) {
      link.isActive = Boolean(isActive);
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

const checkAlias = async (req, res) => {
  try {
    const { alias } = req.params;
    if (!alias || !/^[a-z0-9-_]{3,20}$/.test(alias.toLowerCase())) {
      return res.json({ available: false, reason: 'Invalid format' });
    }
    if (isReservedCode(alias)) {
      return res.json({ available: false, reason: 'Reserved' });
    }
    const exists = await Link.findOne({ shortCode: alias.toLowerCase() });
    res.json({ available: !exists, reason: exists ? 'Taken' : null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check alias' });
  }
};

module.exports = {
  createLink,
  bulkCreateLinks,
  getLinks,
  deleteLink,
  updateLink,
  getQRCode,
  checkAlias,
  formatLink,
};
