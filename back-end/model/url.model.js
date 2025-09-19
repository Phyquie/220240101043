import mongoose from "mongoose"

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);
export default Url;
