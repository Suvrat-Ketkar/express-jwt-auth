import { UNAUTHORIZED } from "../constants/http.js";
import appAssert from "../utils/appAssert.js";
import { verifyToken } from "../utils/jwt.js";
const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    appAssert(accessToken,
        UNAUTHORIZED,
        "Not authorized",
        "InvalidAccessToken",
    );

    const {error,payload} = verifyToken(accessToken);

    appAssert(
        payload,
        UNAUTHORIZED,
        error === "jwt expired" ? "Session expired" : "Invalid Token",
        "InvalidAccessToken",
    );

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();
};

export default authenticate;