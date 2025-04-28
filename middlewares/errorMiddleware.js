
// import ApiError from '../utils/apiError.js';

// const handlerJwtInvalidSignature = ()=>{
//     return new ApiError('Invalid Jwt signature ,please login again.');
// }

// const handlerJwtExpired = ()=>{
//     return new ApiError('Expired token ,please login again...');
// }

// export const globalError = (err,req,res,next) => {
//     console.error(err);
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';
//     if(process.env.NODE_ENV !== 'development'){
//         return sendErrorForDev(err,res);
//     }else{
//         if(err.name === 'jsonWebTokenError') err = handlerJwtInvalidSignature();
//         if(err.name === 'TokenExpiredError') err = handlerJwtExpired();
//         return sendErrorForProd(err,res);
//     }
// }

// export const sendErrorForDev = (err,res) => {
//     console.log(err);
//     return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//         error: err
//     });
// }

// export const sendErrorForProd = (err,res) => {
//     return res.status(err.statusCode||500).json({
//         status: err.status || 'error',
//         message: err.message || 'Something went wrong',
//     });
// }

import ApiError from "../utils/apiError.js";

const sendErrorForDev = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorForProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
};

const handleJwtInvalidSignature = () =>
    new ApiError('Invalid token, please log in again.', 401);

const handleJwtExpired = () =>
    new ApiError('Expired token, please log in again.', 401);

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status  || 'error';

    if (process.env.NODE_ENV === "development") {
        sendErrorForDev(err, res);
    } else {
        if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
        if (err.name === 'TokenExpiredError') err = handleJwtExpired();
        sendErrorForProd(err, res);
    }
};

export default globalError;
