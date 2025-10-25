import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: () => void;
}

export function ConnectWalletModal({ isOpen, onClose, onConnected }: ConnectWalletModalProps) {
  const currentAccount = useCurrentAccount();

  const handleContinue = () => {
    console.log('Continue butonuna tıklandı!');
    onClose();
    onConnected();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect to Forest">
      <div className="space-y-6">
        <p className="text-gray-600 text-center mb-6">
          Connect your Sui wallet to create your Forest profile
        </p>
        
        {!currentAccount ? (
          <>
            <div className="flex flex-col gap-3">
              <div className="w-full">
                <ConnectButton 
                  connectText="Connect Wallet"
                  className="!w-full"
                />
              </div>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <button
                disabled
                className="w-full px-6 py-3 bg-gray-100 text-gray-400 rounded-full font-semibold cursor-not-allowed"
              >
                ZK Login with Google (Coming Soon)
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Wallet Connected!
              </h3>
              <p className="text-green-700 text-sm mb-1">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </p>
              <p className="text-green-600 text-xs">
                You're ready to create your Forest profile
              </p>
            </div>

            <Button 
              onClick={handleContinue}
              fullWidth
              className="text-lg py-4"
            >
              Continue to Profile Setup →
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
