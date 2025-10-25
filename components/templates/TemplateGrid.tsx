import React from 'react';
import { Template } from './templates';

interface TemplateGridProps {
    templates: Template[];
    onSelectTemplate: (template: Template) => void;
}

const TemplateCard: React.FC<{ template: Template; onSelect: () => void }> = ({ template, onSelect }) => {
    const Icon = template.icon;
    return (
        <div 
            onClick={onSelect}
            className="bg-[#1c1c1c] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500 transition-all duration-300 cursor-pointer group flex flex-col"
        >
            <div className="relative aspect-[4/5] overflow-hidden">
                <img src={template.previewUrl} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-white text-lg mb-1">{template.title}</h3>
                <p className="text-gray-400 text-sm flex-grow">{template.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {template.tags.map(tag => (
                        <span key={tag} className="bg-[#2a2a2a] text-gray-300 text-xs font-semibold px-2 py-1 rounded-md">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};


const TemplateGrid: React.FC<TemplateGridProps> = ({ templates, onSelectTemplate }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {templates.map(template => (
                <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onSelect={() => onSelectTemplate(template)} 
                />
            ))}
        </div>
    );
};

export default TemplateGrid;