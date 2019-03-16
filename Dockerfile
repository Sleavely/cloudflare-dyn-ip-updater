FROM node:10

RUN mkdir -p /opt/app
WORKDIR /opt/app

# Move base files into our image
COPY ["./", "/opt/app/"]

RUN npm install --production

CMD node index.js
