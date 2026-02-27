import multer from "multer";
import path from "path";
import fs from "fs";

const createUploader = (allowedTypes, folderName, maxSizeMB = 10) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(process.cwd(), "public", folderName);

            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },

        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname);
            const uniquePrefix = Date.now();
            cb(null, `${uniquePrefix}-${file.fieldname}${ext}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        const isAllowed = allowedTypes.some(type =>
            file.mimetype.startsWith(type)
        );

        if (!isAllowed) {
            return cb(new Error("Invalid file type"), false);
        }

        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSizeMB * 1024 * 1024 }
    });
};

export const avatarUpload = createUploader(['image/'], 'images/avatar', 5);

export const videoUpload = createUploader(['video/'], 'videos', 50);

export const fileUpload = createUploader(
    ['image/', 'video/', 'application/pdf'],
    'uploads',
    20
);
