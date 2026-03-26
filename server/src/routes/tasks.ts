import { Router, Request, Response } from 'express';
import { Task } from '../models/Task';
import { Notification } from '../models/Notification';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET all tasks for logged-in user
router.get('/', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const tasks = await Task
    .find({ userId: authReq.user!.id })
    .sort({ created_at: -1 });
  res.json(tasks);
});

// POST create task
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const task = await Task.create({
    userId: authReq.user!.id,
    title: req.body.title,
    description: req.body.description,
    due_date: req.body.due_date ? new Date(req.body.due_date) : undefined,
  });

  await Notification.create({
    userId: authReq.user!.id,
    type: 'task_update',
    title: 'New Task Added',
    message: `You successfully added task: "${task.title}".`,
    relatedTaskId: task._id
  });

  res.status(201).json(task);
});

// PATCH update status or due_date
router.patch('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthRequest;
  const { status, due_date } = req.body;
  const update: any = {};

  if (status) update.status = status;
  if (status === 'completed') update.completed_at = new Date();

  if (status === 'delayed' && due_date) {
    const existing = await Task.findOne({
      _id: req.params.id, userId: authReq.user!.id
    });
    if (existing?.due_date && !existing.original_due_date) {
      update.original_due_date = existing.due_date;
    }
    update.due_date = new Date(due_date);
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: authReq.user!.id },
    update,
    { new: true }
  );
  if (!task) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  if (status === 'completed') {
      await Notification.create({
          userId: authReq.user!.id,
          type: 'task_update',
          title: 'Task Completed',
          message: `Awesome job! You finished: "${task.title}".`,
          relatedTaskId: task._id
      });
  } else if (status === 'delayed') {
      await Notification.create({
          userId: authReq.user!.id,
          type: 'task_update',
          title: 'Task Delayed',
          message: `"${task.title}" has been delayed to a new due date.`,
          relatedTaskId: task._id
      });
  }

  res.json(task);
});

// DELETE task
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  await Task.findOneAndDelete({ _id: req.params.id, userId: authReq.user!.id });
  res.status(204).send();
});

export default router;
