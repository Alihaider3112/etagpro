import connect from '../../../../connection/index';
import Images from '../../../../models/image';
import { IncomingForm } from 'formidable';
import { deleteImage,updateImage } from '../../../../upload_images/index'; 
import  verifyToken  from '../../../../auth/index';  

export const config = {
    api: {
      bodyParser: false,
    },
  };
const handler = async (req, res) => {
    await connect();
  
    if (req.method === 'DELETE') {
        try {
            const {id}=req.query;
            if (!id) {
                return res.status(400).json({ message: 'ID is required' });
            }
            const imageRecord = await Images.findOne({ _id: id });
            if (!imageRecord) {
                return res.status(400).json({ message: 'Image not found in database ' });
           }

            const public_id = imageRecord.public_id;
            const result = await deleteImage(public_id);

            if (result.success) {
                // Delete the image record from MongoDB if Cloudinary deletion was successful
                await Images.findOneAndDelete(id);
                return res.status(200).json({ message: 'Image deleted successfully from Cloudinary and database' });
            }

        } catch (error) {
            console.error('Error fetching images:', error);
            return res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
     
    } else if (req.method === 'PUT') {
        const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  const form = new IncomingForm();
  form.keepExtensions = true;

  try {
    form.parse(req, async (err, _fields, files) => {
      try {
        if (err) {
          throw new Error(`Error parsing form data: ${err.message}`);
        }

        const image = files.image;
        if (!image || (Array.isArray(image) && image.length === 0)) {
          throw new Error('No file uploaded or multiple files uploaded');
        }

        const imageRecord = await Images.findById(id);
        if (!imageRecord) {
          throw new Error('Image not found in database');
        }

        const public_id = imageRecord.public_id;

        const filePath = Array.isArray(image) ? image[0].filepath : image.filepath;

        if (!filePath) {
          throw new Error('File path is invalid');
        }

        const updatedImage = await updateImage(filePath, public_id, 'next.js_upload_image');

        // Update the image record in the database
        imageRecord.image_url = updatedImage.secure_url;
        imageRecord.public_id = updatedImage.public_id;
       const result= await imageRecord.save();
        return res.status(200).json({ message: 'Image updated successfully in cloudinary and database ', result });

      } catch (error) {
        console.error('Error updating image:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
  } catch (error) {
    console.error('Error in form parsing:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
}
    }else {
      res.setHeader('Allow', ['DELETE','PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };

  
export default (req, res) => verifyToken(req, res, () => handler(req, res));
  
  