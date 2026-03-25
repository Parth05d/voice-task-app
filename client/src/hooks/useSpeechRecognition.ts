import { useState, useRef } from 'react';

export type RecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';

export function useSpeechRecognition() {
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  // Now checking for proper media APIs instead of Web Speech API
  const isSupported = !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

  const startListening = async () => {
    if (!isSupported) {
      setStatus('error');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        setStatus('listening');
      };

      mediaRecorder.start();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const stopListening = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        setStatus('idle');
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        // Build the audio blob once the recording is totally done
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const tracks = mediaRecorder.stream.getTracks();
        tracks.forEach(track => track.stop()); // close microphone
        setStatus('idle');
        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  };

  return { status, startListening, stopListening, isSupported, interimTranscript: '', transcript: '' };
}
