import multer from "multer";
import ApiError from "./apiError.js";

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new ApiError('Not an image! Please upload only images.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadUserImage = upload.single('profile_picture');