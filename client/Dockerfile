FROM nginx:stable-alpine

RUN mkdir -p /run/nginx

ADD ./build /usr/share/nginx/html

COPY ./build/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm /usr/share/nginx/html/nginx.conf

CMD ["nginx", "-g", "daemon off;"]