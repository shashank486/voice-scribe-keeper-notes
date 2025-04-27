
import { useState } from "react";
import { Note, CATEGORIES, SPEECH_LANGUAGES } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveNote, updateNote } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NoteEditorProps {
  initialNote?: Note;
  initialContent?: string;
  initialLanguage?: string;
  onSaved: () => void;
  onCancel: () => void;
}

const NoteEditor = ({ 
  initialNote, 
  initialContent = "", 
  initialLanguage = "en-US",
  onSaved, 
  onCancel 
}: NoteEditorProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || initialContent);
  const [category, setCategory] = useState(initialNote?.category || "Other");
  const [isPinned, setIsPinned] = useState(initialNote?.isPinned || false);
  const [language, setLanguage] = useState(initialNote?.language || initialLanguage);
  const isEditing = !!initialNote;

  const handleSave = () => {
    // Allow empty title - we'll use content timestamp if needed
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your note",
        variant: "destructive"
      });
      return;
    }

    // Use empty string as title if none is provided
    const finalTitle = title.trim() || new Date().toLocaleTimeString();

    if (isEditing && initialNote) {
      updateNote(initialNote.id, { 
        title: finalTitle, 
        content, 
        category, 
        isPinned, 
        language 
      });
      toast({
        title: "Note updated",
        description: "Your changes have been saved"
      });
    } else {
      saveNote({ 
        title: finalTitle, 
        content, 
        category, 
        isPinned, 
        language 
      });
      toast({
        title: "Note saved",
        description: "Your new note has been created"
      });
    }
    
    onSaved();
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Input
          placeholder="Note title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Note content"
          className="min-h-[200px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center">
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {SPEECH_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-between items-center">
          <Label htmlFor="pin-note">Pin this note</Label>
          <Switch
            id="pin-note"
            checked={isPinned}
            onCheckedChange={setIsPinned}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {isEditing ? "Update" : "Save"} Note
        </Button>
      </div>
    </div>
  );
};

export default NoteEditor;
