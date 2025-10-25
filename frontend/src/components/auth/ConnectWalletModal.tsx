import { ConnectButton } from '@mysten/dapp-kit';
import { Modal } from '../common/Modal';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect to Forest">
      <div className="space-y-4">
        <p className="text-gray-600 text-center mb-6">
          Connect your Sui wallet to create your Forest profile
        </p>
        
        <div className="flex flex-col gap-3">
          <ConnectButton className="w-full" />
          
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
      </div>
    </Modal>
  );
}



