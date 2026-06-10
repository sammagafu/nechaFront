FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_APP_URL=http://localhost:3000
ARG VITE_API_BASE_URL=/api
ARG VITE_SHOP_URL=https://necha.africa/shop

ENV VITE_APP_URL=$VITE_APP_URL \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SHOP_URL=$VITE_SHOP_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
