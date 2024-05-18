FROM node:14

WORKDIR /usr/src/app/

COPY package*.json ./

# Dcoded < installing dependencies >
RUN npm install

# Dcoded < copying code to container >
COPY . .

# Dcoded < install rust and cargo >
RUN apt-get update && apt-get install -y curl \
    && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
    && . "$HOME/.cargo/env" \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Dcoded < install solidity >
RUN curl -L -o /usr/local/bin/solc https://github.com/ethereum/solidity/releases/download/v0.8.6/solc-static-linux \
    && chmod +x /usr/local/bin/solc

ENV PATH="/root/.cargo/bin:${PATH}"

RUN chmod +x compile_rust.sh compile_solidity.sh

CMD ["node", "index.js"]

