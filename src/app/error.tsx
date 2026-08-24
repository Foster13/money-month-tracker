"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Di sini kita bisa integrasikan ke Sentry atau tracker lain di masa depan
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <AlertCircle className="w-16 h-16 text-destructive" />
      </div>

      <h2 className="text-2xl font-bold mb-3 tracking-tight">Oops! Sesuatu Berjalan Salah</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, aplikasi mengalami masalah teknis yang tidak terduga. Jangan khawatir, data Anda tetap
        aman.
      </p>

      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default" size="lg">
          Coba Lagi
        </Button>
        <Button onClick={() => (window.location.href = "/")} variant="outline" size="lg">
          Muat Ulang Beranda
        </Button>
      </div>

      {/* Tampilkan detail error hanya saat dalam mode development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-12 p-4 bg-muted rounded-md text-left w-full max-w-2xl overflow-auto text-xs font-mono">
          <p className="font-semibold text-destructive mb-2">
            {error.name}: {error.message}
          </p>
          <pre className="text-muted-foreground whitespace-pre-wrap break-all">{error.stack}</pre>
        </div>
      )}
    </div>
  );
}
