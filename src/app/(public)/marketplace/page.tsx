import { MarketplaceProvider } from '@/domains/marketplace/components/MarketplaceProvider';
import { MarketplaceView } from '@/domains/marketplace/components/MarketplaceView';
import { AuthProvider } from '@/core/shared/auth/AuthProvider';

export default function PublicMarketplacePage() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <MarketplaceView />
      </MarketplaceProvider>
    </AuthProvider>
  );
}






