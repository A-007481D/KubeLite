package com.ork8stra.infrastructure.storage;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class LogArchiveController {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;

    @GetMapping("/builds/{buildId}/logs/archive")
    public ResponseEntity<byte[]> downloadBuildLog(@PathVariable UUID buildId) {
        try {
            String objectKey = "builds/" + buildId + "/build.log";
            try (InputStream is = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(minioConfig.getBucket())
                            .object(objectKey)
                            .build())) {
                byte[] bytes = is.readAllBytes();
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"build-" + buildId + ".log\"")
                        .contentType(MediaType.TEXT_PLAIN)
                        .body(bytes);
            }
        } catch (Exception e) {
            log.warn("Log archive not found for build '{}'", buildId);
            return ResponseEntity.notFound().build();
        }
    }
}
