FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Copy the build artifacts from the build stage
COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]

EXPOSE 9000
