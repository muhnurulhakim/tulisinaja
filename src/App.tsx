import React, { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import useStore from './store';

function App() {
  const { isDarkMode, fetchNotes } = useStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-white dark:bg-gray-800">
        <Sidebar />
        <Editor />
      </div>
    </div>
  );
}

export default App;