FROM node:alpine

# Set WORKDIR so any following instructions are executed
# relative to this path in the container. 
WORKDIR /usr/app/

# Install the dependencies.
# Note: the copy is split in 2 partes: reqs and the rest.
# This is to make use of Docker cache mechanism and actually
# install the reqs only if package.json has changed.
COPY ./package.json ./
RUN npm install

# Copy the remaining files.
COPY ./ ./

CMD ["npm", "start"]