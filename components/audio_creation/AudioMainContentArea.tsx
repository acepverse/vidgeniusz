import React, { useState } from 'react';
import { DownloadIcon, PlayIcon, TrashIcon, SaveIcon, ShareIcon } from '../icons';

interface AudioMainContentAreaProps {
    isLoading: boolean;
    audioResultBase64: string | null;
    text: string;
    onTextChange: (value: string) => void;
    onGenerate: () => void;
    onDelete: () => void;
    error: string | null;
    isSaved: boolean;
    onSaveProject: () => void;
    isPublished: boolean;
    onPublishProject: () => void;
}

// Audio decoding utilities from guidelines
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const AudioMainContentArea: React.FC<AudioMainContentAreaProps> = (props) => {
    const { isLoading, audioResultBase64, text, onTextChange, onGenerate, onDelete, error, isSaved, onSaveProject, isPublished, onPublishProject } = props;
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    const handlePlay = async () => {
        if (!audioResultBase64 || isPlaying) return;

        try {
            const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            if (!audioContext) setAudioContext(ctx);

            const buffer = await decodeAudioData(decode(audioResultBase64), ctx, 24000, 1);
            
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.onended = () => setIsPlaying(false);
            source.start();
            setIsPlaying(true);
        } catch(e) {
            console.error("Failed to play audio", e);
        }
    };

    const handleDownload = () => {
        if (!audioResultBase64) return;
        const bytes = decode(audioResultBase64);
        const blob = new Blob([bytes], { type: 'audio/pcm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-audio.raw';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    const ResultDisplay = () => {
        if (isLoading) {
             return (
                <div className="flex flex-col items-center justify-center bg-[#1c1c1c] border border-gray-800 rounded-2xl w-full p-8 mt-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
                    <p className="mt-4 text-gray-300">Generating audio...</p>
                </div>
            );
        }
        
        if (error) {
             return (
                <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg p-4 mt-8">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )
        }

        if (audioResultBase64) {
            return (
                <div className="w-full bg-[#1c1c1c] border border-gray-800 rounded-2xl p-6 mt-8">
                    <div className="flex items-center gap-4">
                        <button onClick={handlePlay} disabled={isPlaying} className="bg-purple-600 p-3 rounded-full text-white disabled:opacity-50 transition-opacity">
                            <PlayIcon className="w-6 h-6" />
                        </button>
                        <div className="text-gray-300 font-medium">Click to play generated audio</div>
                    </div>
                     <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button onClick={handleDownload} className="flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center">
                            <DownloadIcon /> Download
                        </button>
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
                            <TrashIcon /> Delete
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };


    return (
        <div className="flex flex-col h-full">
            <div className="space-y-4">
                <textarea
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="w-full h-40 bg-[#1c1c1c] border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7f5af0] resize-none"
                    placeholder="Enter the text you want to convert to speech..."
                />
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !text.trim()}
                    className="w-full text-lg font-bold bg-teal-500 text-white py-3 px-6 rounded-full transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_rgba(45,212,191,0.7)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    Generate Audio
                </button>
            </div>
            <ResultDisplay />
        </div>
    );
};

export default AudioMainContentArea;