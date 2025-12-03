/**
 * Custom dataset containing customer history information for Gemini AI context.
 * This data helps the AI understand customer preferences, past orders, and interactions.
 */
export const customerHistoryDataset = {
  businessInfo: {
    name: "Downtown Bistro & Café",
    type: "Restaurant and Café",
    location: "Downtown District",
    businessHours: {
      weekdays: "8:00 AM - 10:00 PM",
      weekends: "9:00 AM - 11:00 PM"
    },
    branches: [
      {
        name: "Downtown Branch",
        address: "123 Main Street, Downtown",
        distance: "0.5 miles",
        phone: "(555) 123-4567",
        isOpen: true
      },
      {
        name: "Westside Café",
        address: "456 West Avenue, Westside",
        distance: "1.2 miles",
        phone: "(555) 234-5678",
        isOpen: true
      },
      {
        name: "Eastside Bistro",
        address: "789 East Boulevard, Eastside",
        distance: "2.1 miles",
        phone: "(555) 345-6789",
        isOpen: false
      }
    ]
  },
  
  menuCategories: {
    pizzas: [
      {
        name: "Margherita Pizza",
        description: "Fresh mozzarella, tomatoes, and basil on thin crust",
        price: "$12.99",
        rating: "4.8",
        category: "Classic Pizzas",
        ingredients: ["mozzarella", "tomatoes", "basil", "olive oil"],
        allergens: ["dairy", "gluten"],
        calories: "850 kcal",
        preparationTime: "15-20 minutes"
      },
      {
        name: "Pepperoni Deluxe",
        description: "Double pepperoni with extra cheese",
        price: "$14.99",
        rating: "4.9",
        category: "Classic Pizzas",
        ingredients: ["pepperoni", "mozzarella", "tomato sauce"],
        allergens: ["dairy", "gluten", "pork"],
        calories: "950 kcal",
        preparationTime: "15-20 minutes"
      },
      {
        name: "Vegetarian Supreme",
        description: "Bell peppers, mushrooms, olives, and onions",
        price: "$13.99",
        rating: "4.7",
        category: "Vegetarian Options",
        ingredients: ["bell peppers", "mushrooms", "olives", "onions", "mozzarella"],
        allergens: ["dairy", "gluten"],
        calories: "780 kcal",
        preparationTime: "15-20 minutes"
      }
    ],
    salads: [
      {
        name: "Caesar Salad",
        description: "Crisp romaine lettuce with parmesan and croutons",
        price: "$8.99",
        rating: "4.6",
        category: "Fresh Salads",
        ingredients: ["romaine lettuce", "parmesan", "croutons", "caesar dressing"],
        allergens: ["dairy", "gluten", "eggs"],
        calories: "320 kcal",
        preparationTime: "10 minutes"
      },
      {
        name: "Greek Salad",
        description: "Feta cheese, olives, cucumbers, and tomatoes",
        price: "$9.99",
        rating: "4.8",
        category: "Fresh Salads",
        ingredients: ["feta cheese", "olives", "cucumbers", "tomatoes", "red onions"],
        allergens: ["dairy"],
        calories: "280 kcal",
        preparationTime: "10 minutes"
      }
    ],
    mainCourses: [
      {
        name: "Grilled Salmon",
        description: "Atlantic salmon with seasonal vegetables",
        price: "$18.99",
        rating: "4.9",
        category: "Main Courses",
        ingredients: ["salmon", "seasonal vegetables", "lemon butter sauce"],
        allergens: ["fish", "dairy"],
        calories: "520 kcal",
        preparationTime: "20-25 minutes"
      },
      {
        name: "Chicken Parmesan",
        description: "Breaded chicken breast with marinara and mozzarella",
        price: "$15.99",
        rating: "4.7",
        category: "Main Courses",
        ingredients: ["chicken breast", "marinara sauce", "mozzarella", "breadcrumbs"],
        allergens: ["dairy", "gluten", "eggs"],
        calories: "680 kcal",
        preparationTime: "20-25 minutes"
      }
    ],
    beverages: [
      {
        name: "Fresh Lemonade",
        description: "Homemade with fresh lemons",
        price: "$3.99",
        rating: "4.5",
        category: "Beverages",
        ingredients: ["lemon juice", "sugar", "water"],
        allergens: [],
        calories: "120 kcal"
      },
      {
        name: "Iced Coffee",
        description: "Cold brew with choice of milk",
        price: "$4.99",
        rating: "4.6",
        category: "Beverages",
        ingredients: ["coffee", "milk", "ice"],
        allergens: ["dairy (optional)"],
        calories: "80 kcal"
      }
    ],
    desserts: [
      {
        name: "Tiramisu",
        description: "Classic Italian coffee-flavored dessert",
        price: "$6.99",
        rating: "4.9",
        category: "Desserts",
        ingredients: ["mascarpone", "ladyfingers", "coffee", "cocoa"],
        allergens: ["dairy", "eggs", "gluten"],
        calories: "450 kcal"
      }
    ]
  },
  
  currentPromotions: [
    {
      id: "promo1",
      title: "20% off on all pizzas",
      description: "Get 20% discount on any pizza order",
      validUntil: "2025-12-31",
      code: "PIZZA20"
    },
    {
      id: "promo2",
      title: "Buy one salad, get one free",
      description: "BOGO deal on all fresh salads",
      validUntil: "2025-12-31",
      code: "SALAD2FOR1"
    },
    {
      id: "promo3",
      title: "Complimentary dessert with orders above $30",
      description: "Free dessert when you spend $30 or more",
      validUntil: "2025-12-31",
      code: "DESSERT30"
    }
  ],
  
  commonCustomerQueries: {
    dietary: {
      vegetarian: "We offer a variety of vegetarian options including Vegetarian Supreme Pizza, Greek Salad, and Caesar Salad.",
      vegan: "We can customize many dishes to be vegan. Our vegetarian pizza can be made vegan by removing cheese.",
      glutenFree: "We offer gluten-free pizza crusts and salads. Please inform us of any gluten allergies when ordering.",
      allergies: "All menu items list common allergens. Please inform our staff of any specific allergies when ordering."
    },
    delivery: {
      minimumOrder: "$15",
      deliveryFee: "$3.99 for orders under $25, free delivery for orders $25+",
      estimatedTime: "30-45 minutes depending on location and current traffic",
      trackingAvailable: true
    },
    payment: {
      acceptedMethods: ["Credit Cards", "Debit Cards", "Cash", "Mobile Payment (Apple Pay, Google Pay)"],
      tipping: "Tips can be added during checkout or given to the delivery driver"
    }
  },
  
  customerServiceGuidelines: {
    tone: "friendly, helpful, and professional",
    responseStyle: "conversational and informative",
    capabilities: [
      "Answer questions about menu items",
      "Provide information about locations and hours",
      "Explain current promotions and deals",
      "Help with dietary requirements and allergies",
      "Assist with order tracking",
      "Handle basic customer service inquiries"
    ],
    limitations: [
      "Cannot process payments directly",
      "Cannot modify orders after they're placed (refer to customer service)",
      "Cannot access personal customer account information"
    ]
  },
  
  contextInstructions: `You are a helpful AI assistant for Downtown Bistro & Café. Your role is to:
    
1. Assist customers with menu inquiries and recommendations
2. Provide accurate information about locations, hours, and services
3. Explain current promotions and special offers
4. Help with dietary restrictions and allergen information
5. Guide customers through the ordering process
6. Maintain a friendly, professional, and helpful tone

When responding:
- Be conversational and personable
- Provide specific details from the menu when asked
- Suggest relevant menu items based on customer preferences
- Always mention current promotions when appropriate
- If you don't know something specific, acknowledge it and offer to help in another way
- For location queries, always ask the customer's location or provide information about all branches
- For dietary questions, reference the allergen and ingredient information provided

Remember: You cannot process orders directly, access account information, or modify existing orders. For these requests, guide customers appropriately.`
};

/**
 * Helper function to format the dataset for Gemini AI context
 * @returns {string} Formatted context string for AI model
 */
export function getFormattedCustomerContext() {
  return `
BUSINESS CONTEXT:
${JSON.stringify(customerHistoryDataset?.businessInfo, null, 2)}

MENU INFORMATION:
${JSON.stringify(customerHistoryDataset?.menuCategories, null, 2)}

CURRENT PROMOTIONS:
${JSON.stringify(customerHistoryDataset?.currentPromotions, null, 2)}

COMMON QUERIES:
${JSON.stringify(customerHistoryDataset?.commonCustomerQueries, null, 2)}

CUSTOMER SERVICE GUIDELINES:
${customerHistoryDataset?.contextInstructions}
`;
}

export default customerHistoryDataset;