import { create } from 'zustand';
import { Note, NoteStore } from './types';

const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions/notes'
  : 'http://localhost:8888/.netlify/functions/notes';

const useStore = create<NoteStore>((set, get) => ({
  notes: [],
  currentNote: null,
  isDarkMode: localStorage.getItem('darkMode') === 'true',

  fetchNotes: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const notes = await response.json();
      set({ notes });
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      set({ notes: [] }); // Set empty notes array on error
    }
  },

  addNote: async () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      images: []
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set(state => ({
        notes: [newNote, ...state.notes],
        currentNote: newNote
      }));
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  },

  updateNote: async (id, updates) => {
    const state = get();
    const note = state.notes.find(n => n.id === id);
    if (!note) return;

    const updatedNote = {
      ...note,
      ...updates,
      updatedAt: new Date()
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set(state => ({
        notes: state.notes.map(n => n.id === id ? updatedNote : n),
        currentNote: state.currentNote?.id === id ? updatedNote : state.currentNote
      }));
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  },

  deleteNote: async (id) => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        currentNote: state.currentNote?.id === id ? null : state.currentNote
      }));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),
  
  toggleTheme: () => {
    set(state => {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', String(newDarkMode));
      return { isDarkMode: newDarkMode };
    });
  },

  addImage: async (noteId, image) => {
    const state = get();
    const note = state.notes.find(n => n.id === noteId);
    if (!note) return;

    const updatedNote = {
      ...note,
      images: [image, ...note.images],
      content: `![Image](${image})\n\n${note.content}`,
      updatedAt: new Date()
    };

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set(state => ({
        notes: state.notes.map(n => n.id === noteId ? updatedNote : n),
        currentNote: state.currentNote?.id === noteId ? updatedNote : state.currentNote
      }));
    } catch (error) {
      console.error('Failed to add image:', error);
    }
  }
}));