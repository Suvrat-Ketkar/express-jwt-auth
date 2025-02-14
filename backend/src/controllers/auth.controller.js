import catchErrors from "../utils/catchErrors.js";
import { z } from "zod";
import { createAccount } from "../services/auth.service.js";
import { setAuthCookies } from "../utils/cookies.js";
import { CREATED } from "../constants/http.js";


import { registerSchema, loginSchema } from "./auth.schemas.js";


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

export const loginHandler = catchErrors(async (req, res, next) => { 
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });

    const {} = await loginUser(request);
});