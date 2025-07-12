import "fastify";
import { Role } from "./auth";

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      userId: string;
      email: string;
      role: Role;
    };
  }
}
