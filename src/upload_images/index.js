import cloudinary from "../cloudinary/index";

export const uploadImage = async (filePath, folder) => {
  try {
    // Ensure `filePath` is a valid path
    if (!filePath) {
      throw new Error('File path is required');
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: false,
    });

    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const deleteImage = async (publicId) => {
  try {
    // Ensure `publicId` is provided
    if (!publicId) {
      throw new Error('Public ID is required');
    }

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      throw new Error(`Failed to delete image from Cloudinary: ${result.result}`);
    }

    return { success: true, message: 'Image deleted successfully', result };
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
