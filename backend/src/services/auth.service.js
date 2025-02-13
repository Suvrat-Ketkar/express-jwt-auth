import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import VerificationCodeModel from "../models/verificationCode.model.js";
import { oneYearFromNow } from "../utils/date.js";
import jwt from "jsonwebtoken";

import { JWT_REFRESH_SECRET } from '../constants/env.js';
export const createAccount = async (data) => {
    // Verify email is not taken
    const existingUser = await UserModel.exists({ email: data.email });
  
    if (existingUser) {
      throw new Error("Email is already in use");
    }

    // create user
    const user = await UserModel.create(
      {
        email: data.email,
        password: data.password,
      }
    );
    const verificationCode = await VerificationCodeModel.create({
      userId: user._id,
      type: "EmailVerification",
      expiresAt: oneYearFromNow(), 
    })
    
    // create session
    const session = await SessionModel.create({
      userId: user._id,
      userAgent: data.userAgent,
    })

    const refreshToken = jwt.sign(
      { sessionId: session._id},
      JWT_REFRESH_SECRET,{
        audience: ['user'],
        expiresIn: "30d",
      }

    )
    const accessToken = jwt.sign(
      { userId: user._id,
        sessionId: session._id,
      },
      JWT_REFRESH_SECRET,
      {
        audience: ['user'],
        expiresIn: "15m",
      }

    )
  
    return { user, accessToken, refreshToken };
  };
  