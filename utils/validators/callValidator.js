import { check } from 'express-validator';

import {validatorMiddleware} from '../../middlewares/validatorMiddleware.js';

export const createCallValidator = [
    check('participants')
    .notEmpty()
    .withMessage('Participants is required')
    .isMongoId()
    .withMessage('Invalid participants id format'),
    check('callType')
    .notEmpty()
    .withMessage('Call type is required'),
    // check('initiatedAt')
    // .notEmpty()
    // .withMessage('Initiated at is required '),
    check('answeredAt')
    .optional(),
    check('startedAt')
    .optional(),
    check('endedAt')
    .optional(),
    check('status')
    .optional(),
    check('roomId')
    .optional(),
    validatorMiddleware
]

export const getCallValidator = [
    check('id')
    .isMongoId()
    .withMessage('Invalid call id format'),
    validatorMiddleware
]  

export const updateCallValidator = [
    check('id')
    .isMongoId()
    .withMessage('Invalid call id format'),
    validatorMiddleware
]  

export const deleteCallValidator = [
    check('id')
    .isMongoId()
    .withMessage('Invalid call id format'),
    validatorMiddleware
]  
    