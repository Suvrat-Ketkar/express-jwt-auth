import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import VerificationCodeModel from "../models/verificationCode.model.js";
import { oneYearFromNow,thirtyDaysFromNow,ONE_DAY_MS } from "../utils/date.js";
import jwt from "jsonwebtoken";
import { APP_ORIGIN, JWT_REFRESH_SECRET } from '../constants/env.js';
import appAssert from "../utils/appAssert.js";
import { CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "../constants/http.js";
import { signToken, refreshTokenSignOptions, accessTokenSignOptions, verifyToken } from "../utils/jwt.js";
import { sendMail } from "../utils/sendMail.js";
import { getVerifyEmailTemplate } from "../utils/emailTemplates.js";

export const createAccount = async (data) => {
    // Verify email is not taken
    const existingUser = await UserModel.exists({ 
      email: data.email 
    }); // Check if a user with the given email already exists

    appAssert(
        !existingUser,
        CONFLICT,
        "Email is already in use",
    ) // Assert that the email is unique, throwing an error otherwise
    
    // create user
    const user = await UserModel.create({
      email: data.email,
      password: data.password,
    }); // Create a new user with provided credentials

    const userId = user._id;

    const verificationCode = await VerificationCodeModel.create({ 
      userId,
      type: "EmailVerification",
      expiresAt: oneYearFromNow(), 
    }) // Generate and save a verification code for email validation

    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`
    const {
      error
    } = await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),

    })
    if(error) {
      console.log(error);
    }
    
    // create session
    const session = await SessionModel.create({
      userId,
      userAgent: data.userAgent,
    }); // Create a new session for the newly registered user

    const sessionInfo = {
      sessionId: session._id,
    }

    const refreshToken = signToken(
      sessionInfo,  
      refreshTokenSignOptions
    );// Generate a refresh token with a 30-day expiration
    
    const accessToken = signToken({
      userId,
      ...sessionInfo,
    }); // Generate an access token with a 15-minute expiration
    
    return { 
      user: user.omitPassword(), // Call on the user instance to remove sensitive data
      accessToken, refreshToken // Return tokens and sanitized user object
    };
};

export const loginUser = async ({email,password,userAgent}) => {
    // get user by email
    const user = await UserModel.findOne({email}); // Retrieve user from database using provided email
    
    const isValid = await user.comparePassword(password); // Verify the password against stored hash
    
    appAssert(
        isValid,
        UNAUTHORIZED,
        "Invalid email or password",
    ); // Assert that credentials are valid, throwing an error otherwise

    const userId = user._id; // Extract user ID for session creation
    
    const session = await SessionModel.create({
      userId,
      userAgent,
    }); // Create a new session for the authenticated user

    const sessionInfo = {
      sessionId: session._id,
    }
    
    const refreshToken = signToken(
      sessionInfo,
      refreshTokenSignOptions,
    ); // Generate a refresh token with a 30-day expiration
    
    const accessToken = signToken({
      userId,
      ...sessionInfo,
    }); // Generate an access token with a 15-minute expiration
    
    return { 
      user: user.omitPassword(), // Call on the user instance to remove sensitive data
      accessToken, refreshToken // Return tokens and sanitized user object
    };
};

export const refreshUserAccessToken = async (refreshToken) => {
  const {
    payload
  } = verifyToken(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  })
  appAssert(payload, UNAUTHORIZED,"INVALID_REFRESH_TOKEN")

  const session = await SessionModel.findById(payload.sessionId)
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // refresh session if it expires in the next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }
 
  const newRefreshToken = sessionNeedsRefresh
  ? signToken(
    {
    sessionId: session._id,
    },
    refreshTokenSignOptions
  )
  : undefined;


  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return { 
    accessToken,
    newRefreshToken
  };
};

export const verifyEmail = async (code) => {
  // get verification code 
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: "EmailVerification",
    expiresAt: { $gt: new Date() }, 
  });

  appAssert(
    validCode,
    UNAUTHORIZED,
    "Invalid or expired verification code",
  );

  const updatedUser = await UserModel.findOneAndUpdate(
    validCode.userId,
    { 
      verified: true
    },
    { new: true }
  );

  appAssert(
    updatedUser,
    INTERNAL_SERVER_ERROR,
    "Failed to verify email"
  );

  await validCode.deleteOne();
}
