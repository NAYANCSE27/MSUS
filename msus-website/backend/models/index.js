/**
 * Models Index
 * Exports all Mongoose models for easy importing
 */

const User = require('./User');
const Donation = require('./Donation');
const Event = require('./Event');
const Post = require('./Post');
const ActivityModule = require('./ActivityModule');
const Gallery = require('./Gallery');
const Contact = require('./Contact');
const Settings = require('./Settings');
const Testimonial = require('./Testimonial');

module.exports = {
  User,
  Donation,
  Event,
  Post,
  ActivityModule,
  Gallery,
  Contact,
  Settings,
  Testimonial
};
