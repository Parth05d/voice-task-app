import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' });

export interface ParsedTask {
  title: string;
  description: string;
  due_date: string | null;
  confidence: 'high' | 'medium' | 'low';
  warnings: string[];
}

export async function parseTaskFromTranscript(
  transcript: string
): Promise<ParsedTask> {
  const today = new Date().toISOString();

  const prompt = `
Today is ${today}.
Extract structured task data from this voice input: "${transcript}"

Respond ONLY with a JSON object (no markdown, no explanation):
{
  "title": "short task title under 80 chars",
  "description": "full original phrasing or context",
  "due_date": "ISO 8601 datetime or null if not mentioned",
  "confidence": "high | medium | low",
  "warnings": ["array of issues, or empty array"]
}

Rules:
- 'next Friday' = the coming Friday from today's date
- 'tomorrow' = today + 1 day
- 'end of day' = 17:00 local (use UTC if unsure)
- If no time mentioned, use T09:00:00.000Z for due_date
- confidence = high if title+due_date both clear
- confidence = medium if one field is ambiguous
- confidence = low if input is very vague
- Add to warnings if: no due date, vague title, unclear intent
  `;

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || groqKey === 'gsk_...' || groqKey === 'placeholder') {
    return {
      title: "Dummy Groq Task",
      description: transcript,
      due_date: new Date().toISOString(),
      confidence: 'low',
      warnings: ["Mock API response - Groq Key not configured"]
    };
  }

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });

  return JSON.parse(res.choices[0].message.content!) as ParsedTask;
}
