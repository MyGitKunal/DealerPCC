export type UserRole =
  | "service_manager"
  | "warranty_manager"
  | "master_technician"
  | "manufacturer_admin"
  | "super_admin";

export type AccountType = "dealer" | "manufacturer";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  accountType: AccountType;
  dealerName?: string;
  brand?: string;
  kvps?: string;
}

export interface DealerAccessRequest {
  id: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  brand: string;
  dealerWorkshopCode: string;
  dealerName: string;
  employeeFullName: string;
  officialDealerEmail: string;
  officialMobileNumber: string;
  role: string;
  locationBranch: string;
  employeeId: string;
  termsAgreed: boolean;
  mfgDetails?: string;
  preferredUsername?: string;
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
}
