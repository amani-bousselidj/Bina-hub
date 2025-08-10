import { useState, useEffect } from 'react';
import { UserService } from '../../../services/user';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button'; // Using existing casing
// Note: UserCard component will be created as part of the optimization
// import { UserCard } from '@/components/user/UserCard';

export const CustomerSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const userService = new UserService();
  
  // Search for customers using UserService
  const searchCustomers = async (query: string) => {
    // Implementation will use UserService to search users
    return { data: [], error: null };
  };
  
  const createOrder = async (orderData: any) => {
    // Implementation will use OrderService to create orders
    return { data: { id: 'temp-id' }, error: null };
  };
  
  // Search for customers using Supabase
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await searchCustomers(searchQuery);
      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create new order for selected customer
  const handleCreateOrder = async (customerId: string) => {
    try {
      const { data, error } = await createOrder({
        customer_id: customerId,
        status: 'draft',
        created_at: new Date().toISOString()
      });
      
      if (error) throw error;
      
      // Navigate to order details page
      window.location.href = `/store/orders/${data.id}`;
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  
  return (
    <div className="customer-search-container">
      <h2>Search Customers</h2>
      
      <div className="search-input-container flex gap-2 mb-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or phone"
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
      
      <div className="search-results">
        {searchResults.map((customer: any) => (
          <div key={customer.id} className="customer-card border p-4 rounded mb-2">
            <div className="customer-info">
              <h3 className="font-semibold">{customer.name}</h3>
              <p className="text-gray-600">{customer.email}</p>
              <p className="text-gray-600">{customer.phone}</p>
            </div>
            <div className="customer-actions mt-2">
              <Button 
                onClick={() => handleCreateOrder(customer.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Order
              </Button>
            </div>
          </div>
        ))}
        
        {searchResults.length === 0 && searchQuery && !isLoading && (
          <div className="no-results text-center py-8 text-gray-500">
            No customers found. Try a different search term.
          </div>
        )}
      </div>
    </div>
  );
};




