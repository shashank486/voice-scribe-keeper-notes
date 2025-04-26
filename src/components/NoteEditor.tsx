
import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveNote, updateNote } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";

interface NoteEditorProps {
  initialNote?: Note;
  initialContent?: string;
  onSaved: () => void;
  onCancel: () => void;
}

const NoteEditor = ({ 
  initialNote, 
  initialContent = "", 
  onSaved, 
  onCancel 
}: NoteEditorProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialNote?.title || "");
  const [content, setContent] = useState(initialNote?.content || initialContent);
  const isEditing = !!initialNote;

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your note",
        variant: "destructive"
      });
      return;
    }

    if (isEditing && initialNote) {
      updateNote(initialNote.id, { title, content });
      toast({
        title: "Note updated",
        description: "Your changes have been saved"
      });
    } else {
      saveNote({ title, content });
      toast({
        title: "Note saved",
        description: "Your new note has been created"
      });
    }
    
    onSaved();
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Input
          placeholder="Note title"
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
