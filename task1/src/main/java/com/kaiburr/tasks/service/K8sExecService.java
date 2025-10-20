package com.kaiburr.tasks.service;

import io.fabric8.kubernetes.api.model.Pod;
import io.fabric8.kubernetes.api.model.PodBuilder;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.UUID;

@Service
public class K8sExecService {
    private final String namespace;
    private final String image;
    private final int timeoutSeconds;

    public K8sExecService(
            @Value("${app.k8s.namespace:default}") String namespace,
            @Value("${app.k8s.image:busybox:stable}") String image,
            @Value("${app.k8s.timeoutSeconds:60}") int timeoutSeconds) {
        this.namespace = namespace;
        this.image = image;
        this.timeoutSeconds = timeoutSeconds;
    }

    public String run(String command) throws Exception {
        String name = "task-exec-" + UUID.randomUUID().toString().substring(0, 8);
        try (KubernetesClient client = new DefaultKubernetesClient()) {
            Pod pod = new PodBuilder()
                    .withNewMetadata().withName(name).endMetadata()
                    .withNewSpec()
                    .withRestartPolicy("Never")
                    .addNewContainer()
                    .withName("runner")
                    .withImage(image)
                    .withCommand("sh", "-lc", command)
                    .endContainer()
                    .endSpec()
                    .build();

            client.pods().inNamespace(namespace).resource(pod).create();

            // Wait for completion
        client.resource(pod).waitUntilCondition(p ->
            p.getStatus() != null &&
                ("Succeeded".equals(p.getStatus().getPhase()) ||
                 "Failed".equals(p.getStatus().getPhase())),
            timeoutSeconds, TimeUnit.SECONDS);

            // Try to get logs
            String logs = client.pods().inNamespace(namespace).withName(name).getLog();
            return logs == null ? "" : logs.trim();
        } finally {
            try (KubernetesClient client = new DefaultKubernetesClient()) {
                client.pods().inNamespace(namespace).withName(name).delete();
            } catch (Exception ignored) {}
        }
    }
}
