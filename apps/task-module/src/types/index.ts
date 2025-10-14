export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TicketStatus {
  NOT_ASSIGNED = 'not-assigned',
  ASSIGNED = 'assigned',
  IN_QUEUE = 'in-queue',
  PICKED = 'picked',
  COMPLETED = 'completed',
  REROUTED = 'rerouted',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Stage {
  id: string;
  name: string;
  order: number;
  color: string;
  description?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  stageId: string | null;
  createdBy: string;
  assignedTo: string | null;
  pickedBy: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  attachments?: string[];
  estimatedHours?: number;
  actualHours?: number;
  companyId: string;
}

export interface Assignment {
  id: string;
  ticketId: string;
  assignedBy: string;
  assignedTo: string;
  assignedAt: string;
  note?: string;
}

export interface Notification {
  id: string;
  userId: string;
  ticketId: string;
  type: 'assigned' | 'rerouted' | 'completed' | 'updated' | 'commented';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RerouteRequest {
  id: string;
  ticketId: string;
  requestedBy: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  respondedBy?: string;
  respondedAt?: string;
  response?: string;
}

export interface TicketFilter {
  status?: TicketStatus[];
  priority?: TicketPriority[];
  assignedTo?: string[];
  stageId?: string[];
  createdBy?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface KanbanColumn {
  id: string;
  stage: Stage;
  tickets: Ticket[];
}

export interface DashboardStats {
  totalTickets: number;
  assignedTickets: number;
  completedTickets: number;
  myTickets: number;
  pendingAssignments: number;
  inQueueTickets: number;
}
