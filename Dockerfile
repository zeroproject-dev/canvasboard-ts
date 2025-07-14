FROM node:19-alpine3.16 AS build
ARG VITE_BASE_URL=./
WORKDIR /app
COPY package.json .
RUN npm install --prefer-offline --no-audit --progress=false
COPY . .
RUN npm run build -- --base ${VITE_BASE_URL}

# Stage 2

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# artifact stage for deployment

FROM scratch AS artifact
COPY --from=build /app/dist /canvasboard-ts
