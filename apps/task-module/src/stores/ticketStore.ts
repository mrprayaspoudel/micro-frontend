import { create } from 'zustand';
import { Ticket, TicketStatus, TicketPriority, TicketFilter } from '../types';

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  filter: TicketFilter;
  
  // Actions
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  assignTicket: (ticketId: string, userId: string) => void;
  pickTicket: (ticketId: string, userId: string) => void;
  rerouteTicket: (ticketId: string, reason: string) => void;
  moveTicketToStage: (ticketId: string, stageId: string) => void;
  setFilter: (filter: Partial<TicketFilter>) => void;
  clearFilter: () => void;
  fetchTickets: () => Promise<void>;
  getTicketById: (id: string) => Ticket | undefined;
  getTicketsByStatus: (status: TicketStatus) => Ticket[];
  getTicketsByAssignee: (userId: string) => Ticket[];
  getTicketsByStage: (stageId: string) => Ticket[];
  getUnassignedTickets: () => Ticket[];
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,
  filter: {},

  setTickets: (tickets) => set({ tickets }),

  addTicket: (ticket) => set((state) => ({
    tickets: [...state.tickets, ticket],
  })),

  updateTicket: (id, updates) => set((state) => ({
    tickets: state.tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket
    ),
  })),

  deleteTicket: (id) => set((state) => ({
    tickets: state.tickets.filter((ticket) => ticket.id !== id),
  })),

  assignTicket: (ticketId, userId) => set((state) => ({
    tickets: state.tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            assignedTo: userId,
            status: TicketStatus.ASSIGNED,
            updatedAt: new Date().toISOString(),
          }
        : ticket
    ),
  })),

  pickTicket: (ticketId, userId) => set((state) => ({
    tickets: state.tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            pickedBy: userId,
            status: TicketStatus.PICKED,
            updatedAt: new Date().toISOString(),
          }
        : ticket
    ),
  })),

  rerouteTicket: (ticketId, reason) => set((state) => ({
    tickets: state.tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            status: TicketStatus.REROUTED,
            assignedTo: null,
            pickedBy: null,
            updatedAt: new Date().toISOString(),
          }
        : ticket
    ),
  })),

  moveTicketToStage: (ticketId, stageId) => set((state) => ({
    tickets: state.tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            stageId,
            updatedAt: new Date().toISOString(),
          }
        : ticket
    ),
  })),

  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter },
  })),

  clearFilter: () => set({ filter: {} }),

  fetchTickets: async () => {
    set({ loading: true, error: null });
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || '1';
      const response = await fetch(`http://localhost:3000/task/${companyId}.json`);
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data = await response.json();
      set({ tickets: data.tickets || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  getTicketById: (id) => {
    return get().tickets.find((ticket) => ticket.id === id);
  },

  getTicketsByStatus: (status) => {
    return get().tickets.filter((ticket) => ticket.status === status);
  },

  getTicketsByAssignee: (userId) => {
    return get().tickets.filter((ticket) => ticket.assignedTo === userId || ticket.pickedBy === userId);
  },

  getTicketsByStage: (stageId) => {
    return get().tickets.filter((ticket) => ticket.stageId === stageId);
  },

  getUnassignedTickets: () => {
    return get().tickets.filter((ticket) => ticket.status === TicketStatus.NOT_ASSIGNED);
  },
}));
