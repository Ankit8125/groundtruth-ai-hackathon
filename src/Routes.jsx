import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ChatLogViewer from './pages/chat-log-viewer';
import CustomerChatInterface from './pages/customer-chat-interface';
import AdminDashboard from './pages/admin-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CustomerChatInterface />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/chat-log-viewer" element={<ChatLogViewer />} />
        <Route path="/customer-chat-interface" element={<CustomerChatInterface />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
