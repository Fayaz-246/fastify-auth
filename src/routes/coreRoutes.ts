import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "../../generated/prisma";
import { comparePasswords, getHash } from "../lib/hash";
import { LoginBody, SignupBody } from "../types/core";
import { signToken } from "../lib/jwt";
import { authenticate, authorizeRole } from "../lib/auth";
import { VALID_ROLES } from "../types/auth";
import { checkEmail } from "../lib/regex";

const prisma = new PrismaClient();

export default async function userRoutes(
  fastify: FastifyInstance
): Promise<void> {
  fastify.post(
    "/signup",
    async (req: FastifyRequest<{ Body: SignupBody }>, reply: FastifyReply) => {
      const { email, name, password, role } = req.body;
      const passwordHash = await getHash(password);
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { name }] },
      });

      if (existingUser)
        return reply
          .status(409)
          .send({ error: `User already exists with same email or name.` });

      if (!checkEmail(email))
        return reply.status(400).send({
          error: `Invalid email format; ${email}; expected name@provider.domain`,
        });

      if (!VALID_ROLES.includes(role)) {
        return reply.status(400).send({ error: "Invalid role specified." });
      }

      const user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash,
          role,
        },
      });

      const token = signToken({
        userId: user.id,
        role: user.role,
        email: user.email,
      });

      return reply.status(200).send({ message: "Sign-Up successful", token });
    }
  );

  fastify.post(
    "/login",
    async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) return reply.status(401).send({ error: "User not found..." });
      if (!(await comparePasswords(password, user.passwordHash)))
        return reply.status(401).send({ error: "Password Incorrect..." });

      const token = signToken({
        userId: user.id,
        role: user.role,
        email: user.email,
      });

      return reply.status(200).send({ message: "Login successful", token });
    }
  );

  fastify.get("/me", { preHandler: [authenticate] }, async (req, reply) => {
    return { user: req.user };
  });

  fastify.get(
    "/admin",
    { preHandler: [authenticate, authorizeRole(["admin"])] },
    async (req, reply) => {
      const users = await prisma.user.findMany();
      return { users };
    }
  );

  fastify.get("/logout", { preHandler: [authenticate] }, async (req, reply) => {
    return { message: "Logout Successful", status: 200 };
  });
}
