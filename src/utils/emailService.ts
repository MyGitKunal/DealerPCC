const EMAIL_LOG_KEY = "sentEmails";

interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  type: "approval" | "rejection";
}

export function sendApprovalEmail(
  to: string,
  employeeName: string,
  username: string,
  password: string,
  dealerName: string
): void {
  const email: EmailLog = {
    id: "EMAIL-" + Date.now(),
    to,
    subject: "Your Dealer Portal Access has been Approved",
    body: `Dear ${employeeName},\n\nYour access request for the Škoda | Volkswagen Dealer Portal has been approved.\n\nLogin Credentials:\nUsername: ${username}\nTemporary Password: ${password}\n\nDealer: ${dealerName}\nPortal: ${window.location.origin}/login\n\nPlease change your password after first login.\n\nRegards,\nManufacturer Admin Team`,
    sentAt: new Date().toISOString(),
    type: "approval",
  };

  logEmail(email);
  console.log("[Email Service] Approval email sent to:", to, email);
}

export function sendRejectionEmail(to: string, employeeName: string, reason: string): void {
  const email: EmailLog = {
    id: "EMAIL-" + Date.now(),
    to,
    subject: "Dealer Portal Access Request Update",
    body: `Dear ${employeeName},\n\nWe regret to inform you that your access request for the Škoda | Volkswagen Dealer Portal has been rejected.\n\nReason: ${reason}\n\nIf you have questions, please contact support.\n\nRegards,\nManufacturer Admin Team`,
    sentAt: new Date().toISOString(),
    type: "rejection",
  };

  logEmail(email);
  console.log("[Email Service] Rejection email sent to:", to, email);
}

function logEmail(email: EmailLog): void {
  try {
    const logs: EmailLog[] = JSON.parse(localStorage.getItem(EMAIL_LOG_KEY) || "[]");
    logs.push(email);
    localStorage.setItem(EMAIL_LOG_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}
