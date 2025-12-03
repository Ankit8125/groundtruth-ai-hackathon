import React, { useState, useEffect } from 'react';
import Icon from '../components/AppIcon';

const ConversationQuickActions = ({ onActionSelect }) => {
  const [contextualActions, setContextualActions] = useState([]);

  const defaultActions = [
    { id: 'menu', label: 'View Menu', icon: 'BookOpen' },
    { id: 'order', label: 'Place Order', icon: 'ShoppingCart' },
    { id: 'hours', label: 'Opening Hours', icon: 'Clock' },
    { id: 'location', label: 'Find Location', icon: 'MapPin' },
    { id: 'reservations', label: 'Book Table', icon: 'Calendar' },
    { id: 'specials', label: 'Today\'s Specials', icon: 'Sparkles' },
    { id: 'dietary', label: 'Dietary Info', icon: 'Info' },
    { id: 'contact', label: 'Contact Us', icon: 'Phone' }
  ];

  useEffect(() => {
    setContextualActions(defaultActions);
  }, []);

  const handleActionClick = (action) => {
    onActionSelect?.(action);
    console.log('Quick action selected:', action?.id);
  };

  return (
    <div className="conversation-quick-actions">
      <div className="conversation-quick-actions-container">
        {contextualActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleActionClick(action)}
            className="conversation-quick-action-chip"
          >
            <div className="flex items-center gap-2">
              <Icon name={action?.icon} size={16} />
              <span>{action?.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationQuickActions;