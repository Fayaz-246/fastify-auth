import { FastifyRequest, FastifyReply, preHandlerHookHandler } from "fastify";
import jwt from "jsonwebtoken";
import { JwtPayload, Role } from "../types/auth";
import { verifyToken } from "./jwt";

const JWT_SECRET = process.env.JWT_SECRET || "lololol";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .status(401)
        .send({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    const payload = verifyToken<JwtPayload>(token);

    // Attach user info to request
    request.user = payload;
  } catch (error) {
    return reply.status(401).send({ error: "Invalid or expired token" });
  }
}

export function authorizeRole(roles: Role[]): preHandlerHookHandler {
  return async function (req, reply) {
    if (!req.user) return reply.status(401).send({ message: "Unknown User." });
    if (!roles.includes(req.user?.role))
      return reply.status(403).send({ message: "Forbidden" });
  };
}
