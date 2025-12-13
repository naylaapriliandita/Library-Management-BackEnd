import { prisma } from "../config/prisma.js";

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req, res) => {
  const { email, name, password } = req.body;

  const user = await prisma.user.create({
    data: { email, name, password },
  });

  res.json(user);
};
