
import { useState, useEffect, useCallback } from 'react';

// Declare the SpeechRecognition interface for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  setTranscript: (text: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  supportedLanguages: string[];
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [language, setLanguage] = useState('en-US');
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    const recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    recognitionInstance.onresult = (event: Event) => {
      const speechEvent = event as any; // Type assertion for compatibility
      let currentTranscript = '';
      for (let i = 0; i < speechEvent.results.length; i++) {
        currentTranscript += speechEvent.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognitionInstance.onerror = (event: Event) => {
      const errorEvent = event as any; // Type assertion for compatibility
      setError(`Speech recognition error: ${errorEvent.error}`);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (!recognition) return;
    
    setError(null);
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'InvalidStateError') {
        // Recognition has already started, stop it and start again
        recognition.stop();
        setTimeout(() => {
          recognition.start();
          setIsListening(true);
        }, 100);
      } else {
        setError('Failed to start speech recognition');
        console.error('Recognition error:', err);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    recognition.stop();
    setIsListening(false);
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
    language,
    setLanguage,
    supportedLanguages
  };
};
