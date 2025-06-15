import React from "react";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  useUpload: boolean;
  onChange: (useUpload: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
  useUpload,
  onChange,
}) => (
  <div className="mb-4 flex flex-wrap items-center gap-4 justify-center">
    <Button
      variant={useUpload ? "secondary" : "default"}
      onClick={() => onChange(false)}
    >
      Camera Mode
    </Button>
    <Button
      variant={useUpload ? "default" : "secondary"}
      onClick={() => onChange(true)}
    >
      Upload Photo
    </Button>
  </div>
);

export default ModeToggle;
