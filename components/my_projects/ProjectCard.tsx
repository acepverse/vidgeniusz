import React from 'react';
import type { Project } from '../../services/database';
import { SoundIcon, PlayIcon, ImageIcon } from '../icons';

interface ProjectCardProps {
    project: Project;
    onSelect: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
    const { title, type, thumbnailUrl, createdAt } = project;

    const renderMedia = () => {
        switch(type) {
            case 'video':
                return <video src={thumbnailUrl} muted loop autoPlay playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />;
            case 'image':
                return <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />;
            case 'audio':
                 return (
                    <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url(${thumbnailUrl})` }}>
                        <div className="w-full h-full bg-black/50 flex items-center justify-center">
                            <SoundIcon className="w-12 h-12 text-white/70" />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    const TypeIcon = () => {
        switch(type) {
            case 'video': return <PlayIcon className="w-4 h-4" />;
            case 'image': return <ImageIcon className="w-4 h-4" />;
            case 'audio': return <SoundIcon className="w-4 h-4" />;
            default: return null;
        }
    }

    return (
        <div 
            onClick={onSelect}
            className="bg-[#1c1c1c] rounded-xl overflow-hidden border border-gray-800 group relative cursor-pointer"
        >
            <div className="aspect-[3/4] overflow-hidden">
                {renderMedia()}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                <h3 className="font-bold text-white text-sm truncate">{title}</h3>
                <p className="text-gray-400 text-xs">{createdAt}</p>
            </div>
            
            {/* Type Indicator */}
            <div className="absolute top-2 left-2 bg-black/50 p-1.5 rounded-full">
                <TypeIcon />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold border-2 border-white rounded-full px-4 py-2">
                    View Details
                </span>
            </div>
        </div>
    );
};

export default ProjectCard;