// Excel Import Service
export interface ExcelImportSession {
  id: string;
  filename: string;
  totalRows: number;
  processedRows: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  errors: ExcelImportError[];
}

export interface ExcelImportError {
  row: number;
  column: string;
  message: string;
  value?: any;
}

export interface ExcelRowData {
  [key: string]: any;
}

export interface ExcelSearchResult {
  sessions: ExcelImportSession[];
  total: number;
}

class ExcelImportService {
  private sessions: Map<string, ExcelImportSession> = new Map();

  // Session management
  async createSession(filename: string, totalRows: number): Promise<string> {
    const sessionId = this.generateSessionId();
    const session: ExcelImportSession = {
      id: sessionId,
      filename,
      totalRows,
      processedRows: 0,
      status: 'pending',
      createdAt: new Date(),
      errors: []
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  async getSession(sessionId: string): Promise<ExcelImportSession | null> {
    return this.sessions.get(sessionId) || null;
  }

  async getAllSessions(): Promise<ExcelImportSession[]> {
    return Array.from(this.sessions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async searchSessions(query: string): Promise<ExcelSearchResult> {
    const allSessions = await this.getAllSessions();
    const filteredSessions = allSessions.filter(session =>
      session.filename.toLowerCase().includes(query.toLowerCase()) ||
      session.id.includes(query) ||
      session.status.includes(query)
    );

    return {
      sessions: filteredSessions,
      total: filteredSessions.length
    };
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }

  // File processing
  async processExcelFile(file: File, sessionId: string): Promise<ExcelImportSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.status = 'processing';
    this.sessions.set(sessionId, session);

    try {
      // Mock file processing
      const data = await this.parseExcelFile(file);
      await this.processData(data, session);
      
      session.status = 'completed';
      session.completedAt = new Date();
    } catch (error) {
      session.status = 'failed';
      session.errors.push({
        row: -1,
        column: 'general',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }

    this.sessions.set(sessionId, session);
    return session;
  }

  private async parseExcelFile(file: File): Promise<ExcelRowData[]> {
    // Mock Excel parsing - in real implementation would use a library like xlsx
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0]?.split(',') || [];
    
    const data: ExcelRowData[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const row: ExcelRowData = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }

    return data;
  }

  private async processData(data: ExcelRowData[], session: ExcelImportSession): Promise<void> {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // +2 because we start from 1 and skip header

      try {
        await this.processRow(row, rowNumber, session);
        session.processedRows++;
      } catch (error) {
        session.errors.push({
          row: rowNumber,
          column: 'general',
          message: error instanceof Error ? error.message : 'Failed to process row'
        });
      }

      // Update session progress
      this.sessions.set(session.id, { ...session });
    }
  }

  private async processRow(row: ExcelRowData, rowNumber: number, session: ExcelImportSession): Promise<void> {
    // Mock row processing - validate and import data
    const validationErrors = this.validateRow(row, rowNumber);
    
    if (validationErrors.length > 0) {
      session.errors.push(...validationErrors);
      return;
    }

    // Mock data import
    console.log(`Processing row ${rowNumber}:`, row);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  private validateRow(row: ExcelRowData, rowNumber: number): ExcelImportError[] {
    const errors: ExcelImportError[] = [];

    // Example validation rules
    if (!row.name || row.name.trim() === '') {
      errors.push({
        row: rowNumber,
        column: 'name',
        message: 'Name is required',
        value: row.name
      });
    }

    if (row.email && !this.isValidEmail(row.email)) {
      errors.push({
        row: rowNumber,
        column: 'email',
        message: 'Invalid email format',
        value: row.email
      });
    }

    if (row.phone && !this.isValidPhone(row.phone)) {
      errors.push({
        row: rowNumber,
        column: 'phone',
        message: 'Invalid phone format',
        value: row.phone
      });
    }

    return errors;
  }

  // Import templates
  async getImportTemplates(): Promise<string[]> {
    return [
      'customers',
      'products',
      'orders',
      'inventory',
      'suppliers',
      'employees'
    ];
  }

  async generateTemplate(type: string): Promise<string> {
    const templates = {
      customers: 'name,email,phone,company,address\nJohn Doe,john@example.com,+1234567890,Acme Corp,123 Main St',
      products: 'sku,name,category,price,stock\nPROD001,Widget,Electronics,29.99,100',
      orders: 'order_id,customer_email,product_sku,quantity,date\nORD001,john@example.com,PROD001,2,2024-02-15',
      inventory: 'sku,current_stock,minimum_stock,location\nPROD001,100,10,Warehouse A',
      suppliers: 'name,email,phone,products\nSupplier Inc,supplier@example.com,+1987654321,Electronics',
      employees: 'name,email,department,position,salary\nJane Smith,jane@example.com,IT,Developer,75000'
    };

    return templates[type as keyof typeof templates] || 'Invalid template type';
  }

  // Utility methods
  private generateSessionId(): string {
    return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[-\s\(\)]/g, ''));
  }

  // Statistics
  async getImportStats(): Promise<{
    totalSessions: number;
    completedSessions: number;
    failedSessions: number;
    totalRowsProcessed: number;
  }> {
    const sessions = await this.getAllSessions();
    
    return {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      failedSessions: sessions.filter(s => s.status === 'failed').length,
      totalRowsProcessed: sessions.reduce((sum, s) => sum + s.processedRows, 0)
    };
  }
}

// Export singleton instance
export const excelImportService = new ExcelImportService();

export default excelImportService;


export { ExcelImportService };


