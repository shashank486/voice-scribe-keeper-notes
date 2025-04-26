
import { useState, useEffect } from "react";
import { getNotes, getTheme, setTheme, searchNotes, filterNotesByCategory } from "@/lib/store";
import { Note, CATEGORIES } from "@/types";
import VoiceRecorder from "@/components/VoiceRecorder";
import NoteCard from "@/components/NoteCard";
import EmptyNotes from "@/components/EmptyNotes";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  
  const loadNotes = () => {
    let filteredNotes: Note[] = [];
    
    if (searchQuery) {
      filteredNotes = searchNotes(searchQuery);
    } else if (selectedCategory) {
      filteredNotes = filterNotesByCategory(selectedCategory);
    } else {
      filteredNotes = getNotes();
    }
    
    // Sort notes: pinned notes first, then by date
    const sortedNotes = filteredNotes.sort((a, b) => {
      // First sort by pinned status
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Then sort by date (newest first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    setNotes(sortedNotes);
  };
  
  useEffect(() => {
    loadNotes();
  }, [searchQuery, selectedCategory]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "All" ? null : category);
    setSearchQuery("");
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          VoiceScribe Pro
        </h1>
        <Button variant="outline" size="icon" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 mb-6">
        Transform your thoughts into text, instantly
      </p>
      
      <VoiceRecorder onNoteSaved={loadNotes} onSearch={handleSearch} />
      
      <div className="mt-8 mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Notes</h2>
        <Select value={selectedCategory || "All"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {searchQuery && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing results for: "{searchQuery}"
        </p>
      )}
      
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

const IndexWithTheme = () => {
  return (
    <ThemeProvider>
      <Index />
    </ThemeProvider>
  );
};

export default IndexWithTheme;
