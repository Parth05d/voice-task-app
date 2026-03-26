import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  type: 'task_update' | 'system_alert' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  relatedTaskId?: Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ['task_update', 'system_alert', 'reminder'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedTaskId: { type: Schema.Types.ObjectId, ref: 'Task' },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
