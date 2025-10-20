package com.kaiburr.tasks.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ExecutionService {
    private final LocalExecService local;
    private final K8sExecService k8s;

    private final String mode;

    public ExecutionService(LocalExecService local,
                            K8sExecService k8s,
                            @Value("${app.execution.mode:local}") String mode) {
        this.local = local;
        this.k8s = k8s;
        this.mode = mode;
    }

    public String run(String command) throws Exception {
        if ("k8s".equalsIgnoreCase(mode)) {
            return k8s.run(command);
        }
        return local.run(command);
    }
}
