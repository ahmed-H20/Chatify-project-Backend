import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware.js";
import User from "../../Models/userModel.js";


export const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ max: 50 })
    .withMessage("Name can not be greater than 50 characters ")
    .isLength({ min: 3 })
    .withMessage("Name must be greater than 3 characters "),
    check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .custom(async (value) => {
      const user = await User.findOne({ phone: value });
      if (user) {
        throw new Error("Phone in use");
      }
    })
    .isMobilePhone("ar-EG")
    .withMessage('Invalid phone number'),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
  validatorMiddleware,
];

export const loginValidator = [
  check('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Invalid email address')
      .custom((val) =>
        User.findOne({ email: val }).then((user) => {
          if (!user) {
            return Promise.reject(new Error("Invalid email or password"));
          }
        })),
  check('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),

  validatorMiddleware
];
// export const loginValidator = [
//   check("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .withMessage("Please enter a valid email"),
//   check("password")
//     .notEmpty()
//     .withMessage("Password is required")
//     .isLength({ min: 5 })
//     .withMessage("Password must be at least 5 characters long"),
//   validatorMiddleware,
// ];
// export const loginWebSiteValidator = [
//   check('phone')
//    .notEmpty()
//    .withMessage("Phone is required")
//    .isMobilePhone(['ar-EG'])
//    .withMessage('Invalid phone number'),
//   check("email")
//     .notEmpty()
//     .withMessage("Email is required")
//     .isEmail()
//     .withMessage("Please enter a valid email"),
//   check("password")
//     .notEmpty()
//     .withMessage("Password is required")
//     .isLength({ min: 5 })
//     .withMessage("Password must be at least 5 characters long"),
//   validatorMiddleware,
// ];

