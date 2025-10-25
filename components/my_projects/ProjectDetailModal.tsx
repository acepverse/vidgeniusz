import React, { useState, useEffect } from 'react';
import type { Project } from '../../services/database';
import { DownloadIcon, ShareIcon, TrashIcon, PlayIcon, SoundIcon } from '../icons';

interface ProjectDetailModalProps {
    project: Project;
    onClose: () => void;
    onDelete: () => void;
    onPublish: () => void;
}

// Audio Player Component
const AudioPlayer: React.FC<{ project: Project }> = ({ project }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    // Decoding utilities
    const decode = (base64: string): Uint8Array => {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      return bytes;
    }

    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
      const dataInt16 = new Int16Array(data.buffer);
      const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }
      return buffer;
    };

    useEffect(() => {
        const prepareAudio = async () => {
            if (project.mediaUrl.startsWith('data:audio/pcm;base64,')) {
                const base64 = project.mediaUrl.split(',')[1];
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                setAudioContext(ctx);
                const buffer = await decodeAudioData(decode(base64), ctx);
                setAudioBuffer(buffer);
            }
        };
        prepareAudio();
    }, [project.mediaUrl]);

    const handlePlay = () => {
        if (!audioContext || !audioBuffer || isPlaying) return;
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
        setIsPlaying(true);
    };

    return (
        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${project.thumbnailUrl})` }}>
            <div className="w-full h-full bg-black/60 flex flex-col items-center justify-center text-white p-4">
                <SoundIcon className="w-24 h-24 text-white/70 mb-4" />
                <h3 className="text-xl font-bold mb-2 truncate max-w-full">{project.title}</h3>
                <button onClick={handlePlay} disabled={isPlaying || !audioBuffer} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 transition-colors text-white font-bold py-3 px-6 rounded-full flex items-center gap-2">
                    <PlayIcon className="w-5 h-5"/>
                    {isPlaying ? 'Playing...' : 'Play Audio'}
                </button>
            </div>
        </div>
    );
};

const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose, onDelete, onPublish }) => {

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = project.mediaUrl;
        const fileExtension = project.type === 'video' ? 'mp4' : project.type === 'image' ? 'jpeg' : 'raw';
        link.download = `${project.title.replace(/\s+/g, '_')}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#1c1c1c] rounded-2xl w-full max-w-5xl h-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Media Display Area */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                    {project.type === 'video' && <video src={project.mediaUrl} controls autoPlay loop className="w-full h-full object-contain" />}
                    {project.type === 'image' && <img src={project.mediaUrl} alt={project.prompt} className="w-full h-full object-contain" />}
                    {project.type === 'audio' && <AudioPlayer project={project} />}
                </div>

                {/* Details and Actions Area */}
                <div className="w-full md:w-1/3 p-6 flex flex-col overflow-y-auto">
                    <h2 className="text-2xl font-bold text-white mb-2 truncate">{project.title}</h2>
                    <p className="text-sm text-gray-500 mb-4">Dibuat pada: {project.createdAt}</p>
                    
                    {/* Prompt */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Prompt</h3>
                        <p className="text-gray-200 bg-[#2a2a2a] p-3 rounded-lg text-sm max-h-48 overflow-y-auto">{project.prompt}</p>
                    </div>

                    <div className="flex-grow"></div>
                    
                    {/* Actions */}
                    <div className="space-y-3">
                        <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                            <DownloadIcon /> Unduh
                        </button>
                         <button onClick={onPublish} className="w-full flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                            <ShareIcon /> Bagikan ke Publik
                        </button>
                        <button onClick={onDelete} className="w-full flex items-center justify-center gap-2 bg-red-800/60 hover:bg-red-800/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                            <TrashIcon /> Hapus Proyek
                        </button>
                    </div>
                </div>
            </div>
             {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors" aria-label="Close modal">
                &#x2715;
            </button>
        </div>
    );
};

export default ProjectDetailModal;