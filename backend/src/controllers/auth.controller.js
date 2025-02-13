import catchErrors from "../utils/catchErrors.js";
import { z } from "zod";
import { createAccount } from "../services/auth.service.js";
import { setAuthCookies } from "../utils/cookies.js";
import { CREATED } from "../constants/http.js";


const registerSchema = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
    
}).refine(
    (data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });


export const registerHandler = catchErrors(async (req, res, next) => {
        //validate request body
        const request = registerSchema.parse({
            ...req.body,
            userAgent: req.headers['user-agent'],
        });
        // create service
        const {user, accessToken, refreshToken} = await createAccount(request);

        return setAuthCookies({res, accessToken, refreshToken})
        .status(CREATED)
        .json(user)
});