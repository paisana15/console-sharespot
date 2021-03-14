import mongoose from 'mongoose';

const HotspotSchema = new mongoose.Schema({
  totalEarnings: {
    type: String,
  },
});

const Hotspot = mongoose.model('Hotspot', HotspotSchema);
export default Hotspot;
