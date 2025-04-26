
import { useState } from "react";
import { Note } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { deleteNote } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import NoteEditor from "./NoteEditor";
import { Trash2, Edit } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onUpdated: () => void;
  onDeleted: () => void;
}

const NoteCard = ({ note, onUpdated, onDeleted }: NoteCardProps) => {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(note.id);
      toast({
        title: "Note deleted",
        description: "Your note has been removed"
      });
      onDeleted();
    }
  };
  
  const handleEditCompleted = () => {
    setShowEditDialog(false);
    onUpdated();
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="whitespace-pre-wrap break-words text-sm">{note.content}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between text-xs text-muted-foreground border-t">
        <span>
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
        <div className="flex gap-2">
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit size={16} />
                <span className="sr-only">Edit</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
              </DialogHeader>
              <NoteEditor 
                initialNote={note}
                onSaved={handleEditCompleted}
                onCancel={() => setShowEditDialog(false)}
              />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 size={16} />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
