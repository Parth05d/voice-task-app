import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  due_date?: Date;
  original_due_date?: Date;
  status: 'pending' | 'completed' | 'cancelled' | 'delayed';
  created_at: Date;
  completed_at?: Date;
}

const TaskSchema = new Schema<ITask>({
  userId:            { type: String, required: true, index: true },
  title:             { type: String, required: true, maxlength: 100 },
  description:       { type: String },
  due_date:          { type: Date },
  original_due_date: { type: Date },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'delayed'],
    default: 'pending'
  },
  created_at:  { type: Date, default: Date.now },
  completed_at: { type: Date },
});

export const Task = mongoose.model<ITask>('Task', TaskSchema);
