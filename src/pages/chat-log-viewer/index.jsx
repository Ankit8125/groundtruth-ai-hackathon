import React, { useState, useEffect } from 'react';
import AdministrativeSidebar from '../../components/AdministrativeSidebar';
import AdministrativeContextHeader from '../../components/AdministrativeContextHeader';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ConversationCard from './components/ConversationCard';
import ConversationDetail from './components/ConversationDetail';
import FilterPanel from './components/FilterPanel';
import { getConversations, exportForTraining } from '../../services/chatStorageService';

const ChatLogViewer = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    status: 'all',
    outlet: 'all',
    topic: 'all',
    satisfaction: 'all'
  });
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);

  // Load conversations from storage
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadConversations = () => {
    const allConversations = getConversations();
    setConversations(allConversations);
  };

  useEffect(() => {
    let filtered = [...conversations];

    if (filters?.search) {
      filtered = filtered?.filter(
        (conv) =>
          conv?.customerId?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
          conv?.lastMessage?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter((conv) => conv?.status === filters?.status);
    }

    if (filters?.outlet !== 'all') {
      filtered = filtered?.filter((conv) => conv?.outlet?.toLowerCase()?.includes(filters?.outlet?.toLowerCase()));
    }

    if (filters?.dateFrom) {
      filtered = filtered?.filter((conv) => new Date(conv.startTime) >= new Date(filters.dateFrom));
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter((conv) => new Date(conv.startTime) <= new Date(filters.dateTo));
    }

    setFilteredConversations(filtered);
  }, [filters, conversations]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      dateFrom: '',
      dateTo: '',
      status: 'all',
      outlet: 'all',
      topic: 'all',
      satisfaction: 'all'
    });
  };

  const handleExport = () => {
    const exportData = exportForTraining(filters);
    
    const jsonContent = 'data:text/json;charset=utf-8,' + 
      encodeURIComponent(JSON.stringify(exportData, null, 2));

    const link = document.createElement('a');
    link?.setAttribute('href', jsonContent);
    link?.setAttribute('download', `training_data_${new Date()?.toISOString()?.split('T')?.[0]}.json`);
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const stats = {
    total: conversations?.length,
    resolved: conversations?.filter((c) => c?.status === 'resolved' || c?.status === 'completed')?.length,
    escalated: conversations?.filter((c) => c?.status === 'escalated')?.length,
    avgSatisfaction: conversations?.length > 0 
      ? (conversations?.reduce((sum, c) => sum + (c?.satisfactionRating || 0), 0) / conversations?.length)?.toFixed(1)
      : 0
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Chat Log Viewer</h1>
            <p className="text-muted-foreground">
              Review customer interactions with automatic PII masking and comprehensive analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Conversations</span>
                <Icon name="MessageSquare" size={20} className="text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats?.total}</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Resolved</span>
                <Icon name="CheckCircle" size={20} className="text-success" />
              </div>
              <div className="text-2xl font-bold text-success">{stats?.resolved}</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Escalated</span>
                <Icon name="AlertTriangle" size={20} className="text-warning" />
              </div>
              <div className="text-2xl font-bold text-warning">{stats?.escalated}</div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Satisfaction</span>
                <Icon name="Star" size={20} className="text-warning" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stats?.avgSatisfaction}/5</div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                iconName="Filter"
                iconPosition="left"
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
              <span className="text-sm text-muted-foreground">
                Showing {filteredConversations?.length} of {conversations?.length} conversations
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={handleExport}
            >
              Export for Training
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {showFilters && (
              <div className="lg:col-span-3">
                <FilterPanel
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onReset={handleResetFilters}
                  onExport={handleExport}
                />
              </div>
            )}

            <div className={showFilters ? 'lg:col-span-4' : 'lg:col-span-5'}>
              <div className="space-y-3">
                {filteredConversations?.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {conversations?.length === 0 
                        ? 'No conversations recorded yet. Start a chat to see conversations here.' :'No conversations found matching your filters'}
                    </p>
                    {conversations?.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="mt-4"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredConversations?.map((conversation) => (
                    <ConversationCard
                      key={conversation?.id}
                      conversation={conversation}
                      isSelected={selectedConversation?.id === conversation?.id}
                      onClick={() => setSelectedConversation(conversation)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className={showFilters ? 'lg:col-span-5' : 'lg:col-span-7'}>
              <div className="sticky top-24">
                <ConversationDetail
                  conversation={selectedConversation}
                  onClose={() => setSelectedConversation(null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLogViewer;