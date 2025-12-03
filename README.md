# 🍽️ RestaurantAI Support: Hyper-Personalized & Privacy-First
**Tagline:** A context-aware AI agent that interprets vague cravings into actionable orders while strictly protecting customer privacy.

## 1. The Problem (Real World Scenario)
**Context:** In the restaurant industry, generic chatbots are a major friction point. They treat every customer the same, lacking awareness of location, real-time stock, or personal history. Furthermore, customers often share sensitive info (phone numbers for reservations) which creates a massive data privacy risk when passed to public LLMs.

**The Pain Point:** 
1.  **Vague Queries Fail:** If a user says "I'm cold," a standard bot says "I don't understand." It fails to connect the dot to "Hot Chocolate" or "Indoor Seating."
2.  **Privacy Risks:** Sending raw customer chat logs containing phone numbers or addresses to third-party AI providers is a compliance nightmare.

**My Solution:** I built **RestaurantAI Support**, a privacy-first, context-aware agent. It intercepts messages to mask PII locally, then uses a RAG-style context engine to interpret vague intent ("I'm hungry") into specific, location-based sales opportunities ("The Downtown branch has your favorite pizza in stock").

## 2. Expected End Result
**For the Customer:**
*   **Input:** "I'm cold and hungry."
*   **Action:** System checks local weather, nearest branch amenities (indoor heating), and menu inventory.
*   **Output:** "Café Aroma (40m away) has indoor heating. Your favorite 'Hazelnut Hot Chocolate' is in stock. You also have a 15% coupon—should I apply it?"

**For the Business:**
*   **Safety:** Customer phone numbers/emails are seen as `***-***-1234` by the AI.
*   **Insight:** Admin dashboard tracks "Missed Opportunities" and "Sentiment" without exposing private data.

## 3. Technical Approach
I focused on building a **Secure Intelligence Layer** between the user and the LLM.

**System Architecture:**

1.  **Privacy Middleware (The Guard):** 
    *   Before any data leaves the browser, a custom Regex-based PII masking engine scans for Phone Numbers, Emails, and Credit Cards.
    *   It replaces them with tokens (e.g., `[PHONE_MASKED]`) so the LLM *never* sees the raw data.

2.  **Contextual RAG (The Brain):** 
    *   Instead of a generic prompt, we inject a dynamic "World State" into Gemini.
    *   This includes: **Menu Data + Branch Status (Open/Close) + Customer Order History + Active Coupons**.
    *   This allows the AI to answer "Do you have vegan options?" with specific items currently in stock at the user's specific location.

3.  **Smart Intent Classification:**
    *   We use a lightweight classification step to determine if a user is asking for a *Menu*, *Complaint*, or *General Chat*, optimizing the system prompt for that specific goal.

## 4. Tech Stack
*   **Frontend:** React 18, Vite, Tailwind CSS
*   **AI Model:** Google Gemini 2.5 Flash (via Google Gen AI SDK)
*   **Privacy:** Custom Regex PII Masking Middleware
*   **Visualization:** Recharts (for Admin Dashboard)
*   **State Management:** React Hooks + In-Memory Service Layer

## 5. Challenges & Learnings
**Challenge 1: The Privacy vs. Utility Trade-off**
*   **Issue:** If we mask too much, the AI can't help (e.g., masking a reservation date).
*   **Solution:** I tuned the Regex patterns to be specific to *Identity* (Phone, Email, SSN) while preserving *Context* (Dates, Times, Menu Item names). We also implemented a "Rehydration" layer that keeps the original data on the client while sending masked data to the cloud.

**Challenge 2: Hallucinations on Menu Items**
*   **Issue:** The AI would invent delicious-sounding dishes that didn't exist.
*   **Solution:** I implemented a "Strict Context" system prompt. I explicitly instructed Gemini: *"You are an employee of Downtown Bistro. You can ONLY recommend items listed in the provided MENU JSON. If it's not there, apologize and suggest a similar real item."*

## 6. Visual Proof
*(Placeholders for Hackathon Submission)*

*   **Customer Chat:** Showing the AI suggesting a specific branch based on "I'm cold."
*   **Admin Dashboard:** Showing the "PII Masking Rate" metric and redacted logs.
*   **Privacy in Action:** Console log showing the masked payload sent to Gemini vs. the UI showing the user's typed message.

## 7. How to Run

```bash
# 1. Clone Repository
git clone https://github.com/yourusername/restaurantai-support.git

# 2. Install Dependencies
npm install

# 3. Configure Environment
# Create a .env file in the root directory
# Add your Gemini API Key:
# VITE_GEMINI_API_KEY="your_actual_api_key_here"

# 4. Run Application
npm run dev
```

