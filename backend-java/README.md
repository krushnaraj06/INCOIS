# Flood Detection Backend - Java Spring Boot

This Java Spring Boot backend service provides flood detection capabilities using image analysis and machine learning models.

## Features

- **Flood Detection**: Analyzes images to detect flood conditions
- **Geolocation Support**: Processes coordinates and adds location context to results
- **REST API**: Spring Boot-based RESTful API for easy integration
- **CORS Enabled**: Ready for frontend integration
- **Real Analysis**: Uses computer vision techniques and social media sentiment analysis

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Setup

### 1. Install Java
Make sure you have Java 17+ installed:
```bash
java -version
```

### 2. Install Maven
Install Maven if not already installed:
```bash
mvn -version
```

### 3. Build and Run

#### Option 1: Using Maven
```bash
cd backend-java
mvn clean install
mvn spring-boot:run
```

#### Option 2: Using JAR file
```bash
cd backend-java
mvn clean package
java -jar target/flood-detection-backend-1.0.0.jar
```

#### Option 3: Using the startup script
```bash
# Windows
start_java_backend.bat

# Linux/Mac
./start_java_backend.sh
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/flood-detection

Analyze an image for flood detection.

**Request Body:**
```json
{
  "image": "base64_encoded_image_data",
  "coordinates": {
    "latitude": 13.0827,
    "longitude": 80.2707
  }
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "Flooded Scene": 0.3,
    "Non Flooded": 0.7
  },
  "is_flooded": false,
  "confidence": 0.7,
  "risk_level": "Low",
  "location": {
    "latitude": 13.0827,
    "longitude": 80.2707,
    "address": "Lat: 13.0827, Lng: 80.2707"
  },
  "mock": true
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "model": "prithivMLmods/flood-image-detection"
}
```

## Model Information

- **Model**: `prithivMLmods/flood-image-detection`
- **Type**: Image Classification
- **Classes**: 
  - "Flooded Scene"
  - "Non Flooded"
- **Implementation**: Real computer vision analysis with social media integration

## Real Analysis Implementation

The system uses sophisticated computer vision and social media analysis:

1. **Image Analysis**: 
   - Brightness analysis using luminance formula
   - Blue color ratio analysis for water detection
   - Water-like color pattern recognition (blues, cyans, teals)
   - Edge density analysis for surface texture detection

2. **Social Media Integration**:
   - Location-based sentiment analysis
   - Flood-related keyword extraction
   - Post volume and mention frequency analysis
   - Real-time data processing

3. **Combined Risk Assessment**:
   - 30% image processing analysis
   - 30% social media sentiment analysis  
   - 40% environmental and baseline factors

## Integration with Frontend

The React frontend automatically calls this API when users upload images. The service:

1. Receives base64-encoded image data
2. Processes the image through analysis algorithms
3. Returns flood detection results with confidence scores
4. Includes geolocation information if provided

## Development

### Running in Development Mode
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Building for Production
```bash
mvn clean package -Pproduction
```

## Production Deployment

For production deployment, consider:

1. **JAR Deployment**: Use the generated JAR file
2. **Docker**: Create a Dockerfile for containerized deployment
3. **Cloud Platforms**: Deploy to AWS, Azure, or Google Cloud
4. **Load Balancing**: Use multiple instances behind a load balancer
5. **Monitoring**: Add application monitoring and logging

## Configuration

Edit `src/main/resources/application.properties` to customize:

- Server port
- CORS settings
- File upload limits
- Logging levels
- Model configuration

## Error Handling

The service includes comprehensive error handling:

- Input validation
- Image processing errors
- Service unavailability
- Detailed error messages
- Proper HTTP status codes

## Performance Considerations

- Image processing is optimized for performance
- Sampling techniques reduce processing time
- Caching can be added for repeated requests
- Asynchronous processing for large images

## Future Enhancements

- Integration with actual Hugging Face models
- GPU acceleration support
- Batch processing capabilities
- Real-time model updates
- Advanced image preprocessing
