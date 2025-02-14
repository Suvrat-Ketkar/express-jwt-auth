// import AppErrorCode from "../constants/appErrorCode";
// import { HttpStatusCode } from "../constants/http";

class AppError extends Error {
  constructor(statusCode, message, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export default AppError;
