FROM node:22.8-slim

# Adicionar bash, git e Docker CLI
RUN apt update && \
    apt install -y curl && \
    curl -fsSL https://get.docker.com -o get-docker.sh && \
    sh ./get-docker.sh

# Ativar o Corepack e definir a versão específica do Yarn
RUN corepack enable && corepack prepare yarn@4.5.0 --activate

WORKDIR /code

# Configurar o diretório do Git como seguro
RUN git config --global --add safe.directory /code

ENV DOCKER_GROUP_ID 999

## create group if not exists
RUN groupadd -g ${DOCKER_GROUP_ID} docker-host-group; exit 0

RUN usermod -aG ${DOCKER_GROUP_ID} node

USER node

CMD ["bash", "-c", "yarn && npx lefthook install && yarn start:debug"]
