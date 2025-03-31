import cloudinary from 'cloudinary';

const deleteOldImage = async (publicId) => {
    try {
        if (!publicId) {
            throw new Error('PublicId is required to delete an image.');
        }

        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'ok') {
            console.log(`Image with public ID ${publicId} deleted successfully.`);
            return result;
        } else {
            throw new Error(`Failed to delete image with public ID ${publicId}.`);
        }
    } catch (error) {
        console.error('Error deleting image:', error.message);
        throw error;
    }
};

export { deleteOldImage };