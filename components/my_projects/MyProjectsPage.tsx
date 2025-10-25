import React, { useState, useMemo, useEffect } from 'react';
import { SearchIcon, FolderIcon, VideoIcon, ImageIcon, SoundIcon, LockIcon } from '../icons';
import ProjectsGrid from './ProjectsGrid';
import ProjectDetailModal from './ProjectDetailModal';
import { useAuth } from '../../contexts/AuthContext';
import { getProjectsForUser, deleteProjectForUser } from '../../services/database';
import type { Project } from '../../services/database';

type FilterType = 'all' | 'video' | 'image' | 'audio';

const FilterButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            isActive ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:bg-[#2a2a2a]'
        }`}
    >
        {icon}
        {label}
    </button>
);

interface MyProjectsPageProps {
    onPublishProject: (project: Project) => void;
}

const MyProjectsPage: React.FC<MyProjectsPageProps> = ({ onPublishProject }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeFilter, setActiveFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const fetchProjects = () => {
        if (user) {
            setProjects(getProjectsForUser(user.id));
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [user]);

    const filteredAndSortedProjects = useMemo(() => {
        return projects
            .filter(p => activeFilter === 'all' || p.type === activeFilter)
            .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                if (sortBy === 'name') return a.title.localeCompare(b.title);
                return 0;
            });
    }, [projects, activeFilter, searchTerm, sortBy]);
    
    const handleDeleteProject = (id: string) => {
        if (user) {
            deleteProjectForUser(user.id, id);
            fetchProjects(); // Re-fetch projects after deletion
            setSelectedProject(null); // Close modal if open
        }
    };

    const handlePublishProject = (project: Project) => {
        if (user) {
            onPublishProject(project);
            setSelectedProject(null); // Close modal
        }
    };

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
    };

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    return (
        <>
            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white">My Projects</h1>
                            <LockIcon className="w-6 h-6 text-gray-500" />
                        </div>
                        <p className="text-gray-400 mt-1">Galeri pribadi Anda. Hanya Anda yang bisa melihat konten ini.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
                        <FolderIcon className="w-5 h-5" />
                        Create Folder
                    </button>
                </div>
                
                <div className="bg-[#1c1c1c] border border-gray-800 rounded-xl p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex items-center gap-2">
                            <FilterButton icon={<FolderIcon className="w-5 h-5"/>} label="All" isActive={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
                            <FilterButton icon={<VideoIcon className="w-5 h-5"/>} label="Videos" isActive={activeFilter === 'video'} onClick={() => setActiveFilter('video')} />
                            <FilterButton icon={<ImageIcon className="w-5 h-5"/>} label="Images" isActive={activeFilter === 'image'} onClick={() => setActiveFilter('image')} />
                            <FilterButton icon={<SoundIcon className="w-5 h-5"/>} label="Audio" isActive={activeFilter === 'audio'} onClick={() => setActiveFilter('audio')} />
                        </div>
                         <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="bg-[#2a2a2a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            </div>
                             <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="bg-[#2a2a2a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="newest">Sort by Newest</option>
                                <option value="oldest">Sort by Oldest</option>
                                <option value="name">Sort by Name</option>
                            </select>
                        </div>
                    </div>
                </div>

                <ProjectsGrid projects={filteredAndSortedProjects} onProjectSelect={handleSelectProject} />
            </div>

            {selectedProject && (
                <ProjectDetailModal 
                    project={selectedProject} 
                    onClose={handleCloseModal}
                    onDelete={() => handleDeleteProject(selectedProject.id)}
                    onPublish={() => handlePublishProject(selectedProject)}
                />
            )}
        </>
    );
};

export default MyProjectsPage;