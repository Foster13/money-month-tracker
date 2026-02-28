// File: src/app/notes/page.tsx
import { Dashboard } from "@/components/Dashboard";

export const metadata = {
  title: "Notes - Personal Finance Manager",
  description: "Quick notes for your financial planning and reminders",
};

export default function NotesPage() {
  return <Dashboard defaultTab="notes" />;
}
