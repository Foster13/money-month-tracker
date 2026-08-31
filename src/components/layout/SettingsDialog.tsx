"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SettingsDialog({
  onProfileUpdate,
}: {
  onProfileUpdate: (name: string, logo: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.user_metadata) {
          setName(user.user_metadata.display_name || "Money Month");
        }
      });
    }
  }, [open]);

  const handleSaveName = async () => {
    setLoading(true);
    // ponytail: frontend cannot truly enforce uniqueness securely without a DB table or Edge Function.
    const { error } = await supabase.auth.updateUser({
      data: { display_name: name },
    });
    setLoading(false);
    if (error) alert("Error saving name: " + error.message);
    else {
      alert("Name updated!");
      onProfileUpdate(name, "");
    }
  };

  const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          // ponytail: native canvas compression, no libs, fits in metadata
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          if (width > 128 || height > 128) {
            const ratio = Math.min(128 / width, 128 / height);
            width *= ratio;
            height *= ratio;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);

          const base64 = canvas.toDataURL("image/jpeg", 0.7);

          // FIX: DO NOT store base64 in Supabase user_metadata!
          // It bloats the JWT session token and causes REQUEST_HEADER_TOO_LARGE.
          // For now, we save it to localStorage. The ideal way is Supabase Storage.
          localStorage.setItem("user_avatar", base64);

          setLoading(false);
          alert("Logo updated & compressed (saved locally)!");
          onProfileUpdate(name, base64);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePassword = async () => {
    const newPassword = window.prompt("Enter new password:");
    if (newPassword) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      alert(error ? `Error: ${error.message}` : "Password updated successfully!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="flex items-center gap-2 pl-2 text-sm text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:pl-0"
          title="Settings"
        >
          <Settings className="w-6 h-6 flex-shrink-0" />
          <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity group-data-[collapsible=icon]:hidden">
            Settings
          </span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Display Name (Must be unique)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={handleSaveName}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: Uniqueness check requires database setup.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Change Logo / Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadLogo}
              disabled={loading}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t">
            <button
              onClick={handlePassword}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
            >
              Change Password
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
