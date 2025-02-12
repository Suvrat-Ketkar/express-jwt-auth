// This function helps handle errors in asynchronous functions so that if an error occurs, 
// it gets passed to Express's error handler instead of crashing the app.

// This function takes another function (controller) as input.
const catchErrors = (controller) => {
    // It returns a new function that takes req, res, and next as input.
    // This new function will wrap the original controller inside a try...catch
    return async (req, res, next) => {
        // The try block runs the original controller function
      try {
        await controller(req, res, next);
      } 
    //   If an error happens, the catch block catches it.
      catch (error) {
        // It passes the error to next(error), which sends it to Express’s error handler.
        next(error);
      }
    };
  };
  
  export default catchErrors; 
  