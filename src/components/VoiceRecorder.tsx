
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Mic, MicOff, Save, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import NoteEditor from "./NoteEditor";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SPEECH_LANGUAGES } from "@/types";

interface VoiceRecorderProps {
  onNoteSaved: () => void;
  onSearch: (query: string) => void;
}

const VoiceRecorder = ({ onNoteSaved, onSearch }: VoiceRecorderProps) => {
  const [showEditor, setShowEditor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { 
    transcript, 
    isListening, 
    error, 
    startListening, 
    stopListening, 
    resetTranscript,
    language,
    setLanguage
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
      stopListening(); // Stop recording when opening the editor
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

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      <Card className="p-4 mb-8">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h2 className="text-xl font-semibold">Voice Notes</h2>
            <div className="flex items-center gap-2">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[140px] md:w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {SPEECH_LANGUAGES.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isListening ? (
                <Button 
                  onClick={handleStopRecording}
                  variant="destructive"
                  className="gap-2"
                >
                  <MicOff size={18} />
                  Stop
                </Button>
              ) : (
                <Button 
                  onClick={handleStartRecording}
                  variant="default"
                  className="gap-2"
                >
                  <Mic size={18} />
                  Record
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="outline">
              <Search size={18} />
            </Button>
          </form>
          
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
              {transcript || (isListening ? "Speak now..." : "Click 'Record' and begin speaking...")}
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
            initialLanguage={language}
            onSaved={handleNoteSaved}
            onCancel={handleEditorClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoiceRecorder;
