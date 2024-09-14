# Trade Republic Coding Challenge Mihail Andritchi

## Overview

This coding challenge was migrated from Kotlin to Typescript.
For the sake of simplicity and time constraints I used only in-memory storage instead of using a proper db like Mongo or Redis.


## Table of Contents

- [Project Structure](#project-structure)
- [Setup](#setup)
- [Building the Project](#building-the-project)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Future Development](#future-development)


## Project Structure

- **src/**: Source files of the TypeScript project.
- **dist/**: Compiled JavaScript files.
- **tests/**: Test files for the project.
- **Dockerfile**: Dockerfile for containerizing the application.
- **docker-compose.yml**: Compose file for orchestrating multiple containers.

## Setup

1. **Install dependencies**:
   ```npm install```

## Building the project

1. **Compile TypeScript to Javascript**:
    ```npm run build```

## Running the project

1. **Start the project**
    ```npm run start```

    The consumed results can be checked at
    ```http://localhost:9000/api/candlesticks?isin={ISIN}```

## Testing

1. **Run the tests with Jest**
    ```npm run test```

## Docker deployment

1. **Run with docker compose**
    ```docker-compose up```

## Environment variables

1. **PARTNER_SERVICE_URL** : URL for the partner service providing real-time instrument data.
    Defaults to `ws://localhost:8032` for cases when you run the app and the service separately without docker compose

## Future development

1. Persistent storage
3. Result serializer
4. Separate router
2. Integration test coverage
3. Graceful shutdown
4. Enhaced error handling
5. Performance optimizations



