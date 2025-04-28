import { check } from 'express-validator';

import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";


export const createMessageValidator = [
    check('messageType')
    .notEmpty()
    .withMessage('messageType is required'),
    check('seenBy')
    .optional()
    .isMongoId()
    .withMessage('Invalid seenBy id format'),
    validatorMiddleware
]

export const getMessageValidator = [
    check('id')
    .isMongoId()
    .withMessage('Invalid message id format'),
    validatorMiddleware
]  

export const deleteMessageValidator = [
    check('id')
    .isMongoId()
    .withMessage('Invalid message id format'),
    validatorMiddleware
]  
    