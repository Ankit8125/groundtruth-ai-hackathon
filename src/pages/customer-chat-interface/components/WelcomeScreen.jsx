import React from 'react';
import Icon from '../../../components/AppIcon';

const WelcomeScreen = ({ onSuggestionClick }) => {
  const suggestions = [
    {
      id: 'menu',
      icon: 'BookOpen',
      title: 'Browse Menu',
      description: 'View our full menu with prices and availability'
    },
    {
      id: 'order',
      icon: 'ShoppingCart',
      title: 'Place an Order',
      description: 'Order your favorite dishes for pickup or delivery'
    },
    {
      id: 'location',
      icon: 'MapPin',
      title: 'Find Locations',
      description: 'Discover our restaurants near you'
    },
    {
      id: 'specials',
      icon: 'Sparkles',
      title: 'Today\'s Specials',
      description: 'Check out our daily offers and promotions'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Icon name="Bot" size={32} color="var(--color-primary)" />
        </div>
        <h1 className="text-2xl font-bold font-heading text-foreground mb-2">
          Welcome to RestaurantAI Support
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          I'm your AI assistant, ready to help you with orders, menu queries, location finding, and more. How can I assist you today?
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        <button
          onClick={() => onSuggestionClick({ id: 'share_location', title: 'Find Nearest Outlet' })}
          className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-200 text-primary font-medium mb-2"
        >
          <Icon name="MapPin" size={20} />
          <span>Share Location to Find Nearest Outlet</span>
        </button>
        {suggestions?.map((suggestion) => (
          <button
            key={suggestion?.id}
            onClick={() => onSuggestionClick(suggestion)}
            className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors duration-200">
              <Icon name={suggestion?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {suggestion?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {suggestion?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <Icon name="Sparkles" size={14} />
        <span>Powered by advanced AI for personalized assistance</span>
      </div>
    </div>
  );
};

export default WelcomeScreen;