const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
      index: true,
    },
    visitedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    device: {
      type: String,
      default: 'Unknown',
    },
    browser: {
      type: String,
      default: 'Unknown',
    },
    os: {
      type: String,
      default: 'Unknown',
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    referrer: {
      type: String,
      default: null,
    },
    referrerHost: {
      type: String,
      default: 'Direct',
      index: true,
    },
    utmSource: {
      type: String,
      default: null,
      index: true,
    },
    utmMedium: {
      type: String,
      default: null,
      index: true,
    },
    utmCampaign: {
      type: String,
      default: null,
      index: true,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model('Visit', visitSchema);
