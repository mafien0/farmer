FROM denoland/deno:2.7.9

WORKDIR /src

COPY . .

RUN chown -R deno:deno /src
RUN deno cache src/main.js

USER deno

CMD ["deno", "task", "start"]
