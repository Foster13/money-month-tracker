"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      className="hidden md:flex gap-2"
      onClick={handleInstallClick}
    >
      <Download className="h-4 w-4" />
      <span>Install App</span>
    </Button>
  );
}
