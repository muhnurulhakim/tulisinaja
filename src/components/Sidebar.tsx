import React from 'react';
import { PlusCircle, Moon, Sun, Trash2 } from 'lucide-react';
import useStore from '../store';

export default function Sidebar() {
  const { notes, currentNote, addNote, setCurrentNote, isDarkMode, toggleTheme, deleteNote } = useStore();

  return (
    <div className="w-64 h-screen border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">TulisinAja</h1>
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-gray-200" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
      </div>
      
      <div className="p-4">
        <button
          onClick={addNote}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          <PlusCircle className="w-5 h-5" />
          New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.map(note => (
          <div
            key={note.id}
            className={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center ${
              currentNote?.id === note.id ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => setCurrentNote(note)}
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 dark:text-white truncate">
                {note.title || 'Untitled Note'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(note.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}