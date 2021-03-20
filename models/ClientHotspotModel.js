import mongoose from 'mongoose';
import Double from '@mongoosejs/double';

const ClientHotspotSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    hotspot_name: {
      type: String,
      required: true,
    },
    hotspot_address: {
      type: String,
      required: true,
    },
    relation_type: {
      type: String,
      required: true,
    },
    percentage: {
      type: Double,
      required: true,
    },
    total_earned: {
      type: Number,
      default: 0.0,
    },
    startDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ClientHotspot = mongoose.model('ClientHotspot', ClientHotspotSchema);
export default ClientHotspot;
