import { check } from 'express-validator';
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";



export const getUserValidator = [
    check('id')
    .isMongoId().withMessage('Invalid user id format'),
    validatorMiddleware
]



export const deleteUserValidator = [
    check('id')
    .isMongoId().withMessage('Invalid user id format'),
    validatorMiddleware
]

