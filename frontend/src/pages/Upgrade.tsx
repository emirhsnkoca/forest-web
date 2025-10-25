import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

interface PremiumFeatures {
  unlimitedLinks: boolean;
  customThemes: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  customDomain: boolean;
}

export function Upgrade() {
  const navigate = useNavigate();
  const { currentAccount, isConnected } = useAuth();
  
  const [hasWALLLCoin, setHasWALLLCoin] = useState(false);
  const [hasMonkeyNFT, setHasMonkeyNFT] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');

  const premiumFeatures: PremiumFeatures = {
    unlimitedLinks: true,
    customThemes: true,
    analytics: true,
    prioritySupport: true,
    customDomain: true
  };

  useEffect(() => {
    checkEligibility();
  }, [currentAccount]);

  const checkEligibility = async () => {
    setIsChecking(true);
    
    // Mock wallet check - in real app, this would check actual wallet
    if (currentAccount?.address) {
      // Simulate checking for WALLL coin (10+ dollars worth)
      const mockWALLLBalance = Math.random() > 0.5; // 50% chance
      setHasWALLLCoin(mockWALLLBalance);
      
      // Simulate checking for Monkey NFT
      const mockMonkeyNFT = Math.random() > 0.7; // 30% chance
      setHasMonkeyNFT(mockMonkeyNFT);
    }
    
    setIsChecking(false);
  };

  const handleUpgrade = () => {
    if (hasWALLLCoin || hasMonkeyNFT) {
      // Free upgrade for eligible users
      setSelectedPlan('premium');
      setIsUpgradeModalOpen(true);
    } else {
      // Paid upgrade
      setSelectedPlan('premium');
      setIsUpgradeModalOpen(true);
    }
  };

  const confirmUpgrade = () => {
    // In real app, this would process payment or activate premium
    console.log('Upgrade confirmed:', selectedPlan);
    setIsUpgradeModalOpen(false);
    navigate('/admin');
  };

  const isEligibleForFree = hasWALLLCoin || hasMonkeyNFT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">🌲</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-900">Forest Premium</span>
              <p className="text-sm text-gray-600">Unlock your Web3 potential</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Admin
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Upgrade to Forest Premium
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Unlock unlimited links, advanced analytics, and premium features for your Web3 presence
            </p>
            
            {/* Eligibility Check */}
            {isChecking ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 font-medium">Checking your wallet for eligibility...</span>
                </div>
              </div>
            ) : isEligibleForFree ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl">🎉</span>
                  <h3 className="text-2xl font-bold text-green-800">You're eligible for FREE Premium!</h3>
                </div>
                <div className="space-y-2 text-green-700">
                  {hasWALLLCoin && (
                    <p className="flex items-center justify-center gap-2">
                      <span>💰</span>
                      <span>You have WALLL coin (10+ USD value)</span>
                    </p>
                  )}
                  {hasMonkeyNFT && (
                    <p className="flex items-center justify-center gap-2">
                      <span>🐵</span>
                      <span>You own a Monkey NFT</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-3xl">💎</span>
                  <h3 className="text-2xl font-bold text-orange-800">Premium Features Available</h3>
                </div>
                <p className="text-orange-700">
                  Get WALLL coin (10+ USD) or own a Monkey NFT for free premium access!
                </p>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Up to 5 links</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Basic themes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span>Community support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">✗</span>
                  <span className="text-gray-400">Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">✗</span>
                  <span className="text-gray-400">Custom domain</span>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-1 text-sm font-bold transform rotate-12 translate-x-4 -translate-y-2">
                {isEligibleForFree ? 'FREE' : 'POPULAR'}
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="text-4xl font-bold mb-2">
                  {isEligibleForFree ? 'FREE' : '$9.99'}
                </div>
                <p className="text-purple-100">
                  {isEligibleForFree ? 'You qualify for free premium!' : 'Unlock unlimited potential'}
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-green-300">✓</span>
                  <span>Unlimited links</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-300">✓</span>
                  <span>Custom themes</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-300">✓</span>
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-300">✓</span>
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-300">✓</span>
                  <span>Custom domain</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">Premium Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔗</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Unlimited Links</h4>
                <p className="text-gray-600">Add as many links as you want - no limits!</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎨</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Custom Themes</h4>
                <p className="text-gray-600">Personalize your Forest with custom colors and styles</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics</h4>
                <p className="text-gray-600">Track clicks, views, and engagement metrics</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Priority Support</h4>
                <p className="text-gray-600">Get help faster with priority customer support</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🌐</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Custom Domain</h4>
                <p className="text-gray-600">Use your own domain like yourname.forest.ee</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Web3 Integration</h4>
                <p className="text-gray-600">Advanced blockchain and NFT features</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-lg"
            >
              {isEligibleForFree ? 'Get Free Premium' : 'Upgrade to Premium'}
            </Button>
            <p className="text-gray-600 mt-4">
              {isEligibleForFree 
                ? 'No payment required - you qualify for free premium!' 
                : 'Cancel anytime. 30-day money-back guarantee.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Confirmation Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title={isEligibleForFree ? "Activate Free Premium" : "Confirm Premium Upgrade"}
        size="large"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🌲</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isEligibleForFree ? 'Free Premium Activated!' : 'Premium Upgrade Confirmed'}
            </h3>
            <p className="text-gray-600">
              {isEligibleForFree 
                ? 'Your premium features are now active. Enjoy unlimited links and all premium benefits!'
                : 'Your premium subscription is now active. You can cancel anytime.'
              }
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-bold text-gray-900 mb-3">What you get:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Unlimited links (no 5-link limit)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Custom themes and styling</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Advanced analytics dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Priority customer support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Custom domain support</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={confirmUpgrade}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isEligibleForFree ? 'Activate Now' : 'Complete Payment'}
            </Button>
            <Button
              onClick={() => setIsUpgradeModalOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
