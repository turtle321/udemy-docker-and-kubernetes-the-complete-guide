FROM node:alpine as builder
WORKDIR /app

COPY package.json .
RUN npm install
COPY . .
CMD npm run build


FROM nginx
# EXPOSE has no effect on local dev, where you have to forward ports in the `docker run` or in `docker-compose`.
# It works insteal in Elastic Beanstalk.
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html