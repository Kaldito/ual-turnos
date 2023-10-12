import { model, models, Schema } from 'mongoose';

const departmentSchema = new Schema(
  {
    name: { type: String, unique: true },
    description: String,
    available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Department = models.Departments || model('Departments', departmentSchema);

export default Department;
