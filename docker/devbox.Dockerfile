ARG NODE_VERSION=21

FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN mkdir -p /cache-volume
RUN ln -s /cache-volume/.bash_history /home/node/.bash_history
RUN chown -R node:node /cache-volume
USER node
VOLUME /cache-volume
ENTRYPOINT ["/bin/bash"]