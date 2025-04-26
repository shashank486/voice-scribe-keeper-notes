
import { Card } from "@/components/ui/card";

const EmptyNotes = () => {
  return (
    <Card className="p-8 text-center">
      <h3 className="text-xl font-medium mb-2">No Notes Yet</h3>
      <p className="text-muted-foreground mb-4">
        Use the voice recorder above to create your first note.
      </p>
      <div className="flex flex-col items-center text-muted-foreground">
        <p>1. Click "Start Recording"</p>
        <p>2. Speak your note</p>
        <p>3. Click "Save as Note"</p>
      </div>
    </Card>
  );
};

export default EmptyNotes;
