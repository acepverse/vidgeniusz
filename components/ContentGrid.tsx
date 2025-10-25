import React, { useState, useEffect, useMemo } from 'react';
import { PlayIcon, SoundIcon, ChatBubbleIcon, BookmarkIcon, BookmarkFilledIcon, SearchIcon } from './icons';
import { PublicContentItem, getPublicContent, isItemSaved, saveItem, unsaveItem } from '../services/database';
import { useAuth } from '../contexts/AuthContext';
import { MainTab } from '../App';

interface GridItemProps {
    item: PublicContentItem;
    onItemSelect: (item: PublicContentItem) => void;
}

const GridItem: React.FC<GridItemProps> = ({ item, onItemSelect }) => {
    const { user, openLoginModal } = useAuth();
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (user) {
            setIsSaved(isItemSaved(user.id, item.id));
        } else {
            setIsSaved(false);
        }
    }, [user, item.id]);

    const handleSaveToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
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

    return (
        <div 
            className="relative rounded-xl overflow-hidden group aspect-[3/4] bg-gray-900 cursor-pointer"
            onClick={() => onItemSelect(item)}
        >
            {item.type === 'video' && item.videoUrl ? (
                <video
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
            ) : (
                <img 
                    src={item.imageUrl} 
                    alt={item.prompt}
                    className="w-full h-full object-cover" 
                />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {item.label && (
                <div className={`absolute top-2 left-2 flex items-center gap-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${item.icon === 'chat' ? 'bg-purple-500/80' : 'bg-black/50'}`}>
                    {item.icon === 'chat' && <ChatBubbleIcon className="w-4 h-4" />}
                    {item.type === 'video' && item.icon !== 'chat' && <PlayIcon className="w-4 h-4" />}
                    <span>{item.label}</span>
                </div>
            )}

            {item.icon === 'sound' && item.type !== 'video' && (
                <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-full">
                    <SoundIcon className="w-5 h-5 text-white" />
                </div>
            )}

            {/* Tombol Simpan */}
            <button 
                onClick={handleSaveToggle}
                className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
                aria-label={isSaved ? 'Unsave item' : 'Save item'}
            >
                {isSaved ? <BookmarkFilledIcon className="w-5 h-5 text-purple-400" /> : <BookmarkIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

interface ContentGridProps {
    searchTerm: string;
    onItemSelect: (item: PublicContentItem) => void;
    items?: PublicContentItem[]; // Prop opsional untuk menyediakan data kustom
    activeTab: MainTab;
    disableTabFilter?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({ searchTerm, onItemSelect, items, activeTab, disableTabFilter = false }) => {
    const [contentItems, setContentItems] = useState<PublicContentItem[]>([]);
    
    useEffect(() => {
        // Gunakan 'items' jika disediakan, jika tidak, ambil semua konten publik
        setContentItems(items || getPublicContent());
    }, [items]);

    const filteredItems = useMemo(() => {
        let tabFiltered = contentItems;

        if (!disableTabFilter) {
            // 1. Filter berdasarkan tab aktif
            switch (activeTab) {
                case 'All':
                    // Tidak perlu filter, tabFiltered sudah berisi semua contentItems
                    break;
                case 'Video':
                    tabFiltered = contentItems.filter(item => item.type === 'video');
                    break;
                case 'Agen':
                    tabFiltered = contentItems.filter(item => item.icon === 'chat');
                    break;
                case 'Template':
                    // Tampilkan item yang memiliki label (kemungkinan dibuat dari template)
                    tabFiltered = contentItems.filter(item => item.label);
                    break;
            }
        }

        // 2. Filter berdasarkan istilah pencarian
        if (!searchTerm) {
            return tabFiltered;
        }
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return tabFiltered.filter(item => 
            item.prompt.toLowerCase().includes(lowercasedSearchTerm) ||
            item.label?.toLowerCase().includes(lowercasedSearchTerm)
        );
    }, [contentItems, searchTerm, activeTab, disableTabFilter]);

    if (filteredItems.length === 0 && searchTerm) {
        return (
            <div className="text-center py-20 bg-[#1c1c1c] border-2 border-dashed border-gray-800 rounded-xl">
                <SearchIcon className="w-16 h-16 mx-auto text-gray-600" />
                <h3 className="mt-4 text-xl font-semibold text-gray-400">
                    Tidak ada hasil yang ditemukan
                </h3>
                <p className="mt-1 text-gray-500">
                    Coba gunakan kata kunci lain untuk "{searchTerm}".
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredItems.map(item => (
                <GridItem key={item.id} item={item} onItemSelect={onItemSelect} />
            ))}
        </div>
    );
};

export default ContentGrid;