import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
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
  DragEndEvent,
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
  id: number; // u64 from Move contract
  profile_id: string;
  type: 'wallet' | 'nft' | 'defi' | 'social' | 'custom';
  title: string;
  url: string;
  icon: string;
  banner: string;
  is_active: boolean; // Move contract field name
  order: number;
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
  platform?: string;
}

export function Admin() {
  const navigate = useNavigate();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState<Web3Link[]>([]);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Web3Link | null>(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: '',
    banner: '',
    type: 'custom' as 'wallet' | 'nft' | 'defi' | 'social' | 'custom',
    blockchain: '',
    contractAddress: '',
    tokenId: ''
  });

  const [profileSettings, setProfileSettings] = useState({
    displayName: '',
    bio: '',
    profileImage: '',
    ensName: '',
    customDomain: ''
  });

  const [profileId, setProfileId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Ultra-optimized Drag & Drop sensors for maximum performance
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 12,
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadProfileData();
  }, []);

  // Profil verilerini akıllı kontraktan yükle
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Local storage'dan profile ID'yi al
      const storedProfileId = localStorage.getItem('forest_profile_id');
      console.log('🔍 Admin: Stored Profile ID:', storedProfileId);
      
      if (!storedProfileId) {
        setError('Profil bulunamadı. Lütfen önce profil oluşturun.');
        return;
      }

      setProfileId(storedProfileId);
      
      // Profil verilerini kontraktan çek
      console.log('🔍 Admin: Fetching profile from blockchain...', storedProfileId);
      let profileData = await forest.getProfile(storedProfileId);
      console.log('🔍 Admin: Profile data received:', profileData);
      
      // Eğer profil bulunamazsa ve geçici ID ise, localStorage'dan veri kullan
      if (!profileData && storedProfileId.startsWith('temp_')) {
        console.log('🔍 Admin: Using localStorage data for temporary ID:', storedProfileId);
        const userData = localStorage.getItem('forest_user_data');
        if (userData) {
          const parsedData = JSON.parse(userData);
          profileData = {
            id: storedProfileId,
            owner: '',
            username: parsedData.username || 'user',
            display_name: parsedData.displayName || 'Anonymous',
            bio: parsedData.bio || '',
            image_url: parsedData.imageUrl || '',
            subdomain: parsedData.subdomain || 'user.forest.ee',
            link_ids: [],
            next_link_id: 0,
            link_count: 0,
          };
        } else {
          // Fallback mock data
          profileData = {
            id: storedProfileId,
            owner: '',
            username: 'user',
            display_name: 'Anonymous',
            bio: '',
            image_url: '',
            subdomain: 'user.forest.ee',
            link_ids: [],
            next_link_id: 0,
            link_count: 0,
          };
        }
      }
      
      if (!profileData) {
        console.error('❌ Admin: Profile not found on blockchain for ID:', storedProfileId);
        setError('Profil blockchain\'de bulunamadı. Lütfen önce profil oluşturun.');
        return;
      }
      
      // Link'leri çek (dynamic fields'dan)
      const profileLinks = await forest.getProfileLinks(storedProfileId);
      
      // Web3Link formatına dönüştür - Move contract verilerini kullan
      const web3Links: Web3Link[] = profileLinks.map(link => ({
        id: link.id, // u64 from Move contract
        profile_id: storedProfileId,
        type: 'custom', // Default type, can be enhanced later
        title: link.title,
        url: link.url,
        icon: link.icon,
        banner: link.banner,
        is_active: link.is_active, // Move contract field name
        order: link.order,
      }));
      
      setLinks(web3Links);
      setProfileSettings({
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
  };

  // Link ekleme fonksiyonu - akıllı kontraktla
  const handleAddLink = async () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      setError('Lütfen başlık ve URL alanlarını doldurun.');
      return;
    }
    if (!profileId) {
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
        signAndExecuteTransaction
      );

      console.log('✅ Admin: Link added successfully:', result);

      if (result.linkId !== undefined) {
        // Link eklendi - reload et
        await loadProfileData();
        setNewLink({ title: '', url: '', icon: '', banner: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '' });
        setIsAddLinkModalOpen(false);
        console.log('✅ Admin: Link added and UI updated');
      }
    } catch (err) {
      console.error('❌ Admin: Link eklenirken hata:', err);
      const errorMessage = err instanceof Error ? err.message : 'Link eklenirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddLinkModalOpen(false);
    setEditingLink(null);
    setNewLink({ title: '', url: '', icon: '', banner: '', type: 'custom', blockchain: '', contractAddress: '', tokenId: '' });
  };

  // Memoized link IDs for better performance
  const linkIds = useMemo(() => links.map(link => link.id), [links]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profileSettings.profileImage ? (
                <img 
                  src={profileSettings.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-600">👤</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{profileSettings.displayName}</h3>
              <p className="text-sm text-gray-500">▼</p>
            </div>
            <button className="text-gray-600 hover:text-gray-900">🔔</button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">My Forest</h3>
            <button 
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'links' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('links')}
              type="button"
            >
              Links
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Shop
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Design
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Earn
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Audience
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Insights
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tools</h3>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Social planner
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Instagram auto-reply
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Link shortener
            </button>
            <button 
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
              type="button"
            >
              Post ideas
            </button>
          </div>
        </div>

        {/* Setup Checklist */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                33%
              </div>
              <span className="text-sm font-medium text-gray-900">Your setup checklist</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">2 of 6 complete</p>
            <button className="w-full bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
              Finish setup
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Links</h1>
              <p className="text-sm text-gray-600">Manage your Forest links</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <span className="text-sm text-gray-600">forest.ee/{profileSettings.displayName}</span>
                <button className="text-gray-600 hover:text-gray-900">📤</button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
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
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {profileSettings.profileImage ? (
                  <img 
                    src={profileSettings.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-2xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {profileSettings.displayName || 'Yükleniyor...'}
                </h2>
                <p className="text-gray-600">
                  {profileSettings.bio || 'Add bio'}
                </p>
                {profileSettings.customDomain && (
                  <p className="text-sm text-green-600 font-medium">
                    🌲 {profileSettings.customDomain}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => setIsAddLinkModalOpen(true)}
                disabled={isLoading}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-2">+</span>
                {isLoading ? 'Yükleniyor...' : 'Add'}
              </Button>
              <Button 
                variant="outline"
                className="px-6 py-3 rounded-lg font-medium"
              >
                Add collection
              </Button>
               <Button 
                 variant="outline"
                 className="px-6 py-3 rounded-lg font-medium ml-auto"
               >
                 View archive &gt;
               </Button>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="mb-4">No links yet</p>
                <Button
                  onClick={() => setIsAddLinkModalOpen(true)}
                  className="bg-purple-500 text-white hover:bg-purple-600"
                >
                  Add Your First Link
                </Button>
              </div>
            ) : (
              links.map((link) => (
                <div
                  key={link.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{link.icon || '🔗'}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{link.title}</h3>
                        <p className="text-sm text-gray-500">{link.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600">✏️</button>
                      <button className="text-gray-400 hover:text-gray-600">🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Mobile Preview Panel */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Mobile Header */}
          <div className="bg-black text-white px-4 py-2 flex items-center justify-between">
            <span className="text-sm">forest.ee/{profileSettings.displayName}</span>
            <button className="text-white">📤</button>
          </div>
          
          {/* Mobile Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                {profileSettings.profileImage ? (
                  <img 
                    src={profileSettings.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 text-2xl">👤</span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">@{profileSettings.displayName}</h2>
              <p className="text-sm text-gray-600">{profileSettings.bio}</p>
            </div>
            
            {/* Mobile Links */}
            <div className="space-y-2">
              {links.filter(link => link.is_active).map((link) => (
                <button 
                  key={link.id}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-left hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">{link.icon || '🔗'}</span>
                    </div>
                    <span className="font-medium text-gray-900">{link.title}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Mobile Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">Forest'te {profileSettings.displayName} ile katılın</p>
              <p className="text-xs text-gray-400 mt-1">Report • Privacy</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="bg-purple-500 hover:bg-purple-600 text-white shadow-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
