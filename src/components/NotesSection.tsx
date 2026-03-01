// File: src/components/NotesSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icon } from "./icons/Icon";
import { Plus, Trash2, Edit2, Check, X, Calendar, Search, Save, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: string;
}

const NOTE_COLORS = [
  { name: "Pink", value: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800" },
  { name: "Blue", value: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  { name: "Green", value: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
  { name: "Yellow", value: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" },
  { name: "Purple", value: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" },
];

const STORAGE_KEY = "finance-notes";

export function NotesSection() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<{ title: string; content: string; color: string } | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "", color: NOTE_COLORS[0].value });
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load notes from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNotes(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    }
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const handleAddNote = () => {
    if (!newNote.title.trim() && !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please add a title or content",
        variant: "destructive",
      });
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: newNote.color,
    };

    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", color: NOTE_COLORS[0].value });
    setIsAdding(false);
    toast({
      title: "Success",
      description: "Note added successfully",
    });
  };

  const handleUpdateNote = (id: string) => {
    if (!editingNote) return;

    if (!editingNote.title.trim() && !editingNote.content.trim()) {
      toast({
        title: "Error",
        description: "Note cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setNotes(notes.map((note) =>
      note.id === id
        ? { 
            ...note, 
            title: editingNote.title.trim(),
            content: editingNote.content.trim(),
            color: editingNote.color,
            updatedAt: new Date().toISOString() 
          }
        : note
    ));
    setEditingId(null);
    setEditingNote(null);
    toast({
      title: "Success",
      description: "Note updated successfully",
    });
  };

  const handleStartEdit = (note: Note) => {
    setEditingId(note.id);
    setEditingNote({
      title: note.title,
      content: note.content,
      color: note.color,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingNote(null);
  };

  const handleDeleteNote = () => {
    if (!noteToDelete) return;

    const updatedNotes = notes.filter((note) => note.id !== noteToDelete);
    setNotes(updatedNotes);
    
    if (updatedNotes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    
    toast({
      title: "Success",
      description: "Note deleted successfully",
    });
    
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  const openDeleteDialog = (id: string) => {
    setNoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setNoteToDelete(null);
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-full overflow-x-hidden space-y-6">
      {/* Header - Responsive spacing and layout */}
      <Card className="glass-card border-purple-200 dark:border-purple-800">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                <Icon name="sparkles" size="md" className="sm:w-6 sm:h-6" aria-hidden={true} />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-purple-700 dark:text-purple-300">
                  Quick Notes
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {notes.length} {notes.length === 1 ? "note" : "notes"}
                  {searchQuery && ` • ${filteredNotes.length} found`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              size="sm"
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white min-h-[44px] w-full sm:w-auto"
              aria-label="Add new note"
            >
              <Plus className="w-4 h-4 mr-1" aria-hidden={true} />
              Add Note
            </Button>
          </div>

          {/* Search Bar - Responsive with proper touch targets */}
          {notes.length > 0 && (
            <div className="relative">
              <label htmlFor="note-search" className="sr-only">Search notes</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden={true} />
              <Input
                id="note-search"
                type="text"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-900/50 min-h-[44px]"
                aria-label="Search notes by title or content"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-md"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" aria-hidden={true} />
                </button>
              )}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Add Note Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className={`${newNote.color} border-2`}>
              <CardContent className="pt-6 stack-spacing-sm">
                <div>
                  <label htmlFor="new-note-title" className="sr-only">Note title</label>
                  <Input
                    id="new-note-title"
                    placeholder="Note title (optional)"
                    value={newNote.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNote({ ...newNote, title: e.target.value })}
                    className="bg-white/50 dark:bg-gray-900/50 min-h-[44px]"
                    aria-label="Note title (optional)"
                  />
                </div>
                <div>
                  <label htmlFor="new-note-content" className="sr-only">Note content</label>
                  <Textarea
                    id="new-note-content"
                    placeholder="Write your note here..."
                    value={newNote.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={4}
                    className="bg-white/50 dark:bg-gray-900/50 resize-none"
                    aria-label="Note content"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex gap-2 flex-wrap">
                    {NOTE_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setNewNote({ ...newNote, color: color.value })}
                        className={`w-10 h-10 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-full ${color.value} border-2 cursor-pointer transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                          newNote.color === color.value
                            ? "ring-2 ring-purple-400 ring-offset-2"
                            : ""
                        }`}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => {
                        setIsAdding(false);
                        setNewNote({ title: "", content: "", color: NOTE_COLORS[0].value });
                      }}
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none min-h-[44px]"
                      aria-label="Cancel adding note"
                    >
                      <X className="w-4 h-4 mr-1" aria-hidden={true} />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddNote}
                      size="sm"
                      className="flex-1 sm:flex-none bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white min-h-[44px]"
                      aria-label="Save new note"
                    >
                      <Check className="w-4 h-4 mr-1" aria-hidden={true} />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List - Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence>
          {filteredNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className={`${editingId === note.id ? editingNote?.color : note.color} border-2 hover:shadow-lg transition-all duration-200`}>
                <CardContent className="pt-6 space-y-3">
                  {editingId === note.id ? (
                    <>
                      <div>
                        <label htmlFor={`edit-note-title-${note.id}`} className="sr-only">Note title</label>
                        <Input
                          id={`edit-note-title-${note.id}`}
                          value={editingNote?.title || ""}
                          placeholder="Note title (optional)"
                          className="bg-white/50 dark:bg-gray-900/50 font-semibold min-h-[44px]"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingNote(editingNote ? { ...editingNote, title: e.target.value } : null)}
                          aria-label="Note title (optional)"
                        />
                      </div>
                      <div>
                        <label htmlFor={`edit-note-content-${note.id}`} className="sr-only">Note content</label>
                        <Textarea
                          id={`edit-note-content-${note.id}`}
                          value={editingNote?.content || ""}
                          placeholder="Note content"
                          rows={5}
                          className="bg-white/50 dark:bg-gray-900/50 resize-none"
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingNote(editingNote ? { ...editingNote, content: e.target.value } : null)}
                          aria-label="Note content"
                        />
                      </div>
                      
                      {/* Color Picker for Edit Mode - Responsive */}
                      <div className="flex items-center gap-2 pt-2 flex-wrap">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Color:</span>
                        {NOTE_COLORS.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setEditingNote(editingNote ? { ...editingNote, color: color.value } : null)}
                            className={`w-10 h-10 sm:w-8 sm:h-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-full ${color.value} border-2 cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ${
                              editingNote?.color === color.value
                                ? "ring-2 ring-purple-400 ring-offset-2 scale-110"
                                : "hover:scale-105"
                            }`}
                            title={color.name}
                            aria-label={`Select ${color.name} color`}
                          />
                        ))}
                      </div>

                      {/* Edit Actions - Responsive */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button
                          onClick={() => handleUpdateNote(note.id)}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white min-h-[44px]"
                          aria-label="Save changes to note"
                        >
                          <Save className="w-4 h-4 mr-1" aria-hidden={true} />
                          Save Changes
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          size="sm"
                          className="flex-1 min-h-[44px]"
                          aria-label="Cancel editing note"
                        >
                          <X className="w-4 h-4 mr-1" aria-hidden={true} />
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {note.title && (
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 break-words">
                          {note.title}
                        </h3>
                      )}
                      {note.content && (
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                          {note.content}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" aria-hidden={true} />
                          {format(new Date(note.updatedAt), "MMM dd, yyyy")}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleStartEdit(note)}
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            aria-label="Edit note"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden={true} />
                          </Button>
                          <Button
                            onClick={() => openDeleteDialog(note.id)}
                            variant="ghost"
                            size="sm"
                            className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 p-0 hover:bg-rose-100 dark:hover:bg-rose-900/30"
                            aria-label="Delete note"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" aria-hidden={true} />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results State */}
      {notes.length > 0 && filteredNotes.length === 0 && (
        <Card className="glass-card border-dashed border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <Search className="w-8 h-8 text-purple-400" aria-hidden={true} />
            </div>
            <h3 className="text-heading-sm text-gray-900 dark:text-gray-100 mb-2">
              No notes found
            </h3>
            <p className="text-body mb-4">
              Try searching with different keywords
            </p>
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              aria-label="Clear search filter"
            >
              <X className="w-4 h-4 mr-2" aria-hidden={true} />
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {notes.length === 0 && !isAdding && (
        <Card className="glass-card border-dashed border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <Icon name="sparkles" size={32} aria-hidden={true} /> {/* Custom size for empty state hero icon */}
            </div>
            <h3 className="text-heading-sm text-gray-900 dark:text-gray-100 mb-2">
              No notes yet
            </h3>
            <p className="text-body mb-4">
              Start adding notes to keep track of important information
            </p>
            <Button
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white"
              aria-label="Add your first note"
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden={true} />
              Add Your First Note
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent 
          hideClose 
          className="w-[90vw] max-w-[340px] sm:max-w-[400px] glass-card border-2 border-rose-200 dark:border-rose-800 p-4 sm:p-6 rounded-lg !fixed !left-[50%] !top-[50%] !-translate-x-1/2 !-translate-y-1/2"
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
          }}
          onPointerDownOutside={(e) => {
            e.preventDefault();
            closeDeleteDialog();
          }}
          onEscapeKeyDown={(e) => {
            // Allow Escape key to close the dialog
            closeDeleteDialog();
          }}
        >
          <DialogHeader>
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:w-6 text-rose-600 dark:text-rose-400" aria-hidden={true} />
              </div>
              <DialogTitle className="text-base sm:text-lg text-gray-900 dark:text-gray-100 leading-tight">
                Delete Note
              </DialogTitle>
            </div>
            <DialogDescription className="text-body pt-1 sm:pt-2 leading-relaxed">
              Are you sure you want to delete this note? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteDialog}
              className="w-full sm:w-auto order-2 sm:order-1 h-9 text-sm"
              aria-label="Cancel deletion"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteNote}
              className="w-full sm:w-auto order-1 sm:order-2 h-9 text-sm bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white"
              aria-label="Confirm delete note"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" aria-hidden={true} />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
