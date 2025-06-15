
import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoUploaderProps {
  onUpload: (dataUrl: string) => void;
}

export default function PhotoUploader({ onUpload }: PhotoUploaderProps) {
  const [fileName, setFileName] = useState<string>("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = evt => {
        if (evt.target?.result) {
          onUpload(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label
        className="inline-flex items-center cursor-pointer bg-blue-600/20 hover:bg-blue-700/30 text-blue-200 px-3 py-2 rounded transition"
        title="Upload Photo"
      >
        <Upload className="w-5 h-5 mr-2" />
        <span>Upload a photo</span>
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </label>
      {fileName && (
        <span className="text-xs text-gray-400">{fileName}</span>
      )}
    </div>
  );
}
