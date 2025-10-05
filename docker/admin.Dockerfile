# Admin Dockerfile (centralizado)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL="http://localhost:8080/api"
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ARG VITE_BASE="/"
ENV VITE_BASE=${VITE_BASE}
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" && npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
