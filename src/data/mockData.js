// Mock data for the Ocean Hazard Social Feed app

export const mockPosts = [
  {
    id: 1,
    user: {
      id: 1,
      name: "Rajesh Kumar",
      handle: "@rajesh_coastal",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    content: "Massive waves hitting the shore at Marina Beach! Water level rising rapidly. Stay away from the coast.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    hazardType: "High Waves",
    severity: "high",
    location: {
      name: "Marina Beach, Chennai",
      coordinates: [13.0827, 80.2707]
    },
    timestamp: "2024-01-15T10:30:00Z",
    likes: 45,
    comments: 12,
    shares: 8,
    verified: true
  },
  {
    id: 2,
    user: {
      id: 2,
      name: "Priya Nair",
      handle: "@priya_kerala",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    content: "Cyclone approaching Kochi coast. Strong winds and heavy rainfall expected. Fishermen advised not to venture into sea.",
    image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600&h=400&fit=crop",
    hazardType: "Cyclone",
    severity: "high",
    location: {
      name: "Kochi, Kerala",
      coordinates: [9.9312, 76.2673]
    },
    timestamp: "2024-01-15T09:15:00Z",
    likes: 78,
    comments: 23,
    shares: 15,
    verified: true
  },
  {
    id: 3,
    user: {
      id: 3,
      name: "Amit Patel",
      handle: "@amit_gujarat",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    content: "Coastal flooding in Dwarka area. Roads waterlogged. Local authorities evacuating residents from low-lying areas.",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop",
    hazardType: "Flood",
    severity: "medium",
    location: {
      name: "Dwarka, Gujarat",
      coordinates: [22.2394, 68.9678]
    },
    timestamp: "2024-01-15T08:45:00Z",
    likes: 34,
    comments: 9,
    shares: 6,
    verified: false
  },
  {
    id: 4,
    user: {
      id: 4,
      name: "Sunita Reddy",
      handle: "@sunita_ap",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    content: "Storm surge warning for Visakhapatnam coast. Waves reaching 4-5 meters height. Port operations suspended.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
    hazardType: "High Waves",
    severity: "high",
    location: {
      name: "Visakhapatnam, Andhra Pradesh",
      coordinates: [17.6868, 83.2185]
    },
    timestamp: "2024-01-15T07:20:00Z",
    likes: 56,
    comments: 18,
    shares: 11,
    verified: true
  },
  {
    id: 5,
    user: {
      id: 5,
      name: "Ravi Sharma",
      handle: "@ravi_mumbai",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    content: "Moderate waves at Juhu Beach. Weather seems to be improving. Fishermen preparing to resume operations.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    hazardType: "High Waves",
    severity: "low",
    location: {
      name: "Juhu Beach, Mumbai",
      coordinates: [19.0760, 72.8777]
    },
    timestamp: "2024-01-15T06:00:00Z",
    likes: 23,
    comments: 5,
    shares: 3,
    verified: false
  }
];

export const mockAlerts = [
  {
    id: 1,
    title: "High Wave Alert",
    message: "High Wave Alert in Kerala Coast - Waves up to 6 meters expected",
    severity: "high",
    location: "Kerala Coast",
    timestamp: "2024-01-15T10:00:00Z",
    active: true
  },
  {
    id: 2,
    title: "Cyclone Warning",
    message: "Cyclone 'Vardah' approaching Tamil Nadu coast in next 24 hours",
    severity: "high",
    location: "Tamil Nadu Coast",
    timestamp: "2024-01-15T08:00:00Z",
    active: true
  }
];

export const mockTips = [
  {
    id: 1,
    title: "Tsunami Safety",
    content: "If you feel strong earthquake shaking, immediately move to higher ground or inland.",
    icon: "🌊"
  },
  {
    id: 2,
    title: "Cyclone Preparation",
    content: "Secure loose objects, stock emergency supplies, and stay indoors during cyclone.",
    icon: "🌀"
  },
  {
    id: 3,
    title: "Flood Safety",
    content: "Never walk or drive through flood water. Turn around, don't drown.",
    icon: "🌊"
  },
  {
    id: 4,
    title: "High Wave Warning",
    content: "Stay away from beaches and rocky shores during high wave conditions.",
    icon: "🌊"
  }
];

export const mockUser = {
  id: 1,
  name: "John Doe",
  handle: "@johndoe_coastal",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  stats: {
    reports: 12,
    likes: 156,
    comments: 43
  },
  badges: [
    { id: 1, name: "5 Reports Posted", icon: "📝", earned: true },
    { id: 2, name: "Verified Reporter", icon: "✅", earned: true },
    { id: 3, name: "Community Helper", icon: "🤝", earned: false },
    { id: 4, name: "Early Warning", icon: "⚠️", earned: true }
  ],
  joinDate: "2023-06-15"
};

export const hazardTypes = [
  { id: 'all', name: 'All', color: 'gray' },
  { id: 'flood', name: 'Floods', color: 'blue' },
  { id: 'high-waves', name: 'High Waves', color: 'cyan' },
  { id: 'cyclone', name: 'Cyclones', color: 'purple' },
  { id: 'tsunami', name: 'Tsunami', color: 'red' }
];

export const severityLevels = {
  low: { name: 'Low', color: 'success', bgColor: 'bg-success-50', textColor: 'text-success-600' },
  medium: { name: 'Medium', color: 'warning', bgColor: 'bg-warning-50', textColor: 'text-warning-600' },
  high: { name: 'High', color: 'danger', bgColor: 'bg-danger-50', textColor: 'text-danger-600' }
};

// Language translations
export const translations = {
  en: {
    home: "Home",
    map: "Map",
    report: "Report",
    profile: "Profile",
    allPosts: "All Posts",
    filters: "Filters",
    like: "Like",
    comment: "Comment",
    share: "Share",
    uploadReport: "Upload Report",
    takePhoto: "Take Photo",
    selectHazard: "Select Hazard Type",
    addDescription: "Add Description (Optional)",
    location: "Location",
    preview: "Preview",
    submit: "Submit Report",
    myProfile: "My Profile",
    myReports: "My Reports",
    badges: "Badges",
    settings: "Settings",
    language: "Language"
  },
  hi: {
    home: "होम",
    map: "मैप",
    report: "रिपोर्ट",
    profile: "प्रोफाइल",
    allPosts: "सभी पोस्ट",
    filters: "फिल्टर",
    like: "पसंद",
    comment: "टिप्पणी",
    share: "साझा करें",
    uploadReport: "रिपोर्ट अपलोड करें",
    takePhoto: "फोटो लें",
    selectHazard: "खतरे का प्रकार चुनें",
    addDescription: "विवरण जोड़ें (वैकल्पिक)",
    location: "स्थान",
    preview: "पूर्वावलोकन",
    submit: "रिपोर्ट जमा करें",
    myProfile: "मेरी प्रोफाइल",
    myReports: "मेरी रिपोर्ट्स",
    badges: "बैज",
    settings: "सेटिंग्स",
    language: "भाषा"
  }
};