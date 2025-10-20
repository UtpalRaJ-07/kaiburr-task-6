package com.kaiburr.tasks.controller;

import com.kaiburr.tasks.model.Task;
import com.kaiburr.tasks.model.TaskExecution;
import com.kaiburr.tasks.repository.TaskRepository;
import com.kaiburr.tasks.service.CommandValidator;
import com.kaiburr.tasks.service.ExecutionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class TaskController {
    private final TaskRepository repo;
    private final CommandValidator validator;
    private final ExecutionService executor;

    public TaskController(TaskRepository repo, CommandValidator validator, ExecutionService executor) {
        this.repo = repo;
        this.validator = validator;
        this.executor = executor;
    }

    // GET /api/tasks or /api/tasks?id=123
    @GetMapping("/tasks")
    public ResponseEntity<?> getTasks(@RequestParam(value = "id", required = false) String id) {
        if (id == null) {
            return ResponseEntity.ok(repo.findAll());
        }
        Optional<Task> t = repo.findById(id);
        return t.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found"));
    }

    // PUT /api/tasks  (create or update)
    @PutMapping("/tasks")
    public ResponseEntity<?> putTask(@Valid @RequestBody Task task) {
        if (!validator.isSafe(task.getCommand())) {
            return ResponseEntity.badRequest().body("Unsafe command");
        }
        Task saved = repo.save(task);
        return ResponseEntity.ok(saved);
    }

    // DELETE /api/tasks/{id}
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/tasks/find?name=abc
    @GetMapping("/tasks/find")
    public ResponseEntity<?> findByName(@RequestParam("name") String name) {
        List<Task> res = repo.findByNameContainingIgnoreCase(name);
        if (res.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No tasks found");
        return ResponseEntity.ok(res);
    }

    // PUT /api/tasks/{id}/execute
    @PutMapping("/tasks/{id}/execute")
    public ResponseEntity<?> execute(@PathVariable("id") String id) {
        Optional<Task> opt = repo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        Task t = opt.get();
        if (!validator.isSafe(t.getCommand())) {
            return ResponseEntity.badRequest().body("Unsafe command");
        }
        try {
            Instant start = Instant.now();
            String out = executor.run(t.getCommand());
            Instant end = Instant.now();
        TaskExecution exec = new TaskExecution(start, end, out);
            t.getTaskExecutions().add(exec);
            repo.save(t);
            return ResponseEntity.ok(exec);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Execution failed: " + e.getMessage());
        }
    }
}
