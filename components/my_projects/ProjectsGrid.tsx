import React from 'react';
import type { Project } from '../../services/database';
import ProjectCard from './ProjectCard';
import { FolderIcon } from '../icons';

interface ProjectsGridProps {
    projects: Project[];
    onProjectSelect: (project: Project) => void;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, onProjectSelect }) => {
    if (projects.length === 0) {
        return (
            <div className="text-center py-20 bg-[#1c1c1c] border-2 border-dashed border-gray-800 rounded-xl">
                <FolderIcon className="w-16 h-16 mx-auto text-gray-600" />
                <h3 className="mt-4 text-xl font-semibold text-gray-400">No Projects Found</h3>
                <p className="mt-1 text-gray-500">Your gallery is empty or no projects match your filters.</p>
                <button className="mt-6 bg-teal-500 text-white font-semibold px-5 py-2 rounded-full hover:bg-teal-600 transition-colors">
                    Start Creating
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {projects.map(project => (
                <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onSelect={() => onProjectSelect(project)} 
                />
            ))}
        </div>
    );
};

export default ProjectsGrid;