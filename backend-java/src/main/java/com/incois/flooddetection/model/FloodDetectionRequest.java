package com.incois.flooddetection.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FloodDetectionRequest {

    @JsonProperty("image")
    private String image;

    @JsonProperty("coordinates")
    private Coordinates coordinates;

    public FloodDetectionRequest() {
    }

    public FloodDetectionRequest(String image, Coordinates coordinates) {
        this.image = image;
        this.coordinates = coordinates;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }

    public static class Coordinates {
        @JsonProperty("latitude")
        private double latitude;

        @JsonProperty("longitude")
        private double longitude;

        public Coordinates() {
        }

        public Coordinates(double latitude, double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
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
    }
}
