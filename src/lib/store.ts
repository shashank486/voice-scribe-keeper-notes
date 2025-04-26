import { Note, NewNote } from "@/types";

const STORAGE_KEY = "voice-notes";
const THEME_KEY = "voice-scribe-theme";

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
    updatedAt: timestamp,
    isPinned: note.isPinned || false,
    category: note.category || "Other",
    language: note.language || "en-US"
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

export const searchNotes = (query: string): Note[] => {
  if (!query.trim()) return getNotes();
  
  const notes = getNotes();
  const lowerCaseQuery = query.toLowerCase();
  
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowerCaseQuery) || 
    note.content.toLowerCase().includes(lowerCaseQuery)
  );
};

export const togglePinNote = (id: string): Note | null => {
  const note = getNoteById(id);
  if (!note) return null;
  
  return updateNote(id, { isPinned: !note.isPinned });
};

export const filterNotesByCategory = (category: string | null): Note[] => {
  if (!category) return getNotes();
  
  const notes = getNotes();
  return notes.filter(note => note.category === category);
};

export const getTheme = (): 'dark' | 'light' => {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === 'dark' ? 'dark' : 'light';
};

export const setTheme = (theme: 'dark' | 'light'): void => {
  localStorage.setItem(THEME_KEY, theme);
  
  // Apply theme to document
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const generateTitle = (content: string): string => {
  if (!content) return 'New Note';
  
  // Extract the first sentence or first few words
  const firstSentence = content.split(/[.!?]/)[0].trim();
  
  // If the first sentence is short enough, use it as the title
  if (firstSentence.length <= 40) {
    return firstSentence;
  }
  
  // Otherwise use the first few words
  return firstSentence.split(' ').slice(0, 5).join(' ') + '...';
};
