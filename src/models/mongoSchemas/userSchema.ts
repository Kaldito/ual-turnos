import { model, models, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    correo: { type: String, unique: true },
    password: String,
    rol: String,
    servicePoint: { type: Schema.Types.ObjectId, ref: 'ServicePoints' },
    department: { type: Schema.Types.ObjectId, ref: 'Departments' },
    status: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = models.Users || model('Users', userSchema);

export default User;
