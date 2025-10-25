import React from 'react';
import ProfilePageWrapper from './ProfilePageWrapper';
import { TelegramIcon } from '../icons';

interface CommunityPageProps {
    onBack: () => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
    const communityLink = "https://t.me/vidgeniuscommunity";

    return (
        <ProfilePageWrapper title="Komunitas VidGenius" onBack={onBack}>
            <div className="flex flex-col items-center justify-center text-center h-full py-12">
                <div className="w-24 h-24 rounded-full bg-sky-500/20 flex items-center justify-center mb-6">
                    <TelegramIcon className="w-12 h-12 text-sky-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Bergabunglah dengan Komunitas Kami!</h2>
                <p className="text-gray-400 max-w-xl mb-8">
                    Terhubung dengan sesama kreator, bagikan karya Anda, dapatkan tips & trik eksklusif, dan jadilah yang pertama tahu tentang fitur-fitur baru VidGenius.
                </p>
                <a 
                    href={communityLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-full transition-colors text-lg"
                >
                    <TelegramIcon className="w-6 h-6" />
                    Gabung via Telegram
                </a>
            </div>
        </ProfilePageWrapper>
    );
};
export default CommunityPage;