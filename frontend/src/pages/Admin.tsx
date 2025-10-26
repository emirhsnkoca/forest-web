import { useState, useEffect, useCallback } from 'react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { forest } from '../forest';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Web3Link {
  id: number;
  profile_id: string;
  type: 'wallet' | 'nft' | 'defi' | 'social' | 'custom';
  title: string;
  url: string;
  icon: string;
  banner: string;
  is_active: boolean;
  order: number;
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
  platform?: string;
}

// Sortable Link Component
function SortableLink({ link, onDelete, isLoading }: { link: Web3Link; onDelete: (id: number) => void; isLoading: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-amber-50 rounded-lg p-4 border border-gray-300 hover:border-green-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
            <span className="text-lg">{link.icon || '🔗'}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{link.title}</h3>
              <button className="text-gray-400 hover:text-gray-600">✏️</button>
            </div>
            <p className="text-sm text-gray-500">{link.url}</p>
            {link.url === 'http://emirkc_' && (
              <div className="bg-red-100 border border-red-200 rounded p-2 mt-2">
                <p className="text-red-800 text-xs">Please enter a valid URL</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <span>📊</span>
            <span>📤</span>
            <span>⭐</span>
            <span>🔒</span>
            <span>0 clicks</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">📤</button>
          <button 
            className={`w-12 h-6 rounded-full border-2 flex items-center justify-center ${
              link.is_active 
                ? 'bg-green-500 border-green-500' 
                : 'bg-gray-300 border-gray-300'
            }`}
            type="button"
          >
            {link.is_active && <span className="text-white text-xs">✓</span>}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link.id);
            }}
            disabled={isLoading}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete link"
          >
            {isLoading ? '⏳' : '🗑️'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Admin() {
  // Mock Forest kullanıyoruz, cüzdan hooks'ları gerekli değil
  // const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  // const currentAccount = useCurrentAccount();
  
  const [links, setLinks] = useState<Web3Link[]>([]);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: '',
    banner: '',
    type: 'custom' as const,
    blockchain: '',
    contractAddress: '',
    tokenId: '',
    platform: ''
  });

  const [profile, setProfile] = useState({
    displayName: '',
    bio: '',
    profileImage: '',
    ensName: '',
    customDomain: ''
  });

  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [mockData, setMockData] = useState<any>(null);
  const [profileId, setProfileId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Profil verilerini mock data'dan yükle
  const loadProfileData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Mock Forest kullanıyoruz, cüzdan kontrolü gerekli değil
      console.log('🔍 Admin: Loading profile from mock data');
      
      // localStorage'dan profil ID'yi al
      const storedProfileId = localStorage.getItem('forest_profile_id');
      if (!storedProfileId) {
        console.error('❌ Admin: No profile ID found in localStorage');
        setError('Profil bulunamadı. Lütfen önce profil oluşturun.');
        return;
      }

      // Profili mock data'dan bul
      let profileData = await forest.getProfile(storedProfileId);
      console.log('🔍 Admin: Profile data received:', profileData);
      
      if (!profileData) {
        console.error('❌ Admin: Profile not found in mock data for ID:', storedProfileId);
        setError('Profil mock data\'da bulunamadı. Lütfen önce profil oluşturun.');
        return;
      }

      // Profil ID'yi set et
      setProfileId(profileData.id);
      
      // Link'leri mock data'dan çek
      let web3Links: Web3Link[] = [];
      try {
        const profileLinks = await forest.getProfileLinks(profileData.id);
        web3Links = profileLinks.map(link => ({
          id: link.id,
          profile_id: profileData.id,
          type: 'custom',
          title: link.title,
          url: link.url,
          icon: link.icon,
          banner: link.banner,
          is_active: link.is_active,
          order: link.order,
        }));
        console.log('✅ Admin: Loaded links from mock data:', web3Links);
      } catch (linkError) {
        console.warn('⚠️ Admin: Could not fetch links from mock data:', linkError);
        web3Links = []; // Boş array kullan
      }
      
      setLinks(web3Links);
        setProfile({
        displayName: profileData.display_name,
        bio: profileData.bio,
        profileImage: profileData.image_url,
        ensName: '',
        customDomain: profileData.subdomain || `${profileData.username}.forest.ee`
      });
      
      console.log('✅ Admin: Profile data loaded successfully:', {
        displayName: profileData.display_name,
        bio: profileData.bio,
        imageUrl: profileData.image_url,
        subdomain: profileData.subdomain,
        linkCount: web3Links.length
      });
      
    } catch (err) {
      console.error('Profil verileri yüklenirken hata:', err);
      setError('Profil verileri yüklenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
    
    // LinkAddedEvent listener'ını başlat
    const setupEventListeners = async () => {
      try {
        // LinkAdded event'ini dinle
        const unsubscribeLinkAdded = await forest.listenForLinkAdded((event) => {
          console.log('🔍 Admin: LinkAdded event received:', event);
          
          // Eğer bu kullanıcının profili ise UI'yi güncelle
          if (profileId && event.profile_id === profileId) {
            console.log('✅ Admin: Link added to current profile, refreshing data');
            loadProfileData(); // Profil verilerini yeniden yükle
          }
        });
        
        // LinkDeleted event'ini dinle
        const unsubscribeLinkDeleted = await forest.listenForLinkDeleted((event) => {
          console.log('🔍 Admin: LinkDeleted event received:', event);
          
          // Eğer bu kullanıcının profili ise UI'yi güncelle
          if (profileId && event.profile_id === profileId) {
            console.log('✅ Admin: Link deleted from current profile, refreshing data');
            loadProfileData(); // Profil verilerini yeniden yükle
          }
        });
        
        // Cleanup function
        return () => {
          unsubscribeLinkAdded();
          unsubscribeLinkDeleted();
        };
      } catch (error) {
        console.error('❌ Admin: Error setting up event listeners:', error);
      }
    };
    
    const cleanup = setupEventListeners();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, [profileId, loadProfileData]);

  // Link ekleme fonksiyonu - mock data ile
  const handleAddLink = async () => {
    console.log('🔍 Admin: handleAddLink called');
    console.log('🔍 Admin: profileId:', profileId);
    console.log('🔍 Admin: newLink:', newLink);
    
    if (!newLink.title.trim() || !newLink.url.trim()) {
      console.log('❌ Admin: Title or URL is empty');
      setError('Lütfen başlık ve URL alanlarını doldurun.');
      return;
    }
    if (!profileId) {
      console.log('❌ Admin: No profile ID');
      setError('Profil ID bulunamadı.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      console.log('🔍 Admin: Adding new link:', {
        profileId,
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon || '🔗',
        banner: newLink.banner || ''
      });

      const result = await forest.addLinkWithDappKit(
        profileId,
        newLink.title,
        newLink.url,
        newLink.icon || '🔗',
        newLink.banner || '',
        null // Mock Forest için signAndExecuteTransaction gerekli değil
      );

      console.log('✅ Admin: Link added successfully:', result);

      if (result.linkId !== undefined) {
        // UI'yi manuel olarak güncelle
        setNewLink({ title: '', url: '', icon: '', banner: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '', platform: '' });
        setIsAddLinkModalOpen(false);
        
        // Profil verilerini yeniden yükle
        loadProfileData();
        console.log('✅ Admin: Link added, UI updated');
      }
    } catch (err) {
      console.error('❌ Admin: Link eklenirken hata:', err);
      const errorMessage = err instanceof Error ? err.message : 'Link eklenirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug paneli fonksiyonları
  const toggleDebugPanel = () => {
    setShowDebugPanel(!showDebugPanel);
    if (!showDebugPanel) {
      setMockData(forest.getMockData());
    }
  };

  const clearMockData = () => {
    if (confirm('Tüm mock data silinecek. Emin misiniz?')) {
      forest.clearMockData();
      setMockData(null);
      loadProfileData();
    }
  };

  const exportMockData = () => {
    const data = forest.getMockData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'forest-mock-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importMockData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            forest.importMockData(data);
            setMockData(data);
            loadProfileData();
            alert('✅ Mock data imported successfully!');
          } catch (error) {
            alert('❌ Error importing data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCloseModal = () => {
    setIsAddLinkModalOpen(false);
    setNewLink({ 
      title: '', 
      url: '', 
      icon: '', 
      banner: '', 
      type: 'custom', 
      blockchain: '', 
      contractAddress: '', 
      tokenId: '', 
      platform: '' 
    });
  };

  // Drag & Drop handler
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);

      const newLinks = arrayMove(links, oldIndex, newIndex);
      setLinks(newLinks);

      // Mock Forest'a yeni sıralamayı kaydet
      try {
        await forest.reorderLinkWithDappKit(
          profileId,
          active.id,
          newIndex,
          null
        );
        console.log('✅ Link order updated successfully');
      } catch (error) {
        console.error('❌ Error updating link order:', error);
        // Hata durumunda eski sıralamayı geri yükle
        loadProfileData();
      }
    }
  };

  // Link silme fonksiyonu - mock data ile
  const handleDeleteLink = async (linkId: number) => {
    if (!profileId) {
      setError('Profil ID bulunamadı.');
      return;
    }

    // Silme onayı
    const linkToDelete = links.find(link => link.id === linkId);
    const linkTitle = linkToDelete?.title || 'this link';
    
    if (!confirm(`Are you sure you want to delete "${linkTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      console.log('🔍 Admin: Deleting link:', { profileId, linkId });

      const result = await forest.deleteLinkWithDappKit(
        profileId,
        linkId,
        null // Mock Forest için signAndExecuteTransaction gerekli değil
      );

      console.log('✅ Admin: Link deleted successfully:', result);

      // UI'yi manuel olarak güncelle
      loadProfileData();
      console.log('✅ Admin: Link deleted, UI updated');
    } catch (err) {
      console.error('❌ Admin: Link silinirken hata:', err);
      const errorMessage = err instanceof Error ? err.message : 'Link silinirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">

      <div className="flex">
        {/* Left Sidebar - Minecraft Style */}
        <div className="w-64 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900 border-r border-amber-600 flex flex-col min-h-screen relative overflow-hidden">
          {/* Minecraft Texture Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 20%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(160, 82, 45, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(101, 67, 33, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 60% 40%, rgba(120, 75, 37, 0.3) 0%, transparent 50%)
              `,
              backgroundSize: '20px 20px, 15px 15px, 25px 25px, 18px 18px'
            }}></div>
          </div>
          {/* User Profile Section */}
          <div className="p-4 border-b border-amber-600 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-amber-400">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-amber-800">👤</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm drop-shadow-lg">{profile.displayName}</h3>
                <p className="text-xs text-amber-200">▼</p>
              </div>
              <button className="text-amber-200 hover:text-white transition-colors">🔔</button>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 p-4 relative z-10">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-amber-200 uppercase tracking-wider mb-3 drop-shadow-lg">My Forest</h3>
              <button 
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium bg-green-600 text-white border-2 border-green-500 shadow-lg hover:bg-green-500 transition-colors"
                type="button"
              >
                Links
              </button>
            </div>
          </div>

          {/* Setup Checklist */}
          <div className="p-4 border-t border-amber-600 relative z-10">
            <div className="bg-amber-800 border-2 border-amber-600 rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-green-400">
                  33%
                </div>
                <span className="text-sm font-medium text-white drop-shadow-lg">Your setup checklist</span>
              </div>
              <p className="text-xs text-amber-200 mb-3">2 of 6 complete</p>
              <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-500 transition-colors border-2 border-green-500 shadow-lg">
                Finish setup
              </button>
            </div>
          </div>

          {/* Help Icons */}
          <div className="p-4 border-t border-amber-600 relative z-10">
            <div className="flex items-center gap-3">
              <button className="text-amber-200 hover:text-white transition-colors">❓</button>
              <button className="text-amber-200 hover:text-white transition-colors">⚙️</button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <div className="bg-amber-50 border-b border-gray-300 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Links</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <span>✨</span>
                  <span className="text-sm font-medium">Enhance</span>
                </button>
                <button 
                  onClick={toggleDebugPanel}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <span>🐛</span>
                  <span className="text-sm font-medium">Debug</span>
                </button>
                <button className="text-gray-600 hover:text-gray-900">⚙️</button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Debug Panel */}
            {showDebugPanel && (
              <div className="bg-gray-900 text-white rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">🐛 Mock Data Debug Panel</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={exportMockData}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      📤 Export
                    </button>
                    <button
                      onClick={importMockData}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      📥 Import
                    </button>
                    <button
                      onClick={clearMockData}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      🗑️ Clear All
                    </button>
                    <button
                      onClick={toggleDebugPanel}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-sm"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-800 p-3 rounded">
                    <h4 className="font-semibold text-green-400">Profiles</h4>
                    <p className="text-sm">{mockData?.profiles ? Object.keys(mockData.profiles).length : 0}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <h4 className="font-semibold text-blue-400">Links</h4>
                    <p className="text-sm">{mockData?.links ? Object.keys(mockData.links).length : 0}</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <h4 className="font-semibold text-yellow-400">Next ID</h4>
                    <p className="text-sm">{mockData?.nextId || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-800 rounded p-4">
                  <h4 className="font-semibold mb-2">Raw Data:</h4>
                  <pre className="text-xs overflow-auto max-h-64 bg-black p-2 rounded">
                    {JSON.stringify(mockData, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-red-600">⚠️</span>
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-blue-800 font-medium">İşlem yapılıyor...</span>
                </div>
              </div>
            )}

            {/* Profile Section */}
            <div className="bg-amber-50 rounded-lg p-6 mb-6 border border-gray-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-amber-700 text-2xl">👤</span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile.displayName || 'Yükleniyor...'}
                  </h2>
                  <p className="text-gray-600">
                    {profile.bio || 'Add bio'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg">📷</span>
                    <span className="text-lg">+</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    console.log('🔍 Admin: Add button clicked, opening modal');
                    setIsAddLinkModalOpen(true);
                  }}
                  disabled={isLoading}
                  className="group relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 hover:from-green-500 hover:via-green-400 hover:to-emerald-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-500 hover:shadow-green-500/50 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Luxury Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Luxury Border Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/30 via-green-400/30 to-emerald-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  
                  {/* Button Content */}
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                    <span>{isLoading ? 'Yükleniyor...' : 'Add'}</span>
                  </div>
                  
                  {/* Luxury Shine Effect */}
                  <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                </button>
              </div>

            </div>

            {/* Links Section */}
            <div className="space-y-3">
              {links.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">No links yet</p>
                  <Button
                    onClick={() => {
                      console.log('🔍 Admin: Add Your First Link button clicked, opening modal');
                      setIsAddLinkModalOpen(true);
                    }}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Add Your First Link
                  </Button>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
                    {links.map((link) => (
                      <SortableLink
                        key={link.id}
                        link={link}
                        onDelete={handleDeleteLink}
                        isLoading={isLoading}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}

              {/* Forest Footer Card */}
              <div className="bg-amber-50 rounded-lg p-4 border border-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Forest footer</h3>
                    <p className="text-sm text-gray-500">Forest*</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="w-12 h-6 rounded-full border-2 flex items-center justify-center bg-green-500 border-green-500"
                      type="button"
                    >
                      <span className="text-white text-xs">✓</span>
                    </button>
                    <span className="text-green-600">⚡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Mobile Preview Panel */}
        <div className="w-80 bg-amber-50 border-l border-gray-300 p-6 flex flex-col items-center justify-center">
          {/* Share/Copy Area */}
          <div className="w-full max-w-sm mb-6">
            <div className="bg-white rounded-xl border-2 border-gray-300 p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span className="text-sm text-gray-700 font-medium">forest.ee/{profile.displayName}</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`forest.ee/${profile.displayName}`);
                    // Toast notification could be added here
                  }}
                  className="ml-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy link"
                >
                  📤
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center max-w-sm">

            {/* Ultra Stylish Phone Frame */}
            <div className="relative">
              {/* Phone Frame with Premium Design */}
              <div className="w-72 h-[600px] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl">
                {/* Phone Screen with Premium Look */}
                <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-[2.5rem] overflow-hidden relative border border-gray-700">
                  {/* Premium Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-black bg-opacity-40 flex items-center justify-between px-6 text-white text-sm font-medium">
                    <span>9:42</span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-3 bg-white rounded-sm opacity-80"></div>
                      <div className="w-8 h-4 border border-white rounded-sm opacity-60">
                        <div className="w-6 h-3 bg-white rounded-sm m-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Premium Content */}
                  <div className="pt-10 p-8 h-full flex flex-col">
                    {/* Top Icon with Glow */}
                    <div className="flex justify-start mb-8">
                      <div className="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-20">
                        <span className="text-white text-lg">*</span>
                      </div>
                    </div>

                    {/* Premium Profile Section */}
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-white bg-opacity-10 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl overflow-hidden backdrop-blur-sm border border-white border-opacity-20">
                        {profile.profileImage ? (
                          <img 
                            src={profile.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-3xl">👤</span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">@{profile.displayName}</h2>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-white text-lg">📷</span>
                      </div>
                    </div>

                    {/* Premium Links Section */}
                    <div className="flex-1 space-y-3 mb-6">
                      {links.filter(link => link.is_active).map((link) => (
                        <button 
                          key={link.id}
                          onClick={() => window.open(link.url, '_blank')}
                          className="w-full bg-white bg-opacity-95 hover:bg-opacity-100 border border-white border-opacity-30 rounded-3xl p-4 text-left transition-all duration-500 hover:shadow-2xl hover:scale-[1.03] group backdrop-blur-sm"
                          type="button"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-lg">{link.icon || '🔗'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-base group-hover:text-green-700 transition-colors truncate">
                                {link.title}
                              </h3>
                              <p className="text-sm text-gray-600 truncate">{link.url}</p>
                            </div>
                            <div className="text-gray-400 group-hover:text-green-500 transition-colors flex-shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Premium Call to Action Button */}
                    <div className="mt-auto">
                      <button className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-6 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] text-lg">
                        Forest'te {profile.displayName} ile katılın
                      </button>
                    </div>

                    {/* Forest Branding */}
                    <div className="mt-3 text-center">
                      <p className="text-xs text-white/60 font-medium">Powered by Forest</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Phone Shadow with Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent rounded-[3rem] -z-10 transform translate-y-4 opacity-30"></div>
              <div className="absolute inset-0 bg-yellow-400 rounded-[3rem] -z-20 transform translate-y-6 opacity-20 blur-xl"></div>
            </div>

            {/* Premium Footer Links */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">Report • Privacy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Link Modal */}
      <Modal
        isOpen={isAddLinkModalOpen}
        onClose={handleCloseModal}
        title="Add New Link"
        size="large"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
            <select
              value={newLink.type}
              onChange={(e) => setNewLink({ ...newLink, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="custom">Custom Link</option>
              <option value="wallet">Wallet</option>
              <option value="nft">NFT Collection</option>
              <option value="defi">DeFi Portfolio</option>
              <option value="social">Social Media</option>
            </select>
          </div>

          <Input
            label="Title"
            placeholder="My Website"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          />

          <Input
            label="URL"
            placeholder="https://example.com"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />

          <Input
            label="Icon"
            placeholder="📸 or https://example.com/icon.png"
            value={newLink.icon}
            onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
          />

          <Input
            label="Banner"
            placeholder="https://example.com/banner.jpg"
            value={newLink.banner}
            onChange={(e) => setNewLink({ ...newLink, banner: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddLink}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'İşleniyor...' : 'Add Link'}
            </Button>
            <Button onClick={handleCloseModal} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}