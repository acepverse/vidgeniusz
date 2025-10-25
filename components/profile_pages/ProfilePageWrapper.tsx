import React from 'react';

interface ProfilePageWrapperProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const ProfilePageWrapper: React.FC<ProfilePageWrapperProps> = ({ title, onBack, children }) => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white">&larr; Kembali</button>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
      </div>
      <div className="bg-[#1c1c1c] border border-gray-800 rounded-xl p-6 min-h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ProfilePageWrapper;
