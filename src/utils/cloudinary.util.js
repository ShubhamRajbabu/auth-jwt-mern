import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const uploadToCloudinary = async (localFilePath) => {
    if (!localFilePath) throw Error("Image not found");
    try {
        const { url } = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto' //will automatically decide what file type is available in local path(video/audio/image)
        });

        return url;
    } catch (error) {
        return new Error(error);
    } finally {
        // ALWAYS cleanup local file
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
    }
}