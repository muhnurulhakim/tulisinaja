export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}

export interface NoteStore {
  notes: Note[];
  currentNote: Note | null;
  isDarkMode: boolean;
  addNote: () => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setCurrentNote: (note: Note | null) => void;
  toggleTheme: () => void;
  addImage: (noteId: string, image: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
}