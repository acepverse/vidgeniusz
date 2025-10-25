import React from 'react';
import ProfilePageWrapper from './ProfilePageWrapper';
import { useAuth } from '../../contexts/AuthContext';
import { UserIcon, LogoutIcon } from '../icons';

interface UserInfoPageProps {
    onBack: () => void;
}

const UserInfoPage: React.FC<UserInfoPageProps> = ({ onBack }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onBack(); // Return to the previous view after logging out
    };

    return (
        <ProfilePageWrapper title="Info Pengguna" onBack={onBack}>
            {user ? (
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-6">
                        {user.photo ? (
                            <img src={user.photo} alt="User Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-gray-700" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                            <p className="text-md text-gray-400">{user.email}</p>
                            <p className="text-sm text-gray-500">Username: {user.username}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row gap-4">
                        <button 
                            className="w-full sm:w-auto flex-1 bg-[#2a2a2a] text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-gray-700"
                            onClick={() => alert('Fungsi edit profil akan segera hadir!')}
                        >
                            Edit Profil
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-red-800/60 text-white font-semibold py-2 px-4 rounded-lg transition-colors hover:bg-red-800/90"
                        >
                            <LogoutIcon className="w-5 h-5" />
                            Keluar
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Silakan login untuk melihat informasi pengguna.</p>
            )}
        </ProfilePageWrapper>
    );
};
export default UserInfoPage;