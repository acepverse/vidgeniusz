import React, { useRef, useState, DragEvent, FC } from 'react';
import { UploadIcon } from '../icons';

interface TransitionMainContentAreaProps {
    isLoading: boolean;
    loadingMessage: string;
    videoResultUrl: string | null;
    startImage: File | null;
    onStartImageUpload: (file: File | null) => void;
    endImage: File | null;
    onEndImageUpload: (file: File | null) => void;
    prompt: string;
    onPromptChange: (value: string) => void;
    onGenerate: () => void;
    error: string | null;
}

const ImageUploadSlot: FC<{ title: string; file: File | null; onFileChange: (file: File | null) => void; }> = ({ title, file, onFileChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    React.useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        return () => {
          reader.onloadend = null;
        }
    }, [file]);

    const handleFileSelect = (files: FileList | null) => {
        onFileChange(files?.[0] || null);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileSelect(e.dataTransfer.files);
    };

    return (
        <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="relative cursor-pointer aspect-video bg-[#1c1c1c] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg flex items-center justify-center text-center transition-colors p-4"
        >
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" accept="image/*" />
            {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-md" />
            ) : (
                <div className="flex flex-col items-center text-gray-500">
                    <UploadIcon className="w-8 h-8 mb-2" />
                    <span className="font-semibold">{title}</span>
                </div>
            )}
        </div>
    );
};

const TransitionMainContentArea: React.FC<TransitionMainContentAreaProps> = (props) => {
    const { isLoading, loadingMessage, videoResultUrl, startImage, onStartImageUpload, endImage, onEndImageUpload, prompt, onPromptChange, onGenerate, error } = props;

    const ResultArea = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center bg-[#1c1c1c] border border-gray-800 rounded-xl p-8 w-full aspect-video">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
                    <p className="mt-4 text-gray-300 text-center">{loadingMessage}</p>
                </div>
            );
        }

        if (error) {
             return (
                <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )
        }

        if (videoResultUrl) {
            return (
                <div className="rounded-xl overflow-hidden border border-gray-800 aspect-video">
                     <video src={videoResultUrl} controls autoPlay loop className="w-full h-full object-cover" />
                </div>
            );
        }

        return (
             <div className="text-center py-16 text-gray-500">
                <p>Upload a start and end image to generate a transition.</p>
            </div>
        );
    };


    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadSlot title="Upload Start Image" file={startImage} onFileChange={onStartImageUpload} />
                <ImageUploadSlot title="Upload End Image" file={endImage} onFileChange={onEndImageUpload} />
            </div>
            
            <textarea
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                className="w-full h-24 bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Describe the transition (e.g., 'a smooth fade from the city to the beach')..."
            />
            
            <button
                onClick={onGenerate}
                disabled={isLoading || !startImage || !endImage}
                className="w-full text-lg font-bold bg-teal-500 text-white py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(45,212,191,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Generate Transition
            </button>

            <div className="mt-8">
                <ResultArea />
            </div>
        </div>
    );
};

export default TransitionMainContentArea;
