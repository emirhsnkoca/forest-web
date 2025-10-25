// Forest blockchain entegrasyonu
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

// Sui client configuration
const client = new SuiClient({ url: getFullnodeUrl('testnet') });

// Contract configuration - Backend'deki deployment.json'dan
const PACKAGE_ID = '0x69032fa43cd3308395b38bc1e5fbb414dbe482229ae9f79f9dd1d09dc67cdc5e';
const MODULE_NAME = 'linktree';

// Types for our smart contract
export interface Profile {
  id: string;
  owner: string;
  username: string;
  display_name: string;
  bio: string;
  image_url: string;
  subdomain: string;
  link_ids: number[];
  link_count: number;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  icon: string;
  banner: string;
  is_active: boolean;
  order: number;
}

export interface ProfileCreatedEvent {
  profile_id: string;
  owner: string;
  username: string;
  subdomain: string;
}

export interface ProfileUpdatedEvent {
  profile_id: string;
  display_name: string;
}

export interface ProfileImageUpdatedEvent {
  profile_id: string;
  image_url: string;
}

export interface LinkAddedEvent {
  profile_id: string;
  link_id: number;
  title: string;
  url: string;
}

export interface LinkUpdatedEvent {
  profile_id: string;
  link_id: number;
  title: string;
}

export interface LinkDeletedEvent {
  profile_id: string;
  link_id: number;
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

  // Create a new profile with dapp-kit
  async createProfileWithDappKit(
    username: string,
    displayName: string,
    bio: string,
    imageUrl: string,
    subdomain: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string; profileId: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::create_profile`,
      arguments: [
        txb.pure.string(username),
        txb.pure.string(displayName),
        txb.pure.string(bio),
        txb.pure.string(imageUrl),
        txb.pure.string(subdomain),
      ],
    });

    console.log('Creating profile with transaction:', txb);
    console.log('SignAndExecuteTransaction function type:', typeof signAndExecuteTransaction);

    // signAndExecuteTransaction bir mutate fonksiyonu
    const result = await new Promise((resolve, reject) => {
      signAndExecuteTransaction({
        transaction: txb,
        options: {
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      }, {
        onSuccess: (data: any) => {
          console.log('Transaction success:', data);
          resolve(data);
        },
        onError: (error: any) => {
          console.error('Transaction error:', error);
          reject(error);
        }
      });
    });

    console.log('Transaction result:', result);
    console.log('Object changes:', (result as any)?.objectChanges);

    // Created object ID'yi al - basit ve direkt
    let profileId = '';
    
    const objectChanges = (result as any)?.objectChanges;
    if (objectChanges && Array.isArray(objectChanges)) {
      console.log('Object changes array length:', objectChanges.length);
      
      // Tüm created objects'leri logla
      const createdObjects = objectChanges.filter((change: any) => change.type === 'created');
      console.log('All created objects:', createdObjects);
      
      // UserProfile'ı bul
      const userProfile = createdObjects.find((change: any) => 
        change.objectType && change.objectType.includes('UserProfile')
      );
      
      if (userProfile && userProfile.objectId) {
        profileId = userProfile.objectId;
        console.log('Found UserProfile with ID:', profileId);
      } else {
        console.log('No UserProfile found in created objects');
      }
    } else {
      console.log('No object changes found');
    }

    return {
      digest: (result as any)?.digest || '',
      profileId
    };

    return {
      digest: (result as any)?.digest || '',
      profileId
    };
  }

  // Update profile with dapp-kit
  async updateProfileWithDappKit(
    profileId: string,
    displayName: string,
    bio: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::update_profile`,
      arguments: [
        txb.object(profileId),
        txb.pure.string(displayName),
        txb.pure.string(bio),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    return {
      digest: result?.digest || '',
    };
  }

  // Update profile image with dapp-kit
  async updateProfileImageWithDappKit(
    profileId: string,
    imageUrl: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::update_profile_image`,
      arguments: [
        txb.object(profileId),
        txb.pure.string(imageUrl),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    return {
      digest: result?.digest || '',
    };
  }

  // Update subdomain with dapp-kit
  async updateSubdomainWithDappKit(
    profileId: string,
    subdomain: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::update_subdomain`,
      arguments: [
        txb.object(profileId),
        txb.pure.string(subdomain),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    return {
      digest: result?.digest || '',
    };
  }

  // Add a link to a profile with dapp-kit
  async addLinkWithDappKit(
    profileId: string,
    title: string,
    url: string,
    icon: string,
    banner: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string; linkId: number }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::add_link`,
      arguments: [
        txb.object(profileId),
        txb.pure.string(title),
        txb.pure.string(url),
        txb.pure.string(icon),
        txb.pure.string(banner),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    console.log('Link transaction result:', result);

    // Event'ten link_id'yi al
    const linkAddedEvent = result?.events?.find(
      (event: any) => event.type === `${this.packageId}::${this.moduleName}::LinkAdded`
    );
    const linkId = linkAddedEvent?.parsedJson?.link_id || 0;

    return {
      digest: result?.digest || '',
      linkId
    };
  }

  // Update a link with dapp-kit
  async updateLinkWithDappKit(
    profileId: string,
    linkId: number,
    title: string,
    url: string,
    icon: string,
    banner: string,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::update_link`,
      arguments: [
        txb.object(profileId),
        txb.pure.u64(linkId),
        txb.pure.string(title),
        txb.pure.string(url),
        txb.pure.string(icon),
        txb.pure.string(banner),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    return {
      digest: result?.digest || '',
    };
  }

  // Delete a link with dapp-kit
  async deleteLinkWithDappKit(
    profileId: string,
    linkId: number,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::delete_link`,
      arguments: [
        txb.object(profileId),
        txb.pure.u64(linkId),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    return {
      digest: result?.digest || '',
    };
  }

  // Toggle link active status with dapp-kit
  async toggleLinkWithDappKit(
    profileId: string,
    linkId: number,
    isActive: boolean,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::toggle_link`,
      arguments: [
        txb.object(profileId),
        txb.pure.u64(linkId),
        txb.pure.bool(isActive),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    return {
      digest: result?.digest || '',
    };
  }

  // Reorder link with dapp-kit
  async reorderLinkWithDappKit(
    profileId: string,
    linkId: number,
    newOrder: number,
    signAndExecuteTransaction: any
  ): Promise<{ digest: string }> {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${this.packageId}::${this.moduleName}::reorder_link`,
      arguments: [
        txb.object(profileId),
        txb.pure.u64(linkId),
        txb.pure.u64(newOrder),
      ],
    });

    const result = await signAndExecuteTransaction({
      transaction: txb,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    });

    return {
      digest: result?.digest || '',
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
          username: fields.username,
          display_name: fields.display_name,
          bio: fields.bio,
          image_url: fields.image_url,
          subdomain: fields.subdomain,
          link_ids: fields.link_ids || [],
          link_count: fields.link_count || 0,
        };
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    return null;
  }

  // Get link data from profile
  async getLink(profileId: string, linkId: number): Promise<Link | null> {
    try {
      const object = await this.client.getObject({
        id: profileId,
        options: {
          showContent: true,
        },
      });

      if (object.data?.content && 'fields' in object.data.content) {
        // const fields = object.data.content.fields as any;
        
        // Dynamic field'dan link'i al
        const dynamicFields = await this.client.getDynamicFields({
          parentId: profileId,
        });

        const linkField = dynamicFields.data.find(
          (field: any) => field.name.fields.id === linkId
        );

        if (linkField) {
          const linkObject = await this.client.getObject({
            id: linkField.objectId,
            options: {
              showContent: true,
            },
          });

          if (linkObject.data?.content && 'fields' in linkObject.data.content) {
            const linkFields = linkObject.data.content.fields as any;
            return {
              id: linkId,
              title: linkFields.title,
              url: linkFields.url,
              icon: linkFields.icon,
              banner: linkFields.banner,
              is_active: linkFields.is_active,
              order: linkFields.order,
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching link:', error);
    }
    return null;
  }

  // Get all links for a profile
  async getProfileLinks(profileId: string): Promise<Link[]> {
    try {
      const profile = await this.getProfile(profileId);
      if (!profile) return [];

      const links: Link[] = [];
      
      for (const linkId of profile.link_ids) {
        const link = await this.getLink(profileId, linkId);
        if (link) {
          links.push(link);
        }
      }

      // Order by order field
      return links.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error('Error fetching profile links:', error);
      return [];
    }
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

  // Listen for LinkAdded events
  async listenForLinkAdded(
    callback: (event: LinkAddedEvent) => void
  ): Promise<() => void> {
    const subscription = await this.client.subscribeEvent({
      filter: {
        MoveEventType: `${this.packageId}::${this.moduleName}::LinkAdded`,
      },
      onMessage: (event) => {
        const parsedEvent = event.parsedJson as LinkAddedEvent;
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