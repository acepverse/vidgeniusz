import React, { useState, useEffect, useRef } from 'react';
import { MenuIcon, ChatIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { ProfilePage } from '../App';
import { getNotifications, markAllNotificationsAsRead, Notification } from '../services/database';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  onMenuClick: () => void;
  onProfileNavigate: (page: ProfilePage) => void;
  onNavigateHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onProfileNavigate, onNavigateHome }) => {
  const { user, logout, openLoginModal } = useAuth();
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
        const fetchedNotifications = getNotifications();
        setNotifications(fetchedNotifications);
        setHasUnread(fetchedNotifications.some(n => !n.read));
    } else {
        setNotifications([]);
        setHasUnread(false);
    }
  }, [user, isNotificationsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems: { label: string; page: ProfilePage }[] = [
    { label: 'Info Pengguna', page: 'userInfo' },
    { label: 'Tutorial', page: 'tutorial' },
    { label: 'FAQ', page: 'faq' },
    { label: 'Dukungan', page: 'support' },
    { label: 'Komunitas', page: 'community' },
  ];

  const handleMenuClick = (page: ProfilePage) => {
    onProfileNavigate(page);
    setProfileOpen(false);
  };

  const handleProfileToggle = () => {
    setProfileOpen(prev => !prev);
    setNotificationsOpen(false); // Close other menu
  };

  const handleNotificationsToggle = () => {
    setNotificationsOpen(prev => {
        const nextState = !prev;
        if (nextState && hasUnread) {
            markAllNotificationsAsRead();
            setHasUnread(false);
        }
        return nextState;
    });
    setProfileOpen(false); // Close other menu
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    onNavigateHome();
  };

  const ProfileMenu = () => (
    <div className="absolute top-full right-0 mt-2 w-48 bg-[#2a2a2a] rounded-xl shadow-lg z-20 p-2 border border-gray-700">
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleMenuClick(item.page)}
            className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
          >
            {item.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
        >
          Logout
        </button>
      </nav>
    </div>
  );

  return (
    <header className="flex items-center justify-between p-4 sticky top-0 bg-black/80 backdrop-blur-sm z-10 lg:justify-end">
      <div className="flex items-center gap-3 lg:hidden">
        <button onClick={onMenuClick} aria-label="Open menu">
            <MenuIcon className="w-7 h-7 text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold text-xl">
                V
            </div>
          <span className="text-2xl font-bold tracking-tighter">VidGenius</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative" ref={notificationsRef}>
            <button onClick={handleNotificationsToggle} className="bg-[#2a2a2a] p-2 rounded-full relative" aria-label="Buka notifikasi">
                <ChatIcon className="w-5 h-5" />
                {user && hasUnread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1c1c1c]"></span>}
            </button>
            {isNotificationsOpen && user && <NotificationPanel notifications={notifications} onClose={() => setNotificationsOpen(false)} />}
        </div>

        {user ? (
          <div className="relative" ref={profileRef}>
             <button 
                onClick={handleProfileToggle} 
                className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-bold text-white"
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                aria-label="User menu"
            >
                {user.username.charAt(0).toUpperCase()}
            </button>
            {isProfileOpen && <ProfileMenu />}
          </div>
        ) : (
          <button 
            onClick={openLoginModal}
            className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;