package com.ork8stra.infrastructure.storage;

import com.ork8stra.buildengine.Build;
import com.ork8stra.buildengine.BuildCompletedEvent;
import com.ork8stra.buildengine.BuildRepository;
import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LogArchiverService {

    private final MinioClient minioClient;
    private final MinioConfig minioConfig;
    private final KubernetesClient kubernetesClient;
    private final BuildRepository buildRepository;

    @ApplicationModuleListener
    public void onBuildCompleted(BuildCompletedEvent event) {
        UUID buildId = event.buildId();
        Optional<Build> buildOpt = buildRepository.findById(buildId);
        if (buildOpt.isEmpty())
            return;

        Build build = buildOpt.get();
        String jobName = build.getJobName();
        if (jobName == null)
            return;

        log.info("Archiving logs for build '{}' (job: '{}')", buildId, jobName);

        try {
            ensureBucketExists();

            List<Pod> pods = kubernetesClient.pods()
                    .inAnyNamespace()
                    .withLabel("job-name", jobName)
                    .list()
                    .getItems();

            if (pods.isEmpty()) {
                log.warn("No pods found for job '{}', skipping log archival", jobName);
                return;
            }

            Pod pod = pods.get(0);
            String podName = pod.getMetadata().getName();
            String namespace = pod.getMetadata().getNamespace();

            String logs = kubernetesClient.pods()
                    .inNamespace(namespace)
                    .withName(podName)
                    .getLog();

            if (logs == null || logs.isBlank()) {
                log.warn("No logs available for pod '{}', skipping archival", podName);
                return;
            }

            String objectKey = "builds/" + buildId + "/build.log";
            byte[] logBytes = logs.getBytes(StandardCharsets.UTF_8);
            try (InputStream is = new ByteArrayInputStream(logBytes)) {
                minioClient.putObject(
                        PutObjectArgs.builder()
                                .bucket(minioConfig.getBucket())
                                .object(objectKey)
                                .stream(is, logBytes.length, -1)
                                .contentType("text/plain")
                                .build());
            }

            log.info("Build logs for '{}' archived to MinIO at '{}/{}'", buildId, minioConfig.getBucket(), objectKey);

        } catch (Exception e) {
            log.error("Failed to archive logs for build '{}'", buildId, e);
        }
    }

    private void ensureBucketExists() throws Exception {
        boolean exists = minioClient.bucketExists(
                BucketExistsArgs.builder().bucket(minioConfig.getBucket()).build());
        if (!exists) {
            minioClient.makeBucket(
                    MakeBucketArgs.builder().bucket(minioConfig.getBucket()).build());
            log.info("Created MinIO bucket '{}'", minioConfig.getBucket());
        }
    }
}
