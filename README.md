# Ocean Hazard Social Feed

A mobile-first React web application for crowdsourced ocean hazard monitoring and social media reporting, designed for the Smart India Hackathon problem statement: INCOIS – Crowdsourced Ocean Hazard & Social Media Monitoring.

## Features

### 🏠 Home / Dashboard
- Real-time alert banners for emergency notifications
- Swipeable safety tips carousel (Instagram stories style)
- Filter bar for different hazard types (All, Floods, High Waves, Cyclones, Tsunami)
- Infinite scroll with smooth animations
- Pull-to-refresh functionality

### 🗺️ Interactive Map
- Leaflet-based interactive map showing hazard reports
- Color-coded pins and heatmap clusters (Green/Yellow/Red severity)
- Popup previews with post details when tapping pins
- Floating "Upload Report" button
- Map legend for severity levels

### 📱 Report Upload
- Multi-step upload flow with progress indicator
- Camera interface for photo capture (mock file input)
- **Automatic geolocation capture and overlay on images**
- **AI-powered flood detection using Hugging Face model**
- Real-time flood risk assessment with confidence scores
- Auto-generated location and timestamp
- Hazard type selection dropdown
- Optional description text box
- Preview before submission with flood detection results
- Automatic integration with feed and map

### 👤 Profile Management
- User profile with avatar, stats, and badges
- Gamification system with achievement badges
- Personal report history
- User statistics (reports, likes, comments)
- Settings and language toggle

### 🌐 Additional Features
- Mobile-first responsive design
- Multilingual support (English/Hindi)
- Clean, modern UI similar to Twitter/Instagram
- Bottom navigation with 4 tabs
- Mock data for realistic demonstration

## Tech Stack

- **Frontend**: React 18
- **Backend**: Python Flask
- **AI/ML**: Hugging Face Transformers (SigLIP model)
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **Maps**: React Leaflet
- **Icons**: Lucide React
- **State Management**: React Context API

## Installation

### Quick Start (Windows)
1. Clone the repository:
```bash
git clone <repository-url>
cd ocean-hazard-social-feed
```

2. Run the startup script:
```bash
start_project.bat
```

This will automatically start both the Python backend and React frontend.

### Manual Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ocean-hazard-social-feed
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up the Python backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```

4. In a new terminal, start the React frontend:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Backend Services

#### Python Backend (Original)
The Python backend runs on [http://localhost:5000](http://localhost:5000) and provides:
- Flood detection API using Hugging Face model
- Image processing with geolocation support
- RESTful endpoints for frontend integration

#### Java Backend (Alternative)
The Java Spring Boot backend also runs on [http://localhost:5000](http://localhost:5000) and provides:
- Flood detection API with intelligent mock implementation
- Image analysis using brightness and color heuristics
- RESTful endpoints compatible with the frontend
- Better performance and enterprise-ready architecture

**To use Java backend:**
```bash
# Quick start with Java backend
start_project_java.bat

# Or manually
cd backend-java
mvn spring-boot:run
```

## Project Structure

```
src/
├── components/
│   ├── Feed/
│   │   ├── AlertBanner.js
│   │   ├── FilterBar.js
│   │   ├── PostCard.js
│   │   └── TipsCarousel.js
│   ├── Layout/
│   │   ├── BottomNavigation.js
│   │   └── Header.js
│   └── Map/
│       └── MapComponent.js
├── contexts/
│   ├── AppContext.js
│   └── LanguageContext.js
├── data/
│   └── mockData.js
├── pages/
│   ├── Home.js
│   ├── Map.js
│   ├── Profile.js
│   └── Report.js
├── App.js
├── index.css
└── index.js
```

## Mock Data

The application uses comprehensive mock data including:
- Sample hazard reports with images, locations, and severity levels
- User profiles with avatars and statistics
- Emergency alerts and safety tips
- Gamification badges and achievements
- Multilingual translations (English/Hindi)

## Key Components

### PostCard
Displays individual hazard reports with:
- User information and verification status
- Hazard images and descriptions
- Location and timestamp
- Severity badges
- Interaction buttons (like, comment, share)

### MapComponent
Interactive map featuring:
- Custom markers based on severity levels
- Popup previews for each report
- Legend for severity indication
- Responsive design for mobile devices

### Report Upload Flow
Three-step process:
1. Photo capture/selection
2. Hazard details and description
3. Preview and submission

## Responsive Design

The application is built with a mobile-first approach:
- Optimized for screens 375px and up
- Touch-friendly interface elements
- Smooth animations and transitions
- Bottom navigation for easy thumb access

## Future Enhancements

- Real-time notifications
- Offline functionality
- Advanced filtering and search
- Social features (following, messaging)
- Integration with weather APIs
- Push notifications for emergency alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is developed for the Smart India Hackathon and is intended for educational and demonstration purposes.
