import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";
// import verify from "jsonwebtoken/verify.js";
import Audience from "../constants/audience.js";

const defaults = {
  audience: [Audience.User], // Works just like an enum
};


export const accessTokenSignOptions = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (payload, options = accessTokenSignOptions) => {
  const { secret, ...signOpts } = options;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

export const verifyToken = (token, options = {}) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options;
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    });
    return {
      payload,
    };
  } catch (error) {
    console.log(error.message);
    return {
      error: error.message,
    };
  }
};