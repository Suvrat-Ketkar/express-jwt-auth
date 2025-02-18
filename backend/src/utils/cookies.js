// import { Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.js";

export const REFRESH_PATH = "/auth/refresh";
const secure = process.env.NODE_ENV !== "development";
const defaults = {
    sameSite: "strict",
    httpOnly: true,
    secure: true
    
}

export const getaAccessTokenCookieOptions = () => ({
    ...defaults, 
    expires: fifteenMinutesFromNow()
});
export const getRefreshTokenCookieOptions = () => ({
    ...defaults, 
    expires: thirtyDaysFromNow(),
    path: REFRESH_PATH
});


export const setAuthCookies = ({res, accessToken, refreshToken}) => 
    res
    .cookie("accessToken", accessToken, getaAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res) => 
    res.clearCookie("accessToken").clearCookie("refreshToken", {
        path: REFRESH_PATH,
    });