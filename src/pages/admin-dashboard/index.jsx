import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdministrativeSidebar from '../../components/AdministrativeSidebar';
import AdministrativeContextHeader from '../../components/AdministrativeContextHeader';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import PerformanceMetricsCard from './components/PerformanceMetricsCard';
import SystemHealthCard from './components/SystemHealthCard';
import PIIMaskingControlCard from './components/PIIMaskingControlCard';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecentActivityFeed from './components/RecentActivityFeed';
import { getChatStatistics, getSystemHealth, getPIIMaskingMetrics, exportForTraining } from '../../services/chatStorageService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [statistics, setStatistics] = useState({
    totalChats: 0,
    activeChats: 0,
    dailyInteractions: 0,
    piiMaskingRate: 0,
    avgResponseTime: '0s',
    escalationRate: 0,
    satisfactionScore: 0
  });
  const [systemHealth, setSystemHealth] = useState({
    status: 'operational',
    apiStatus: 'healthy',
    databaseStatus: 'healthy',
    uptime: '99.9%',
    lastIncident: 'None in last 30 days'
  });
  const [piiMetrics, setPiiMetrics] = useState({
    totalScanned: 0,
    piiDetected: 0,
    maskingEffectiveness: 100,
    falsePositives: 0,
    detectionAccuracy: 98
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [stats, health, piiData] = await Promise.all([
        getChatStatistics(),
        getSystemHealth(),
        getPIIMaskingMetrics()
      ]);
      
      setStatistics(stats);
      setSystemHealth(health);
      setPiiMetrics(piiData);
      
      // Load recent activity
      const activities = [
        {
          id: 1,
          type: 'chat_complete',
          message: 'Customer chat session completed successfully',
          timestamp: new Date(Date.now() - 300000),
          severity: 'info'
        },
        {
          id: 2,
          type: 'pii_masked',
          message: 'Phone number masked in conversation CONV-2025-156',
          timestamp: new Date(Date.now() - 600000),
          severity: 'success'
        },
        {
          id: 3,
          type: 'escalation',
          message: 'Chat escalated to human agent - High priority',
          timestamp: new Date(Date.now() - 1200000),
          severity: 'warning'
        },
        {
          id: 4,
          type: 'system',
          message: 'System health check passed - All services operational',
          timestamp: new Date(Date.now() - 1800000),
          severity: 'info'
        }
      ];
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'view_logs': navigate('/chat-log-viewer');
        break;
      case 'export_data':
        handleExportData();
        break;
      case 'configure_pii': 
        navigate('/pii-configuration');
        break;
      case 'system_health': 
        alert('Detailed system health diagnostics are coming soon!');
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  const handleExportData = () => {
    try {
      const data = exportForTraining();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `training_data_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdministrativeSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div
        className={`main-content with-admin-sidebar ${
          isSidebarCollapsed ? 'collapsed' : ''
        } with-admin-header transition-all duration-300`}
      >
        <AdministrativeContextHeader />

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Central command center for restaurant AI support system management
            </p>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Active Chats</span>
                <Icon name="MessageSquare" size={20} className="text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : statistics?.activeChats}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Real-time sessions</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Daily Interactions</span>
                <Icon name="Activity" size={20} className="text-success" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : statistics?.dailyInteractions}
              </div>
              <p className="text-xs text-success mt-1">↑ 12% from yesterday</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">PII Masking Rate</span>
                <Icon name="Shield" size={20} className="text-warning" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : `${statistics?.piiMaskingRate}%`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Effectiveness rate</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Response Accuracy</span>
                <Icon name="Target" size={20} className="text-info" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {isLoading ? '...' : `${statistics?.satisfactionScore}%`}
              </div>
              <p className="text-xs text-muted-foreground mt-1">AI response quality</p>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Performance Metrics */}
            <div className="lg:col-span-2">
              <PerformanceMetricsCard
                statistics={statistics}
                isLoading={isLoading}
              />
            </div>

            {/* System Health */}
            <div className="lg:col-span-1">
              <SystemHealthCard
                systemHealth={systemHealth}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* PII Masking & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* PII Masking Control */}
            <div className="lg:col-span-2">
              <PIIMaskingControlCard
                piiMetrics={piiMetrics}
                isLoading={isLoading}
                onViewLogs={() => navigate('/chat-log-viewer')}
                onConfigureRules={() => navigate('/pii-configuration')}
              />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActionsPanel onActionClick={handleQuickAction} />
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="mb-6">
            <RecentActivityFeed
              activities={recentActivity}
              isLoading={isLoading}
            />
          </div>

          {/* Administrative Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              iconName="Database"
              onClick={() => navigate('/chat-log-viewer')}
            >
              <span className="font-semibold mb-1">Chat Log Viewer</span>
              <span className="text-xs text-muted-foreground">
                Review and analyze customer interactions
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              iconName="Settings"
              onClick={() => navigate('/pii-configuration')}
            >
              <span className="font-semibold mb-1">PII Configuration</span>
              <span className="text-xs text-muted-foreground">
                Manage masking rules and detection
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex-col"
              iconName="Download"
              onClick={handleExportData}
            >
              <span className="font-semibold mb-1">Bulk Export</span>
              <span className="text-xs text-muted-foreground">
                Export all chat data for training
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;