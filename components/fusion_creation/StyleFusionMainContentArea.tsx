import React, { useRef, useState, DragEvent, FC } from 'react';
import { UploadIcon, DownloadIcon, SaveIcon, ShareIcon, TrashIcon } from '../icons';
import type { OutputType } from './StyleFusionPage';

interface StyleFusionMainContentAreaProps {
    isLoading: boolean;
    loadingMessage: string;
    resultUrl: string | null;
    resultType: OutputType | null;
    contentFile: File | null;
    onContentFileUpload: (file: File | null) => void;
    styleFile: File | null;
    onStyleFileUpload: (file: File | null) => void;
    onGenerate: () => void;
    onDelete: () => void;
    error: string | null;
}

const UploadSlot: FC<{ title: string; file: File | null; onFileChange: (file: File | null) => void; accept: string; }> = ({ title, file, onFileChange, accept }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [previewType, setPreviewType] = useState<'image' | 'video' | null>(null);

    React.useEffect(() => {
        if (!file) {
            setPreview(null);
            setPreviewType(null);
            return;
        }
        setPreviewType(file.type.startsWith('image') ? 'image' : 'video');
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
            className="relative cursor-pointer aspect-video bg-[#1c1c1c] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg flex items-center justify-center text-center transition-colors p-4 w-full"
        >
            <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" accept={accept} />
            {preview ? (
                previewType === 'image' ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-md" />
                ) : (
                    <video src={preview} muted loop autoPlay playsInline className="w-full h-full object-contain rounded-md" />
                )
            ) : (
                <div className="flex flex-col items-center text-gray-500">
                    <UploadIcon className="w-8 h-8 mb-2" />
                    <span className="font-semibold">{title}</span>
                </div>
            )}
        </div>
    );
};


const StyleFusionMainContentArea: React.FC<StyleFusionMainContentAreaProps> = (props) => {
    const { isLoading, loadingMessage, resultUrl, resultType, contentFile, onContentFileUpload, styleFile, onStyleFileUpload, onGenerate, onDelete, error } = props;

    const ResultArea = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center bg-[#1c1c1c] border border-gray-800 rounded-xl p-8 w-full max-w-lg mx-auto aspect-video">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
                    <p className="mt-4 text-gray-300 text-center">{loadingMessage}</p>
                </div>
            );
        }
        
        if(error) {
             return (
                <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4 mt-8 max-w-lg mx-auto">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )
        }

        if (resultUrl && resultType) {
            return (
                <div className="w-full max-w-lg mx-auto">
                    <div className="rounded-xl overflow-hidden border border-gray-800 aspect-video">
                        {resultType === 'image' ? (
                            <img src={resultUrl} alt="Hasil Fusi" className="w-full h-full object-cover" />
                        ) : (
                            <video src={resultUrl} controls autoPlay loop className="w-full h-full object-cover" />
                        )}
                    </div>
                     <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <a href={resultUrl} download={`vidgenius-fusion.${resultType === 'image' ? 'jpeg' : 'mp4'}`} className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <DownloadIcon /> Unduh
                        </a>
                         <button className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <SaveIcon /> Simpan
                        </button>
                        <button onClick={onDelete} className="flex items-center justify-center gap-2 bg-red-800/50 hover:bg-red-800/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <TrashIcon /> Hapus
                        </button>
                         <button className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <ShareIcon /> Bagikan
                        </button>
                    </div>
                </div>
            );
        }

        return (
             <div className="text-center py-16 text-gray-500">
                <p>Unggah konten dan gambar gaya untuk memulai.</p>
            </div>
        );
    };


    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <UploadSlot title="Unggah Konten (Gambar/Video)" file={contentFile} onFileChange={onContentFileUpload} accept="image/*,video/*" />
                <UploadSlot title="Unggah Gaya (Gambar)" file={styleFile} onFileChange={onStyleFileUpload} accept="image/*" />
            </div>
            
            <button
                onClick={onGenerate}
                disabled={isLoading || !contentFile || !styleFile}
                className="w-full text-lg font-bold bg-teal-500 text-white py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(45,212,191,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Hasilkan Fusi
            </button>

            <div className="mt-8">
                <ResultArea />
            </div>
        </div>
    );
};

export default StyleFusionMainContentArea;
