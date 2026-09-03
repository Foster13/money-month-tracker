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
import { useTransactionStore } from "@/stores/transactionStore";
import { isSameMonth, parseISO } from "date-fns";

export function SettingsDialog({
  onProfileUpdate,
}: {
  onProfileUpdate: (name: string, logo: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const paydayDate = useTransactionStore((state) => state.paydayDate);
  const lastPaydayChange = useTransactionStore((state) => state.lastPaydayChange);
  const setPaydayDateStore = useTransactionStore((state) => state.setPaydayDate);
  const [paydayInput, setPaydayInput] = useState("");

  const canChangePayday = !lastPaydayChange || !isSameMonth(parseISO(lastPaydayChange), new Date());

  useEffect(() => {
    if (open) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.user_metadata) {
          setName(user.user_metadata.display_name || "Money Month");
        }
      });
      if (paydayDate) setPaydayInput(paydayDate.toString());
    }
  }, [open, paydayDate]);

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

          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                setLoading(false);
                return alert("Failed to compress image");
              }

              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) {
                setLoading(false);
                return alert("User not logged in");
              }

              const filePath = `${user.id}/profile.jpeg`;

              // Upload to Supabase Storage (requires RLS policies we created)
              const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, blob, { upsert: true, contentType: "image/jpeg" });

              if (uploadError) {
                setLoading(false);
                return alert("Upload failed: " + uploadError.message);
              }

              // Get the public URL
              const {
                data: { publicUrl },
              } = supabase.storage.from("avatars").getPublicUrl(filePath);

              // Save the short URL string to user_metadata (safe, won't bloat JWT)
              const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl },
              });

              setLoading(false);
              if (updateError) {
                alert("Error updating profile: " + updateError.message);
              } else {
                alert("Logo updated and saved to Storage!");
                onProfileUpdate(name, publicUrl);
              }
            },
            "image/jpeg",
            0.7
          );
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
            <label className="text-sm font-medium">Payday Date (1-31)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={31}
                value={paydayInput}
                onChange={(e) => setPaydayInput(e.target.value)}
                disabled={!canChangePayday}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={async () => {
                  const val = parseInt(paydayInput);
                  if (val >= 1 && val <= 31) {
                    setLoading(true);
                    const res = await setPaydayDateStore(val);
                    setLoading(false);
                    if (res?.success) {
                      alert("Payday updated successfully!");
                    } else {
                      alert("Failed to update payday: " + (res?.error?.message || "Unknown error"));
                    }
                  } else {
                    alert("Invalid date");
                  }
                }}
                disabled={!canChangePayday || loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 disabled:opacity-50"
              >
                Save
              </button>
            </div>
            {!canChangePayday && (
              <p className="text-xs text-destructive">
                You have already changed your payday this month.
              </p>
            )}
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
