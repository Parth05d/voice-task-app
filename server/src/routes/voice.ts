import { Router, Request, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { parseTaskFromTranscript } from '../services/nlp';
import multer from 'multer';
import Groq from 'groq-sdk';
import fs from 'fs';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'placeholder' });
const upload = multer({ dest: 'uploads/' });
const router = Router();

// Existing text endpoint fallback
router.post('/parse', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { transcript } = req.body;
  if (!transcript || transcript.trim().length === 0) {
    res.status(400).json({ error: 'Empty transcript' });
    return;
  }
  const parsed = await parseTaskFromTranscript(transcript);
  res.json(parsed);
});

// New audio endpoint utilizing Groq Whisper
router.post('/parse_audio', requireAuth, upload.single('audio'), async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No audio file provided' });
    return;
  }

  try {
    let transcriptText = "";
    
    // Check if Groq API keys are actually configured properly
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey || groqKey === 'gsk_...' || groqKey === 'placeholder') {
      transcriptText = "This is a simulated raw audio transcription generated locally because Groq Keys are just placeholders. No audio was actually sent.";
    } else {
      const newPath = req.file.path + '.webm';
      fs.renameSync(req.file.path, newPath);
      req.file.path = newPath;

      const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: "whisper-large-v3",
        temperature: 0,
        response_format: "verbose_json",
      });
      transcriptText = transcription.text;
    }

    // Clean up temporary audio file from disk
    fs.unlinkSync(req.file.path);

    // After extracting text, seamlessly perform NLP parsing
    const parsed = await parseTaskFromTranscript(transcriptText);
    res.json({ ...parsed, text: transcriptText });
  } catch (error) {
    console.error("Whisper Error:", error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: 'Failed to process audio' });
  }
});

export default router;
