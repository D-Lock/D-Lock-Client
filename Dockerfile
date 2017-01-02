FROM node:slim

RUN apt-get update

# Install electron dependencies
RUN apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1
RUN npm install -g electron
RUN apt-get -y install bzip2

WORKDIR /usr/src/app

COPY ./package.json package.json
COPY ./node_modules node_modules
RUN npm install

CMD ["bash"]