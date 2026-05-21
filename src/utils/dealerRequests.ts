import type { DealerAccessRequest } from "@/types";

const STORAGE_KEY = "dealerAccessRequests";
const APPROVED_USERS_KEY = "approvedDealerUsers";

function generateId(): string {
  return "REQ-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function createAccessRequest(data: Omit<DealerAccessRequest, "id" | "requestDate" | "status">): DealerAccessRequest {
  const request: DealerAccessRequest = {
    ...data,
    id: generateId(),
    requestDate: new Date().toISOString(),
    status: "pending",
  };

  const existing = getAccessRequests();
  existing.push(request);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return request;
}

export function getAccessRequests(): DealerAccessRequest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getPendingRequests(): DealerAccessRequest[] {
  return getAccessRequests().filter((r) => r.status === "pending");
}

export function approveRequest(
  id: string,
  mfgDetails: string,
  preferredUsername: string,
  initialPassword: string,
  approvedBy: string
): DealerAccessRequest | null {
  const requests = getAccessRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  requests[idx] = {
    ...requests[idx],
    status: "approved",
    mfgDetails,
    preferredUsername,
    approvedBy,
    approvalDate: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));

  // Create user account
  const req = requests[idx];
  const approvedUsers = JSON.parse(localStorage.getItem(APPROVED_USERS_KEY) || "[]");
  approvedUsers.push({
    id: "USR-" + Date.now(),
    username: preferredUsername,
    email: req.officialDealerEmail,
    password: initialPassword,
    role: mapRole(req.role),
    accountType: "dealer",
    dealerName: req.dealerName,
    brand: req.brand,
    kvps: req.dealerWorkshopCode,
  });
  localStorage.setItem(APPROVED_USERS_KEY, JSON.stringify(approvedUsers));

  return requests[idx];
}

export function rejectRequest(id: string, reason: string): DealerAccessRequest | null {
  const requests = getAccessRequests();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  requests[idx] = {
    ...requests[idx],
    status: "rejected",
    rejectionReason: reason,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  return requests[idx];
}

function mapRole(role: string): string {
  const map: Record<string, string> = {
    "Service Head/Service Manager": "service_manager",
    "Warranty Manager": "warranty_manager",
    "Master Technician": "master_technician",
  };
  return map[role] || "service_manager";
}
