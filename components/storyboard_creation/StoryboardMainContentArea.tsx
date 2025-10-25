import React, { useRef, useState, DragEvent, FC, useEffect } from 'react';
import type { CharacterReference, StoryboardResult } from './StoryboardCreationPage';
import { UploadIcon, DownloadIcon, SaveIcon, ShareIcon, ClipboardIcon } from '../icons';

interface StoryboardMainContentAreaProps {
    isLoading: boolean;
    loadingMessage: string;
    error: string | null;
    characterRefs: CharacterReference[];
    onCharacterChange: (index: number, name: string, file: File | null) => void;
    script: string;
    onScriptChange: (value: string) => void;
    onGenerate: () => void;
    results: StoryboardResult[];
}

const CharacterUploadSlot: FC<{
    character: CharacterReference;
    onChange: (name: string, file: File | null) => void;
}> = ({ character, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (character.file) {
            const objectUrl = URL.createObjectURL(character.file);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [character.file]);

    const handleFileSelect = (files: FileList | null) => {
        const file = files?.[0] || null;
        onChange(character.name, file);
    };
    
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, character.file);
    };

    return (
        <div className="flex flex-col gap-2">
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer aspect-square bg-[#1c1c1c] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg flex items-center justify-center text-center transition-colors p-2"
            >
                <input type="file" ref={fileInputRef} onChange={(e) => handleFileSelect(e.target.files)} className="hidden" accept="image/*" />
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <UploadIcon className="w-6 h-6" />
                    </div>
                )}
            </div>
            <input
                type="text"
                value={character.name}
                onChange={handleNameChange}
                placeholder={`Nama Karakter ${character.id + 1}`}
                className="w-full bg-[#2a2a2a] border border-gray-700 text-center rounded-lg px-2 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
        </div>
    );
};

const ResultCard: FC<{ result: StoryboardResult }> = ({ result }) => {
    const [copyText, setCopyText] = useState('Salin Prompt');

    const handleCopy = () => {
        navigator.clipboard.writeText(result.animationPrompt).then(() => {
            setCopyText('Disalin!');
            setTimeout(() => setCopyText('Salin Prompt'), 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
    
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = result.imageUrl;
        link.download = `vidgenius-storyboard-shot-${result.shot}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-[#1c1c1c] border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 flex-shrink-0">
                <h3 className="font-bold text-white mb-2">Adegan {result.shot}</h3>
                <img src={result.imageUrl} alt={`Storyboard shot ${result.shot}`} className="w-full rounded-lg aspect-video object-cover" />
                <div className="mt-2 grid grid-cols-3 gap-2">
                    <button onClick={handleDownload} className="flex items-center justify-center gap-1.5 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-1.5 px-2 rounded-lg transition-colors text-xs"><DownloadIcon className="w-4 h-4" /> Unduh</button>
                    <button onClick={() => alert("Segera hadir!")} className="flex items-center justify-center gap-1.5 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-1.5 px-2 rounded-lg transition-colors text-xs"><ShareIcon className="w-4 h-4" /> Bagikan</button>
                    <button onClick={() => alert("Segera hadir!")} className="flex items-center justify-center gap-1.5 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-1.5 px-2 rounded-lg transition-colors text-xs"><SaveIcon className="w-4 h-4" /> Simpan</button>
                </div>
            </div>
            <div className="w-full md:w-2/3">
                 <h3 className="font-bold text-white mb-2">Prompt Animasi Lengkap beserta Dialog</h3>
                 <div className="bg-[#2a2a2a] rounded-lg p-3 text-sm text-gray-300 whitespace-pre-wrap font-mono h-48 overflow-y-auto">
                    {result.animationPrompt}
                 </div>
                 <button onClick={handleCopy} className="w-full mt-2 flex items-center justify-center gap-2 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                    <ClipboardIcon className="w-4 h-4" /> {copyText}
                 </button>
            </div>
        </div>
    );
};


const StoryboardMainContentArea: React.FC<StoryboardMainContentAreaProps> = (props) => {
    const { isLoading, loadingMessage, error, characterRefs, onCharacterChange, script, onScriptChange, onGenerate, results } = props;

    return (
        <div className="flex flex-col h-full space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">1. Unggah Referensi Karakter (Opsional)</label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {characterRefs.map((char, index) => (
                        <CharacterUploadSlot key={char.id} character={char} onChange={(name, file) => onCharacterChange(index, name, file)} />
                    ))}
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-3">2. Masukkan Naskah Lengkap</label>
                 <textarea
                    value={script}
                    onChange={(e) => onScriptChange(e.target.value)}
                    className="w-full h-48 bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                    placeholder="Masukkan naskah cerita lengkap Anda di sini, termasuk nama karakter, dialog, dan deskripsi adegan..."
                />
            </div>
            
            <button
                onClick={onGenerate}
                disabled={isLoading || !script.trim()}
                className="w-full text-lg font-bold bg-teal-500 text-white py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(45,212,191,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isLoading ? 'Menghasilkan...' : 'Buat Storyboard'}
            </button>
            
            {/* Results Area */}
            <div className="mt-4 space-y-4">
                 {isLoading && (
                    <div className="flex flex-col items-center justify-center bg-[#1c1c1c] border border-gray-800 rounded-xl p-8 w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
                        <p className="mt-4 text-gray-300 text-center">{loadingMessage}</p>
                    </div>
                )}
                 {error && (
                    <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
                {results.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Hasil Storyboard</h2>
                        {results.map(res => <ResultCard key={res.shot} result={res} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryboardMainContentArea;
