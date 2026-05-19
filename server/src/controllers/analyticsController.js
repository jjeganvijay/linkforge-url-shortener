const Link = require('../models/Link');
const Visit = require('../models/Visit');
const { UAParser } = require('ua-parser-js');
const { decrypt } = require('../utils/encrypt');
const { formatLink } = require('./linkController');
const { getCountryFromIp } = require('../utils/geoip');
const { frontendUrl } = require('../config/env');

const redirectToLinkError = (res, reason, shortCode) => {
  const params = new URLSearchParams({ reason, code: shortCode });
  return res.redirect(302, `${frontendUrl}/link-error?${params.toString()}`);
};

const getAnalytics = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    const visits = await Visit.find({ linkId: link._id })
      .sort({ visitedAt: -1 })
      .limit(20);

    const lastVisit = visits[0] || null;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyClicks = await Visit.aggregate([
      { $match: { linkId: link._id, visitedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        link: formatLink(link),
        analytics: {
          totalClicks: link.clickCount,
          lastVisitedAt: lastVisit ? lastVisit.visitedAt : null,
          recentVisits: visits.map((v) => ({
            visitedAt: v.visitedAt,
            device: v.device,
            browser: v.browser,
            os: v.os,
            country: v.country,
          })),
          dailyClicks: dailyClicks.map((d) => ({ date: d._id, clicks: d.clicks })),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

const getPublicStats = async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.shortCode, isActive: true });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return res.status(410).json({ success: false, message: 'Link has expired' });
    }

    res.json({
      success: true,
      data: {
        shortCode: link.shortCode,
        totalClicks: link.clickCount,
        createdAt: link.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public stats' });
  }
};

const handleRedirect = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const link = await Link.findOne({ shortCode, isActive: true });

    if (!link) {
      return redirectToLinkError(res, 'notfound', shortCode);
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      return redirectToLinkError(res, 'expired', shortCode);
    }

    const parser = new UAParser(req.headers['user-agent']);
    const result = parser.getResult();

    await Visit.create({
      linkId: link._id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      device: result.device.type || 'desktop',
      browser: result.browser.name || 'Unknown',
      os: result.os.name || 'Unknown',
      country: getCountryFromIp(req.ip),
    });

    link.clickCount += 1;
    await link.save();

    const originalUrl = decrypt(link.encryptedUrl, link.urlIv, link.urlAuthTag);
    return res.redirect(302, originalUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Redirect failed' });
  }
};

module.exports = { getAnalytics, getPublicStats, handleRedirect };
