import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, MenuBar, SafeWrapper } from '@shared/ui-components';
import { useAppStore } from '@shared/state';
import { taskTheme } from './theme';

// Pages
import { Dashboard } from './pages/Dashboard';
import { CreateTicket } from './pages/CreateTicket';
import { TicketQueue } from './pages/TicketQueue';
import { MyTickets } from './pages/MyTickets';
import { TicketPool } from './pages/TicketPool';
import { AssignTickets } from './pages/AssignTickets';
import { AllTicketsView } from './pages/AllTicketsView';
import { StageManagement } from './pages/StageManagement';

interface TaskAppProps {
  basename?: string;
}

const TaskApp = ({ basename }: TaskAppProps) => {
  const { initializeAppState } = useAppStore();
  
  // Initialize app state when Task module loads
  useEffect(() => {
    initializeAppState();
  }, [initializeAppState]);

  // Check if we're running as a standalone app or as a micro frontend
  const currentPort = window.location.port;
  const isStandalone = currentPort === '3005';
  
  const AppContent = () => {
    const location = useLocation();
    
    return (
      <SafeWrapper fallback={<div>Loading Task Module...</div>}>
        <ThemeProvider moduleTheme={taskTheme}>
          <div className="task-app">
            <MenuBar 
              moduleId="task" 
              currentPath={location.pathname}
            />
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="create-ticket" element={<CreateTicket />} />
              <Route path="ticket-queue" element={<TicketQueue />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="ticket-pool" element={<TicketPool />} />
              <Route path="assign-tickets" element={<AssignTickets />} />
              <Route path="all-tickets" element={<AllTicketsView />} />
              <Route path="stage-management" element={<StageManagement />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </ThemeProvider>
      </SafeWrapper>
    );
  };

  // Use BrowserRouter with /task basename when running standalone
  if (isStandalone) {
    return (
      <BrowserRouter basename="/task">
        <AppContent />
      </BrowserRouter>
    );
  }

  // When embedded in host, just return content (host router handles navigation)
  return <AppContent />;
};

export default TaskApp;
