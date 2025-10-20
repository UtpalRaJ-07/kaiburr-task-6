# Task 1: Java REST API with MongoDB
**Author: Utpal Raj**  
**Date: October 20, 2025**

## Project Description
This repository contains the implementation of a REST API using Java Spring Boot and MongoDB for Task 1 of the Kaiburr assessment. The application provides endpoints for managing task objects that can be run in Kubernetes pods.

## Features
- CRUD operations for tasks via REST API
- MongoDB integration for persistent storage
- Command validation and execution
- Task execution history tracking
- RESTful endpoints with proper status codes and responses

## Technologies Used
- Java 11
- Spring Boot 2.7.x
- MongoDB
- Maven
- Docker
- PowerShell (for testing)

## API Documentation

### Task Object Structure
```json
{
    "id": "string",
    "name": "string",
    "owner": "string",
    "command": "string",
    "taskExecutions": [
        {
            "startTime": "datetime",
            "endTime": "datetime",
            "output": "string"
        }
    ]
}
```

### Endpoints

1. **GET /api/tasks**
   - Description: Retrieve all tasks or a specific task by ID
   - Parameters: Optional task ID
   - Response: List of tasks or single task
   ![Get Tasks](screenshots/get_tasks.png)

2. **PUT /api/tasks**
   - Description: Create a new task
   - Request Body: Task object
   - Response: Created task object
   ![Create Task](screenshots/create_task.png)

3. **DELETE /api/tasks/{id}**
   - Description: Delete a task by ID
   - Parameters: Task ID
   - Response: Success/failure message

4. **GET /api/tasks/find**
   - Description: Search tasks by name
   - Parameters: name (string)
   - Response: List of matching tasks
   ![Search Task](screenshots/search_task.png)

5. **PUT /api/tasks/{id}/execute**
   - Description: Execute a task's command
   - Parameters: Task ID
   - Response: Execution results
   ![Execute Task](screenshots/execute_task.png)

## Setup Instructions

### Prerequisites
1. Java 11 or higher
2. MongoDB 4.4 or higher
3. Maven 3.8+
4. Docker (optional)

### Local Setup
1. Clone the repository
```bash
git clone https://github.com/utpal-raj/kaiburr-task-1.git
cd kaiburr-task-1
```

2. Configure MongoDB
```properties
# src/main/resources/application.properties
spring.data.mongodb.uri=mongodb://localhost:27017/tasks
```

3. Build the application
```bash
./mvnw clean install
```

4. Run the application
```bash
./mvnw spring-boot:run
```

### Docker Setup
1. Build Docker image
```bash
docker build -t kaiburr-task1 .
```

2. Run container
```bash
docker run -p 8080:8080 kaiburr-task1
```

## Testing
The API has been thoroughly tested using PowerShell commands. Screenshots in this repository demonstrate:
- Successful task creation
- Task retrieval and listing
- Task search functionality
- Command execution
- Error handling

## Project Structure
```
kaiburr-task-1/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── kaiburr/
│       │           └── tasks/
│       │               ├── TasksApplication.java
│       │               ├── controller/
│       │               │   └── TaskController.java
│       │               ├── model/
│       │               │   ├── Task.java
│       │               │   └── TaskExecution.java
│       │               ├── repository/
│       │               │   └── TaskRepository.java
│       │               └── service/
│       │                   ├── CommandValidator.java
│       │                   └── ExecutionService.java
│       └── resources/
│           └── application.properties
├── screenshots/
│   ├── get_tasks.png
│   ├── create_task.png
│   ├── search_task.png
│   └── execute_task.png
├── Dockerfile
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## Security Considerations
- Input validation for all endpoints
- Command injection prevention
- Proper error handling and status codes
- No sensitive data exposure

## Author
**Utpal Raj**
- Date: October 20, 2025
- Assessment: Kaiburr Technical Assessment Task 1

## License
This project is open source and available under the MIT License.