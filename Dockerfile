FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ./ ./
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
# RUN npm install -g typescript@^4.1.3
# RUN npm install -g cross-env
# RUN npm run build
RUN npm i && npm audit fix
# RUN ["chmod", "+x", "/usr/local/bin/docker-entrypoint.sh"]
# RUN npm run dev
# COPY . .
EXPOSE 9090
# CMD ["npm", "run", "dev"]
CMD ["npm", "start"]
# CMD ["/bin/bash"]

# ENTRYPOINT ["sh", "/usr/local/bin/docker-entrypoint.sh"]

#### Command to Build Docker Image
# docker build -t rtl1 .
#### Command to run docker image
# docker run -p 9090:9090 rtl1