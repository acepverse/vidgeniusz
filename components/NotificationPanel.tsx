import React from 'react';
import { Notification, getUserById } from '../services/database';
import { MegaphoneIcon, PlusCircleIcon, SparklesIcon, UserIcon } from './icons';

const timeSince = (dateStr: string): string => {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s ago";
};

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
    switch (type) {
        case 'new_content':
            return <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center"><PlusCircleIcon className="w-5 h-5 text-green-400" /></div>;
        case 'announcement':
            return <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center"><MegaphoneIcon className="w-5 h-5 text-blue-400" /></div>;
        case 'system':
            return <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><SparklesIcon className="w-5 h-5 text-purple-400" /></div>;
        default:
            return null;
    }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const author = notification.authorId ? getUserById(notification.authorId) : null;
    return (
        <div className="flex items-start gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
            <div className="flex-shrink-0 mt-0.5">
                {notification.type === 'new_content' && author ? (
                    author.photo ? <img src={author.photo} alt={author.name} className="w-8 h-8 rounded-full" /> : <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center"><UserIcon className="w-5 h-5 text-gray-300"/></div>
                ) : (
                    <NotificationIcon type={notification.type} />
                )}
            </div>
            <div className="flex-grow">
                <p className="text-sm text-gray-200 leading-tight" dangerouslySetInnerHTML={{ __html: notification.message.replace(/"(.*?)"/g, '<span class="font-semibold text-white">"$1"</span>') }}></p>
                <p className="text-xs text-gray-500 mt-1">{timeSince(notification.timestamp)}</p>
            </div>
            {!notification.read && <div className="w-2.5 h-2.5 rounded-full bg-teal-400 self-center flex-shrink-0"></div>}
        </div>
    );
};


interface NotificationPanelProps {
    notifications: Notification[];
    onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose }) => {
    return (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[#2a2a2a] rounded-xl shadow-lg z-20 border border-gray-700 max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-gray-700">
                <h3 className="font-bold text-white text-lg">Notifikasi</h3>
            </div>
            {notifications.length > 0 ? (
                 <div className="overflow-y-auto p-2">
                    {notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                </div>
            ) : (
                 <div className="flex-grow flex items-center justify-center text-center p-4 h-40">
                    <p className="text-gray-500">Tidak ada notifikasi baru.</p>
                </div>
            )}
            <div className="p-2 border-t border-gray-700 text-center">
                <button onClick={onClose} className="text-sm text-purple-400 hover:text-purple-300 font-medium">
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default NotificationPanel;