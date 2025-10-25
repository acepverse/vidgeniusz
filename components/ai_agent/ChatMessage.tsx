import React from 'react';
import type { Message } from './AIAgentPage';
import { SparklesIcon, UserIcon } from '../icons';

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
          <SparklesIcon className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`rounded-xl p-3 text-white inline-block max-w-md ${isUser ? 'bg-purple-600' : 'bg-[#2a2a2a]'}`}
        >
          {message.text}
          {message.imageUrl && (
            <img src={message.imageUrl} alt="Uploaded content" className="mt-2 rounded-lg max-h-48" />
          )}
        </div>
        
        {message.mediaUrl && (
          <div className="mt-2 p-2 bg-[#2a2a2a] rounded-xl border border-gray-700 max-w-md">
            {message.mediaType === 'video' ? (
              <video src={message.mediaUrl} controls loop className="w-full rounded-lg" />
            ) : (
              <img src={message.mediaUrl} alt="Generated content" className="w-full rounded-lg" />
            )}
          </div>
        )}
      </div>

      {isUser && (
         <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;