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

const getHostname = (value) => {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    return null;
  }
};

const clampInt = (value, fallback, { min, max }) => {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
};

const getAnalytics = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    const days = clampInt(req.query.days, 30, { min: 1, max: 365 });
    const limit = clampInt(req.query.limit, 20, { min: 1, max: 200 });

    const rangeEnd = new Date();
    const rangeStart = new Date();
    rangeStart.setDate(rangeStart.getDate() - days);

    const visitMatch = { linkId: link._id, visitedAt: { $gte: rangeStart, $lte: rangeEnd } };

    const visits = await Visit.find(visitMatch)
      .sort({ visitedAt: -1 })
      .limit(limit);

    const lastVisit = visits[0] || null;

    const dailyClicks = await Visit.aggregate([
      { $match: visitMatch },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const browserStats = await Visit.aggregate([
      { $match: visitMatch },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const countryStats = await Visit.aggregate([
      { $match: visitMatch },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const referrerStats = await Visit.aggregate([
      { $match: visitMatch },
      { $group: { _id: '$referrerHost', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const campaignStats = await Visit.aggregate([
      { $match: { ...visitMatch, utmCampaign: { $ne: null } } },
      { $group: { _id: '$utmCampaign', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        link: formatLink(link),
        analytics: {
          totalClicks: link.clickCount,
          lastVisitedAt: lastVisit ? lastVisit.visitedAt : null,
          range: {
            days,
            start: rangeStart.toISOString(),
            end: rangeEnd.toISOString(),
            limit,
          },
          recentVisits: visits.map((v) => ({
            visitedAt: v.visitedAt,
            device: v.device,
            browser: v.browser,
            os: v.os,
            country: v.country,
            referrerHost: v.referrerHost || 'Direct',
            utmSource: v.utmSource || null,
            utmMedium: v.utmMedium || null,
            utmCampaign: v.utmCampaign || null,
          })),
          dailyClicks: dailyClicks.map((d) => ({ date: d._id, clicks: d.clicks })),
          topBrowsers: browserStats.map((b) => ({ name: b._id || 'Unknown', count: b.count })),
          topCountries: countryStats.map((c) => ({ name: c._id || 'Unknown', count: c.count })),
          topReferrers: referrerStats.map((r) => ({ name: r._id || 'Direct', count: r.count })),
          topCampaigns: campaignStats.map((c) => ({ name: c._id, count: c.count })),
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

    const clientIp = req.ip;
    const referrer = req.get('referer') || req.get('referrer') || null;
    const referrerHost = getHostname(referrer) || 'Direct';
    const utmSource = typeof req.query.utm_source === 'string' ? req.query.utm_source.trim() : null;
    const utmMedium = typeof req.query.utm_medium === 'string' ? req.query.utm_medium.trim() : null;
    const utmCampaign =
      typeof req.query.utm_campaign === 'string' ? req.query.utm_campaign.trim() : null;

    await Promise.all([
      Visit.create({
        linkId: link._id,
        ip: clientIp,
        userAgent: req.headers['user-agent'],
        device: result.device.type || 'desktop',
        browser: result.browser.name || 'Unknown',
        os: result.os.name || 'Unknown',
        country: getCountryFromIp(clientIp),
        referrer,
        referrerHost,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
      }),
      Link.updateOne({ _id: link._id }, { $inc: { clickCount: 1 } }),
    ]);

    let originalUrl;
    try {
      originalUrl = decrypt(link.encryptedUrl, link.urlIv, link.urlAuthTag);
    } catch {
      return redirectToLinkError(res, 'invalid', shortCode);
    }
    return res.redirect(302, originalUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Redirect failed' });
  }
};

const escapeCsv = (value) => {
  if (value === null || value === undefined) return '';
  const raw = String(value);
  if (/[",\n]/.test(raw)) return `"${raw.replace(/"/g, '""')}"`;
  return raw;
};

const exportVisitsCsv = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ success: false, message: 'Link not found' });
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="link-${link.shortCode}-visits.csv"`
    );

    res.write(
      [
        'visitedAt',
        'country',
        'device',
        'browser',
        'os',
        'referrerHost',
        'utmSource',
        'utmMedium',
        'utmCampaign',
      ].join(',') + '\n'
    );

    const cursor = Visit.find({ linkId: link._id }).sort({ visitedAt: -1 }).cursor();
    for await (const visit of cursor) {
      res.write(
        [
          escapeCsv(visit.visitedAt?.toISOString?.() ? visit.visitedAt.toISOString() : visit.visitedAt),
          escapeCsv(visit.country),
          escapeCsv(visit.device),
          escapeCsv(visit.browser),
          escapeCsv(visit.os),
          escapeCsv(visit.referrerHost),
          escapeCsv(visit.utmSource),
          escapeCsv(visit.utmMedium),
          escapeCsv(visit.utmCampaign),
        ].join(',') + '\n'
      );
    }

    res.end();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to export visits' });
  }
};

module.exports = { getAnalytics, getPublicStats, handleRedirect, exportVisitsCsv };
