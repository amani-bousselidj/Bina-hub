import { Order, Warranty, Project, ProjectPurchase } from '@/core/shared/types/types';
import { ProjectTrackingService } from './project';
import { BaseService } from './base-service';

export interface PurchaseAllocation {
  projectId: string;
  projectName: string;
  quantity: number;
  cost: number;
}

export interface PurchaseAssignmentDialog {
  show: boolean;
  order: Order | null;
  availableProjects: Project[];
  allocations: PurchaseAllocation[];
}

export class ProjectPurchaseService extends BaseService {
  // Get all active projects for purchase assignment
  static async getAvailableProjects(): Promise<Project[]> {
    try {
      const projects = await ProjectTrackingService.getProjects();
      return projects.filter(p => p.status !== 'completed');
    } catch (error) {
      console.error('Error getting available projects:', error);
      return [];
    }
  }

  // Auto-assign purchase to project if only one active project exists
  static async autoAssignPurchase(order: Order): Promise<boolean> {
    const availableProjects = await this.getAvailableProjects();
    
    if (availableProjects.length === 1) {
      const project = availableProjects[0];
      await this.assignOrderToProject(order, project.id);
      return true;
    }
    
    return false; // Multiple projects - need user selection
  }

  // Assign order to specific project
  static async assignOrderToProject(order: Order, projectId: string, allocation?: PurchaseAllocation[]): Promise<void> {
    try {
      // If no allocation specified, assign entire order to project
      if (!allocation) {
        const projectPurchase: ProjectPurchase = {
          id: `purchase-${Date.now()}`,
          projectId: projectId,
          orderId: order.id,
          materialName: order.items[0]?.name || '',
          quantity: order.items[0]?.quantity || 1,
          unit: 'قطعة',
          price: order.items[0]
            ? (order.items[0].price * order.items[0].quantity) / order.items[0].quantity
            : 0,
          totalCost: order.total_amount,
          purchase_date: order.createdAt.toISOString(),
          vendor: order.supplier_name || order.vendor || 'غير محدد',
          receipt_number: order.id,
          order_status: 'ordered'
        };

        await this.addPurchaseToProject(projectPurchase);
      } else {
        // Handle multiple project allocations
        for (const alloc of allocation) {
          const projectPurchase: ProjectPurchase = {
            id: `purchase-${Date.now()}-${alloc.projectId}`,
            projectId: alloc.projectId,
            orderId: order.id,
            materialName: order.items[0]?.name || '',
            quantity: alloc.quantity,
            unit: 'قطعة',
            price: alloc.quantity ? alloc.cost / alloc.quantity : 0,
            totalCost: alloc.cost,
            purchase_date: order.createdAt.toISOString(),
            vendor: order.supplier_name || order.vendor || 'غير محدد',
            receipt_number: order.id,
            order_status: 'ordered'
          };

          await this.addPurchaseToProject(projectPurchase);
        }
      }

      // Update order with project assignment
      await this.updateOrderWithProject(order.id, projectId);
    } catch (error) {
      console.error('Error assigning order to project:', error);
      throw error;
    }
  }

  // Add warranty to project purchase
  static async addWarrantyToPurchase(warranty: Warranty, projectId: string): Promise<void> {
    try {
      // Find the purchase related to this warranty
      const project = await ProjectTrackingService.getProjectById(projectId);
      if (!project?.purchases) return;

      const relatedPurchase = project.purchases.find(p => 
        (warranty.product_id && p.materialId === warranty.product_id) || 
        p.materialName.toLowerCase().includes(warranty.description.toLowerCase())
      );

      if (relatedPurchase) {
        // Update purchase with warranty info
        relatedPurchase.warranty_id = warranty.id;

        await this.updateProjectPurchase(relatedPurchase);
      }

      // Update warranty with project link
      await this.updateWarrantyWithProject(warranty.id, projectId);
    } catch (error) {
      console.error('Error adding warranty to purchase:', error);
      throw error;
    }
  }

  // Get purchases for a project with warranty status
  static async getProjectPurchasesWithWarranty(projectId: string): Promise<ProjectPurchase[]> {
    try {
      const project = await ProjectTrackingService.getProjectById(projectId);
      return project?.purchases || [];
    } catch (error) {
      console.error('Error getting project purchases:', error);
      return [];
    }
  }

  // Get warranty items for a project
  static async getProjectWarranties(projectId: string): Promise<Warranty[]> {
    try {
      // This would typically come from a warranty service
      // For now, return mock data
      return [];
    } catch (error) {
      console.error('Error getting project warranties:', error);
      return [];
    }
  }

  // Private helper methods
  private static async addPurchaseToProject(purchase: ProjectPurchase): Promise<void> {
    // This would integrate with the project tracking service
    // to add the purchase to the project
    console.log('Adding purchase to project:', purchase);
  }

  private static async updateProjectPurchase(purchase: ProjectPurchase): Promise<void> {
    // Update existing purchase
    console.log('Updating project purchase:', purchase);
  }

  private static async updateOrderWithProject(orderId: string, projectId: string): Promise<void> {
    // Update order to link with project
    console.log('Linking order to project:', orderId, projectId);
  }

  private static async updateWarrantyWithProject(warrantyId: string, projectId: string): Promise<void> {
    // Update warranty to link with project
    console.log('Linking warranty to project:', warrantyId, projectId);
  }
}

export const projectPurchaseService = new ProjectPurchaseService();
export default projectPurchaseService;


