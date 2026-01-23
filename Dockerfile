FROM node:20-alpine
WORKDIR /backend/nestjs-basic
COPY package*.json ./
RUN npm install --legacy-peer-deps

RUN npm install -g @nestjs/cli@9.4.2

COPY . .

RUN npm run build

CMD ["node", "dist/main"]