package com.incois.flooddetection.controller;

import com.incois.flooddetection.model.FloodDetectionRequest;
import com.incois.flooddetection.model.FloodDetectionResponse;
import com.incois.flooddetection.service.FloodDetectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FloodDetectionController {

    private static final Logger logger = LoggerFactory.getLogger(FloodDetectionController.class);

    @Autowired
    private FloodDetectionService floodDetectionService;

    @PostMapping("/flood-detection")
    public ResponseEntity<FloodDetectionResponse> detectFlood(@RequestBody FloodDetectionRequest request) {
        try {
            logger.info("Received flood detection request");

            if (request.getImage() == null || request.getImage().isEmpty()) {
                FloodDetectionResponse errorResponse = new FloodDetectionResponse(false);
                errorResponse.setError("No image data provided");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            FloodDetectionResponse response = floodDetectionService.detectFlood(request);

            if (response.isSuccess()) {
                logger.info("Flood detection completed successfully");
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Flood detection failed: {}", response.getError());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (Exception e) {
            logger.error("Unexpected error in flood detection", e);
            FloodDetectionResponse errorResponse = new FloodDetectionResponse(false);
            errorResponse.setError("Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> healthCheck() {
        HealthResponse health = new HealthResponse("healthy", "prithivMLmods/flood-image-detection");
        return ResponseEntity.ok(health);
    }

    // Inner class for health response
    public static class HealthResponse {
        private String status;
        private String model;

        public HealthResponse(String status, String model) {
            this.status = status;
            this.model = model;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getModel() {
            return model;
        }

        public void setModel(String model) {
            this.model = model;
        }
    }
}
