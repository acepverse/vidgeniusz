import React, { useState, useEffect } from 'react';
import { PublicContentItem, getUserById, User, isItemSaved, saveItem, unsaveItem } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { BookmarkIcon, BookmarkFilledIcon, DownloadIcon, ShareIcon, UserIcon, TrashIcon } from './icons';

interface ContentDetailModalProps {
    item: PublicContentItem;
    onClose: () => void;
    onViewProfile: (userId: string) => void;
    onUnpublish: (contentId: string) => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({ item, onClose, onViewProfile, onUnpublish }) => {
    const { user, openLoginModal } = useAuth();
    const [author, setAuthor] = useState<User | null>(null);
    const [isSaved, setIsSaved] = useState(false);

    const isOwner = user?.id === item.authorId;

    useEffect(() => {
        const authorData = getUserById(item.authorId);
        if (authorData) {
            setAuthor(authorData);
        }

        if (user) {
            setIsSaved(isItemSaved(user.id, item.id));
        } else {
            setIsSaved(false);
        }
    }, [item, user]);

    const handleSaveToggle = () => {
        if (!user) {
            openLoginModal();
            return;
        }
        if (isSaved) {
            unsaveItem(user.id, item.id);
            setIsSaved(false);
        } else {
            saveItem(user.id, item);
            setIsSaved(true);
        }
    };

    const handleDownload = () => {
        const url = item.type === 'video' ? item.videoUrl : item.imageUrl;
        if (!url) return;
        
        const link = document.createElement('a');
        link.href = url;
        // Suggest a filename for the download
        link.download = `vidgenius-${item.type}-${item.id}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
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
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                {/* Media Display Area */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                    {item.type === 'video' ? (
                        <video src={item.videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                    ) : (
                        <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-contain" />
                    )}
                </div>

                {/* Details and Actions Area */}
                <div className="w-full md:w-1/3 p-6 flex flex-col overflow-y-auto">
                    {/* Author Info */}
                    <button 
                        onClick={() => onViewProfile(item.authorId)}
                        className="flex items-center gap-3 mb-4 text-left w-full p-2 -ml-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                        aria-label={`View profile of ${author?.name || 'Unknown User'}`}
                    >
                        {author?.photo ? (
                            <img src={author.photo} alt={author.name} className="w-12 h-12 rounded-full object-cover"/>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-white">{author?.name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-400">@{author?.username || 'unknown'}</p>
                        </div>
                    </button>
                    
                    {/* Prompt */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Prompt</h3>
                        <p className="text-gray-200 bg-[#2a2a2a] p-3 rounded-lg text-sm">{item.prompt}</p>
                    </div>

                    {/* Spacer */}
                    <div className="flex-grow"></div>
                    
                    {/* Actions */}
                    <div className={`grid ${isOwner ? 'grid-cols-4' : 'grid-cols-3'} gap-3`}>
                         <button onClick={handleSaveToggle} className="flex flex-col items-center justify-center gap-1 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors">
                            {isSaved ? <BookmarkFilledIcon className="w-5 h-5 text-purple-400"/> : <BookmarkIcon className="w-5 h-5"/>}
                            <span className="text-xs">{isSaved ? 'Tersimpan' : 'Simpan'}</span>
                        </button>
                         <button onClick={handleDownload} className="flex flex-col items-center justify-center gap-1 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors">
                            <DownloadIcon />
                            <span className="text-xs">Unduh</span>
                        </button>
                        <button onClick={() => alert('Fitur berbagi akan segera hadir!')} className="flex flex-col items-center justify-center gap-1 bg-[#2a2a2a] hover:bg-gray-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors">
                            <ShareIcon />
                            <span className="text-xs">Bagikan</span>
                        </button>
                        {isOwner && (
                            <button 
                                onClick={() => onUnpublish(item.id)} 
                                className="flex flex-col items-center justify-center gap-1 bg-red-800/60 hover:bg-red-800/90 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
                            >
                                <TrashIcon />
                                <span className="text-xs">Hapus</span>
                            </button>
                        )}
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

export default ContentDetailModal;