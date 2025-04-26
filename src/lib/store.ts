
import { Note, NewNote } from "@/types";

const STORAGE_KEY = "voice-notes";

export const getNotes = (): Note[] => {
  const notes = localStorage.getItem(STORAGE_KEY);
  return notes ? JSON.parse(notes) : [];
};

export const saveNote = (note: NewNote): Note => {
  const notes = getNotes();
  const timestamp = new Date().toISOString();
  
  const newNote: Note = {
    id: crypto.randomUUID(),
    title: note.title,
    content: note.content,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  notes.unshift(newNote);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  
  return newNote;
};

export const updateNote = (id: string, updates: Partial<Note>): Note | null => {
  const notes = getNotes();
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex === -1) return null;
  
  const updatedNote = {
    ...notes[noteIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  notes[noteIndex] = updatedNote;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  
  return updatedNote;
};

export const deleteNote = (id: string): boolean => {
  const notes = getNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
  return true;
};

export const getNoteById = (id: string): Note | null => {
  const notes = getNotes();
  return notes.find(note => note.id === id) || null;
};
