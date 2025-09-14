package com.incois.flooddetection.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class FloodDetectionResponse {

    @JsonProperty("success")
    private boolean success;

    @JsonProperty("prediction")
    private Map<String, Double> prediction;

    @JsonProperty("is_flooded")
    private boolean isFlooded;

    @JsonProperty("confidence")
    private double confidence;

    @JsonProperty("risk_level")
    private String riskLevel;

    @JsonProperty("location")
    private LocationInfo location;

    @JsonProperty("error")
    private String error;

    @JsonProperty("mock")
    private boolean mock = false;

    @JsonProperty("social_media_analysis")
    private SocialMediaAnalysisData socialMediaAnalysis;

    public FloodDetectionResponse() {
    }

    public FloodDetectionResponse(boolean success) {
        this.success = success;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Map<String, Double> getPrediction() {
        return prediction;
    }

    public void setPrediction(Map<String, Double> prediction) {
        this.prediction = prediction;
    }

    public boolean isFlooded() {
        return isFlooded;
    }

    public void setFlooded(boolean flooded) {
        isFlooded = flooded;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public LocationInfo getLocation() {
        return location;
    }

    public void setLocation(LocationInfo location) {
        this.location = location;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public boolean isMock() {
        return mock;
    }

    public void setMock(boolean mock) {
        this.mock = mock;
    }

    public SocialMediaAnalysisData getSocialMediaAnalysis() {
        return socialMediaAnalysis;
    }

    public void setSocialMediaAnalysis(SocialMediaAnalysisData socialMediaAnalysis) {
        this.socialMediaAnalysis = socialMediaAnalysis;
    }

    public static class LocationInfo {
        @JsonProperty("latitude")
        private double latitude;

        @JsonProperty("longitude")
        private double longitude;

        @JsonProperty("address")
        private String address;

        public LocationInfo() {
        }

        public LocationInfo(double latitude, double longitude, String address) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.address = address;
        }

        public double getLatitude() {
            return latitude;
        }

        public void setLatitude(double latitude) {
            this.latitude = latitude;
        }

        public double getLongitude() {
            return longitude;
        }

        public void setLongitude(double longitude) {
            this.longitude = longitude;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public static class SocialMediaAnalysisData {
        @JsonProperty("sentiment_score")
        private double sentimentScore;

        @JsonProperty("confidence")
        private double confidence;

        @JsonProperty("relevant_keywords")
        private java.util.List<String> relevantKeywords;

        @JsonProperty("post_count")
        private int postCount;

        @JsonProperty("mention_count")
        private int mentionCount;

        @JsonProperty("location_key")
        private String locationKey;

        public SocialMediaAnalysisData() {
        }

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

        public java.util.List<String> getRelevantKeywords() {
            return relevantKeywords;
        }

        public void setRelevantKeywords(java.util.List<String> relevantKeywords) {
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
