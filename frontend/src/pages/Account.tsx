import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';

export function Account() {
  const navigate = useNavigate();
  // Mysten Labs dapp-kit hooks kullanılıyor
  const currentAccount = useCurrentAccount();
  const isConnected = !!currentAccount;
  
  const [profileData, setProfileData] = useState({
    name: 'TAHA ÖZLÜ',
    email: 'yutahaozlu@gmail.com',
    bio: 'Web3 Developer & NFT Collector',
    profileImage: '',
    ensName: '',
    customDomain: 'samcuu.forest.ee'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveDetails = () => {
    // Save profile data logic here
    setIsEditing(false);
    // Show success message
  };

  const handleDeleteAccount = () => {
    // Delete account logic here
    setIsDeleting(false);
    // Redirect to landing page
    navigate('/');
  };

  const handleUpgradeToPro = () => {
    // Handle upgrade to Pro logic here
    console.log('Upgrade to Pro clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gray-800 text-white py-2 px-4 text-center text-sm">
        <span>🌲 Try Forest Pro for free</span>
        <button className="ml-4 bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs font-medium">
          Upgrade
        </button>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🌲</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Forest</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          {/* My Information Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                {isEditing ? (
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900">{profileData.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your email can't be changed as you signed up using your Google account.
                </p>
              </div>

              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleSaveDetails}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                    >
                      Save details
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="px-4 py-2 rounded-lg"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="px-4 py-2 rounded-lg"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>


          {/* Account Management Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Account management</h2>
            
            <div className="mb-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Forests you own</h3>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">Y</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">@yuusftaha</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    ⋯
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Plan</span>
                    <span className="text-sm text-gray-900">Free</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Admins ?</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{profileData.email}</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Owner (you)
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Upgrade to Pro to invite multiple admins to manage this Forest
                  </p>
                  
                  <Button 
                    onClick={handleUpgradeToPro}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <span>⚡</span>
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Forever Section */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Delete forever</h2>
            <p className="text-gray-700 mb-4">
              Permanently delete your account and all your Forest profiles.
            </p>
            
            {isDeleting ? (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button 
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Yes, Delete Account
                  </Button>
                  <Button 
                    onClick={() => setIsDeleting(false)}
                    variant="outline"
                    className="px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setIsDeleting(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Delete account
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
