FROM node:12 AS builder

RUN apt update
RUN apt install -y build-essential git libtool autoconf automake
RUN useradd -m -s /bin/sh builder

USER builder
RUN mkdir /home/builder/build
WORKDIR /home/builder/build

COPY ./package-lock.json ./package.json ./.npmrc ./
RUN npm ci


FROM node:12

RUN apt update
RUN apt install curl bash
RUN useradd -m -s /bin/sh lisk

COPY ./ /home/lisk/lisk-service/
RUN chown -R lisk:lisk /home/lisk/
COPY --from=builder /home/builder/build/node_modules/ /home/lisk/lisk-service/core/node_modules/

USER lisk
WORKDIR /home/lisk/lisk-service/core
CMD ["node", "app.js"]
