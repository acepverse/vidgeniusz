import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VideoCreationPage from './components/video_creation/VideoCreationPage';
import ImageCreationPage from './components/image_creation/ImageCreationPage';
import AudioCreationPage from './components/audio_creation/AudioCreationPage';
import StoryboardCreationPage from './components/storyboard_creation/StoryboardCreationPage';
import TransitionCreationPage from './components/transition_creation/TransitionCreationPage';
import TemplatePage from './components/templates/TemplatePage';
import UnderDevelopmentPage from './components/UnderDevelopmentPage';
import MainTabs from './components/MainTabs';
import ContentGrid from './components/ContentGrid';
import CreationBar from './components/CreationBar';
import StyleFusionPage from './components/fusion_creation/StyleFusionPage';
import MoreModesPage from './components/more_modes/MoreModesPage';
import MyProjectsPage from './components/my_projects/MyProjectsPage';
import SavedPage from './components/saved/SavedPage';
import { useAuth } from './contexts/AuthContext';
import LoginModal from './components/LoginPage';
import UserInfoPage from './components/profile_pages/UserInfoPage';
import TutorialPage from './components/profile_pages/TutorialPage';
import FAQPage from './components/profile_pages/FAQPage';
import SupportPage from './components/profile_pages/SupportPage';
import CommunityPage from './components/profile_pages/CommunityPage';
import SearchBar from './components/SearchBar';
import ContentDetailModal from './components/ContentDetailModal';
import { PublicContentItem, unpublishPublicContent, Project, publishProjectToPublic } from './services/database';
import PublicProfilePage from './components/public_profile/PublicProfilePage';
import AIAgentPage from './components/ai_agent/AIAgentPage';

type Page = 
    | 'home' 
    | 'video' 
    | 'image' 
    | 'audio'
    | 'storyboard' 
    | 'templates' 
    | 'transitions' 
    | 'fusion' 
    | 'agent' 
    | 'more' 
    | 'projects' 
    | 'saved'
    | 'publicProfile';

export type ProfilePage = 'userInfo' | 'tutorial' | 'faq' | 'support' | 'community';
export type MainTab = 'All' | 'Video' | 'Agen' | 'Template';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState<Page>('home');
  const [activeProfilePage, setActiveProfilePage] = useState<ProfilePage | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PublicContentItem | null>(null);
  const [viewedUserId, setViewedUserId] = useState<string | null>(null);
  const [contentKey, setContentKey] = useState(0); // Kunci untuk me-remount ContentGrid
  const { user, isLoginModalOpen, closeLoginModal } = useAuth();

  const handleMainNavigate = (page: Page) => {
    setActivePage(page);
    setActiveProfilePage(null); // Reset profile page when main navigation occurs
    setViewedUserId(null); // Reset viewed user ID
    setSearchTerm(''); // Reset search term on navigation
    setSidebarOpen(false);
  };

  const handleProfileNavigate = (page: ProfilePage) => {
    setActiveProfilePage(page);
  };

  const handleItemSelect = (item: PublicContentItem) => {
    setSelectedItem(item);
  };

  const handleViewProfile = (userId: string) => {
    setViewedUserId(userId);
    setActivePage('publicProfile');
    setSelectedItem(null); // Close the detail modal
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };
  
  const handleUnpublishItem = (contentId: string) => {
    if (!user) return;
    unpublishPublicContent(user.id, contentId);
    setSelectedItem(null); // Tutup modal
    setContentKey(prevKey => prevKey + 1); // Paksa ContentGrid untuk me-remount dan mengambil data baru
  };

  const handlePublishItem = (project: Project) => {
    if (!user) return;
    publishProjectToPublic(project);
    alert(`"${project.title}" telah berhasil dibagikan ke halaman utama!`);
    setContentKey(prevKey => prevKey + 1); // Paksa ContentGrid untuk me-remount dan mengambil data baru
  };


  const renderMainContent = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <MainTabs activeTab={activeMainTab} onTabChange={setActiveMainTab} />
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <ContentGrid 
                key={contentKey}
                activeTab={activeMainTab}
                searchTerm={searchTerm} 
                onItemSelect={handleItemSelect} 
            />
          </>
        );
      case 'publicProfile':
        return viewedUserId ? (
            <PublicProfilePage 
                userId={viewedUserId} 
                onBack={() => handleMainNavigate('home')} 
                onItemSelect={handleItemSelect}
            />
        ) : null;
      case 'video':
        return <VideoCreationPage onPublishProject={handlePublishItem} />;
      case 'image':
        return <ImageCreationPage onPublishProject={handlePublishItem} />;
      case 'audio':
        return <AudioCreationPage onPublishProject={handlePublishItem} />;
      case 'storyboard':
        return <StoryboardCreationPage onPublishProject={handlePublishItem} />;
      case 'transitions':
        return <TransitionCreationPage />;
      case 'templates':
          return <TemplatePage />;
      case 'fusion':
        return <StyleFusionPage />;
      case 'agent':
        return <AIAgentPage />;
      case 'more':
        return <MoreModesPage />;
      case 'projects':
        return <MyProjectsPage onPublishProject={handlePublishItem} />;
      case 'saved':
        return <SavedPage />;
      default:
        return <UnderDevelopmentPage />;
    }
  };

  const renderProfileContent = () => {
    switch (activeProfilePage) {
      case 'userInfo':
        return <UserInfoPage onBack={() => setActiveProfilePage(null)} />;
      case 'tutorial':
        return <TutorialPage onBack={() => setActiveProfilePage(null)} />;
      case 'faq':
        return <FAQPage onBack={() => setActiveProfilePage(null)} />;
      case 'support':
        return <SupportPage onBack={() => setActiveProfilePage(null)} />;
      case 'community':
        return <CommunityPage onBack={() => setActiveProfilePage(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white h-screen flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activePage={activePage}
        onNavigate={(page) => handleMainNavigate(page as Page)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          onProfileNavigate={handleProfileNavigate} 
          onNavigateHome={() => handleMainNavigate('home')}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {activeProfilePage ? renderProfileContent() : renderMainContent()}
        </main>
        {activePage === 'home' && !activeProfilePage && <CreationBar />}
      </div>
      {isLoginModalOpen && <LoginModal onClose={closeLoginModal} />}
      {selectedItem && (
        <ContentDetailModal 
            item={selectedItem} 
            onClose={handleCloseModal}
            onViewProfile={handleViewProfile} 
            onUnpublish={handleUnpublishItem}
        />
      )}
    </div>
  );
}

export default App;