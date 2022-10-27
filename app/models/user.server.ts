import { db } from "utils/db.server";
import bcrypt from "@node-rs/bcrypt";
import { generateCode } from "~/helpers/generateCode.server";
import { redis } from "~/utils/redis.server";
import cuid from "cuid";

type UserUpdateType = {
  userId: number;
  name: string;
  username: string;
};

export const getUserById = async (userId: number) => {
  const res = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  return res;
};

export const getUserBycuid = async (userid: string) => {
  const res = await db.user.findFirst({
    where: {
      cuid: userid,
    },
  });
  return res;
};

export const getUserByEmail = async (email: string) => {
  const res = await db.user.findFirst({
    where: {
      email: email,
    },
  });
  return res;
};

export const getUserByUsername = async (username: string) => {
  const res = await db.user.findFirst({
    where: {
      username: username,
    },
  });
  return res;
};

export const getUserDetails = async (userId: number) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

export const getuserWithPassword = async (userId: number) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      password: true,
    },
  });

  return user;
};

export const createUser = async (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const hash = await bcrypt.hash(data.password, 10);
  const res = await db.user.create({
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      password: {
        create: {
          hash: hash,
        },
      },
    },
    include: {
      password: true,
    },
  });
  return res;
};

export const updatePassword = async (userid: number, password: string) => {
  const hash = await bcrypt.hash(password, 10);
  const user = await db.user.update({
    where: {
      id: userid,
    },
    data: {
      password: {
        update: {
          hash: hash,
        },
      },
    },
    include: {
      password: true,
    },
  });
  return user;
};

// use for when user is login
export const verifyUser = async (email: string, password: string) => {
  const user = await db.user.findFirst({
    where: {
      email: email,
    },
    include: {
      password: true,
    },
  });

  if (!user || !user.password) return null;
  const comparePassword = await bcrypt.verify(password, user.password.hash);
  if (!comparePassword) return null;
  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// this line handle with redis
// create 6 digit verify code
// mark = rgt (register), fp(forgot password)
export const setVerifyCode = (userId: string, mark?: string) => {
  const code = mark === "rgt" ? generateCode : cuid();
  // set 5 minute / 300 s
  redis.set(userId + "|" + mark, code, "EX", 300);
  return code;
};

// verify User email
export const updateVerifyEmail = async (userid: string) => {
  const res = await db.user.update({
    where: {
      cuid: userid,
    },
    data: {
      isVerify: true,
      verifyDate: new Date(),
    },
  });
  return res;
};

export const getVerifyCode = async (userid: string, mark?: string) => {
  try {
    const res = await redis.get(`${userid}|${mark}`);
    return res;
  } catch (err) {
    return err;
  }
};

export const delVerifyCode = async (userid: string, mark?: string) => {
  try {
    const res = await redis.del(`${userid}|${mark}`);
    return res;
  } catch (err) {
    return err;
  }
};

export const updateUser = async (data: UserUpdateType) => {
  const res = await db.user.update({
    where: {
      id: data.userId,
    },
    data: {
      name: data.name,
      username: data.username,
    },
  });

  return res;
};

// end for redis
