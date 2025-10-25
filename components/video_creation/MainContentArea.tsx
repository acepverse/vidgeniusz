import React, { useRef, useState, DragEvent } from 'react';
import type { AspectRatio } from './VideoCreationPage';
import { UploadIcon, DownloadIcon, SaveIcon, ShareIcon, TrashIcon } from '../icons';

interface MainContentAreaProps {
    isLoading: boolean;
    loadingMessage: string;
    videoResultUrl: string | null;
    description: string;
    onDescriptionChange: (value: string) => void;
    uploadedImage: File | null;
    onImageUpload: (file: File | null) => void;
    onCreateVideo: () => void;
    onDeleteVideo: () => void;
    aspectRatio: AspectRatio;
    error: string | null;
    isSaved: boolean;
    onSaveProject: () => void;
    isPublished: boolean;
    onPublishProject: () => void;
}

const getAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
        case '1:1': return 'aspect-square';
        case '16:9': return 'aspect-video';
        case '9:16': return 'aspect-[9/16]';
        case '4:3': return 'aspect-[4/3]';
        default: return 'aspect-square';
    }
}

const MainContentArea: React.FC<MainContentAreaProps> = (props) => {
    const { 
        isLoading, 
        loadingMessage,
        videoResultUrl, 
        onCreateVideo, 
        onDeleteVideo,
        aspectRatio, 
        uploadedImage,
        onImageUpload,
        description,
        onDescriptionChange,
        error,
        isSaved,
        onSaveProject,
        isPublished,
        onPublishProject
    } = props;
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (files: FileList | null) => {
        const file = files?.[0];
        if (file) {
            onImageUpload(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            onImageUpload(null);
            setImagePreview(null);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFileChange(e.dataTransfer.files);
    };
    
    // Renders the placeholder, loader, or video result
    const ResultArea = () => {
        if (isLoading) {
            return (
                <div className={`flex flex-col items-center justify-center bg-[#1c1c1c] border border-gray-800 rounded-xl p-8 w-full max-w-lg mx-auto ${getAspectRatioClass(aspectRatio)}`}>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
                    <p className="mt-4 text-gray-300 text-center">{loadingMessage}</p>
                </div>
            );
        }

        if (error) {
             return (
                <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4 mt-8 max-w-lg mx-auto">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )
        }

        if (videoResultUrl) {
            return (
                <div className="w-full max-w-lg mx-auto">
                     <div className={`rounded-xl overflow-hidden border border-gray-800 ${getAspectRatioClass(aspectRatio)}`}>
                         <video src={videoResultUrl} controls autoPlay loop className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <a href={videoResultUrl} download="vidgenius-video.mp4" className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <DownloadIcon /> Unduh
                        </a>
                         <button 
                            onClick={onSaveProject}
                            disabled={isSaved}
                            className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                         >
                            <SaveIcon /> {isSaved ? 'Tersimpan' : 'Simpan'}
                        </button>
                         <button 
                            onClick={onPublishProject} 
                            disabled={isPublished}
                            className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                         >
                            <ShareIcon /> {isPublished ? 'Dibagikan' : 'Bagikan Publik'}
                        </button>
                        <button onClick={onDeleteVideo} className="flex items-center justify-center gap-2 bg-red-800/50 hover:bg-red-800/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <TrashIcon /> Hapus
                        </button>
                    </div>
                </div>
            );
        }

        return (
             <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-400">Belum ada video</h2>
                <p className="text-gray-500">Mulai buat video pertamamu di sini.</p>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-4">
                <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative cursor-pointer bg-[#1c1c1c] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl p-8 text-center transition-colors w-full"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="hidden"
                        accept="image/*"
                    />
                    {imagePreview ? (
                         <img src={imagePreview} alt="Preview" className="mx-auto max-h-40 rounded-lg" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <UploadIcon className="w-10 h-10 mb-2" />
                            <p className="font-semibold">Drag & drop atau klik untuk upload gambar</p>
                            <p className="text-sm">(Opsional, sebagai gambar awal)</p>
                        </div>
                    )}
                </div>

                <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    className="w-full h-24 bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Jelaskan ide video kamu di sini..."
                />
                
                <button
                    onClick={onCreateVideo}
                    disabled={isLoading || (!description && !uploadedImage)}
                    className="w-full text-lg font-bold bg-teal-500 text-white py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(45,212,191,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Hasilkan Video
                </button>
            </div>

            <div className="mt-8">
                <ResultArea />
            </div>
        </div>
    );
};

export default MainContentArea;