import React, { useState } from 'react';
import type { ImageAspectRatio } from './ImageCreationPage';
import { DownloadIcon, SaveIcon, ShareIcon, TrashIcon, ClipboardIcon } from '../icons';

interface ImageMainContentAreaProps {
    isLoading: boolean;
    imageResultUrl: string | null;
    prompt: string;
    onPromptChange: (value: string) => void;
    onGenerate: () => void;
    onDelete: () => void;
    aspectRatio: ImageAspectRatio;
    error: string | null;
    isSaved: boolean;
    onSaveProject: () => void;
    isPublished: boolean;
    onPublishProject: () => void;
    animationPrompt: string | null;
    isGeneratingAnimationPrompt: boolean;
}

const getAspectRatioClass = (ratio: ImageAspectRatio) => {
    switch (ratio) {
        case '1:1': return 'aspect-square';
        case '3:4': return 'aspect-[3/4]';
        case '9:16': return 'aspect-[9/16]';
        case '16:9': return 'aspect-video';
        case '4:5': return 'aspect-[4/5]';
        default: return 'aspect-square';
    }
}

const ImageMainContentArea: React.FC<ImageMainContentAreaProps> = (props) => {
    const { isLoading, imageResultUrl, prompt, onPromptChange, onGenerate, aspectRatio, error, onDelete, isSaved, onSaveProject, isPublished, onPublishProject, animationPrompt, isGeneratingAnimationPrompt } = props;
    const [copyButtonText, setCopyButtonText] = useState('Salin');

    const handleCopyPrompt = () => {
        if (!animationPrompt) return;
        navigator.clipboard.writeText(animationPrompt).then(() => {
            setCopyButtonText('Disalin!');
            setTimeout(() => setCopyButtonText('Salin'), 2000);
        }).catch(err => {
            console.error('Gagal menyalin prompt: ', err);
            alert('Gagal menyalin prompt.');
        });
    };

    const ResultDisplay = () => {
        if (isLoading) {
            return (
                <div className={`flex flex-col items-center justify-center bg-[#1c1c1c] border border-gray-800 rounded-2xl w-full max-w-lg mx-auto ${getAspectRatioClass(aspectRatio)}`}>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
                    <p className="mt-4 text-gray-300">Menghasilkan gambar...</p>
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

        if (imageResultUrl) {
            return (
                <div className="w-full max-w-lg mx-auto">
                    <div className={`rounded-2xl overflow-hidden border border-gray-800 shadow-lg shadow-black/30 ${getAspectRatioClass(aspectRatio)}`}>
                        <img src={imageResultUrl} alt="Generated result" className="w-full h-full object-cover" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <a href={imageResultUrl} download="vidgenius-image.jpeg" className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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
                         <button onClick={onDelete} className="flex items-center justify-center gap-2 bg-red-800/50 hover:bg-red-800/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <TrashIcon /> Hapus
                        </button>
                    </div>

                    {animationPrompt && (
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-gray-400 mb-2">Saran Prompt Animasi (untuk Video)</h3>
                            <div className="bg-[#2a2a2a] p-4 rounded-lg text-sm text-gray-200">
                                <p className="mb-3">{animationPrompt}</p>
                                <button
                                    onClick={handleCopyPrompt}
                                    className="w-full flex items-center justify-center gap-2 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                                >
                                    <ClipboardIcon className="w-4 h-4" />
                                    {copyButtonText}
                                </button>
                            </div>
                        </div>
                    )}
                    {isGeneratingAnimationPrompt && (
                        <div className="mt-6 text-center text-gray-400 text-sm animate-pulse">
                            <p>Menghasilkan saran prompt animasi...</p>
                        </div>
                    )}
                </div>
            );
        }

        return null; // Don't show anything if there's no result and not loading
    };


    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow space-y-4">
                 <textarea
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    className="w-full h-28 bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] resize-none"
                    placeholder="Deskripsikan hasil gambar yang kamu inginkan (misalnya: model mengenakan jaket kulit hitam bergaya fashion editorial)."
                />
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full text-lg font-bold bg-teal-500 text-white py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(45,212,191,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Hasilkan Gambar
                </button>
            </div>

            <div className="mt-8">
                <ResultDisplay />
            </div>
        </div>
    );
};

export default ImageMainContentArea;