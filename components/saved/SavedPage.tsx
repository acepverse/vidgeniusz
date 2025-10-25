import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getSavedForUser, unsaveItem, SavedItem } from '../../services/database';
import { BookmarkIcon, BookmarkFilledIcon, PlayIcon, SoundIcon } from '../icons';

// Kartu individual untuk item yang disimpan, dengan tombol untuk menghapus
const SavedItemCard: React.FC<{ item: SavedItem; onUnsave: (id: string) => void }> = ({ item, onUnsave }) => {
    return (
        <div className="relative rounded-xl overflow-hidden group aspect-[3/4] bg-gray-900">
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
                    alt={`Content ${item.id}`} 
                    className="w-full h-full object-cover" 
                />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Tombol Hapus Penyimpanan (Unsave) */}
            <button 
                onClick={(e) => { e.stopPropagation(); onUnsave(item.id); }}
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80"
                aria-label="Unsave item"
            >
                <BookmarkFilledIcon className="w-5 h-5 text-purple-400" />
            </button>
            
             {item.type === 'video' && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold px-2 py-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayIcon className="w-3 h-3" />
                    <span>Video</span>
                </div>
            )}
            {item.type === 'audio' && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold px-2 py-1 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <SoundIcon className="w-3 h-3" />
                    <span>Audio</span>
                </div>
            )}
        </div>
    );
};


const SavedPage: React.FC = () => {
    const { user, openLoginModal } = useAuth();
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

    useEffect(() => {
        if (user) {
            setSavedItems(getSavedForUser(user.id));
        } else {
            setSavedItems([]); // Hapus item jika pengguna logout
        }
    }, [user]);

    const handleUnsave = (contentId: string) => {
        if (user) {
            unsaveItem(user.id, contentId);
            // Perbarui state secara langsung untuk umpan balik UI yang instan
            setSavedItems(prevItems => prevItems.filter(item => item.id !== contentId));
        }
    };

    // Kondisi jika pengguna tidak login sudah ditangani oleh Sidebar, 
    // tapi ini adalah fallback jika halaman diakses secara langsung.
    if (!user) {
        return (
            <div className="text-center py-20 bg-[#1c1c1c] border-2 border-dashed border-gray-800 rounded-xl">
                <BookmarkIcon className="w-16 h-16 mx-auto text-gray-600" />
                <h3 className="mt-4 text-xl font-semibold text-gray-400">Lihat Item Tersimpan Anda</h3>
                <p className="mt-1 text-gray-500">Silakan login untuk mengakses koleksi pribadi Anda.</p>
                <button 
                    onClick={openLoginModal}
                    className="mt-6 bg-teal-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-teal-600 transition-colors"
                >
                    Login
                </button>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Item Tersimpan</h1>
            <p className="text-gray-400 mb-8">Koleksi inspirasi pribadi Anda.</p>
            
            {savedItems.length === 0 ? (
                <div className="text-center py-20 bg-[#1c1c1c] border-2 border-dashed border-gray-800 rounded-xl">
                    <BookmarkIcon className="w-16 h-16 mx-auto text-gray-600" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-400">Daftar tersimpan Anda kosong</h3>
                    <p className="mt-1 text-gray-500">Jelajahi halaman utama dan simpan konten yang Anda sukai.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {savedItems.map(item => (
                        <SavedItemCard key={item.id} item={item} onUnsave={handleUnsave} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedPage;
