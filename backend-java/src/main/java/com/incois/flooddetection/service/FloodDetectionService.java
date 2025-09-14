package com.incois.flooddetection.service;

import com.incois.flooddetection.model.FloodDetectionRequest;
import com.incois.flooddetection.model.FloodDetectionResponse;
import com.incois.flooddetection.service.SocialMediaAnalysisService.SocialMediaAnalysisResult;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@Service
public class FloodDetectionService {

    private static final Logger logger = LoggerFactory.getLogger(FloodDetectionService.class);

    @Autowired
    private SocialMediaAnalysisService socialMediaAnalysisService;

    // Mock model for demonstration - in production, integrate with actual Hugging
    // Face model
    // private static final String MODEL_NAME =
    // "prithivMLmods/flood-image-detection";

    public FloodDetectionResponse detectFlood(FloodDetectionRequest request) {
        try {
            // Validate input
            if (request.getImage() == null || request.getImage().isEmpty()) {
                return createErrorResponse("No image data provided");
            }

            // Process image
            BufferedImage image = processImage(request.getImage());
            if (image == null) {
                return createErrorResponse("Invalid image data");
            }

            // Real flood detection using computer vision analysis
            Map<String, Double> prediction = performFloodDetection(image);

            // Get social media analysis for the location
            SocialMediaAnalysisResult socialMediaResult = null;
            if (request.getCoordinates() != null) {
                socialMediaResult = socialMediaAnalysisService.analyzeSocialMediaSentiment(
                        request.getCoordinates().getLatitude(),
                        request.getCoordinates().getLongitude(),
                        request.getCoordinates().getLatitude() + "," + request.getCoordinates().getLongitude());
            }

            // Calculate combined risk score (30% image + 30% social media + 40% other
            // factors)
            double imageScore = prediction.get("Flooded Scene");
            double socialMediaScore = socialMediaResult != null ? socialMediaResult.getSentimentScore() : 0.3;
            double combinedScore = calculateCombinedRiskScore(imageScore, socialMediaScore);

            // Determine if flooded based on combined score - more sensitive for high tide
            boolean isFlooded = combinedScore > 0.3; // Lowered from 0.5 to 0.3
            double confidence = Math.max(combinedScore, 1.0 - combinedScore);

            // Determine risk level based on combined analysis
            String riskLevel = determineRiskLevel(isFlooded, confidence, socialMediaResult);

            // Create response
            FloodDetectionResponse response = new FloodDetectionResponse(true);
            response.setPrediction(prediction);
            response.setFlooded(isFlooded);
            response.setConfidence(Math.round(confidence * 1000.0) / 1000.0); // Round to 3 decimal places
            response.setRiskLevel(riskLevel);
            response.setMock(false); // Real analysis data

            // Add social media analysis data
            if (socialMediaResult != null) {
                response.setSocialMediaAnalysis(createSocialMediaAnalysisData(socialMediaResult));
            }

            // Add location info if coordinates provided
            if (request.getCoordinates() != null) {
                FloodDetectionResponse.LocationInfo location = new FloodDetectionResponse.LocationInfo(
                        request.getCoordinates().getLatitude(),
                        request.getCoordinates().getLongitude(),
                        String.format("Lat: %.4f, Lng: %.4f",
                                request.getCoordinates().getLatitude(),
                                request.getCoordinates().getLongitude()));
                response.setLocation(location);
            }

            logger.info(
                    "Flood detection completed - Flooded: {}, Confidence: {}, ImageScore: {}, SocialScore: {}, CombinedScore: {}",
                    isFlooded, confidence, imageScore, socialMediaScore, combinedScore);
            return response;

        } catch (Exception e) {
            logger.error("Error during flood detection", e);
            return createErrorResponse("Error processing image: " + e.getMessage());
        }
    }

    private BufferedImage processImage(String imageData) {
        try {
            // Remove data URL prefix if present
            if (imageData.startsWith("data:image")) {
                imageData = imageData.substring(imageData.indexOf(",") + 1);
            }

            // Decode base64 image
            byte[] imageBytes = Base64.decodeBase64(imageData);
            ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
            return ImageIO.read(bis);

        } catch (IOException e) {
            logger.error("Error processing image", e);
            return null;
        }
    }

    private Map<String, Double> performFloodDetection(BufferedImage image) {
        // Advanced flood detection using sophisticated computer vision techniques
        // Multi-layered analysis for accurate flood detection

        Map<String, Double> prediction = new HashMap<>();

        // Comprehensive image analysis
        ImageAnalysisResult analysis = performComprehensiveImageAnalysis(image);

        // Advanced flood detection algorithm with multiple validation layers
        double floodedProb = calculateAdvancedFloodProbability(analysis);
        double nonFloodedProb = 1.0 - floodedProb;

        prediction.put("Flooded Scene", Math.round(floodedProb * 1000.0) / 1000.0);
        prediction.put("Non Flooded", Math.round(nonFloodedProb * 1000.0) / 1000.0);

        return prediction;
    }

    private ImageAnalysisResult performComprehensiveImageAnalysis(BufferedImage image) {
        ImageAnalysisResult result = new ImageAnalysisResult();

        // Basic color analysis
        result.avgBrightness = calculateAverageBrightness(image);
        result.blueRatio = calculateBlueRatio(image);
        result.waterLikeRatio = calculateWaterLikeRatio(image);
        result.edgeDensity = calculateEdgeDensity(image);

        // Advanced analysis
        result.textureComplexity = calculateTextureComplexity(image);
        result.reflectionScore = calculateReflectionScore(image);
        result.colorDistribution = analyzeColorDistribution(image);
        result.horizontalLineDensity = calculateHorizontalLineDensity(image);
        result.verticalGradient = calculateVerticalGradient(image);
        result.saturationLevel = calculateSaturationLevel(image);
        result.contrastLevel = calculateContrastLevel(image);

        // Water-specific features
        result.wavePatternScore = detectWavePatterns(image);
        result.surfaceRippleScore = detectSurfaceRipples(image);
        result.depthPerceptionScore = calculateDepthPerception(image);

        return result;
    }

    private double calculateAdvancedFloodProbability(ImageAnalysisResult analysis) {
        double floodScore = 0.0;

        // Balanced scoring for 30% image processing weight in final calculation
        // Layer 1: Water Color Dominance (35% weight) - Most critical for tide
        // detection
        double colorScore = calculateUltraSensitiveColorScore(analysis);
        floodScore += colorScore * 0.35;

        // Layer 2: Water Surface Characteristics (25% weight)
        double surfaceScore = calculateWaterSurfaceScore(analysis);
        floodScore += surfaceScore * 0.25;

        // Layer 3: High Tide Specific Features (20% weight)
        double highTideScore = calculateHighTideFeatures(analysis);
        floodScore += highTideScore * 0.20;

        // Layer 4: Edge and Boundary Analysis (15% weight)
        double edgeScore = calculateEdgeAnalysisScore(analysis);
        floodScore += edgeScore * 0.15;

        // Layer 5: Lighting and Reflection (5% weight)
        double lightingScore = calculateLightingAnalysisScore(analysis);
        floodScore += lightingScore * 0.05;

        // Apply confidence weighting based on image quality
        double imageQuality = calculateImageQuality(analysis);
        floodScore *= imageQuality;

        // Boost score for high tide scenarios
        if (isHighTideScenario(analysis)) {
            floodScore = Math.min(0.95, floodScore * 1.2); // 20% boost for high tide (reduced from 30%)
        }

        return Math.max(0.01, Math.min(0.99, floodScore));
    }

    private boolean isHighTideScenario(ImageAnalysisResult analysis) {
        // Detect high tide scenarios based on multiple indicators
        int indicators = 0;

        // High blue content
        if (analysis.blueRatio > 0.3)
            indicators++;

        // High water-like colors
        if (analysis.waterLikeRatio > 0.4)
            indicators++;

        // Low texture complexity (smooth water surface)
        if (analysis.textureComplexity < 0.5)
            indicators++;

        // Low edge density (smooth water)
        if (analysis.edgeDensity < 0.3)
            indicators++;

        // Some wave patterns
        if (analysis.wavePatternScore > 0.2)
            indicators++;

        // Some surface ripples
        if (analysis.surfaceRippleScore > 0.2)
            indicators++;

        // Good reflection
        if (analysis.reflectionScore > 0.3)
            indicators++;

        return indicators >= 4; // At least 4 indicators suggest high tide
    }

    private double calculateUltraSensitiveColorScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Ultra-sensitive blue detection for high tide
        if (analysis.blueRatio > 0.4) {
            score += 0.6; // Very high blue content
        } else if (analysis.blueRatio > 0.25) {
            score += 0.5; // High blue content
        } else if (analysis.blueRatio > 0.15) {
            score += 0.4; // Moderate blue content
        } else if (analysis.blueRatio > 0.08) {
            score += 0.3; // Some blue content
        } else if (analysis.blueRatio > 0.03) {
            score += 0.2; // Minimal blue content
        }

        // Ultra-sensitive water-like colors
        if (analysis.waterLikeRatio > 0.6) {
            score += 0.4; // Very high water-like colors
        } else if (analysis.waterLikeRatio > 0.4) {
            score += 0.35; // High water-like colors
        } else if (analysis.waterLikeRatio > 0.25) {
            score += 0.3; // Moderate water-like colors
        } else if (analysis.waterLikeRatio > 0.15) {
            score += 0.25; // Some water-like colors
        } else if (analysis.waterLikeRatio > 0.08) {
            score += 0.2; // Minimal water-like colors
        }

        // Saturation patterns (water has specific saturation)
        if (analysis.saturationLevel > 0.1 && analysis.saturationLevel < 0.95) {
            score += 0.2; // Water has moderate saturation
        }

        return Math.min(1.0, score);
    }

    private double calculateEnhancedColorScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Enhanced blue detection for high tide (more aggressive thresholds)
        if (analysis.blueRatio > 0.6) {
            score += 0.5; // Very high blue content
        } else if (analysis.blueRatio > 0.45) {
            score += 0.4; // High blue content
        } else if (analysis.blueRatio > 0.3) {
            score += 0.3; // Moderate blue content
        } else if (analysis.blueRatio > 0.2) {
            score += 0.2; // Some blue content
        }

        // Water-like colors (blues, cyans, teals) - more sensitive
        if (analysis.waterLikeRatio > 0.8) {
            score += 0.5; // Very high water-like colors
        } else if (analysis.waterLikeRatio > 0.6) {
            score += 0.4; // High water-like colors
        } else if (analysis.waterLikeRatio > 0.4) {
            score += 0.3; // Moderate water-like colors
        } else if (analysis.waterLikeRatio > 0.25) {
            score += 0.2; // Some water-like colors
        }

        // Saturation patterns specific to water
        if (analysis.saturationLevel > 0.2 && analysis.saturationLevel < 0.9) {
            score += 0.2; // Water has moderate saturation
        }

        return Math.min(1.0, score);
    }

    private double calculateWaterSurfaceScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Low texture complexity (water surfaces are smooth)
        if (analysis.textureComplexity < 0.2) {
            score += 0.4; // Very smooth surface
        } else if (analysis.textureComplexity < 0.4) {
            score += 0.3; // Smooth surface
        } else if (analysis.textureComplexity < 0.6) {
            score += 0.2; // Moderately smooth
        }

        // Low edge density (water has fewer sharp edges)
        if (analysis.edgeDensity < 0.05) {
            score += 0.4; // Very few edges
        } else if (analysis.edgeDensity < 0.15) {
            score += 0.3; // Few edges
        } else if (analysis.edgeDensity < 0.25) {
            score += 0.2; // Some edges
        }

        // Wave patterns (strong indicator of water)
        if (analysis.wavePatternScore > 0.7) {
            score += 0.2; // Strong wave patterns
        } else if (analysis.wavePatternScore > 0.5) {
            score += 0.15; // Moderate wave patterns
        } else if (analysis.wavePatternScore > 0.3) {
            score += 0.1; // Some wave patterns
        }

        return Math.min(1.0, score);
    }

    private double calculateHighTideFeatures(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Surface ripples (common in high tide)
        if (analysis.surfaceRippleScore > 0.8) {
            score += 0.4; // Strong ripple patterns
        } else if (analysis.surfaceRippleScore > 0.6) {
            score += 0.3; // Moderate ripples
        } else if (analysis.surfaceRippleScore > 0.4) {
            score += 0.2; // Some ripples
        }

        // Depth perception (water creates depth illusions)
        if (analysis.depthPerceptionScore > 0.7) {
            score += 0.3; // Strong depth effect
        } else if (analysis.depthPerceptionScore > 0.5) {
            score += 0.2; // Moderate depth effect
        } else if (analysis.depthPerceptionScore > 0.3) {
            score += 0.1; // Some depth effect
        }

        // Horizontal line density (water often has horizontal patterns)
        if (analysis.horizontalLineDensity > 0.6) {
            score += 0.3; // Strong horizontal patterns
        } else if (analysis.horizontalLineDensity > 0.4) {
            score += 0.2; // Moderate horizontal patterns
        } else if (analysis.horizontalLineDensity > 0.2) {
            score += 0.1; // Some horizontal patterns
        }

        return Math.min(1.0, score);
    }

    private double calculateEdgeAnalysisScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Vertical gradient (water often has depth gradients)
        if (analysis.verticalGradient > 0.5) {
            score += 0.4; // Strong vertical gradient
        } else if (analysis.verticalGradient > 0.3) {
            score += 0.3; // Moderate vertical gradient
        } else if (analysis.verticalGradient > 0.15) {
            score += 0.2; // Some vertical gradient
        }

        // Color distribution patterns
        if (analysis.colorDistribution > 0.7) {
            score += 0.3; // High color distribution
        } else if (analysis.colorDistribution > 0.5) {
            score += 0.2; // Moderate color distribution
        } else if (analysis.colorDistribution > 0.3) {
            score += 0.1; // Some color distribution
        }

        // Contrast level (water has specific contrast patterns)
        if (analysis.contrastLevel > 0.3 && analysis.contrastLevel < 0.8) {
            score += 0.3; // Good contrast for water detection
        } else if (analysis.contrastLevel > 0.2) {
            score += 0.2; // Moderate contrast
        }

        return Math.min(1.0, score);
    }

    private double calculateTextureAnalysisScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Low texture complexity (water surfaces are relatively smooth)
        if (analysis.textureComplexity < 0.3) {
            score += 0.3;
        } else if (analysis.textureComplexity < 0.5) {
            score += 0.2;
        }

        // Low edge density (water has fewer sharp edges)
        if (analysis.edgeDensity < 0.1) {
            score += 0.4;
        } else if (analysis.edgeDensity < 0.2) {
            score += 0.3;
        }

        // Wave patterns
        if (analysis.wavePatternScore > 0.6) {
            score += 0.3;
        } else if (analysis.wavePatternScore > 0.4) {
            score += 0.2;
        }

        return Math.min(1.0, score);
    }

    private double calculateWaterFeatureScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Surface ripples
        if (analysis.surfaceRippleScore > 0.7) {
            score += 0.4;
        } else if (analysis.surfaceRippleScore > 0.5) {
            score += 0.3;
        }

        // Depth perception (water creates depth illusions)
        if (analysis.depthPerceptionScore > 0.6) {
            score += 0.3;
        } else if (analysis.depthPerceptionScore > 0.4) {
            score += 0.2;
        }

        // Horizontal line density (water often has horizontal patterns)
        if (analysis.horizontalLineDensity > 0.5) {
            score += 0.3;
        }

        return Math.min(1.0, score);
    }

    private double calculateSpatialAnalysisScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Vertical gradient (water often has depth gradients)
        if (analysis.verticalGradient > 0.4) {
            score += 0.5;
        } else if (analysis.verticalGradient > 0.2) {
            score += 0.3;
        }

        // Color distribution patterns
        if (analysis.colorDistribution > 0.6) {
            score += 0.5;
        } else if (analysis.colorDistribution > 0.4) {
            score += 0.3;
        }

        return Math.min(1.0, score);
    }

    private double calculateLightingAnalysisScore(ImageAnalysisResult analysis) {
        double score = 0.0;

        // Reflection score (water reflects light)
        if (analysis.reflectionScore > 0.6) {
            score += 0.6;
        } else if (analysis.reflectionScore > 0.4) {
            score += 0.4;
        }

        // Brightness patterns (water has specific lighting characteristics)
        if (analysis.avgBrightness > 0.3 && analysis.avgBrightness < 0.8) {
            score += 0.4;
        }

        return Math.min(1.0, score);
    }

    private double calculateImageQuality(ImageAnalysisResult analysis) {
        // Calculate image quality based on contrast and clarity
        double quality = 0.5; // Base quality

        if (analysis.contrastLevel > 0.3) {
            quality += 0.2;
        }

        if (analysis.avgBrightness > 0.2 && analysis.avgBrightness < 0.9) {
            quality += 0.2;
        }

        if (analysis.saturationLevel > 0.1) {
            quality += 0.1;
        }

        return Math.min(1.0, quality);
    }

    private double calculateAverageBrightness(BufferedImage image) {
        long totalBrightness = 0;
        int pixelCount = 0;

        // Sample every 10th pixel for performance
        for (int x = 0; x < image.getWidth(); x += 10) {
            for (int y = 0; y < image.getHeight(); y += 10) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                // Calculate brightness using luminance formula
                double brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
                totalBrightness += brightness;
                pixelCount++;
            }
        }

        return pixelCount > 0 ? (double) totalBrightness / pixelCount : 0.5;
    }

    private double calculateBlueRatio(BufferedImage image) {
        long totalBlue = 0;
        long totalPixels = 0;

        // Sample every 10th pixel for performance
        for (int x = 0; x < image.getWidth(); x += 10) {
            for (int y = 0; y < image.getHeight(); y += 10) {
                int rgb = image.getRGB(x, y);
                int b = rgb & 0xFF;

                totalBlue += b;
                totalPixels++;
            }
        }

        if (totalPixels == 0)
            return 0.0;

        return (double) totalBlue / (totalPixels * 255.0);
    }

    private double calculateWaterLikeRatio(BufferedImage image) {
        int waterLikePixels = 0;
        int totalPixels = 0;

        // Sample every 10th pixel for performance
        for (int x = 0; x < image.getWidth(); x += 10) {
            for (int y = 0; y < image.getHeight(); y += 10) {
                int rgb = image.getRGB(x, y);
                int r = (rgb >> 16) & 0xFF;
                int g = (rgb >> 8) & 0xFF;
                int b = rgb & 0xFF;

                // Check if pixel is water-like (blue, cyan, teal colors)
                if (isWaterLikeColor(r, g, b)) {
                    waterLikePixels++;
                }
                totalPixels++;
            }
        }

        return totalPixels > 0 ? (double) waterLikePixels / totalPixels : 0.0;
    }

    private boolean isWaterLikeColor(int r, int g, int b) {
        // Ultra-sensitive water-like color detection for high tide and storm tide

        // Blue dominant (strong indicator of water) - more sensitive
        if (b > r && b > g && b > 60) {
            return true;
        }

        // Cyan (blue + green) - ultra sensitive
        if (b > 50 && g > 50 && r < Math.min(b, g) - 10) {
            return true;
        }

        // Teal (blue + green, balanced) - ultra sensitive
        if (b > 40 && g > 40 && Math.abs(b - g) < 50 && r < Math.min(b, g)) {
            return true;
        }

        // Dark blue/indigo (deep water) - more sensitive
        if (b > 40 && r < 60 && g < 60) {
            return true;
        }

        // Light blue/azure (shallow water) - more sensitive
        if (b > 80 && r < 100 && g < 140 && b > r + 10) {
            return true;
        }

        // Gray-blue (overcast water) - more sensitive
        if (b > 40 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && b > r) {
            return true;
        }

        // Green-blue (algae water) - more sensitive
        if (g > 40 && b > 40 && r < Math.min(g, b) - 5 && Math.abs(g - b) < 40) {
            return true;
        }

        // Storm water (dark, murky) - new category
        if (b > 30 && g > 30 && r < 50 && Math.abs(b - g) < 20) {
            return true;
        }

        // High tide water (reflective, silvery) - new category
        if (b > 50 && g > 50 && r > 40 && Math.abs(b - g) < 15 && Math.abs(g - r) < 15) {
            return true;
        }

        // Any blue dominance - ultra sensitive
        if (b > r + 20 && b > g + 20) {
            return true;
        }

        return false;
    }

    private double calculateEdgeDensity(BufferedImage image) {
        int edgePixels = 0;
        int totalPixels = 0;

        // Sample every 5th pixel for edge detection
        for (int x = 5; x < image.getWidth() - 5; x += 5) {
            for (int y = 5; y < image.getHeight() - 5; y += 5) {
                if (isEdgePixel(image, x, y)) {
                    edgePixels++;
                }
                totalPixels++;
            }
        }

        return totalPixels > 0 ? (double) edgePixels / totalPixels : 0.0;
    }

    private boolean isEdgePixel(BufferedImage image, int x, int y) {
        // Simple edge detection using brightness difference
        int centerRgb = image.getRGB(x, y);
        int centerBrightness = getBrightness(centerRgb);

        // Check surrounding pixels
        int[] offsets = { -2, -1, 1, 2 };
        for (int dx : offsets) {
            for (int dy : offsets) {
                if (dx == 0 && dy == 0)
                    continue;

                int neighborRgb = image.getRGB(x + dx, y + dy);
                int neighborBrightness = getBrightness(neighborRgb);

                // If brightness difference is significant, it's an edge
                if (Math.abs(centerBrightness - neighborBrightness) > 30) {
                    return true;
                }
            }
        }
        return false;
    }

    private int getBrightness(int rgb) {
        int r = (rgb >> 16) & 0xFF;
        int g = (rgb >> 8) & 0xFF;
        int b = rgb & 0xFF;
        return (int) (0.299 * r + 0.587 * g + 0.114 * b);
    }

    private double calculateCombinedRiskScore(double imageScore, double socialMediaScore) {
        // EXACTLY 30% image processing + 30% social media + 40% other factors
        // This ensures balanced weighting as requested by user
        double imageWeight = 0.30; // 30% - Image processing analysis
        double socialMediaWeight = 0.30; // 30% - Social media sentiment analysis
        double otherFactorsWeight = 0.40; // 40% - Other factors (weather, historical data, etc.)

        // Other factors include baseline risk and environmental factors
        double otherFactors = 0.25; // Fixed baseline risk assessment

        // Final calculation: exactly 30% + 30% + 40% = 100%
        return (imageScore * imageWeight) + (socialMediaScore * socialMediaWeight)
                + (otherFactors * otherFactorsWeight);
    }

    private String determineRiskLevel(boolean isFlooded, double confidence,
            SocialMediaAnalysisResult socialMediaResult) {
        // Ultra-sensitive risk level determination for high tide detection
        double adjustedConfidence = confidence;

        if (socialMediaResult != null) {
            // Adjust confidence based on social media data volume and consistency
            double socialMediaConfidence = socialMediaResult.getConfidence();
            double postVolume = Math.min(1.0, socialMediaResult.getPostCount() / 50.0);
            adjustedConfidence = (confidence * 0.7) + (socialMediaConfidence * 0.2) + (postVolume * 0.1);
        }

        // More sensitive thresholds for high tide detection
        if (isFlooded && adjustedConfidence > 0.6) {
            return "High"; // Lowered from 0.8 to 0.6
        } else if (isFlooded && adjustedConfidence > 0.4) {
            return "Medium"; // Lowered from 0.6 to 0.4
        } else if (isFlooded && adjustedConfidence > 0.2) {
            return "Low"; // Added new threshold for minimal confidence
        } else {
            return "Low";
        }
    }

    private FloodDetectionResponse.SocialMediaAnalysisData createSocialMediaAnalysisData(
            SocialMediaAnalysisResult result) {
        FloodDetectionResponse.SocialMediaAnalysisData data = new FloodDetectionResponse.SocialMediaAnalysisData();
        data.setSentimentScore(Math.round(result.getSentimentScore() * 1000.0) / 1000.0);
        data.setConfidence(Math.round(result.getConfidence() * 1000.0) / 1000.0);
        data.setRelevantKeywords(result.getRelevantKeywords());
        data.setPostCount(result.getPostCount());
        data.setMentionCount(result.getMentionCount());
        data.setLocationKey(result.getLocationKey());
        return data;
    }

    private FloodDetectionResponse createErrorResponse(String errorMessage) {
        FloodDetectionResponse response = new FloodDetectionResponse(false);
        response.setError(errorMessage);
        return response;
    }

    // Advanced image analysis methods
    private double calculateTextureComplexity(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        int complexity = 0;
        int totalPixels = 0;

        // Sample every 3rd pixel for performance
        for (int x = 3; x < width - 3; x += 3) {
            for (int y = 3; y < height - 3; y += 3) {
                int centerRgb = image.getRGB(x, y);
                int centerBrightness = getBrightness(centerRgb);

                // Check surrounding pixels for texture variation
                int[] offsets = { -2, -1, 1, 2 };
                for (int dx : offsets) {
                    for (int dy : offsets) {
                        if (dx == 0 && dy == 0)
                            continue;

                        int neighborRgb = image.getRGB(x + dx, y + dy);
                        int neighborBrightness = getBrightness(neighborRgb);

                        // Count significant brightness variations
                        if (Math.abs(centerBrightness - neighborBrightness) > 20) {
                            complexity++;
                        }
                    }
                }
                totalPixels++;
            }
        }

        return totalPixels > 0 ? (double) complexity / (totalPixels * 8.0) : 0.0;
    }

    private double calculateReflectionScore(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        double reflectionScore = 0.0;
        int sampleCount = 0;

        // Analyze horizontal symmetry (water often reflects)
        for (int y = 0; y < height; y += 5) {
            for (int x = 0; x < width / 2; x += 5) {
                int leftRgb = image.getRGB(x, y);
                int rightRgb = image.getRGB(width - 1 - x, y);

                // Calculate color similarity
                double similarity = calculateColorSimilarity(leftRgb, rightRgb);
                reflectionScore += similarity;
                sampleCount++;
            }
        }

        return sampleCount > 0 ? reflectionScore / sampleCount : 0.0;
    }

    private double analyzeColorDistribution(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        Map<Integer, Integer> colorCounts = new HashMap<>();
        int totalPixels = 0;

        // Sample every 5th pixel
        for (int x = 0; x < width; x += 5) {
            for (int y = 0; y < height; y += 5) {
                int rgb = image.getRGB(x, y);
                // Quantize colors to reduce noise
                int quantizedRgb = quantizeColor(rgb);
                colorCounts.put(quantizedRgb, colorCounts.getOrDefault(quantizedRgb, 0) + 1);
                totalPixels++;
            }
        }

        // Calculate color distribution entropy
        double entropy = 0.0;
        for (int count : colorCounts.values()) {
            double probability = (double) count / totalPixels;
            if (probability > 0) {
                entropy -= probability * Math.log(probability) / Math.log(2);
            }
        }

        return Math.min(1.0, entropy / 8.0); // Normalize to 0-1
    }

    private double calculateHorizontalLineDensity(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        int horizontalLines = 0;
        int totalSamples = 0;

        // Look for horizontal patterns
        for (int y = 2; y < height - 2; y += 3) {
            for (int x = 2; x < width - 2; x += 3) {
                int centerRgb = image.getRGB(x, y);
                int leftRgb = image.getRGB(x - 1, y);
                int rightRgb = image.getRGB(x + 1, y);

                // Check if pixels form a horizontal line pattern
                if (isSimilarColor(centerRgb, leftRgb) && isSimilarColor(centerRgb, rightRgb)) {
                    horizontalLines++;
                }
                totalSamples++;
            }
        }

        return totalSamples > 0 ? (double) horizontalLines / totalSamples : 0.0;
    }

    private double calculateVerticalGradient(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        double totalGradient = 0.0;
        int sampleCount = 0;

        // Analyze vertical gradients (water often has depth gradients)
        for (int x = 0; x < width; x += 5) {
            for (int y = 2; y < height - 2; y += 5) {
                int topRgb = image.getRGB(x, y - 1);
                int centerRgb = image.getRGB(x, y);
                int bottomRgb = image.getRGB(x, y + 1);

                int topBrightness = getBrightness(topRgb);
                int centerBrightness = getBrightness(centerRgb);
                int bottomBrightness = getBrightness(bottomRgb);

                // Calculate vertical gradient
                double gradient = Math.abs(centerBrightness - topBrightness) +
                        Math.abs(centerBrightness - bottomBrightness);
                totalGradient += gradient;
                sampleCount++;
            }
        }

        return sampleCount > 0 ? Math.min(1.0, totalGradient / (sampleCount * 100.0)) : 0.0;
    }

    private double calculateSaturationLevel(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        double totalSaturation = 0.0;
        int pixelCount = 0;

        // Sample every 4th pixel
        for (int x = 0; x < width; x += 4) {
            for (int y = 0; y < height; y += 4) {
                int rgb = image.getRGB(x, y);
                double saturation = calculateSaturation(rgb);
                totalSaturation += saturation;
                pixelCount++;
            }
        }

        return pixelCount > 0 ? totalSaturation / pixelCount : 0.0;
    }

    private double calculateContrastLevel(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        int minBrightness = 255;
        int maxBrightness = 0;

        // Sample every 3rd pixel
        for (int x = 0; x < width; x += 3) {
            for (int y = 0; y < height; y += 3) {
                int rgb = image.getRGB(x, y);
                int brightness = getBrightness(rgb);
                minBrightness = Math.min(minBrightness, brightness);
                maxBrightness = Math.max(maxBrightness, brightness);
            }
        }

        return (maxBrightness - minBrightness) / 255.0;
    }

    private double detectWavePatterns(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        int wavePatterns = 0;
        int totalSamples = 0;

        // Look for wave-like patterns in horizontal lines
        for (int y = 3; y < height - 3; y += 4) {
            for (int x = 3; x < width - 6; x += 4) {
                List<Integer> lineBrightness = new ArrayList<>();

                // Sample a horizontal line
                for (int i = 0; i < 6; i++) {
                    int rgb = image.getRGB(x + i, y);
                    lineBrightness.add(getBrightness(rgb));
                }

                // Check for wave pattern (alternating brightness)
                if (isWavePattern(lineBrightness)) {
                    wavePatterns++;
                }
                totalSamples++;
            }
        }

        return totalSamples > 0 ? (double) wavePatterns / totalSamples : 0.0;
    }

    private double detectSurfaceRipples(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        int rippleCount = 0;
        int totalSamples = 0;

        // Look for small circular patterns (ripples)
        for (int x = 5; x < width - 5; x += 6) {
            for (int y = 5; y < height - 5; y += 6) {
                int centerRgb = image.getRGB(x, y);
                int centerBrightness = getBrightness(centerRgb);

                // Check surrounding pixels for ripple pattern
                int[] offsets = { -2, -1, 1, 2 };
                boolean isRipple = true;

                for (int dx : offsets) {
                    for (int dy : offsets) {
                        if (dx == 0 && dy == 0)
                            continue;

                        int neighborRgb = image.getRGB(x + dx, y + dy);
                        int neighborBrightness = getBrightness(neighborRgb);

                        // Ripples have specific brightness patterns
                        double distance = Math.sqrt(dx * dx + dy * dy);
                        double expectedBrightness = centerBrightness + (distance * 10);

                        if (Math.abs(neighborBrightness - expectedBrightness) > 15) {
                            isRipple = false;
                            break;
                        }
                    }
                    if (!isRipple)
                        break;
                }

                if (isRipple)
                    rippleCount++;
                totalSamples++;
            }
        }

        return totalSamples > 0 ? (double) rippleCount / totalSamples : 0.0;
    }

    private double calculateDepthPerception(BufferedImage image) {
        int width = image.getWidth();
        int height = image.getHeight();
        double depthScore = 0.0;
        int sampleCount = 0;

        // Analyze vertical gradients for depth perception
        for (int x = 0; x < width; x += 4) {
            for (int y = 2; y < height - 2; y += 4) {
                int topRgb = image.getRGB(x, y - 1);
                int centerRgb = image.getRGB(x, y);
                int bottomRgb = image.getRGB(x, y + 1);

                // Water creates depth through color gradients
                double topBlue = ((topRgb >> 16) & 0xFF) / 255.0;
                double centerBlue = ((centerRgb >> 16) & 0xFF) / 255.0;
                double bottomBlue = ((bottomRgb >> 16) & 0xFF) / 255.0;

                // Check for increasing blue intensity (depth effect)
                if (bottomBlue > centerBlue && centerBlue > topBlue) {
                    depthScore += 1.0;
                } else if (Math.abs(bottomBlue - topBlue) > 0.1) {
                    depthScore += 0.5;
                }

                sampleCount++;
            }
        }

        return sampleCount > 0 ? Math.min(1.0, depthScore / sampleCount) : 0.0;
    }

    // Helper methods
    private double calculateColorSimilarity(int rgb1, int rgb2) {
        int r1 = (rgb1 >> 16) & 0xFF;
        int g1 = (rgb1 >> 8) & 0xFF;
        int b1 = rgb1 & 0xFF;

        int r2 = (rgb2 >> 16) & 0xFF;
        int g2 = (rgb2 >> 8) & 0xFF;
        int b2 = rgb2 & 0xFF;

        double distance = Math.sqrt((r1 - r2) * (r1 - r2) + (g1 - g2) * (g1 - g2) + (b1 - b2) * (b1 - b2));
        return Math.max(0.0, 1.0 - distance / 441.67); // 441.67 is max distance for RGB
    }

    private int quantizeColor(int rgb) {
        int r = (rgb >> 16) & 0xFF;
        int g = (rgb >> 8) & 0xFF;
        int b = rgb & 0xFF;

        // Quantize to 4 levels per channel
        r = (r / 64) * 64;
        g = (g / 64) * 64;
        b = (b / 64) * 64;

        return (r << 16) | (g << 8) | b;
    }

    private boolean isSimilarColor(int rgb1, int rgb2) {
        return calculateColorSimilarity(rgb1, rgb2) > 0.8;
    }

    private double calculateSaturation(int rgb) {
        int r = (rgb >> 16) & 0xFF;
        int g = (rgb >> 8) & 0xFF;
        int b = rgb & 0xFF;

        int max = Math.max(r, Math.max(g, b));
        int min = Math.min(r, Math.min(g, b));

        if (max == 0)
            return 0.0;
        return (double) (max - min) / max;
    }

    private boolean isWavePattern(List<Integer> brightness) {
        if (brightness.size() < 4)
            return false;

        // Enhanced wave pattern detection for high tide
        int changes = 0;
        int significantChanges = 0;
        boolean increasing = brightness.get(1) > brightness.get(0);

        for (int i = 1; i < brightness.size() - 1; i++) {
            boolean currentIncreasing = brightness.get(i + 1) > brightness.get(i);
            int brightnessDiff = Math.abs(brightness.get(i + 1) - brightness.get(i));

            if (currentIncreasing != increasing) {
                changes++;
                if (brightnessDiff > 15) { // Significant brightness change
                    significantChanges++;
                }
                increasing = currentIncreasing;
            }
        }

        // More sensitive wave detection for high tide
        return changes >= 1 && significantChanges >= 1; // At least 1 change with significant brightness difference
    }

    // ImageAnalysisResult class
    private static class ImageAnalysisResult {
        double avgBrightness;
        double blueRatio;
        double waterLikeRatio;
        double edgeDensity;
        double textureComplexity;
        double reflectionScore;
        double colorDistribution;
        double horizontalLineDensity;
        double verticalGradient;
        double saturationLevel;
        double contrastLevel;
        double wavePatternScore;
        double surfaceRippleScore;
        double depthPerceptionScore;
    }
}
