import mongoose from 'mongoose';
import Double from '@mongoosejs/double';

const ClientHotspotSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  hotspot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotspot',
  },
  relationship_type: {
    type: String,
  },
  totalEarnings: {
    type: Double,
  },
  percentage: {
    type: Number,
  },
  available_balance: {
    type: Double,
  },
});

const ClientHotspot = mongoose.model('ClientHotspot', ClientHotspotSchema);
export default ClientHotspot;
