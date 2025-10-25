import React from 'react';
import {
    HomeIcon,
    VideoIcon,
    ImageIcon,
    SpeechIcon,
    StoryboardIcon,
    TemplateIcon,
    TransitionIcon,
    FusionIcon,
    AgentIcon,
    MoreModesIcon,
    FolderIcon,
    BookmarkIcon,
    DiamondIcon,
} from './icons';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activePage: string;
    onNavigate: (page: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void, isNew?: boolean }> = ({ icon, label, isActive, onClick, isNew }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
            isActive ? 'bg-purple-600/20 text-white' : 'text-gray-400 hover:bg-gray-800'
        }`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
        {isNew && <span className="ml-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">New</span>}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activePage, onNavigate }) => {
    const { user, openLoginModal } = useAuth();
    const protectedPages = ['storyboard', 'templates', 'transitions', 'fusion', 'agent', 'more', 'projects', 'saved'];

    const handleNavigate = (page: string) => {
        if (protectedPages.includes(page) && !user) {
            openLoginModal();
        } else {
            onNavigate(page);
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 z-20 transition-opacity lg:hidden ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            ></div>

            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-black/80 backdrop-blur-sm border-r border-gray-800 transform transition-transform z-30 lg:relative lg:transform-none lg:w-64 flex-shrink-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="h-full overflow-y-auto p-4 pb-24">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center font-bold text-2xl">
                            V
                        </div>
                        <span className="text-2xl font-bold tracking-tighter">VidGenius</span>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <h3 className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Menu</h3>
                        <NavItem icon={<HomeIcon />} label="Home" isActive={activePage === 'home'} onClick={() => handleNavigate('home')} />
                        <NavItem icon={<VideoIcon />} label="Video Generation" isActive={activePage === 'video'} onClick={() => handleNavigate('video')} />
                        <NavItem icon={<ImageIcon />} label="Image Generation" isActive={activePage === 'image'} onClick={() => handleNavigate('image')} />
                        <NavItem icon={<SpeechIcon />} label="Audio Generation" isActive={activePage === 'audio'} onClick={() => handleNavigate('audio')} />
                        <NavItem icon={<StoryboardIcon />} label="Storyboard" isActive={activePage === 'storyboard'} onClick={() => handleNavigate('storyboard')} />

                        <h3 className="px-4 mt-6 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Advanced Tools</h3>
                        <NavItem icon={<TemplateIcon />} label="Templates" isActive={activePage === 'templates'} onClick={() => handleNavigate('templates')} />
                        <NavItem icon={<TransitionIcon />} label="Transitions" isActive={activePage === 'transitions'} onClick={() => handleNavigate('transitions')} />
                        <NavItem icon={<FusionIcon />} label="Style Fusion" isActive={activePage === 'fusion'} onClick={() => handleNavigate('fusion')} isNew />
                        <NavItem icon={<AgentIcon />} label="AI Agent" isActive={activePage === 'agent'} onClick={() => handleNavigate('agent')} isNew />
                        <NavItem icon={<MoreModesIcon />} label="More Modes" isActive={activePage === 'more'} onClick={() => handleNavigate('more')} />

                        <h3 className="px-4 mt-6 text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Library</h3>
                        <NavItem icon={<FolderIcon />} label="My Projects" isActive={activePage === 'projects'} onClick={() => handleNavigate('projects')} />
                        <NavItem icon={<BookmarkIcon />} label="Saved" isActive={activePage === 'saved'} onClick={() => handleNavigate('saved')} />

                    </nav>
                </div>
                <div className="absolute bottom-0 w-full p-4 bg-black/80 border-t border-gray-800">
                    <button className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-600/80 to-pink-500/80 p-3 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity">
                        <DiamondIcon className="w-5 h-5" />
                        <span>Upgrade to Pro</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;