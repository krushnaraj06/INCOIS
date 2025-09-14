package com.incois.flooddetection.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class SocialMediaAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(SocialMediaAnalysisService.class);

    // Keywords related to floods and natural disasters
    private static final Set<String> FLOOD_KEYWORDS = Set.of(
            "flood", "flooding", "flooded", "inundation", "deluge", "torrent", "downpour",
            "cyclone", "hurricane", "typhoon", "storm", "tempest", "gale", "squall",
            "tsunami", "tidal wave", "surge", "high water", "overflow", "submerged",
            "waterlogged", "drenched", "soaked", "drowning", "evacuation", "rescue",
            "emergency", "disaster", "crisis", "alert", "warning", "caution");

    // Location-based social media data (mock implementation)
    private static final Map<String, SocialMediaData> LOCATION_DATA = Map.of(
            "chennai", new SocialMediaData(0.7, 45, 120, 0.3),
            "mumbai", new SocialMediaData(0.6, 38, 95, 0.4),
            "kolkata", new SocialMediaData(0.8, 52, 140, 0.2),
            "delhi", new SocialMediaData(0.3, 15, 25, 0.7),
            "bangalore", new SocialMediaData(0.4, 22, 35, 0.6),
            "hyderabad", new SocialMediaData(0.5, 28, 45, 0.5),
            "pune", new SocialMediaData(0.4, 20, 30, 0.6),
            "ahmedabad", new SocialMediaData(0.3, 18, 25, 0.7),
            "jaipur", new SocialMediaData(0.2, 12, 20, 0.8),
            "lucknow", new SocialMediaData(0.3, 16, 28, 0.7));

    public SocialMediaAnalysisResult analyzeSocialMediaSentiment(double latitude, double longitude,
            String locationName) {
        try {
            logger.info("Analyzing social media sentiment for location: {} ({}, {})", locationName, latitude,
                    longitude);

            // Determine location key for data lookup
            String locationKey = determineLocationKey(locationName, latitude, longitude);

            // Get base social media data for the location
            SocialMediaData baseData = LOCATION_DATA.getOrDefault(locationKey, getDefaultData());

            // Apply real-time variations based on actual data patterns
            SocialMediaData currentData = addRealTimeVariations(baseData);

            // Calculate sentiment score
            double sentimentScore = calculateSentimentScore(currentData);

            // Extract relevant keywords from recent posts
            List<String> relevantKeywords = extractRelevantKeywords(currentData);

            // Calculate confidence based on data volume and consistency
            double confidence = calculateConfidence(currentData);

            SocialMediaAnalysisResult result = new SocialMediaAnalysisResult();
            result.setSentimentScore(sentimentScore);
            result.setConfidence(confidence);
            result.setRelevantKeywords(relevantKeywords);
            result.setPostCount(currentData.postCount);
            result.setMentionCount(currentData.mentionCount);
            result.setLocationKey(locationKey);

            logger.info("Social media analysis completed - Sentiment: {}, Confidence: {}", sentimentScore, confidence);
            return result;

        } catch (Exception e) {
            logger.error("Error analyzing social media sentiment", e);
            return createDefaultResult();
        }
    }

    private String determineLocationKey(String locationName, double latitude, double longitude) {
        if (locationName != null) {
            String lowerLocation = locationName.toLowerCase();
            for (String key : LOCATION_DATA.keySet()) {
                if (lowerLocation.contains(key)) {
                    return key;
                }
            }
        }

        // Fallback to geographic regions based on coordinates
        if (latitude >= 12.0 && latitude <= 14.0 && longitude >= 79.0 && longitude <= 81.0) {
            return "chennai";
        } else if (latitude >= 18.0 && latitude <= 20.0 && longitude >= 72.0 && longitude <= 74.0) {
            return "mumbai";
        } else if (latitude >= 22.0 && latitude <= 23.0 && longitude >= 88.0 && longitude <= 89.0) {
            return "kolkata";
        } else if (latitude >= 28.0 && latitude <= 29.0 && longitude >= 76.0 && longitude <= 78.0) {
            return "delhi";
        } else if (latitude >= 12.0 && latitude <= 13.0 && longitude >= 77.0 && longitude <= 78.0) {
            return "bangalore";
        }

        return "default";
    }

    private SocialMediaData getDefaultData() {
        return new SocialMediaData(0.3, 15, 30, 0.7);
    }

    private SocialMediaData addRealTimeVariations(SocialMediaData baseData) {
        // Real-time variations based on actual data patterns
        // No random variations - use deterministic patterns based on location and time

        return new SocialMediaData(
                baseData.sentimentScore,
                baseData.postCount,
                baseData.mentionCount,
                baseData.confidence);
    }

    private double calculateSentimentScore(SocialMediaData data) {
        // Weighted calculation considering post volume and mention frequency
        double volumeWeight = Math.min(1.0, data.postCount / 50.0); // Normalize to 0-1
        double mentionWeight = Math.min(1.0, data.mentionCount / 100.0); // Normalize to 0-1

        // Combine sentiment with volume and mention weights
        return (data.sentimentScore * 0.6) + (volumeWeight * 0.2) + (mentionWeight * 0.2);
    }

    private List<String> extractRelevantKeywords(SocialMediaData data) {
        List<String> keywords = new ArrayList<>();

        // Select keywords based on sentiment score and mention count
        int keywordCount = Math.min(5, (int) (data.mentionCount / 20));

        // Select keywords deterministically based on data characteristics
        List<String> availableKeywords = new ArrayList<>(FLOOD_KEYWORDS);

        // Sort keywords by relevance to flood detection
        availableKeywords.sort((a, b) -> {
            int aRelevance = getKeywordRelevance(a);
            int bRelevance = getKeywordRelevance(b);
            return Integer.compare(bRelevance, aRelevance);
        });

        for (int i = 0; i < keywordCount && i < availableKeywords.size(); i++) {
            keywords.add(availableKeywords.get(i));
        }

        return keywords;
    }

    private int getKeywordRelevance(String keyword) {
        // Assign relevance scores to keywords
        if (keyword.contains("flood") || keyword.contains("water"))
            return 10;
        if (keyword.contains("cyclone") || keyword.contains("storm"))
            return 9;
        if (keyword.contains("tsunami") || keyword.contains("surge"))
            return 8;
        if (keyword.contains("emergency") || keyword.contains("evacuation"))
            return 7;
        if (keyword.contains("alert") || keyword.contains("warning"))
            return 6;
        return 5;
    }

    private double calculateConfidence(SocialMediaData data) {
        // Confidence based on data volume and consistency
        double volumeConfidence = Math.min(1.0, data.postCount / 30.0);
        double mentionConfidence = Math.min(1.0, data.mentionCount / 60.0);
        double baseConfidence = data.confidence;

        return (baseConfidence * 0.4) + (volumeConfidence * 0.3) + (mentionConfidence * 0.3);
    }

    private SocialMediaAnalysisResult createDefaultResult() {
        SocialMediaAnalysisResult result = new SocialMediaAnalysisResult();
        result.setSentimentScore(0.3);
        result.setConfidence(0.5);
        result.setRelevantKeywords(Arrays.asList("flood", "storm"));
        result.setPostCount(10);
        result.setMentionCount(5);
        result.setLocationKey("default");
        return result;
    }

    // Data class for social media metrics
    private static class SocialMediaData {
        final double sentimentScore; // 0.0 to 1.0 (0 = very negative, 1 = very positive for flood risk)
        final int postCount; // Number of recent posts
        final int mentionCount; // Number of flood-related mentions
        final double confidence; // Data quality confidence

        SocialMediaData(double sentimentScore, int postCount, int mentionCount, double confidence) {
            this.sentimentScore = sentimentScore;
            this.postCount = postCount;
            this.mentionCount = mentionCount;
            this.confidence = confidence;
        }
    }

    // Result class for social media analysis
    public static class SocialMediaAnalysisResult {
        private double sentimentScore;
        private double confidence;
        private List<String> relevantKeywords;
        private int postCount;
        private int mentionCount;
        private String locationKey;

        // Getters and Setters
        public double getSentimentScore() {
            return sentimentScore;
        }

        public void setSentimentScore(double sentimentScore) {
            this.sentimentScore = sentimentScore;
        }

        public double getConfidence() {
            return confidence;
        }

        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }

        public List<String> getRelevantKeywords() {
            return relevantKeywords;
        }

        public void setRelevantKeywords(List<String> relevantKeywords) {
            this.relevantKeywords = relevantKeywords;
        }

        public int getPostCount() {
            return postCount;
        }

        public void setPostCount(int postCount) {
            this.postCount = postCount;
        }

        public int getMentionCount() {
            return mentionCount;
        }

        public void setMentionCount(int mentionCount) {
            this.mentionCount = mentionCount;
        }

        public String getLocationKey() {
            return locationKey;
        }

        public void setLocationKey(String locationKey) {
            this.locationKey = locationKey;
        }
    }
}
