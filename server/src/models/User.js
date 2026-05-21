const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleSub: {
      type: String,
      default: null,
      index: true,
    },
    pictureUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const cascadeDeleteUserData = async (userId) => {
  if (!userId) return;
  const Link = require('./Link');
  const Visit = require('./Visit');

  const links = await Link.find({ userId }, { _id: 1 }).lean();
  const linkIds = links.map((l) => l._id);

  if (linkIds.length > 0) {
    await Visit.deleteMany({ linkId: { $in: linkIds } });
  }
  await Link.deleteMany({ userId });
};

// Cascade deletes when deleting via Mongoose model APIs.
userSchema.pre('deleteOne', { document: true, query: false }, async function () {
  await cascadeDeleteUserData(this._id);
});

userSchema.pre('findOneAndDelete', async function () {
  const filter = this.getFilter();
  const user = await this.model.findOne(filter, { _id: 1 }).lean();
  if (user?._id) {
    await cascadeDeleteUserData(user._id);
  }
});

userSchema.pre('deleteOne', { document: false, query: true }, async function () {
  const filter = this.getFilter();
  const user = await this.model.findOne(filter, { _id: 1 }).lean();
  if (user?._id) {
    await cascadeDeleteUserData(user._id);
  }
});

module.exports = mongoose.model('User', userSchema);
