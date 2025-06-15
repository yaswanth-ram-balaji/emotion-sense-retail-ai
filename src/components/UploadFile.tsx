
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Supabase upload has been removed.
const UploadFile = () => (
  <form className="flex items-center gap-2" title="File upload is disabled">
    <Input type="file" disabled />
    <Button type="button" disabled>
      Upload Disabled
    </Button>
  </form>
);

export default UploadFile;
