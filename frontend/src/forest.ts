// Forest blockchain entegrasyonu
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Sui client configuration
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Contract configuration - Backend'deki deployment.json'dan
const PACKAGE_ID = '0xd7dc024c79b49d74de64f6cec621d46488934b19f2200c857a24835878e6e5f7';
const MODULE_NAME = 'linktree';

// Types for our smart contract
export interface Profile {
  id: string;
  owner: string;
  display_name: string;
  bio: string;
  image_url: string;
}

export interface Link {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  is_active: boolean;
}

export interface ProfileCreatedEvent {
  profile_id: string;
  owner: string;
  display_name: string;
}

export interface LinkAddedEvent {
  link_id: string;
  profile_id: string;
  title: string;
  url: string;
}

// Forest class for blockchain integration
export class Forest {
  private client: SuiClient;
  private packageId: string;
  private moduleName: string;

  constructor(packageId: string = PACKAGE_ID) {
    this.client = client;
    this.packageId = packageId;
    this.moduleName = MODULE_NAME;
  }

  // Create a new profile - Onboarding Step 4'ten çağrılacak
  async createProfile(
    displayName: string,
    bio: string,
    imageUrl: string,
    signer: Ed25519Keypair
  ): Promise<{ digest: string; profileId: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::create_profile`,
      arguments: [
        txb.pure.string(displayName),
        txb.pure.string(bio),
        txb.pure.string(imageUrl),
      ],
    });

    const result = await this.client.signAndExecuteTransaction({
      transaction: txb,
      signer,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    // Created object ID'yi al
    const createdObject = result.objectChanges?.find(
      (change: any) => change.type === 'created' && change.objectType?.includes('Profile')
    );
    const profileId = createdObject && 'objectId' in createdObject ? createdObject.objectId : '';

    return {
      digest: result.digest,
      profileId
    };
  }

  // Add a link to a profile
  async addLink(
    profileId: string,
    title: string,
    url: string,
    isActive: boolean,
    signer: Ed25519Keypair
  ): Promise<{ digest: string; linkId: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::add_link`,
      arguments: [
        txb.pure.string(profileId),
        txb.pure.string(title),
        txb.pure.string(url),
        txb.pure.bool(isActive),
      ],
    });

    const result = await this.client.signAndExecuteTransaction({
      transaction: txb,
      signer,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    // Created object ID'yi al
    const createdLink = result.objectChanges?.find(
      (change: any) => change.type === 'created' && change.objectType?.includes('Link')
    );
    const linkId = createdLink && 'objectId' in createdLink ? createdLink.objectId : '';

    return {
      digest: result.digest,
      linkId
    };
  }

  // Get profile data
  async getProfile(profileId: string): Promise<Profile | null> {
    try {
      const object = await this.client.getObject({
        id: profileId,
        options: {
          showContent: true,
        },
      });

      if (object.data?.content && 'fields' in object.data.content) {
        const fields = object.data.content.fields as any;
        return {
          id: profileId,
          owner: fields.owner,
          display_name: new TextDecoder().decode(new Uint8Array(fields.display_name)),
          bio: new TextDecoder().decode(new Uint8Array(fields.bio)),
          image_url: new TextDecoder().decode(new Uint8Array(fields.image_url)),
        };
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null;
  }

  // Listen for ProfileCreated events
  async listenForProfileCreated(
    callback: (event: ProfileCreatedEvent) => void
  ): Promise<() => void> {
    const subscription = await this.client.subscribeEvent({
      filter: {
        MoveEventType: `${this.packageId}::${this.moduleName}::ProfileCreated`,
      },
      onMessage: (event) => {
        const parsedEvent = event.parsedJson as ProfileCreatedEvent;
        callback(parsedEvent);
      },
    });

    return () => subscription();
  }

  // Utility function to generate a new keypair
  static generateKeypair(): Ed25519Keypair {
    return new Ed25519Keypair();
  }
}

// Export a default instance
export const forest = new Forest();