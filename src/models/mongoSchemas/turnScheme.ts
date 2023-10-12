import { model, models, Schema } from 'mongoose';

const turnSchema = new Schema(
  {
    turn: String,
    department: { type: Schema.Types.ObjectId, ref: 'Departments' },
    servicePoint: { type: Schema.Types.ObjectId, ref: 'ServicePoints' },
    status: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Turn = models.Turns || model('Turns', turnSchema);

export default Turn;
