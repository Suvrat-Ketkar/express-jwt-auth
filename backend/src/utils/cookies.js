// import { Response } from "express";
import { fifteenMinutesFromNow, thiryDaysFromNow } from "./date.js";

const secure = process.env.NODE_ENV !== "development";
const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure: true
    
}

const getaAccessTokenCookieOptions = () => ({
    ...defaults, 
    expires: fifteenMinutesFromNow()
});
const getRefreshTokenCookieOptions = () => ({
    ...defaults, 
    expires: thiryDaysFromNow(),
    path: "/auth/refresh"
});


export const setAuthCookies = ({res, accessToken, refreshToken}) => 
    res
    .cookie("accessToken", accessToken, getaAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());