package com.kaiburr.tasks.service;

import org.springframework.stereotype.Component;

@Component
public class CommandValidator {
    // A very simple allow-list based validator; in production use a proper policy
    private static final String[] ALLOWED_PREFIXES = {
            "echo ", "printf ", "date", "ls ", "whoami", "uname", "cat ", "grep ", "wc ", "head ", "tail "
    };

    private static final String[] FORBIDDEN = {
            ";", "&&", "|", "`", "$(", ">", ">>", "<", "<<", "rm ", "mv ", "cp ", "chmod ", "chown ", "curl ", "wget ", "ssh ", "sudo "
    };

    public boolean isSafe(String command) {
        if (command == null || command.isBlank()) return false;
        String c = command.trim();
        for (String bad : FORBIDDEN) {
            if (c.contains(bad)) return false;
        }
        for (String ok : ALLOWED_PREFIXES) {
            if (c.startsWith(ok) || c.equals(ok.trim())) return true;
        }
        return false;
    }
}
