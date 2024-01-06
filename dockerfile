# Stage 1: Build the application
FROM node:18-alpine as build

# Define arguments
ARG MONGO_URI
ARG JWT_SECRET
ARG GMAIL_USER
ARG GMAIL_PASS
ARG EMAIL_FROM_ADDRESS
ARG PAYPAL_CLIENT_SECRET
ARG PAYPAL_CLIENT_ID
ARG WEBHOOK_ID
ARG AWS_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_BUCKET_NAME
ARG OMDB_API_KEY
ARG FRONTEND_URL

# Set environment variables
ENV MONGO_URI=${MONGO_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV GMAIL_USER=${GMAIL_USER}
ENV GMAIL_PASS=${GMAIL_PASS}
ENV EMAIL_FROM_ADDRESS=${EMAIL_FROM_ADDRESS}
ENV PAYPAL_CLIENT_SECRET=${PAYPAL_CLIENT_SECRET}
ENV PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
ENV WEBHOOK_ID=${WEBHOOK_ID}
ENV AWS_REGION=${AWS_REGION}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_BUCKET_NAME=${AWS_BUCKET_NAME}
ENV OMDB_API_KEY=${OMDB_API_KEY}
ENV FRONTEND_URL=${FRONTEND_URL}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npm run build
RUN npm run test

# Stage 2: Run the application
FROM node:18-alpine

# Repeat the ARG and ENV instructions for the second stage

WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
