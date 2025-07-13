import Fastify from "fastify";
import cors from "@fastify/cors";
import core from "./routes/coreRoutes";

async function startServer() {
  const app = Fastify({ logger: true });

  app.register(core);
  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
  });
  const port = process.env.PORT || 8080;

  app.listen({ port }, function (err, address) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Listening on port: ${port} :: http://localhost:${port}/`);
  });
}

startServer();
