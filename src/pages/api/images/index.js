import connect from '../../../connection/index';
import Image from '../../../models/image';
import { IncomingForm } from 'formidable';
import { uploadImage } from '../../../upload_images/index'; 
import  verifyToken  from '../../../auth/index';  


export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  await connect();

  if (req.method === 'POST') {
    const form = new IncomingForm();

    form.parse(req, async (err, _fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ message: 'Error parsing form data', error: err.message });
      }

      const image = files.image;
      if (!image || (Array.isArray(image) && image.length === 0)) {
        return res.status(400).json({ message: 'No file uploaded or multiple files uploaded' });
      }

      try {
        const filePath = image.filepath || image[0]?.filepath; 
  
        if (!filePath) {
          return res.status(400).json({ message: 'File path not found' });
        }

        // Upload the image using Cloudinary
        const data = await uploadImage(filePath, 'next.js_upload_image'); 
        // console.log('Cloudinary upload response:', data);

        if (!data || !data.secure_url || !data.public_id) {
          return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
        }

        const result = await Image.create({
          image_url: data.secure_url,
          public_id: data.public_id,
        });
        return res.status(200).json({ message: 'Image uploaded and data saved successfully', result });

      } catch (error) {
        console.error('Error processing file upload:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const result = await Image.find({});
      return res.status(200).json({ message: 'ok', result });
    } catch (error) {
      console.error('Error fetching images:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default (req, res) => verifyToken(req, res, () => handler(req, res));

