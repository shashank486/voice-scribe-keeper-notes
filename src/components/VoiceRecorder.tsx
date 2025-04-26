
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Mic, MicOff, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import NoteEditor from "./NoteEditor";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VoiceRecorderProps {
  onNoteSaved: () => void;
}

const VoiceRecorder = ({ onNoteSaved }: VoiceRecorderProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const { 
    transcript, 
    isListening, 
    error, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();

  const handleStartRecording = () => {
    resetTranscript();
    startListening();
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleSaveNote = () => {
    if (transcript.trim()) {
      setShowEditor(true);
    }
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    resetTranscript();
  };

  const handleNoteSaved = () => {
    setShowEditor(false);
    resetTranscript();
    onNoteSaved();
  };

  return (
    <>
      <Card className="p-4 mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Voice Notes</h2>
            <div className="flex gap-2">
              {isListening ? (
                <Button 
                  onClick={handleStopRecording}
                  variant="destructive"
                  className="gap-2"
                >
                  <MicOff size={18} />
                  Stop Recording
                </Button>
              ) : (
                <Button 
                  onClick={handleStartRecording}
                  variant="default"
                  className="gap-2"
                >
                  <Mic size={18} />
                  Start Recording
                </Button>
              )}
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative min-h-[100px] p-4 border rounded-md bg-secondary/50">
            {isListening && (
              <div className="absolute -top-2 -right-2">
                <span className="flex h-4 w-4">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative rounded-full h-4 w-4 bg-red-500"></span>
                </span>
              </div>
            )}
            <p className="whitespace-pre-wrap break-words">
              {transcript || (isListening ? "Speak now..." : "Click 'Start Recording' and begin speaking...")}
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleSaveNote}
              disabled={!transcript.trim()}
              className="gap-2"
            >
              <Save size={18} />
              Save as Note
            </Button>
          </div>
        </div>
      </Card>
      
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
          </DialogHeader>
          <NoteEditor
            initialContent={transcript}
            onSaved={handleNoteSaved}
            onCancel={handleEditorClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoiceRecorder;
