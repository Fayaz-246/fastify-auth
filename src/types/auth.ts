import { Role as PrismaRole } from "../../generated/prisma";

export const VALID_ROLES = ["user", "admin"] as const;

export type Role = PrismaRole;
export type JwtPayload = { userId: string; role: Role; email: string };
