import React, { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Image } from 'lucide-react';
import useStore from '../store';

export default function Editor() {
  const { currentNote, updateNote, addImage } = useStore();

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentNote || !e.target.files?.[0]) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      addImage(currentNote.id, base64String);
    };
    reader.readAsDataURL(file);
  }, [currentNote, addImage]);

  if (!currentNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">Select or create a note to start writing</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex h-screen">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between bg-white dark:bg-gray-800">
          <input
            type="text"
            value={currentNote.title}
            onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
            placeholder="Untitled Note"
            className="text-xl font-bold bg-transparent outline-none text-gray-800 dark:text-white w-full"
          />
          <label className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Image className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {currentNote.images.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {currentNote.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="h-20 w-20 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex">
          <textarea
            value={currentNote.content}
            onChange={(e) => updateNote(currentNote.id, { content: e.target.value })}
            placeholder="Start writing in markdown..."
            className="flex-1 p-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white resize-none outline-none"
          />
          <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              className="prose dark:prose-invert max-w-none"
            >
              {currentNote.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}