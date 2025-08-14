# NutriPlan - Recipe & Meal Planning Application

![NutriPlan Banner](https://via.placeholder.com/1200x400?text=NutriPlan+Banner) <!-- Replace with actual banner image -->

NutriPlan is a full-stack web application designed for food enthusiasts to create, share, and discover recipes, generate AI-powered meal plans, track mood-based recipe recommendations, and visualize recipe upload streaks via a GitHub-like heatmap.

## ✨ Features

### 🍳 Recipe Management

- Upload, edit, and delete recipes
- Categorize recipes (Breakfast, Lunch, Dinner, etc.)
- Add ingredients, instructions, and tags
- Like/unlike community recipes

### 🤖 AI-Powered Meal Planning

- Generate personalized weekly meal plans based on dietary preferences & health goals
- Save meal plans to user profiles
- Create AI-generated recipes with nutritional info (Powered by Google Gemini API)

### 😊 Mood-Based Recommendations

- Log daily moods (Happy, Sad, Stressed, etc.)
- Get AI-curated recipes matching your mood
- Track mood history

### 📊 Recipe Upload Heatmap

- GitHub-style visualization of upload activity
- Color-coded (darker = more uploads)
- Streak counter for longest consecutive upload streak
- Tooltips with exact upload dates & counts

### 👥 Community Features

- Browse & search community recipes
- Filter by category, type, or tags
- View liked recipes

### 👤 User Profile

- View uploaded recipes, liked recipes, and saved meal plans
- Update profile settings (username, password, profile picture)

## 🛠️ Tech Stack

### Frontend

- React.js (Functional components, Hooks)
- Material-UI (MUI) for UI components
- D3.js & react-calendar-heatmap for visualization
- React Router for navigation
- Axios for API calls

### Backend

- Node.js + Express.js (REST API)
- MongoDB (NoSQL database)
- Mongoose (ODM for MongoDB)
- JWT (Authentication)
- Bcrypt (Password hashing)

### AI Integration

- Google Gemini API (AI-generated recipes & meal plans)

## 🚀 How It Works

1. **Recipe Management**

   - Users can upload recipes via `AddRecipeDialog`
   - Browse community recipes in `CommunityRecipes`
   - Manage personal recipes in `MyRecipes`

2. **AI Meal Planning**

   - Users select dietary preferences & health goals
   - Gemini generates personalized meal plans & recipes
   - Saved to MongoDB (`mealplanrecipes` collection)

3. **Mood-Based Recipes**

   - Users log mood → Gemini suggests matching recipes
   - Handled by `MoodTracker` component

4. **Heatmap Analytics**

   - `RecipeUploadsHeatmap` fetches upload history
   - Displays interactive calendar heatmap

5. **User Profile**
   - Central hub for user content and settings

## 📁 File Structure Highlights

├── README.md
├── .gitignore
├── client/ # Frontend (React)
│ ├── package.json
│ ├── public/ # Static files
│ │ ├── index.html
│ │ └── manifest.json
│ ├── src/
│ │ ├── App.js
│ │ ├── index.js
│ │ ├── assets/ # Image assets
│ │ ├── Components/ # Reusable UI components
│ │ │ ├── community/
│ │ │ ├── Footer/
│ │ │ ├── Heatmap/
│ │ │ ├── Home/
│ │ │ ├── MealPlan/
│ │ │ ├── MessageModal/
│ │ │ ├── moodtracker/
│ │ │ ├── NavBar/
│ │ │ └── Profile/
│ │ ├── context/ # React Context API
│ │ ├── Pages/ # Main pages (Login, Register, MealPlan)
│ │ └── utils/ # Helper functions & API calls
│ └── tailwind.config.js
├── server/ # Backend (Node.js + Express)
│ ├── package.json
│ ├── server.js # Entry point
│ ├── config/ # Configurations (e.g., Cloudinary)
│ ├── Controller/ # Controllers for main features
│ ├── middleware/ # Authentication & JWT middleware
│ ├── Model/ # Mongoose models
│ ├── Routes/ # API routes
│ └── utils/ # Utility functions
└── .env # Environment variables
