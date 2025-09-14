package com.incois.flooddetection;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin(origins = "*")
public class FloodDetectionApplication {

    public static void main(String[] args) {
        SpringApplication.run(FloodDetectionApplication.class, args);
    }
}
