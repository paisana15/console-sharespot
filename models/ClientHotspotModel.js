import mongoose from 'mongoose';
import Double from '@mongoosejs/double';

const ClientHotspotSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  hotspot_address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  percentage: {
    type: Double,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
});

const ClientHotspot = mongoose.model('ClientHotspot', ClientHotspotSchema);
export default ClientHotspot;
