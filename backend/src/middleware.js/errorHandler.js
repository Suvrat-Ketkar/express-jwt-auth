import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http.js";
import AppError from "../utils/AppError.js";


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
const handleAppError = (res, err) => {
    return res
    .status(err.statusCode)
    .json({
        message: err.message,
        errorCode: err.errorCode,  
    })
}
const errorHandler = (err, req, res, next) => {

    if(err instanceof z.ZodError){
        return handleZodError(err, res);
    }

    if(err instanceof AppError){
        return handleAppError(res, err)
    }
    console.log(`PATH ${req.path}`, err);
    res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
}
export default errorHandler;