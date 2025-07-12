import Fastify from "fastify";
import core from "./routes/coreRoutes";

const app = Fastify({ logger: true });

app.register(core);
const port = 3000;

app.listen({ port }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Listening on port: ${port} :: http://localhost:${port}/`);
});
