import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String
  },
  ip: {
    type: String
  },
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  referrer: {
    type: String
  }
}, { timestamps: true });

const Click = mongoose.model('Click', clickSchema);
export default Click;
