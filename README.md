
# **Ready to Go** - Travel Assistant Chatbot
<img width="717" alt="" src="https://github.com/user-attachments/assets/78d36850-3e82-4ce0-a3c0-0a2b5e56591d">

## 📖 **Project Overview**
"Ready to Go" is a travel assistant chatbot designed to help users ensure they are fully prepared for their trip. From packing essentials to checking flight details, the assistant interacts with the user in a friendly, engaging manner, providing real-time support with a progress bar to track completed tasks.

This project was built using **Next.js**, **OpenAI's GPT-3.5**, and **Material-UI** for the user interface. It demonstrates proficiency in API integration, serverless functions, state management, and dynamic UI development.

---

## 🚀 **Features**

- **Friendly Travel Assistant:** Helps users step-by-step through their travel preparation checklist.
- **Real-Time Chat Integration:** Uses OpenAI's GPT-3.5 for dynamic and intelligent conversations.
- **Progress Tracking:** Visual progress bar showing the completion of tasks (e.g., packing, checking documents).
- **Dark Mode Support:** Users can toggle between light and dark modes for better UX.
- **Customizable:** The checklist is tailored based on the user's travel destination and personal details.
- **Mobile-Responsive Design:** Optimized for both desktop and mobile devices.

---

## 🛠️ **Technologies Used**

- **Frontend:** Next.js, React, Material-UI
- **Backend:** Next.js API Routes, OpenAI GPT-3.5
- **Styling:** CSS-in-JS, Material-UI's Theme Provider (supports light/dark mode)
- **Hosting:** Vercel
- **Version Control:** Git

---

## 🧠 **How It Works**

1. **Interactive Chat:** The chatbot interacts with the user, asking questions such as their name, travel destination, and checklist items for travel readiness.
2. **Task Progression:** As users answer the checklist questions (e.g., packing documents, checking flights), the progress bar updates in real-time.
3. **API Integration:** The chatbot uses OpenAI's API to provide intelligent responses, ensuring that the conversation feels natural and helpful.
4. **Light/Dark Mode Toggle:** Users can switch between light and dark modes based on their preference, offering a better user experience.
5. **Final Checklist Review:** At the end, the chatbot reminds users of any incomplete tasks and provides a supportive message before their journey.

---

## 📦 **Installation & Setup**

### **Requirements:**
- Node.js v14.x or higher
- OpenAI API Key (sign up for an API key [here](https://beta.openai.com/signup/))

### **Steps:**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ready-to-go.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ready-to-go
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables:
   - Create a `.env.local` file in the root directory and add your OpenAI API key:
     ```plaintext
     OPENAI_API_KEY=your-openai-api-key
     ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.


### ✨ **Demo**

Check out the live demo of the app: [Ready to Go](https://your-vercel-deployment-url.com)
