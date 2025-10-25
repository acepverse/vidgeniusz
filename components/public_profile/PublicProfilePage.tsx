import React, { useState, useEffect } from 'react';
import { getUserById, getPublicContentByAuthor, User, PublicContentItem } from '../../services/database';
import { UserIcon } from '../icons';
import ContentGrid from '../ContentGrid';

interface PublicProfilePageProps {
    userId: string;
    onBack: () => void;
    onItemSelect: (item: PublicContentItem) => void;
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ userId, onBack, onItemSelect }) => {
    const [user, setUser] = useState<User | null>(null);
    const [publicItems, setPublicItems] = useState<PublicContentItem[]>([]);

    useEffect(() => {
        const userData = getUserById(userId);
        if (userData) {
            setUser(userData);
        }
        const userItems = getPublicContentByAuthor(userId);
        setPublicItems(userItems);
    }, [userId]);

    if (!user) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-semibold text-gray-400">Pengguna tidak ditemukan</h1>
                <button onClick={onBack} className="mt-4 text-purple-400 hover:text-purple-300">&larr; Kembali ke Beranda</button>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                 <button onClick={onBack} className="text-gray-400 hover:text-white mb-6">&larr; Kembali ke Beranda</button>
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#1c1c1c] p-6 rounded-2xl border border-gray-800">
                    {user.photo ? (
                        <img src={user.photo} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-gray-700"/>
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center">
                            <UserIcon className="w-14 h-14 text-gray-400" />
                        </div>
                    )}
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                        <p className="text-md text-gray-400">@{user.username}</p>
                        <p className="text-sm text-gray-500 mt-2">{publicItems.length} kreasi publik</p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">Kreasi Publik</h2>
            {publicItems.length > 0 ? (
                <ContentGrid 
                    items={publicItems} 
                    searchTerm="" 
                    onItemSelect={onItemSelect} 
                    activeTab="All"
                    disableTabFilter={true}
                />
            ) : (
                <div className="text-center py-16 text-gray-500 bg-[#1c1c1c] rounded-xl">
                    <p>{user.name} belum membagikan kreasi apa pun ke publik.</p>
                </div>
            )}
        </div>
    );
};

export default PublicProfilePage;