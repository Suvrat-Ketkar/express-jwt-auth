import SessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";
import VerificationCodeModel from "../models/verificationCode.model.js";
import { oneYearFromNow } from "../utils/date.js";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET } from '../constants/env.js';
import appAssert from "../utils/appAssert.js";
import { CONFLICT, UNAUTHORIZED } from "../constants/http.js";
import { signToken, refreshTokenSignOptions, accessTokenSignOptions } from "../utils/jwt.js";


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

    const verificationCode = await VerificationCodeModel.create({ 
      userId: user._id,
      type: "EmailVerification",
      expiresAt: oneYearFromNow(), 
    }) // Generate and save a verification code for email validation
    
    // create session
    const session = await SessionModel.create({
      userId: user._id,
      userAgent: data.userAgent,
    }); // Create a new session for the newly registered user

    const refreshToken = jwt.sign(
      { sessionId: session._id},
      JWT_REFRESH_SECRET, {
        audience: ['user'],
        expiresIn: "30d",
      }
    ); // Generate a refresh token with a 30-day expiration
    
    const accessToken = jwt.sign(
      { userId: user._id,
        sessionId: session._id,
      }, 
      JWT_REFRESH_SECRET,
      {
        audience: ['user'], 
        expiresIn: "15m", 
      }
    ); // Generate an access token with a 15-minute expiration
    
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
    
    const refreshToken = jwt.sign(
      sessionInfo,
      JWT_REFRESH_SECRET, {
        audience: ['user'],
        expiresIn: "30d",
      }
    ); // Generate a refresh token with a 30-day expiration
    
    const accessToken = jwt.sign(
      { ...sessionInfo,
        userId: user._id,
      }, 
      JWT_REFRESH_SECRET,
      {
        audience: ['user'], 
        expiresIn: "15m", 
      }
    ); // Generate an access token with a 15-minute expiration
    
    return { 
      user: user.omitPassword(), // Call on the user instance to remove sensitive data
      accessToken, refreshToken // Return tokens and sanitized user object
    };
};

