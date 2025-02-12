import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http.js";


const handleZodError = (error, res) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,

    }));
    return res.status(BAD_REQUEST).json({
        message:error.message,
        errors,
    });
}
const errorHandler = (err, req, res, next) => {

    if(err instanceof z.ZodError){
        return handleZodError(err, res);
    }
    console.log(`PATH ${req.path}`, err);
    res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
}
export default errorHandler;