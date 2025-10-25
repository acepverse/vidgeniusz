// Fix: Import React to resolve namespace issue.
import React from 'react';
import { MonitorIcon, ClockIcon, AspectRatioIcon, GemIcon } from '../icons';

export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'image';
    placeholder?: string;
    defaultValue?: string;
}

export interface Template {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'image';
    icon: React.FC<{className?: string}>;
    previewUrl: string; // Added preview image URL
    fields: TemplateField[];
    tags: string[];
}

export const templates: Template[] = [
    {
        id: 'product-promo',
        title: 'Product Promo Video',
        description: 'Create a short, punchy promo video for your product.',
        type: 'video',
        icon: MonitorIcon,
        previewUrl: 'https://picsum.photos/id/1060/400/500',
        tags: ['E-commerce', 'Marketing', 'Ads'],
        fields: [
            { id: 'productName', label: 'Product Name', type: 'text', placeholder: 'e.g., "AquaBlast Pro"' },
            { id: 'tagline', label: 'Tagline', type: 'text', placeholder: 'e.g., "The Future of Hydration"' },
            { id: 'features', label: 'Key Features (comma-separated)', type: 'textarea', placeholder: 'e.g., "Self-cleaning, Temperature control, 24-hour insulation"' },
            { id: 'productImage', label: 'Product Image', type: 'image' },
        ],
    },
    {
        id: 'event-recap',
        title: 'Event Recap Reel',
        description: 'Generate a dynamic recap of your latest event for social media.',
        type: 'video',
        icon: ClockIcon,
        previewUrl: 'https://picsum.photos/id/1074/400/500',
        tags: ['Social Media', 'Events', 'Recap'],
        fields: [
            { id: 'eventName', label: 'Event Name', type: 'text', placeholder: 'e.g., "Innovate Conference 2024"' },
            { id: 'eventDate', label: 'Event Date', type: 'text', placeholder: 'e.g., "October 26, 2024"' },
            { id: 'highlightMoments', label: 'Highlight Moments', type: 'textarea', placeholder: 'e.g., "Keynote speech by Jane Doe, Networking session, Award ceremony"' },
            { id: 'eventLogo', label: 'Event or Company Logo', type: 'image' },
        ],
    },
    {
        id: 'inspirational-quote',
        title: 'Inspirational Quote Image',
        description: 'Design a beautiful image with a quote for your feed.',
        type: 'image',
        icon: GemIcon,
        previewUrl: 'https://picsum.photos/id/1015/400/500',
        tags: ['Social Media', 'Content', 'Quote'],
        fields: [
            { id: 'quoteText', label: 'Quote', type: 'textarea', placeholder: 'e.g., "The best way to predict the future is to create it."' },
            { id: 'author', label: 'Author', type: 'text', placeholder: 'e.g., "Peter Drucker"' },
            { id: 'backgroundImagePrompt', label: 'Background Image Prompt', type: 'text', placeholder: 'e.g., "Calm, serene mountain sunrise"' },
        ],
    },
    {
        id: 'real-estate',
        title: 'Real Estate Listing',
        description: 'An elegant video showcasing a property for sale.',
        type: 'video',
        icon: MonitorIcon,
        previewUrl: 'https://picsum.photos/id/1018/400/500',
        tags: ['Real Estate', 'Marketing'],
        fields: [
            { id: 'address', label: 'Property Address', type: 'text', placeholder: 'e.g., "123 Dreamy Lane"' },
            { id: 'price', label: 'Price', type: 'text', placeholder: 'e.g., "$850,000"' },
            { id: 'propertyFeatures', label: 'Features (e.g., beds, baths, sqft)', type: 'text', placeholder: 'e.g., "4 Beds, 3 Baths, 2,500 sqft"' },
            { id: 'mainImage', label: 'Main Property Image', type: 'image' },
        ],
    },
    {
        id: 'fashion-lookbook',
        title: 'Fashion Lookbook',
        description: 'Create a stylish lookbook video for your new collection.',
        type: 'video',
        icon: AspectRatioIcon,
        previewUrl: 'https://picsum.photos/id/1027/400/500',
        tags: ['Fashion', 'E-commerce', 'Lookbook'],
        fields: [
            { id: 'collectionName', label: 'Collection Name', type: 'text', placeholder: 'e.g., "Autumn \'24 Collection"' },
            { id: 'styleDescription', label: 'Style Description', type: 'textarea', placeholder: 'e.g., "Minimalist, Earth tones, cozy fabrics"' },
            { id: 'modelImage', label: 'Model/Look Image', type: 'image' },
        ],
    },
    {
        id: 'ai-avatar-post',
        title: 'AI Avatar Post',
        description: 'Generate a unique avatar and a post for social media.',
        type: 'image',
        icon: GemIcon,
        previewUrl: 'https://picsum.photos/id/3/400/500',
        tags: ['AI', 'Social Media', 'Avatar'],
        fields: [
            { id: 'avatarPrompt', label: 'Avatar Description', type: 'textarea', placeholder: 'e.g., "Futuristic cyborg with neon hair, cyberpunk city background"' },
            { id: 'postCaption', label: 'Post Caption', type: 'textarea', placeholder: 'e.g., "Exploring new digital frontiers. What do you think of my new look?"' },
        ],
    },
];