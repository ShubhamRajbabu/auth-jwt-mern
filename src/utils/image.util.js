import multer from "multer";
import path from 'path';
import fs from 'fs';

const uploadPath = path.join(process.cwd(), "public", "images", "avatar");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniquePrefix = Date.now();
        cb(null, `${uniquePrefix + '-' + file.fieldname}${ext}`);
    }
});

const avatarFileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        // You can always pass an error if something goes wrong:
        return cb(new Error('Please upload images only'))
    }

    // To accept the file pass `true`, like so:
    cb(null, true);
}

export const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit (in bytes)
});