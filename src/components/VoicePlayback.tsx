
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Volume, VolumeX } from 'lucide-react';

interface VoicePlaybackProps {
  text: string;
  language?: string;
}

export default function VoicePlayback({ text, language = 'en-US' }: VoicePlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSpeechSupported(false);
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    
    speech.onend = () => {
      setIsPlaying(false);
    };
    
    speech.onerror = () => {
      setIsPlaying(false);
    };
    
    setSpeechInstance(speech);
    
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, language]);

  const handlePlay = () => {
    if (!speechInstance || !window.speechSynthesis) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.speak(speechInstance);
      setIsPlaying(true);
    }
  };

  if (!isSpeechSupported) return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handlePlay}
      title={isPlaying ? "Stop reading" : "Read aloud"}
    >
      {isPlaying ? <VolumeX size={18} /> : <Volume size={18} />}
    </Button>
  );
}
