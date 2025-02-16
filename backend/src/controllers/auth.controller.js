import catchErrors from "../utils/catchErrors.js";
import { z } from "zod";
import { createAccount } from "../services/auth.service.js";
import { setAuthCookies } from "../utils/cookies.js";
import { CREATED } from "../constants/http.js";
import { loginUser } from "../services/auth.service.js";
import { OK } from "../constants/http.js"; 
import { registerSchema, loginSchema } from "./auth.schemas.js";

// Controller function to handle user registration
export const registerHandler = catchErrors(async (req, res, next) => {
    // Validate request body against schema
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    // Create a new account using the provided data
    const { user, accessToken, refreshToken } = await createAccount(request);

    // Set authentication cookies and return response with created status code and user object
    return setAuthCookies({res, accessToken, refreshToken})
        .status(CREATED)
        .json(user);
});

// Controller function to handle user login
export const loginHandler = catchErrors(async (req, res, next) => { 
    // Validate request body against schema
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    // Log in the user and retrieve tokens
    const { accessToken, refreshToken } = await loginUser(request);

    // Set authentication cookies and return response with OK status code and success message
    return setAuthCookies({res, accessToken, refreshToken }).status(OK).json({
        message:"Login Successful",
    });
});