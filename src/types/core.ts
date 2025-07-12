import { Role } from "./auth";

export type SignupBody = {
  email: string;
  name: string;
  password: string;
  role: Role;
};

export type LoginBody = {
  email: string;
  password: string;
};
