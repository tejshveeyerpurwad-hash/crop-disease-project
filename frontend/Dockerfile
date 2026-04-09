FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Environment var for frontend API base URL
ENV VITE_API_URL=http://localhost:8000/api/v1

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
