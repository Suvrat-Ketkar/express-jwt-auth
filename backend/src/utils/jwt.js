import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";


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
