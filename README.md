# NutriPlan - Recipe & Meal Planning Application

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
- Material-UI (MUI) and TailwindCSS for UI components
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

```
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
```

## 🏏 Contributors
- [Nabila Islam](https://github.com/nabila-sheona)
- [Namisa Najah Raisa](https://github.com/N4M154)
- [Nazifa Tasneem](https://github.com/nazifatasneem13)
- [Nusrat Siddique Tuli](https://github.com/ns-tuli)

## 🔐 Environment Variables

This project requires **two** `.env` files — one for the backend (`server/.env`) and one for the frontend (`client/.env`).  
**⚠ Do not commit your real keys.** Use placeholders instead.

### **`server/.env`**

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

### **`client/.env`**

```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
REACT_APP_API_BASE_URL=http://localhost:4000
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

## 🛠 Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/nabila-sheona/NutriPlanner.git
cd NutriPlanner
```

### 2️⃣ Install backend dependencies

```bash
cd server
npm install
```

### 3️⃣ Install frontend dependencies

```bash
cd client
npm install
```

### 4️⃣ Install root dependencies (if any)

```bash
cd ..
npm install
```

## ▶️ Running the Application

### Start the backend (server)

```bash
cd server
nodemon server.js
```

### Start the frontend (client)

```bash
cd client
npm start
```

Once running, open the client URL printed in your terminal
(usually http://localhost:3000 for Create React App).

## 🌟 Motivation

NutriPlanner was created to make healthy eating **simple, enjoyable, and personalized**.  
By combining **mood tracking** with **AI-powered recipe recommendations**, it helps users make better food choices consistently while discovering meals that match their emotions and lifestyle.
