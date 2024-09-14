# Simple Candlesticks reader

## Overview

Simple candlestick reader made with TypeScript

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
   `npm install`

## Building the project

1. **Compile TypeScript to Javascript**:
   `npm run build`

## Running the project

1. **Start the project**
   `npm run start`

    The consumed results can be checked at
    `http://localhost:9000/api/candlesticks?isin={ISIN}`

## Testing

1. **Run the tests with Jest**
   `npm run test`

## Docker deployment

1. **Run with docker compose**
   `docker-compose up`

## Environment variables

1. **PARTNER_SERVICE_URL** : URL for the partner service providing real-time instrument data.
   Defaults to `ws://localhost:8032` for cases when you run the app and the service separately without docker compose

## Future development

1. Persistent storage
2. Result serializer
3. Separate router
4. Integration test coverage
5. Graceful shutdown
6. Enhaced error handling
7. Performance optimizations
