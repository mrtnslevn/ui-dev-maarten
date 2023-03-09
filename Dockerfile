FROM node:18.1.0-alpine as builder
COPY . /app/ui
WORKDIR /app/ui
RUN npm install
RUN npm run build-dev

FROM nginx:1.21-alpine
EXPOSE 80
COPY --from=builder /app/ui/dist/payment-ui /usr/share/nginx/html

# Change timezone to local time
ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY devproxy.conf /etc/nginx/conf.d/default.conf
