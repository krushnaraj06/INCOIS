import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Users, Phone, Search, Shield, CheckCircle, Heart, MessageCircle, Share } from 'lucide-react';
import Header from '../components/Layout/Header';
import QuickReport from '../components/Dashboard/QuickReport';
import { useLanguage } from '../contexts/LanguageContext';
import { mockPosts, severityLevels } from '../data/mockData';

const Dashboard = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('general');
    const [searchLocation, setSearchLocation] = useState('');
    const [quickActionToggle, setQuickActionToggle] = useState('family');
    const [locationResults, setLocationResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    // Mock data for high alert areas
    const alertAreas = [
        {
            id: 1,
            city: 'Visakhapatnam',
            state: 'Andhra Pradesh',
            severity: 85,
            level: 'Critical',
            population: '2,035,922',
            updatedTime: '4:10 PM',
            color: 'red'
        },
        {
            id: 2,
            city: 'Bhubaneswar',
            state: 'Odisha',
            severity: 70,
            level: 'High Alert',
            population: '817,737',
            updatedTime: '4:05 PM',
            color: 'orange'
        },
        {
            id: 3,
            city: 'Chennai',
            state: 'Tamil Nadu',
            severity: 55,
            level: 'Medium Alert',
            population: '4,646,732',
            updatedTime: '3:58 PM',
            color: 'yellow'
        },
        {
            id: 4,
            city: 'Mumbai',
            state: 'Maharashtra',
            severity: 40,
            level: 'Low Alert',
            population: '12,478,447',
            updatedTime: '3:45 PM',
            color: 'green'
        }
    ];

    const getSeverityColor = (color) => {
        const colors = {
            red: 'bg-red-500',
            orange: 'bg-orange-500',
            yellow: 'bg-yellow-500',
            green: 'bg-green-500'
        };
        return colors[color] || 'bg-gray-500';
    };

    const getSeverityBg = (color) => {
        const colors = {
            red: 'bg-red-50 border-red-200',
            orange: 'bg-orange-50 border-orange-200',
            yellow: 'bg-yellow-50 border-yellow-200',
            green: 'bg-green-50 border-green-200'
        };
        return colors[color] || 'bg-gray-50 border-gray-200';
    };

    const getSeverityText = (color) => {
        const colors = {
            red: 'text-red-700',
            orange: 'text-orange-700',
            yellow: 'text-yellow-700',
            green: 'text-green-700'
        };
        return colors[color] || 'text-gray-700';
    };

    const emergencyContacts = [
        { name: 'Emergency Services', number: '108', description: 'Medical Emergency' },
        { name: 'Disaster Management', number: '1070', description: 'Natural Disasters' },
        { name: 'Coast Guard', number: '1554', description: 'Maritime Emergency' },
        { name: 'Fire Services', number: '101', description: 'Fire Emergency' }
    ];

    const guidelines = {
        general: [
            'Stay informed through official weather alerts and warnings',
            'Keep emergency supplies ready: water, food, flashlight, radio',
            'Know your evacuation routes and shelter locations',
            'Have a family emergency communication plan',
            'Keep important documents in waterproof containers'
        ],
        flood: [
            'Move to higher ground immediately if flooding occurs',
            'Never walk or drive through flood water',
            'Stay away from downed power lines',
            'Listen to emergency broadcasts for evacuation orders',
            'Avoid drinking flood water - use bottled or boiled water'
        ],
        cyclone: [
            'Secure loose objects around your property',
            'Board up windows and glass doors',
            'Stay indoors and away from windows during the storm',
            'Have battery-powered radio for weather updates',
            'Do not go outside during the eye of the storm'
        ],
        tsunami: [
            'If you feel strong earthquake shaking, move to higher ground immediately',
            'A tsunami can travel faster than you can run',
            'Stay away from beaches and low-lying coastal areas',
            'Listen for tsunami warning sirens',
            'Do not return to danger areas until authorities give all-clear'
        ]
    };

    const handleLocationCheck = () => {
        if (searchLocation.trim()) {
            setIsSearching(true);
            
            // Simulate API call delay
            setTimeout(() => {
                // Mock location severity data
                const mockSeverityData = {
                    location: searchLocation,
                    severity: Math.floor(Math.random() * 100),
                    level: ['Low Alert', 'Medium Alert', 'High Alert', 'Critical'][Math.floor(Math.random() * 4)],
                    color: ['green', 'yellow', 'orange', 'red'][Math.floor(Math.random() * 4)],
                    population: '1,234,567',
                    lastUpdated: '4:15 PM',
                    coordinates: [13.0827 + (Math.random() - 0.5) * 0.1, 80.2707 + (Math.random() - 0.5) * 0.1]
                };

                // Find related posts for this location (mock search)
                const relatedPosts = mockPosts.filter(post => 
                    post.location.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
                    searchLocation.toLowerCase().includes(post.location.name.toLowerCase().split(',')[0].toLowerCase())
                );

                setLocationResults({
                    ...mockSeverityData,
                    relatedPosts: relatedPosts.length > 0 ? relatedPosts : mockPosts.slice(0, 2) // Show some posts if no exact match
                });
                setIsSearching(false);
            }, 1000);
        } else {
            alert('Please enter a location to check');
        }
    };

    const handleCurrentLocationCheck = () => {
        if (navigator.geolocation) {
            setIsSearching(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Mock current location severity data
                    const mockCurrentLocationData = {
                        location: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                        severity: 35,
                        level: 'Low Alert',
                        color: 'green',
                        population: 'N/A',
                        lastUpdated: '4:15 PM',
                        coordinates: [latitude, longitude]
                    };

                    // Find nearby posts (mock - in real app would use geospatial query)
                    const nearbyPosts = mockPosts.slice(0, 3);

                    setLocationResults({
                        ...mockCurrentLocationData,
                        relatedPosts: nearbyPosts
                    });
                    setIsSearching(false);
                },
                (error) => {
                    setIsSearching(false);
                    alert('Unable to get your location. Please check location permissions.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const clearLocationResults = () => {
        setLocationResults(null);
        setSearchLocation('');
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gray-50 md:pb-0 pb-20">
            <Header title="Ocean Guard Dashboard" />

            {/* Desktop Layout */}
            <div className="hidden md:flex md:ml-64 lg:mr-80">
                <div className="flex-1 max-w-7xl mx-auto px-6 py-6">
                    {/* Critical Alert Banner */}
                    <div className="bg-red-600 text-white p-4 mb-6 rounded-lg shadow-md animate-pulse">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle size={24} className="flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h2 className="font-bold text-lg mb-1">CRITICAL ALERT</h2>
                                <p className="text-red-100">
                                    1 area currently under critical threat: <strong>Visakhapatnam</strong>, Severity <strong>85/100</strong>
                                </p>
                                <div className="flex items-center space-x-4 mt-2 text-red-200 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <Clock size={14} />
                                        <span>Updated: 4:10 PM</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Users size={14} />
                                        <span>Population at risk: 2M+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* High Alert Areas */}
                            <div className="card p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <Shield size={20} className="text-red-600" />
                                    <span>High Alert Areas</span>
                                </h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {alertAreas.map((area) => (
                                        <div key={area.id} className={`border rounded-lg p-4 ${getSeverityBg(area.color)}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(area.color)}`}></div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{area.city}</h4>
                                                        <p className="text-sm text-gray-600">{area.state}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-lg font-bold ${getSeverityText(area.color)}`}>
                                                        {area.severity}/100
                                                    </div>
                                                    <div className={`text-xs font-medium ${getSeverityText(area.color)}`}>
                                                        {area.level}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Users size={14} />
                                                    <span>Pop: {area.population}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Clock size={14} />
                                                    <span>Updated: {area.updatedTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Location Severity Check */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                    <MapPin size={20} className="text-blue-600" />
                                    <span>Check Location Severity</span>
                                </h3>
                                
                                {!locationResults ? (
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchLocation}
                                                onChange={(e) => setSearchLocation(e.target.value)}
                                                placeholder="Enter city or location..."
                                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                onKeyPress={(e) => e.key === 'Enter' && handleLocationCheck()}
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={handleLocationCheck}
                                                disabled={isSearching}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                            >
                                                {isSearching ? 'Checking...' : 'Check Severity'}
                                            </button>
                                            <button
                                                onClick={handleCurrentLocationCheck}
                                                disabled={isSearching}
                                                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                                            >
                                                {isSearching ? 'Locating...' : 'My Location'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Location Severity Results */}
                                        <div className={`border rounded-lg p-4 ${getSeverityBg(locationResults.color)}`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-4 h-4 rounded-full ${getSeverityColor(locationResults.color)}`}></div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{locationResults.location}</h4>
                                                        <p className="text-sm text-gray-600">Population: {locationResults.population}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`text-xl font-bold ${getSeverityText(locationResults.color)}`}>
                                                        {locationResults.severity}/100
                                                    </div>
                                                    <div className={`text-sm font-medium ${getSeverityText(locationResults.color)}`}>
                                                        {locationResults.level}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Clock size={14} />
                                                    <span>Updated: {locationResults.lastUpdated}</span>
                                                </div>
                                                <button
                                                    onClick={clearLocationResults}
                                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    New Search
                                                </button>
                                            </div>
                                        </div>

                                        {/* Related Posts */}
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                                <MessageCircle size={16} className="text-gray-600" />
                                                <span>Recent Reports ({locationResults.relatedPosts.length})</span>
                                            </h4>
                                            <div className="space-y-3 max-h-80 overflow-y-auto">
                                                {locationResults.relatedPosts.map((post) => {
                                                    const severity = severityLevels[post.severity];
                                                    return (
                                                        <div key={post.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
                                                            <div className="flex items-start space-x-3">
                                                                <img
                                                                    src={post.user.avatar}
                                                                    alt={post.user.name}
                                                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <h5 className="font-semibold text-sm text-gray-900 truncate">{post.user.name}</h5>
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severity.bgColor} ${severity.textColor}`}>
                                                                            {post.hazardType}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                                                                    {post.image && (
                                                                        <img
                                                                            src={post.image}
                                                                            alt="Report"
                                                                            className="w-full h-24 object-cover rounded-lg mb-2"
                                                                        />
                                                                    )}
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center space-x-1 text-gray-500">
                                                                            <MapPin size={12} />
                                                                            <span className="text-xs truncate">{post.location.name}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-3 text-gray-500">
                                                                            <div className="flex items-center space-x-1">
                                                                                <Heart size={12} />
                                                                                <span className="text-xs">{post.likes}</span>
                                                                            </div>
                                                                            <div className="flex items-center space-x-1">
                                                                                <MessageCircle size={12} />
                                                                                <span className="text-xs">{post.comments}</span>
                                                                            </div>
                                                                            <span className="text-xs">{formatTime(post.timestamp)}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Emergency Guidelines & Tips */}
                            <div className="card p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Guidelines & Tips</h3>

                                {/* Tabs */}
                                <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                                    {Object.keys(guidelines).map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 capitalize ${activeTab === tab
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Guidelines Content */}
                                <div className="space-y-3 mb-6">
                                    {guidelines[activeTab].map((guideline, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-700">{guideline}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Emergency Contacts */}
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                        <Phone size={16} className="text-red-600" />
                                        <span>Emergency Contacts</span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {emergencyContacts.map((contact, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                                                <div className="font-semibold text-red-600 text-lg">{contact.number}</div>
                                                <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                                <div className="text-xs text-gray-600">{contact.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Action Toggle */}
                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setQuickActionToggle('family')}
                                            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${quickActionToggle === 'family'
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Family Plan
                                        </button>
                                        <button
                                            onClick={() => setQuickActionToggle('kit')}
                                            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${quickActionToggle === 'kit'
                                                    ? 'bg-white text-blue-600 shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            Emergency Kit
                                        </button>
                                    </div>
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-700">
                                            {quickActionToggle === 'family'
                                                ? 'Create a family emergency plan with meeting points and contact information.'
                                                : 'Prepare an emergency kit with water, food, flashlight, radio, and first aid supplies.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Report Section */}
                            <QuickReport />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden max-w-md mx-auto px-4 py-4 space-y-6">
                {/* Critical Alert Banner */}
                <div className="bg-red-600 text-white p-4 rounded-lg shadow-md animate-pulse">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h2 className="font-bold mb-1">CRITICAL ALERT</h2>
                            <p className="text-red-100 text-sm">
                                1 area under critical threat: <strong>Visakhapatnam</strong>, Severity <strong>85/100</strong>
                            </p>
                            <div className="flex items-center space-x-3 mt-2 text-red-200 text-xs">
                                <div className="flex items-center space-x-1">
                                    <Clock size={12} />
                                    <span>Updated: 4:10 PM</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* High Alert Areas */}
                <div className="card p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Shield size={18} className="text-red-600" />
                        <span>High Alert Areas</span>
                    </h3>
                    <div className="space-y-3">
                        {alertAreas.map((area) => (
                            <div key={area.id} className={`border rounded-lg p-3 ${getSeverityBg(area.color)}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(area.color)}`}></div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900">{area.city}</h4>
                                            <p className="text-xs text-gray-600">{area.state}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-bold ${getSeverityText(area.color)}`}>
                                            {area.severity}/100
                                        </div>
                                        <div className={`text-xs ${getSeverityText(area.color)}`}>
                                            {area.level}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <span>Pop: {area.population}</span>
                                    <span>Updated: {area.updatedTime}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* Quick Report */}
                <QuickReport />

                {/* Location Check */}
                <div className="card p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <MapPin size={18} className="text-blue-600" />
                        <span>Check Location</span>
                    </h3>
                    
                    {!locationResults ? (
                        <div className="space-y-3">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="Enter location..."
                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    onKeyPress={(e) => e.key === 'Enter' && handleLocationCheck()}
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleLocationCheck}
                                    disabled={isSearching}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                >
                                    {isSearching ? 'Checking...' : 'Check'}
                                </button>
                                <button
                                    onClick={handleCurrentLocationCheck}
                                    disabled={isSearching}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                                >
                                    {isSearching ? 'Locating...' : 'My Location'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* Location Severity Results */}
                            <div className={`border rounded-lg p-3 ${getSeverityBg(locationResults.color)}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(locationResults.color)}`}></div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-900">{locationResults.location}</h4>
                                            <p className="text-xs text-gray-600">Pop: {locationResults.population}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-bold ${getSeverityText(locationResults.color)}`}>
                                            {locationResults.severity}/100
                                        </div>
                                        <div className={`text-xs ${getSeverityText(locationResults.color)}`}>
                                            {locationResults.level}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Clock size={12} />
                                        <span>Updated: {locationResults.lastUpdated}</span>
                                    </div>
                                    <button
                                        onClick={clearLocationResults}
                                        className="text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        New Search
                                    </button>
                                </div>
                            </div>

                            {/* Related Posts */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-1">
                                    <MessageCircle size={14} className="text-gray-600" />
                                    <span className="text-sm">Reports ({locationResults.relatedPosts.length})</span>
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {locationResults.relatedPosts.map((post) => {
                                        const severity = severityLevels[post.severity];
                                        return (
                                            <div key={post.id} className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors duration-200">
                                                <div className="flex items-start space-x-2">
                                                    <img
                                                        src={post.user.avatar}
                                                        alt={post.user.name}
                                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-1 mb-1">
                                                            <h5 className="font-semibold text-xs text-gray-900 truncate">{post.user.name}</h5>
                                                            <span className={`px-1 py-0.5 rounded text-xs font-medium ${severity.bgColor} ${severity.textColor}`}>
                                                                {post.hazardType}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-700 mb-1 line-clamp-2">{post.content}</p>
                                                        {post.image && (
                                                            <img
                                                                src={post.image}
                                                                alt="Report"
                                                                className="w-full h-16 object-cover rounded mb-1"
                                                            />
                                                        )}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-1 text-gray-500">
                                                                <MapPin size={10} />
                                                                <span className="text-xs truncate">{post.location.name}</span>
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-gray-500">
                                                                <div className="flex items-center space-x-1">
                                                                    <Heart size={10} />
                                                                    <span className="text-xs">{post.likes}</span>
                                                                </div>
                                                                <span className="text-xs">{formatTime(post.timestamp)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                

                {/* Emergency Guidelines */}
                <div className="card p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Emergency Guidelines</h3>

                    <div className="flex space-x-1 mb-3 bg-gray-100 rounded-lg p-1">
                        {Object.keys(guidelines).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 capitalize ${activeTab === tab
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2 mb-4">
                        {guidelines[activeTab].slice(0, 3).map((guideline, index) => (
                            <div key={index} className="flex items-start space-x-2">
                                <CheckCircle size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-700">{guideline}</p>
                            </div>
                        ))}
                    </div>

                    {/* Emergency Contacts */}
                    <div className="border-t pt-3">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-1">
                            <Phone size={14} className="text-red-600" />
                            <span className="text-sm">Emergency Contacts</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {emergencyContacts.map((contact, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-2">
                                    <div className="font-semibold text-red-600">{contact.number}</div>
                                    <div className="text-xs font-medium text-gray-900">{contact.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

               
            </div>
        </div>
    );
};

export default Dashboard;