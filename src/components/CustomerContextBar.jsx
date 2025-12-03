import React, { useState, useEffect } from 'react';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';

const CustomerContextBar = () => {
  const [location, setLocation] = useState('Detecting location...');
  const [orderStatus, setOrderStatus] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation('Downtown Branch, 123 Main St');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLocationClick = () => {
    console.log('Location clicked');
  };

  const handleOrderStatusClick = () => {
    console.log('Order status clicked');
  };

  const handleAccountClick = () => {
    console.log('Account clicked');
  };

  return (
    <div className="customer-context-bar">
      <div className="customer-context-bar-logo">
        <div className="customer-context-bar-logo-icon">
          <Icon name="UtensilsCrossed" size={20} color="var(--color-primary)" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold font-heading text-foreground">RestaurantAI</span>
          <button 
            onClick={handleLocationClick}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 text-left flex items-center gap-1"
          >
            <Icon name="MapPin" size={12} />
            <span className="truncate max-w-[150px]">{location}</span>
          </button>
        </div>
      </div>

      <div className="customer-context-bar-actions">
        {orderStatus && (
          <Button
            variant="ghost"
            size="sm"
            iconName="ShoppingBag"
            iconSize={18}
            onClick={handleOrderStatusClick}
            className="touch-target"
          >
            <span className="hidden sm:inline">Order</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          iconName="User"
          iconSize={18}
          onClick={handleAccountClick}
          className="touch-target"
        >
          <span className="hidden sm:inline">Account</span>
        </Button>
      </div>
    </div>
  );
};

export default CustomerContextBar;