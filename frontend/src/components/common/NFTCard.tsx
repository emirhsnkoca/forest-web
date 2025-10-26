import { useState } from 'react';

interface NFTCardProps {
  nft: {
    id: string;
    name: string;
    description: string;
    image: string;
    collection: string;
    tokenId: string;
    contractAddress: string;
    rarity: string;
    attributes: Array<{ trait_type: string; value: string }>;
  };
}

export function NFTCard({ nft }: NFTCardProps) {
  const [imageError, setImageError] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-200">
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden">
        {!imageError ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
        
        {/* Rarity Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(nft.rarity)}`}>
            {nft.rarity}
          </span>
        </div>
      </div>

      {/* NFT Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 text-lg truncate">{nft.name}</h3>
          <p className="text-sm text-gray-600">{nft.collection}</p>
        </div>

        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{nft.description}</p>

        {/* Attributes */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attributes</h4>
          <div className="grid grid-cols-2 gap-2">
            {nft.attributes.slice(0, 4).map((attr, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2">
                <div className="text-xs text-gray-500">{attr.trait_type}</div>
                <div className="text-sm font-medium text-gray-900">{attr.value}</div>
              </div>
            ))}
          </div>
          {nft.attributes.length > 4 && (
            <div className="text-xs text-gray-500 text-center">
              +{nft.attributes.length - 4} more attributes
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Token ID: {nft.tokenId}</span>
            <span className="truncate max-w-20">{nft.contractAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
