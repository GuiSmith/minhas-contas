# 1° Etapa
FROM node:latest AS build
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# 2° Etapa
FROM nginx:latest
COPY --from=build /frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80