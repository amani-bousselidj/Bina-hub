// Mock Medusa services for development
export class OrderService {
  async list() {
    return [];
  }
  
  async retrieve(id: string) {
    return { id, status: 'pending' };
  }
  
  async create(data: any) {
    return { id: 'order_' + Date.now(), ...data };
  }
}

export class ProductService {
  async list() {
    return [];
  }
  
  async retrieve(id: string) {
    return { id, title: 'Sample Product' };
  }
  
  async create(data: any) {
    return { id: 'prod_' + Date.now(), ...data };
  }
}

export class InventoryService {
  async getInventoryItems() {
    return [];
  }
  
  async adjustInventory(itemId: string, adjustment: number) {
    return { id: itemId, adjustment };
  }
}


