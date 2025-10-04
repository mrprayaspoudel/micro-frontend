import { MockApiService } from '../api/client';

/**
 * Service for accessing CRM data specific to a company
 */
export class CRMService {
  /**
   * Load CRM data for the selected company
   */
  static async loadCompanyCRMData(companyId: string) {
    return await MockApiService.get<any>(`/crm/${companyId}`);
  }

  /**
   * Get customers for a company
   */
  static async getCustomers(companyId: string) {
    const crmData = await this.loadCompanyCRMData(companyId);
    return crmData.customers || [];
  }

  /**
   * Get leads for a company
   */
  static async getLeads(companyId: string) {
    const crmData = await this.loadCompanyCRMData(companyId);
    return crmData.leads || [];
  }

  /**
   * Get opportunities for a company
   */
  static async getOpportunities(companyId: string) {
    const crmData = await this.loadCompanyCRMData(companyId);
    return crmData.opportunities || [];
  }

  /**
   * Get activities for a company
   */
  static async getActivities(companyId: string) {
    const crmData = await this.loadCompanyCRMData(companyId);
    return crmData.activities || [];
  }
}

/**
 * Service for accessing HR data specific to a company
 */
export class HRService {
  /**
   * Load HR data for the selected company
   */
  static async loadCompanyHRData(companyId: string) {
    return await MockApiService.get<any>(`/hr/${companyId}`);
  }

  /**
   * Get employees for a company
   */
  static async getEmployees(companyId: string) {
    const hrData = await this.loadCompanyHRData(companyId);
    return hrData.employees || [];
  }

  /**
   * Get attendance records for a company
   */
  static async getAttendance(companyId: string) {
    const hrData = await this.loadCompanyHRData(companyId);
    return hrData.attendance || [];
  }

  /**
   * Get leave requests for a company
   */
  static async getLeaveRequests(companyId: string) {
    const hrData = await this.loadCompanyHRData(companyId);
    return hrData.leaveRequests || [];
  }

  /**
   * Get departments for a company
   */
  static async getDepartments(companyId: string) {
    const hrData = await this.loadCompanyHRData(companyId);
    return hrData.departments || [];
  }
}

/**
 * Service for accessing Finance data specific to a company
 */
export class FinanceService {
  /**
   * Load Finance data for the selected company
   */
  static async loadCompanyFinanceData(companyId: string) {
    return await MockApiService.get<any>(`/finance/${companyId}`);
  }

  /**
   * Get accounts for a company
   */
  static async getAccounts(companyId: string) {
    const financeData = await this.loadCompanyFinanceData(companyId);
    return financeData.accounts || [];
  }

  /**
   * Get invoices for a company
   */
  static async getInvoices(companyId: string) {
    const financeData = await this.loadCompanyFinanceData(companyId);
    return financeData.invoices || [];
  }

  /**
   * Get expenses for a company
   */
  static async getExpenses(companyId: string) {
    const financeData = await this.loadCompanyFinanceData(companyId);
    return financeData.expenses || [];
  }

  /**
   * Get budgets for a company
   */
  static async getBudgets(companyId: string) {
    const financeData = await this.loadCompanyFinanceData(companyId);
    return financeData.budgets || [];
  }
}

/**
 * Service for accessing Inventory data specific to a company
 */
export class InventoryService {
  /**
   * Load Inventory data for the selected company
   */
  static async loadCompanyInventoryData(companyId: string) {
    return await MockApiService.get<any>(`/inventory/${companyId}`);
  }

  /**
   * Get products for a company
   */
  static async getProducts(companyId: string) {
    const inventoryData = await this.loadCompanyInventoryData(companyId);
    return inventoryData.products || [];
  }

  /**
   * Get stock movements for a company
   */
  static async getStockMovements(companyId: string) {
    const inventoryData = await this.loadCompanyInventoryData(companyId);
    return inventoryData.stockMovements || [];
  }

  /**
   * Get suppliers for a company
   */
  static async getSuppliers(companyId: string) {
    const inventoryData = await this.loadCompanyInventoryData(companyId);
    return inventoryData.suppliers || [];
  }

  /**
   * Get warehouses for a company
   */
  static async getWarehouses(companyId: string) {
    const inventoryData = await this.loadCompanyInventoryData(companyId);
    return inventoryData.warehouses || [];
  }
}
