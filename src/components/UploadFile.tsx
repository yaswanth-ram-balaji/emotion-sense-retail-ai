
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const { data, error } = await supabase.storage
      .from("user-uploads")
      .upload(`public/${file.name}-${Date.now()}`, file);
    setUploading(false);

    if (error) {
      toast({ title: "Upload failed", description: error.message });
    } else {
      toast({ title: "Upload success", description: "File uploaded!" });
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex items-center gap-2">
      <Input type="file" onChange={handleFileChange} />
      <Button type="submit" disabled={uploading || !file}>
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
};

export default UploadFile;
