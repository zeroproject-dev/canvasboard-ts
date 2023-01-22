FROM nginx:alpine

ADD dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf