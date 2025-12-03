import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ filters, onFilterChange, onReset, onExport }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'pending', label: 'Pending' }
  ];

  const outletOptions = [
    { value: 'all', label: 'All Outlets' },
    { value: 'downtown', label: 'Downtown Branch' },
    { value: 'westside', label: 'Westside Mall' },
    { value: 'airport', label: 'Airport Terminal' },
    { value: 'beachfront', label: 'Beachfront Café' }
  ];

  const topicOptions = [
    { value: 'all', label: 'All Topics' },
    { value: 'menu', label: 'Menu Inquiry' },
    { value: 'order', label: 'Order Status' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'reservation', label: 'Reservation' },
    { value: 'dietary', label: 'Dietary Info' }
  ];

  const satisfactionOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          Filter Conversations
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="space-y-4">
        <Input
          type="search"
          label="Search"
          placeholder="Search by customer ID or message content..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="From Date"
            value={filters?.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
          />

          <Input
            type="date"
            label="To Date"
            value={filters?.dateTo}
            onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
          />
        </div>

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          label="Outlet Location"
          options={outletOptions}
          value={filters?.outlet}
          onChange={(value) => onFilterChange('outlet', value)}
        />

        <Select
          label="Conversation Topic"
          options={topicOptions}
          value={filters?.topic}
          onChange={(value) => onFilterChange('topic', value)}
        />

        <Select
          label="Satisfaction Rating"
          options={satisfactionOptions}
          value={filters?.satisfaction}
          onChange={(value) => onFilterChange('satisfaction', value)}
        />

        <div className="pt-4 border-t border-border">
          <Button
            variant="default"
            fullWidth
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export Filtered Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;