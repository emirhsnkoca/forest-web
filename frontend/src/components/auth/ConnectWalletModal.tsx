import { ConnectButton, useCurrentAccount, useCurrentWallet } from '@mysten/dapp-kit';
import { useEffect } from 'react';
import { Button } from '../common/Button';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export function ConnectWalletModal({ isOpen, onClose, onConnected }: ConnectWalletModalProps) {
  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();

  // Cüzdan değişikliklerini takip et
  useEffect(() => {
    if (currentAccount) {
      console.log('🔄 Cüzdan değişikliği tespit edildi!');
      console.log('📍 Yeni adres:', currentAccount.address);
      console.log('🔗 Cüzdan türü:', (currentWallet as any)?.name || 'Unknown');
      
      // Agresif cache temizleme
      if (typeof window !== 'undefined') {
        console.log('🧹 Agresif cache temizleme başlatılıyor...');
        
        // Tüm localStorage'ı temizle
        localStorage.clear();
        console.log('🧹 localStorage tamamen temizlendi');
        
        // Tüm sessionStorage'ı temizle
        sessionStorage.clear();
        console.log('🧹 sessionStorage tamamen temizlendi');
        
        // IndexedDB'yi temizle (eğer varsa)
        if ('indexedDB' in window) {
          indexedDB.databases().then(databases => {
            databases.forEach(db => {
              if (db.name) {
                indexedDB.deleteDatabase(db.name);
                console.log('🧹 IndexedDB temizlendi:', db.name);
              }
            });
          });
        }
        
        // Cache API'yi temizle
        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              caches.delete(cacheName);
              console.log('🧹 Cache temizlendi:', cacheName);
            });
          });
        }
        
        console.log('🧹 Tüm cache temizleme tamamlandı');
      }
    }
  }, [currentAccount, currentWallet]);

  // Auto-navigate when wallet connects
  useEffect(() => {
    if (currentAccount && isOpen) {
      console.log('🔗 Cüzdan bağlandı!');
      console.log('📍 Adres:', currentAccount.address);
      console.log('🔗 Tam adres:', currentAccount.address);
      console.log('📱 Kısaltılmış adres:', `${currentAccount.address.slice(0, 8)}...${currentAccount.address.slice(-6)}`);
      
      const timer = setTimeout(() => {
        onClose();
        onConnected();
      }, 1500); // 1.5 saniye bekleme - kullanıcı success state'i görsün
      return () => clearTimeout(timer);
    }
  }, [currentAccount, isOpen, onClose, onConnected]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-md pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Content with Minecraft-style Green Pixel Background */}
          <div className="relative bg-primary-dark rounded-3xl shadow-2xl overflow-hidden animate-scale-in" style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                #2D5016 0px,
                #2D5016 20px,
                #4A7C25 20px,
                #4A7C25 40px,
                #6B9F3D 40px,
                #6B9F3D 60px
              ),
              repeating-linear-gradient(
                90deg,
                #2D5016 0px,
                #2D5016 20px,
                #4A7C25 20px,
                #4A7C25 40px,
                #6B9F3D 40px,
                #6B9F3D 60px
              )
            `,
            backgroundBlendMode: 'multiply',
            backgroundSize: '60px 60px'
          }}>
            
            {/* Decorative Tree Illustration (CSS-based) */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              {/* Tree trunk - Kahverengi */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-40 rounded-t-lg" style={{
                background: 'linear-gradient(to top, #5C4033, #7D5A3F)'
              }} />
              
              {/* 4 Branches - Yeşil tonlar */}
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
                {/* Branch 1 - Top */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-2xl" style={{
                  background: 'radial-gradient(circle, #6B9F3D 0%, transparent 70%)'
                }} />
                {/* Branch 2 - Right */}
                <div className="absolute top-0 left-16 w-28 h-28 rounded-full blur-2xl" style={{
                  background: 'radial-gradient(circle, #4A7C25 0%, transparent 70%)'
                }} />
                {/* Branch 3 - Left */}
                <div className="absolute top-0 -left-16 w-28 h-28 rounded-full blur-2xl" style={{
                  background: 'radial-gradient(circle, #4A7C25 0%, transparent 70%)'
                }} />
                {/* Branch 4 - Center */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full blur-3xl" style={{
                  background: 'radial-gradient(circle, #6B9F3D 0%, transparent 70%)'
                }} />
              </div>
            </div>

            {/* Header */}
            <div className="relative px-8 pt-8 pb-4 text-center border-b border-white/10">
              <div className="text-4xl mb-3">🌲</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Forest
              </h2>
              <p className="text-white/80 text-sm">
                Connect your wallet to grow your Web3 presence
              </p>
            </div>

            {/* Content */}
            <div className="relative px-8 py-6 space-y-6">
              {!currentAccount ? (
                <>
                  {/* Sui Wallet Button with Forest Theme */}
                  <div className="space-y-4">
                    <ConnectButton 
                      connectText="🔗 Connect Sui Wallet"
                      className="!w-full !bg-gradient-to-r !from-primary-dark !to-primary !text-white !font-semibold !py-4 !px-6 !rounded-2xl !shadow-lg hover:!shadow-xl hover:!scale-[1.02] !transition-all !duration-200 !border-2 !border-primary-light/30"
                    />
                    
                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-primary-dark text-white/70 text-xs uppercase tracking-wider">
                          or
                        </span>
                      </div>
                    </div>
                    
                    {/* ZK Login - Coming Soon */}
                    <button
                      disabled
                      className="w-full px-6 py-4 bg-black/30 text-white/50 rounded-2xl font-semibold cursor-not-allowed border-2 border-white/10 flex items-center justify-center gap-2"
                    >
                      <span>🔐</span>
                      <span>ZK Login with Google</span>
                      <span className="text-xs bg-black/40 px-2 py-1 rounded-full">Soon</span>
                    </button>
                  </div>

                  {/* Info Text */}
                  <p className="text-center text-white/70 text-xs">
                    Your wallet stays secure. We never store your private keys.
                  </p>
                </>
              ) : (
                <>
                  {/* Success State with Tree Animation */}
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border-2 border-primary rounded-2xl p-8 text-center animate-fade-in">
                    {/* Animated Tree + Checkmark */}
                    <div className="relative inline-block mb-4">
                      <div className="text-6xl animate-bounce-slow">🌳</div>
                      <div className="absolute -top-2 -right-2 text-3xl animate-scale-in">
                        ✅
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Connected!
                    </h3>
                    <div className="bg-black/20 rounded-xl px-4 py-2 mb-2 inline-block">
                      <p className="text-primary-light font-mono text-sm">
                        {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
                      </p>
                    </div>
                    {currentWallet && (
                        <div className="bg-black/20 rounded-xl px-4 py-2 mb-2 inline-block">
                          <p className="text-primary-light text-xs">
                            Wallet: {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
                          </p>
                        </div>
                    )}
                    <p className="text-white/80 text-sm">
                      Redirecting to onboarding...
                    </p>
                  </div>

                  {/* Optional Manual Continue Button */}
                  <Button 
                    onClick={() => {
                      onClose();
                      onConnected();
                    }}
                    fullWidth
                    className="!bg-primary !text-white !py-4 !text-lg !font-semibold hover:!bg-primary-dark"
                  >
                    Continue Now →
                  </Button>
                </>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-all duration-200"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
