import { Router, Request, Response } from 'express';
import { Task } from '../models/Task';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user!.id;
  const now = new Date();
  const eightWeeksAgo = new Date(now.getTime() - 56 * 86400000);

  const [statusBreakdown, weeklyCompletions,
         onTimeVsLate, pendingByUrgency] = await Promise.all([

    Task.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),

    Task.aggregate([
      { $match: { userId, status: 'completed',
          completed_at: { $gte: eightWeeksAgo } } },
      { $group: {
          _id: { $isoWeek: '$completed_at' },
          count: { $sum: 1 },
          weekStart: { $min: '$completed_at' }
      }},
      { $sort: { '_id': 1 } }
    ]),

    Task.aggregate([
      { $match: { userId, status: 'completed',
          due_date: { $exists: true },
          completed_at: { $exists: true } } },
      { $group: {
          _id: { $lte: ['$completed_at', '$due_date'] },
          count: { $sum: 1 }
      }}
    ]),

    Task.aggregate([
      { $match: { userId, status: 'pending',
          due_date: { $exists: true } } },
      { $bucket: {
          groupBy: '$due_date',
          boundaries: [
            now,
            new Date(now.getTime() + 86400000),
            new Date(now.getTime() + 7*86400000),
            new Date(now.getTime() + 30*86400000),
          ],
          default: 'later',
          output: { count: { $sum: 1 } }
      }}
    ])
  ]);

  res.json({ statusBreakdown, weeklyCompletions, onTimeVsLate, pendingByUrgency });
});

export default router;
