
import { useState } from "react";
import { Note } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteNote, togglePinNote } from "@/lib/store";
import NoteEditor from "@/components/NoteEditor";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { MicOff, Pin, FileText } from "lucide-react";
import VoicePlayback from "./VoicePlayback";

interface NoteCardProps {
  note: Note;
  onUpdated: () => void;
  onDeleted: () => void;
}

const NoteCard = ({ note, onUpdated, onDeleted }: NoteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    deleteNote(note.id);
    toast({
      title: "Note deleted",
      description: "Your note has been permanently deleted."
    });
    onDeleted();
    setIsDeleting(false);
  };

  const handleEditComplete = () => {
    setIsEditing(false);
    onUpdated();
  };

  const handlePinToggle = () => {
    togglePinNote(note.id);
    toast({
      title: note.isPinned ? "Note unpinned" : "Note pinned",
      description: note.isPinned 
        ? "Note removed from pinned items" 
        : "Note pinned to the top of your list"
    });
    onUpdated();
  };

  return (
    <>
      <Card className={`relative ${note.isPinned ? 'border-primary border-2' : ''}`}>
        {note.isPinned && (
          <div className="absolute top-0 right-0 -mt-2 -mr-2">
            <Badge className="bg-primary">Pinned</Badge>
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold pr-6">{note.title}</CardTitle>
          </div>
          <div className="flex gap-1 mt-1">
            <Badge variant="outline">{note.category}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="whitespace-pre-wrap line-clamp-3">
            {note.content}
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2 text-muted-foreground text-xs">
          <div>
            {format(new Date(note.updatedAt), "MMM d, yyyy")}
          </div>
          <div className="flex gap-1">
            <VoicePlayback text={note.content} language={note.language} />
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handlePinToggle}
              title={note.isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin size={18} className={note.isPinned ? "text-primary" : ""} />
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              title="Edit note"
            >
              <FileText size={18} />
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsDeleting(true)}
              className="text-destructive"
              title="Delete note"
            >
              <MicOff size={18} />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <NoteEditor
            initialNote={note}
            onSaved={handleEditComplete}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this note. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NoteCard;
