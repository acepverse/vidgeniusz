import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { PaperAirplaneIcon, PaperclipIcon } from '../icons';

interface ChatInputProps {
  onSend: (text: string, image: File | null) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (isLoading || (!text.trim() && !image)) return;
    onSend(text, image);
    setText('');
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-2 flex flex-col">
      {imagePreview && (
        <div className="relative p-2">
          <img src={imagePreview} alt="Preview" className="max-h-24 rounded-lg" />
          <button
            onClick={() => {
              setImage(null);
              setImagePreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <textarea
          ref={textAreaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Kirim pesan atau unggah gambar..."
          className="w-full bg-transparent resize-none focus:outline-none text-white placeholder-gray-500 max-h-32"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || (!text.trim() && !image)}
          className="p-2 rounded-full bg-purple-600 text-white disabled:opacity-50 transition-colors flex-shrink-0"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;