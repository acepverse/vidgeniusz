// This file simulates a basic database using localStorage.
// In a real application, this would be replaced with API calls to a server.

export interface User {
  id: string;
  username: string;
  passwordHash: string; // In a real app, never store plain text passwords
  name: string;
  email: string;
  photo?: string; // Optional photo URL
}

// Fix: Define a type for the user object without the password hash for use in the app.
export type AuthenticatedUser = Omit<User, 'passwordHash'>;

export type Project = {
    id: string;
    title: string;
    type: 'video' | 'image' | 'audio';
    thumbnailUrl: string;
    mediaUrl: string; // The actual content URL/data
    prompt: string;
    createdAt: string;
    userId: string;
};

export type PublicContentItem = {
    id: string;
    type: 'video' | 'image' | 'audio';
    label?: string;
    videoUrl?: string;
    imageUrl?: string;
    icon?: 'chat' | 'sound';
    authorId: string;
    prompt: string;
};

export type SavedItem = PublicContentItem & { savedAt: string; };

export type NotificationType = 'new_content' | 'system' | 'announcement';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  relatedContentId?: string;
  authorId?: string;
}

const USERS_KEY = 'vidgenius_users';
const PROJECTS_KEY = 'vidgenius_projects';
const PUBLIC_CONTENT_KEY = 'vidgenius_public_content';
const SAVED_ITEMS_KEY = 'vidgenius_saved_items';
const NOTIFICATIONS_KEY = 'vidgenius_notifications'; // Kunci baru

// --- Database Initialization ---
export const initializeDatabase = () => {
    if (!localStorage.getItem(USERS_KEY)) {
        const mockUsers: User[] = [
            { id: 'u1', username: 'user1', passwordHash: 'pass1', name: 'Acep Verse', email: 'acepverse@gmail.com', photo: 'https://i.pravatar.cc/150?u=user1' },
            { id: 'u2', username: 'user2', passwordHash: 'pass2', name: 'Jane Doe', email: 'jane.doe@example.com', photo: 'https://i.pravatar.cc/150?u=user2' },
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    }

    if (!localStorage.getItem(PROJECTS_KEY)) {
        const mockProjects: Project[] = [
            // Projects for user1
            { id: 'p1', userId: 'u1', title: 'Sunset Over Mountains', type: 'video', thumbnailUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-1164-large.mp4', mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-1164-large.mp4', prompt: 'Beautiful cinematic shot of ocean waves crashing on the shore during sunset.', createdAt: '2024-07-21' },
            { id: 'p2', userId: 'u1', title: 'Cyberpunk Cityscape', type: 'image', thumbnailUrl: 'https://picsum.photos/id/10/400/600', mediaUrl: 'https://picsum.photos/id/10/400/600', prompt: 'A sprawling cyberpunk city at night, with flying cars and neon signs, Blade Runner aesthetic.', createdAt: '2024-07-20' },
            { id: 'p3', userId: 'u1', title: 'Podcast Intro Music', type: 'audio', thumbnailUrl: 'https://picsum.photos/id/1040/400/350', mediaUrl: '', prompt: 'Calm and relaxing lo-fi hip hop beat, perfect for studying or chilling.', createdAt: '2024-07-19' },
        ];
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
    }

    if (!localStorage.getItem(PUBLIC_CONTENT_KEY)) {
        const contentItems: PublicContentItem[] = [
            { id: 'pc1', type: 'video', label: 'Resmi', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-ocean-1164-large.mp4', authorId: 'u1', prompt: 'Beautiful cinematic shot of ocean waves crashing on the shore during sunset.' },
            { id: 'pc2', type: 'image', imageUrl: 'https://picsum.photos/id/1025/400/300', authorId: 'u2', prompt: 'A cute dog with a red collar, sitting on a wooden porch, photorealistic style.' },
            { id: 'pc3', type: 'video', label: 'untuk Hewan', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-fox-in-the-snow-4232-large.mp4', icon: 'chat', authorId: 'u1', prompt: 'A majestic red fox walking through a snowy forest, documentary style video.' },
            { id: 'pc4', type: 'audio', imageUrl: 'https://picsum.photos/id/1040/400/350', icon: 'sound', authorId: 'u2', prompt: 'Calm and relaxing lo-fi hip hop beat, perfect for studying or chilling.' },
            { id: 'pc5', type: 'video', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-person-playing-the-piano-1022-large.mp4', icon: 'sound', authorId: 'u1', prompt: 'Close up shot of hands playing a classical piece on a grand piano.' },
            { id: 'pc6', type: 'image', imageUrl: 'https://picsum.photos/id/10/400/600', authorId: 'u2', prompt: 'A sprawling cyberpunk city at night, with flying cars and neon signs, Blade Runner aesthetic.' },
        ];
        localStorage.setItem(PUBLIC_CONTENT_KEY, JSON.stringify(contentItems));
    }

    if (!localStorage.getItem(SAVED_ITEMS_KEY)) {
        localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify({})); // { userId: [item1, item2], ... }
    }

    if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
        const mockNotifications: Notification[] = [
            { 
                id: 'n1', 
                type: 'announcement', 
                message: 'Selamat datang di VidGenius! Jelajahi fitur-fitur baru kami.', 
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), 
                read: false 
            },
            { 
                id: 'n2', 
                type: 'system', 
                message: 'Fitur Style Fusion kini tersedia! Coba di menu Advanced Tools.', 
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), 
                read: true 
            },
        ];
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(mockNotifications));
    }
};

// --- Authentication Functions ---
export const authenticateUser = (username: string, pass: string): AuthenticatedUser | null => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.username === username);
    
    if (user && user.passwordHash === pass) {
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

export const getOrCreateGoogleUser = (): AuthenticatedUser => {
    const allUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const googleUsername = 'google_user_mock';
    let googleUser = allUsers.find(u => u.username === googleUsername);

    if (googleUser) {
        const { passwordHash, ...userWithoutPassword } = googleUser;
        return userWithoutPassword;
    }

    // Create a new mock Google user if it doesn't exist
    const newGoogleUser: User = {
        id: `u_google_${Date.now()}`,
        username: googleUsername,
        passwordHash: '', // No password for mock Google user
        name: 'Google User',
        email: 'google.user@example.com',
        photo: 'https://i.pravatar.cc/150?u=google_user'
    };

    allUsers.push(newGoogleUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
    
    const { passwordHash, ...userWithoutPassword } = newGoogleUser;
    return userWithoutPassword;
};

export const createUser = (username: string, pass: string): AuthenticatedUser => {
    const allUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check for duplicate username (case-insensitive)
    if (allUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Username sudah ada. Silakan pilih yang lain.');
    }

    // Basic validation
    if (username.length < 3) {
        throw new Error('Username harus memiliki minimal 3 karakter.');
    }
    if (pass.length < 4) {
        throw new Error('Sandi harus memiliki minimal 4 karakter.');
    }

    const newUser: User = {
        id: `u_${Date.now()}`,
        username,
        passwordHash: pass, // Hashed in a real app
        name: username, // Default name to username
        email: `${username}@example.com`, // Dummy email
    };

    allUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));

    const { passwordHash, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
};

export const getUserById = (userId: string): User | undefined => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.find(u => u.id === userId);
};

export const getUserByEmail = (email: string): User | null => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
};

export const checkUserExists = (username: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.some(u => u.username.toLowerCase() === username.toLowerCase());
};

export const resetPassword = (username: string, newPass: string): void => {
    const allUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const userIndex = allUsers.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (userIndex === -1) {
        throw new Error('Pengguna tidak ditemukan.');
    }
     if (newPass.length < 4) {
        throw new Error('Sandi baru harus memiliki minimal 4 karakter.');
    }

    allUsers[userIndex].passwordHash = newPass; // Hashed in a real app
    localStorage.setItem(USERS_KEY, JSON.stringify(allUsers));
};


// --- Project Data Functions ---
export const getProjectsForUser = (userId: string): Project[] => {
    const allProjects: Project[] = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    return allProjects.filter(p => p.userId === userId);
};

export type NewProjectData = Omit<Project, 'id' | 'createdAt' | 'userId'>;

export const addProjectForUser = (userId: string, projectData: NewProjectData): Project => {
    const allProjects: Project[] = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const newProject: Project = {
        id: `p_${Date.now()}`,
        userId,
        ...projectData,
        createdAt: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format
    };
    allProjects.unshift(newProject); // Add to the beginning of the list
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));
    return newProject;
};


export const deleteProjectForUser = (userId: string, projectId: string): void => {
    let allProjects: Project[] = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]');
    const projectIndex = allProjects.findIndex(p => p.id === projectId && p.userId === userId);

    if (projectIndex > -1) {
        allProjects.splice(projectIndex, 1);
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(allProjects));
    }
};

// --- Public Content Functions ---
export const getPublicContent = (): PublicContentItem[] => {
    return JSON.parse(localStorage.getItem(PUBLIC_CONTENT_KEY) || '[]');
};

export const getPublicContentByAuthor = (authorId: string): PublicContentItem[] => {
    const allPublicContent = getPublicContent();
    return allPublicContent.filter(item => item.authorId === authorId);
};

export const publishProjectToPublic = (project: Project): PublicContentItem => {
    const allPublicContent = getPublicContent();
    
    const newPublicItem: PublicContentItem = {
        id: `pc_${Date.now()}`,
        type: project.type,
        label: project.type === 'video' ? 'Resmi' : undefined, // Some default label
        videoUrl: project.type === 'video' ? project.mediaUrl : undefined,
        imageUrl: project.type !== 'video' ? project.thumbnailUrl : undefined, // Use thumbnail for image/audio
        icon: project.type === 'audio' ? 'sound' : undefined,
        authorId: project.userId,
        prompt: project.prompt,
    };

    allPublicContent.unshift(newPublicItem);
    localStorage.setItem(PUBLIC_CONTENT_KEY, JSON.stringify(allPublicContent));

    const author = getUserById(project.userId);
    addNotification({
        type: 'new_content',
        message: `${author?.name || 'Seseorang'} membagikan ${project.type} baru: "${project.title}"`,
        relatedContentId: newPublicItem.id,
        authorId: project.userId,
    });

    return newPublicItem;
};

export const unpublishPublicContent = (userId: string, contentId: string): void => {
    let allPublicContent = getPublicContent();
    const contentIndex = allPublicContent.findIndex(item => item.id === contentId);

    if (contentIndex > -1) {
        // Security check: Only the author can unpublish
        if (allPublicContent[contentIndex].authorId === userId) {
            allPublicContent.splice(contentIndex, 1);
            localStorage.setItem(PUBLIC_CONTENT_KEY, JSON.stringify(allPublicContent));
        } else {
            console.warn(`User ${userId} attempted to unpublish content ${contentId} owned by ${allPublicContent[contentIndex].authorId}.`);
        }
    }
};


// --- Saved Item Functions ---
const getAllSaved = (): Record<string, SavedItem[]> => {
    return JSON.parse(localStorage.getItem(SAVED_ITEMS_KEY) || '{}');
};

export const getSavedForUser = (userId: string): SavedItem[] => {
    const allSaved = getAllSaved();
    return allSaved[userId] || [];
};

export const isItemSaved = (userId: string, contentId: string): boolean => {
    const userSavedItems = getSavedForUser(userId);
    return userSavedItems.some(item => item.id === contentId);
};

export const saveItem = (userId: string, itemToSave: PublicContentItem): void => {
    const allSaved = getAllSaved();
    const userSavedItems = allSaved[userId] || [];

    if (!userSavedItems.some(item => item.id === itemToSave.id)) {
        const newItem: SavedItem = {
            ...itemToSave,
            savedAt: new Date().toISOString(),
        };
        allSaved[userId] = [...userSavedItems, newItem];
        localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(allSaved));
    }
};

export const unsaveItem = (userId: string, contentId: string): void => {
    const allSaved = getAllSaved();
    let userSavedItems = allSaved[userId] || [];
    
    const updatedItems = userSavedItems.filter(item => item.id !== contentId);

    if (updatedItems.length > 0) {
        allSaved[userId] = updatedItems;
    } else {
        delete allSaved[userId]; // Hapus entri pengguna jika tidak ada item yang disimpan
    }
    
    localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(allSaved));
};

// --- Notification Functions ---
export const getNotifications = (): Notification[] => {
    const notifications: Notification[] = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void => {
    const allNotifications = getNotifications();
    const newNotification: Notification = {
        id: `n_${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
        ...notification,
    };
    allNotifications.unshift(newNotification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
};

export const markAllNotificationsAsRead = (): void => {
    let allNotifications = getNotifications();
    allNotifications = allNotifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
};