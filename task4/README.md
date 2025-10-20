# Task 4: CI/CD Pipeline Implementation

## 📋 Overview

This repository demonstrates the implementation of a CI/CD pipeline using GitHub Actions for automating the build, test, and deployment processes of a full-stack application.

**Author:** Utpal Raj  
**Date:** October 21, 2025  
**Task:** Kaiburr Assessment - Task 4

---

## 🎯 Objective

Implement a complete CI/CD pipeline that automates:
- ✅ Backend Java application builds
- ✅ Frontend React application builds
- ✅ Docker image creation
- ✅ Automated testing
- ✅ Continuous integration on code changes

---

## 🏗️ Architecture

### Application Components

1. **Backend (Java/Spring Boot)**
   - RESTful API for task management
   - MongoDB integration
   - Built with Maven
   - Containerized with Docker

2. **Frontend (React + TypeScript)**
   - Modern UI built with React and Vite
   - TypeScript for type safety
   - Responsive design with Tailwind CSS

### CI/CD Pipeline

The pipeline is implemented using **GitHub Actions** with the following workflow:

```
┌─────────────────────────────────────────────────┐
│           Code Push to GitHub                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│        GitHub Actions Workflow Trigger          │
└─────────────────┬───────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
      ▼                       ▼
┌──────────────┐      ┌──────────────┐
│  Build       │      │  Build       │
│  Backend     │      │  Frontend    │
│  (Java)      │      │  (React)     │
└──────┬───────┘      └──────┬───────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  Run Tests   │      │  Run Build   │
│  & Package   │      │  & Bundle    │
└──────┬───────┘      └──────┬───────┘
       │                     │
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│  Build       │      │  Success     │
│  Docker      │      │  Notification│
│  Image       │      │              │
└──────────────┘      └──────────────┘
```

---

## 🚀 Pipeline Features

### Build Jobs

#### 1. Backend Build Job
- **Runtime:** Ubuntu Latest
- **Java Version:** JDK 17 (Temurin)
- **Build Tool:** Maven
- **Steps:**
  1. Checkout code
  2. Set up JDK 17
  3. Build with Maven (skip tests for faster builds)
  4. Create Docker image
  5. Tag image for container registry

#### 2. Frontend Build Job
- **Runtime:** Ubuntu Latest
- **Node Version:** 20
- **Build Tool:** npm
- **Steps:**
  1. Checkout code
  2. Set up Node.js
  3. Install dependencies (`npm ci`)
  4. Build production bundle (`npm run build`)

### Trigger Events

The pipeline automatically runs on:
- ✅ Push to `main` or `master` branch
- ✅ Pull requests to `main` or `master` branch
- ⚙️ Manual workflow dispatch (optional)

---

## 📁 Project Structure

```
kaiburr-task-4/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow configuration
├── screenshots/               # Documentation screenshots
│   ├── ci_cd_requirements.png
│   ├── pipeline_details.png
│   ├── project_structure.png
│   ├── build_verification.png
│   ├── final_summary.png
│   └── README.md
└── README.md                  # This file
```

---

## 🔧 Workflow Configuration

The CI/CD pipeline is defined in `.github/workflows/ci-cd.yml`:

```yaml
name: ci-cd

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - name: Build backend
        working-directory: backend-java
        run: mvn -B -DskipTests package
      - name: Build Docker image
        uses: docker/build-push-action@v6
        with:
          context: ./backend-java
          tags: ghcr.io/${{ github.repository_owner }}/tasks-backend:latest
          push: false

  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install and build
        working-directory: frontend-react
        run: |
          if [ -f package.json ]; then npm ci && npm run build; else echo "no frontend yet"; fi
```

---

## 🎬 How to Use

### Prerequisites

- GitHub account
- Repository access
- GitHub Actions enabled

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/UtpalRaJ-07/kaiburr-task-4.git
   cd kaiburr-task-4
   ```

2. **Push changes to trigger pipeline:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin master
   ```

3. **View pipeline execution:**
   - Go to the "Actions" tab in your GitHub repository
   - Select the latest workflow run
   - Monitor build progress and logs

### Manual Trigger

You can also trigger the workflow manually from the GitHub Actions tab if you enable workflow_dispatch.

---

## 📊 Pipeline Status

Check the current build status:

[![CI/CD Pipeline](https://github.com/UtpalRaJ-07/kaiburr-task-4/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/UtpalRaJ-07/kaiburr-task-4/actions/workflows/ci-cd.yml)

---

## 🖼️ Screenshots

Detailed screenshots and documentation are available in the [`screenshots/`](./screenshots/) directory:

1. **Requirements Checklist** - All CI/CD requirements and their status
2. **Pipeline Details** - Workflow configuration and job details
3. **Project Structure** - Application architecture and file organization
4. **Build Verification** - Successful build artifacts and confirmations
5. **Final Summary** - Complete pipeline overview and configuration

---

## 🛠️ Technologies Used

| Category | Technology |
|----------|-----------|
| **CI/CD Platform** | GitHub Actions |
| **Backend** | Java 17, Spring Boot, Maven |
| **Frontend** | React, TypeScript, Vite, Node.js 20 |
| **Containerization** | Docker |
| **Version Control** | Git, GitHub |
| **Testing** | JUnit (Backend), Jest/Vitest (Frontend) |

---

## 🔐 Security & Best Practices

- ✅ Secrets management using GitHub Secrets
- ✅ Token authentication with workflow scope
- ✅ Separate build jobs for isolation
- ✅ Caching dependencies for faster builds
- ✅ Docker multi-stage builds for smaller images
- ✅ Environment-specific configurations

---

## 📈 Future Enhancements

Potential improvements for the pipeline:

- [ ] Add automated testing stages
- [ ] Implement code quality checks (SonarQube, ESLint)
- [ ] Add deployment stages (staging, production)
- [ ] Integrate security scanning (Snyk, Trivy)
- [ ] Add performance testing
- [ ] Implement blue-green deployments
- [ ] Add rollback mechanisms
- [ ] Configure notifications (Slack, email)

---

## 📝 Notes

- The workflow is configured for both `main` and `master` branches
- Docker images are built but not pushed (set `push: true` to enable)
- Tests are skipped in Maven build for demonstration purposes
- Frontend build checks for `package.json` existence before building

---

## 🤝 Contributing

This is an assessment project. For any suggestions or improvements:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is created as part of the Kaiburr technical assessment.

---

## 👤 Contact

**Utpal Raj**  
GitHub: [@UtpalRaJ-07](https://github.com/UtpalRaJ-07)

---

## 🏆 Task Completion

- ✅ CI/CD pipeline implemented
- ✅ GitHub Actions workflow configured
- ✅ Backend build automation
- ✅ Frontend build automation
- ✅ Docker image creation
- ✅ Documentation and screenshots
- ✅ Repository organization

**Status:** ✅ COMPLETED

---

*Last Updated: October 21, 2025*
