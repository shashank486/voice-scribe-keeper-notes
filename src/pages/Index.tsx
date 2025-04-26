
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
      <h1 className="text-3xl font-bold text-center mb-8">Voice Scribe Notes</h1>
      
      <VoiceRecorder onNoteSaved={loadNotes} />
      
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
  );
};

export default Index;
