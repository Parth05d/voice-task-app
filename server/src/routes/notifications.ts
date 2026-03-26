import { Router, Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { Task } from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Generate reminders logic extracted to be reused
async function generateReminders(userId: string) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const tasksDueToday = await Task.find({
    userId,
    status: 'pending',
    due_date: { $gte: startOfToday, $lte: endOfToday }
  });

  for (const task of tasksDueToday) {
    const existingReminder = await Notification.findOne({
      userId,
      relatedTaskId: task._id,
      type: 'reminder',
      createdAt: { $gte: startOfToday }
    });

    if (!existingReminder) {
        await Notification.create({
            userId,
            type: 'reminder',
            title: 'Critical Task Due Today',
            message: `Your task "${task.title}" is due today. Make sure to complete it!`,
            relatedTaskId: task._id
        });
    }
  }
}

// GET all notifications for logged-in user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user!.id;

  const notifications = await Notification
    .find({ userId })
    .sort({ createdAt: -1 });
    
  res.json(notifications);
});

// GET unread count
router.get('/unread-count', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user!.id;

  await generateReminders(userId);

  const count = await Notification.countDocuments({ userId, isRead: false });
  res.json({ count });
});

// PATCH mark specific notification as read
router.patch('/:id/read', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: authReq.user!.id },
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(notification);
});

// PATCH mark all as read
router.patch('/read-all', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  await Notification.updateMany(
    { userId: authReq.user!.id, isRead: false },
    { isRead: true }
  );
  res.json({ message: 'All notifications marked as read' });
});

export default router;
