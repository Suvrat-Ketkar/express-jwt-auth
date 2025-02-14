import assert from "node:assert"
import AppError from "./AppError.js";
/** 
 * Asserts an condition and throws an AppError  if it is false
*/
const appAssert = (condition,HttpStatusCode, message, errorCode) => {
    assert(condition, new AppError(HttpStatusCode, message, errorCode));
    
}
export default appAssert;