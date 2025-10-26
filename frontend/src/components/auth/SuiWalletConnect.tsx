import { useEffect, useState } from 'react';
import { ConnectButton, useCurrentAccount, useCurrentWallet, useWallets } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';

export function SuiWalletConnect() {
  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const wallets = useWallets();
  const navigate = useNavigate();
  const [hasShownAlert, setHasShownAlert] = useState(false);

  // Cüzdan bağlandıktan sonra otomatik olarak onboarding'e yönlendir
  useEffect(() => {
    if (currentAccount && !hasShownAlert) {
      const walletName = currentWallet?.currentWallet?.name || 'Bilinmeyen';
      console.log('🌲 Cüzdan bağlandı:', {
        address: currentAccount.address,
        wallet: walletName,
        availableWallets: wallets.length
      });
      
      alert(`Cüzdan başarıyla bağlandı!\nAdres: ${currentAccount.address}\nCüzdan: ${walletName}`);
      setHasShownAlert(true);
      
      // 2 saniye sonra onboarding'e yönlendir
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    }
  }, [currentAccount, currentWallet, navigate, hasShownAlert, wallets.length]);

  return (
    <div className="flex items-center gap-3">
      <ConnectButton 
        connectText="Connect Wallet"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-green-500/50"
      />
    </div>
  );
}
