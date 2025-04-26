
import { useState, useEffect } from "react";
import { getNotes } from "@/lib/store";
import { Note } from "@/types";
import VoiceRecorder from "@/components/VoiceRecorder";
import NoteCard from "@/components/NoteCard";
import EmptyNotes from "@/components/EmptyNotes";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  
  const loadNotes = () => {
    const storedNotes = getNotes();
    setNotes(storedNotes);
  };
  
  useEffect(() => {
    loadNotes();
  }, []);
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          VoiceScribe Pro
        </h1>
        <p className="text-muted-foreground mt-2">
          Transform your thoughts into text, instantly
        </p>
      </div>
      
      <VoiceRecorder onNoteSaved={loadNotes} />
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>
        {notes.length > 0 ? (
          <div className="note-grid">
            {notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdated={loadNotes}
                onDeleted={loadNotes}
              />
            ))}
          </div>
        ) : (
          <EmptyNotes />
        )}
      </div>
    </div>
  );
};

export default Index;
