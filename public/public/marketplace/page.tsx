import { MarketplaceProvider } from '@/domains/marketplace/components/MarketplaceProvider';
import { MarketplaceView } from '@/domains/marketplace/components/MarketplaceView';

export default function PublicMarketplacePage() {
  return (
    <MarketplaceProvider>
      <MarketplaceView />
    </MarketplaceProvider>
  );
}




