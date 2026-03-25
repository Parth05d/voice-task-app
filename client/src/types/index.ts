export interface ITask {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  due_date?: string;
  original_due_date?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'delayed';
  created_at: string;
  completed_at?: string;
}

export interface ParsedTask {
  title: string;
  description: string;
  due_date: string | null;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
}
