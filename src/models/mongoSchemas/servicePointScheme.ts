import { model, models, Schema } from 'mongoose';

const servicePointSchema = new Schema(
  {
    name: { type: String, unique: true },
    department: { type: Schema.Types.ObjectId, ref: 'Departments' },
    status: { type: String, default: 'closed' },
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ServicePoint =
  models.ServicePoints || model('ServicePoints', servicePointSchema);

export default ServicePoint;
