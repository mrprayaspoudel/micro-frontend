# Task Module

A comprehensive Jira-style task management system for the Union Products micro-frontend architecture.

## Overview

This module provides a complete task/ticket management solution with role-based access control, similar to Jira. It supports creating tickets, assigning them to users, workflow management with customizable stages, and real-time notifications.

## Features

### For All Users
- **Dashboard**: Overview of tickets, statistics, and quick actions
- **Create Tickets**: Create new task tickets with priority, due dates, tags, and estimated hours
- **My Tickets**: Kanban board view of personally assigned tickets with drag-and-drop stage management
- **Ticket Queue**: AWS Connect-style interface to pick up assigned tickets from a queue

### For Managers
- **Unassigned Pool**: View all unassigned tickets waiting to be assigned
- **Assign Tickets**: Assign tickets from the pool to team members
- **All Tickets View**: Overview of all tickets with filtering by user and status
- **Team Management**: Monitor all team members' tickets and workload

### For Administrators
- **Stage Management**: Create and customize workflow stages (TODO, In Progress, Review, Done, etc.)
- **Stage Configuration**: Set stage names, colors, order, and descriptions per company

## User Roles

1. **User**: Regular team member
   - Create tickets
   - View and pick up assigned tickets
   - Move tickets through workflow stages
   - Reroute tickets back to manager with reasoning

2. **Manager**: Team lead or project manager
   - All user capabilities
   - Assign tickets to team members
   - View all team tickets
   - Access unassigned ticket pool

3. **Admin**: System administrator
   - All manager capabilities
   - Create and manage workflow stages
   - Configure company-specific workflows

## Ticket Workflow

1. **Creation**: User creates a ticket → Status: `NOT_ASSIGNED`
2. **Assignment**: Manager assigns to user → Status: `ASSIGNED` → Notification sent
3. **Queue**: Ticket appears in user's queue → Status: `IN_QUEUE`
4. **Pickup**: User picks up ticket → Status: `PICKED`
5. **Work**: User moves ticket through stages (TODO → In Progress → Review → Done)
6. **Reroute**: User can reroute back to manager with reason → Status: `REROUTED`
7. **Completion**: Ticket reaches final stage → Status: `COMPLETED`

## Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Zustand** for state management
- **React Router** for navigation
- **@dnd-kit** for drag-and-drop kanban functionality
- **date-fns** for date formatting
- **Vite** with Module Federation for micro-frontend architecture

## Project Structure

```
task-module/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── KanbanColumn.tsx
│   │   ├── NotificationBadge.tsx
│   │   └── TicketCard.tsx
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── CreateTicket.tsx
│   │   ├── TicketQueue.tsx    # User: Pick up tickets
│   │   ├── MyTickets.tsx      # User: Active tickets
│   │   ├── TicketPool.tsx     # Manager: Unassigned pool
│   │   ├── AssignTickets.tsx  # Manager: Assign tickets
│   │   ├── AllTicketsView.tsx # Manager: All tickets
│   │   └── StageManagement.tsx # Admin: Manage stages
│   ├── stores/             # Zustand state management
│   │   ├── authStore.ts
│   │   ├── ticketStore.ts
│   │   ├── stageStore.ts
│   │   └── notificationStore.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── theme.ts            # MUI theme configuration
├── backends/               # Mock backend data
│   └── task/
│       ├── 1.json          # Company 1 data
│       ├── 2.json          # Company 2 data
│       └── 3.json          # Company 3 data
└── package.json
```

## Installation

1. Navigate to the module directory:
   ```bash
   cd apps/task-module
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The module will be available at `http://localhost:3005`

## Integration with Host App

The module is integrated into the host application through:

1. **Module Registry** (`host/src/utils/ModuleRegistry.ts`)
2. **Module Federation** (Vite plugin configuration)
3. **Backend Data** (`backends/task/*.json`)
4. **Menu Configuration** (`backends/module-menus.json`)
5. **Company Module Access** (`backends/companies.json`)

## API Endpoints (Mock)

- `GET /task/{companyId}.json` - Get all tickets, stages, and notifications for a company

## Data Models

### Ticket
```typescript
{
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'not-assigned' | 'assigned' | 'in-queue' | 'picked' | 'completed' | 'rerouted';
  stageId: string | null;
  createdBy: string;
  assignedTo: string | null;
  pickedBy: string | null;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
  companyId: string;
}
```

### Stage
```typescript
{
  id: string;
  name: string;
  order: number;
  color: string;
  description?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Notification
```typescript
{
  id: string;
  userId: string;
  ticketId: string;
  type: 'assigned' | 'rerouted' | 'completed' | 'updated' | 'commented';
  message: string;
  read: boolean;
  createdAt: string;
}
```

## Features in Detail

### Kanban Board
- Drag-and-drop tickets between workflow stages
- Visual representation of ticket progress
- Color-coded stages for easy identification

### Notification System
- Real-time notifications for ticket assignments
- Badge showing unread notification count
- Notification history with read/unread status

### Ticket Management
- Priority levels (Low, Medium, High, Urgent)
- Tags for categorization
- Due dates and time tracking
- Rich text descriptions
- File attachments support (planned)

### Role-Based Access
- Different views and capabilities per role
- Route-level access control
- Feature-level permissions

## Future Enhancements

- [ ] Comments and collaboration
- [ ] File attachments
- [ ] Ticket history/audit log
- [ ] Advanced filtering and search
- [ ] Email notifications
- [ ] Sprint planning
- [ ] Burndown charts
- [ ] Time tracking enhancements
- [ ] Custom fields
- [ ] Ticket templates

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## License

Part of the Union Products micro-frontend system.
