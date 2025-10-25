import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleGenAI } from '@google/genai';
import { AgentIcon, SparklesIcon } from '../icons';

export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  imageUrl?: string; // For user uploads
  mediaUrl?: string; // For AI-generated media
  mediaType?: 'image' | 'video';
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });


const AIAgentPage: React.FC = () => {
  const { user, openLoginModal } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Halo! Saya Genie, asisten AI kreatif Anda. Mari kita buat sesuatu yang luar biasa bersama. Anda bisa meminta saya untuk brainstorming ide, atau langsung memberi perintah seperti 'buat video sinematik tentang seekor naga yang terbang di atas pegunungan'. Apa yang ingin Anda ciptakan hari ini?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (inputText: string, imageFile: File | null) => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!inputText.trim() && !imageFile) return;

    // Keep a copy of messages before adding the new user message for history
    const previousMessages = [...messages];

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

      const systemInstruction = "You are Genie, a friendly and extremely creative AI assistant for VidGenius. Your goal is to help users brainstorm and create stunning videos and images. Be conversational, ask clarifying questions, and when the user asks you to 'generate', 'create', or 'make' a video or image, respond with a confirmation message AND a simulated media URL in the format `[GENERATE:{type}:{url}]` where {type} is 'image' or 'video' and {url} is a placeholder URL from picsum.photos for images or mixkit.co for videos. For all other conversation, just respond naturally.";

      // Build conversation history from previous messages
      // Simple mapping: Ignores images in previous turns for this implementation
      const history = previousMessages.map(msg => ({
        role: msg.sender === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      // Build parts for the current user message
      const currentUserParts: any[] = [{ text: inputText }];
      if (imageFile) {
        const base64Data = await fileToBase64(imageFile);
        currentUserParts.push({
          inlineData: {
            mimeType: imageFile.type,
            data: base64Data
          }
        });
      }

      // Combine history with the current user message
      const conversationContents = [
        ...history,
        { role: 'user', parts: currentUserParts }
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: conversationContents, // Use the full conversation history
        config: {
          systemInstruction
        }
      });

      let aiResponseText = response.text;
      let mediaUrl: string | undefined;
      let mediaType: 'image' | 'video' | undefined;

      const generationRegex = /\[GENERATE:(image|video):(.*?)\]/;
      const match = aiResponseText.match(generationRegex);

      if (match) {
        aiResponseText = aiResponseText.replace(generationRegex, '').trim();
        mediaType = match[1] as 'image' | 'video';
        mediaUrl = match[2];
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText || "Berikut hasilnya!",
        mediaUrl,
        mediaType,
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI Agent Error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Maaf, terjadi sedikit kesalahan. Bisakah kita coba lagi?",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
             <div className="bg-gradient-to-br from-purple-600/20 to-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center">
                 <AgentIcon className="w-8 h-8 text-teal-300" />
            </div>
            <div>
                 <h1 className="text-3xl font-bold text-white">AI Agent (Genie)</h1>
                 <p className="text-gray-400">Asisten kreatif pribadi Anda untuk brainstorming dan generasi konten.</p>
            </div>
        </div>

        <div className="flex-grow bg-[#1c1c1c] rounded-2xl border border-gray-800 p-4 flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto space-y-6 pr-2">
                {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <SparklesIcon className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div className="bg-[#2a2a2a] rounded-xl p-3 text-white inline-block">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="mt-4 flex-shrink-0">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </div>
        </div>
    </div>
  );
};

export default AIAgentPage;