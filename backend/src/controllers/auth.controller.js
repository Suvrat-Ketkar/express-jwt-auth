import catchErrors from "../utils/catchErrors.js";
import { createAccount, refreshUserAccessToken, verifyEmail } from "../services/auth.service.js";
import { getaAccessTokenCookieOptions, setAuthCookies, getRefreshTokenCookieOptions } from "../utils/cookies.js";
import { CREATED } from "../constants/http.js";
import { loginUser } from "../services/auth.service.js";
import { OK,UNAUTHORIZED } from "../constants/http.js"; 
import { registerSchema, loginSchema, verificationCodeSchema, emailSchema } from "./auth.schemas.js";
import { verifyToken } from "../utils/jwt.js";
import SessionModel from "../models/session.model.js";
import { clearAuthCookies } from "../utils/cookies.js";
import appAssert from "../utils/appAssert.js";
import { sendPasswordResetEmail } from "../services/auth.service.js";
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

export const logoutHandler = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const {payload} = verifyToken(accessToken)
    // console.log(payload);

    if(payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res)
    .status(OK).json({
        message:"Logout Successful",
    })
 });

 export const refreshHandler = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    appAssert(refreshToken, UNAUTHORIZED, "No refresh token provided");

    const {
        accessToken,
        newRefreshToken
    } = await refreshUserAccessToken(refreshToken);

    if(newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }
    return res
    .status(OK)
    .cookie("accessToken",accessToken,getaAccessTokenCookieOptions())
    .json({
        message:"Access token refreshed successfully",
    });

 })

export const verifyEmailHandler = catchErrors(async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);

    await verifyEmail(verificationCode);

    return res
    .status(OK)
    .json({
        message:"Email verified successfully",
    });


});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {   
    const email = emailSchema.parse(req.body.email);
    
    await sendPasswordResetEmail(email);

    return res
    .status(OK)
    .json({
        message:"Password reset email sent successfully",
    })
});

