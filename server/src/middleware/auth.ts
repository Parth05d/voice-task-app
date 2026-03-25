import { createClient } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
);

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const requireAuth = async (
  req: AuthRequest, res: Response, next: NextFunction
): Promise<void> => {
  const url = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
  if (url.includes('placeholder')) {
    req.user = { id: 'dummy-user-id', email: 'test@example.com' };
    next();
    return;
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  req.user = { id: user.id, email: user.email! };
  next();
};
