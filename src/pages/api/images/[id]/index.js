import connect from '../../../../connection/index';
import Images from '../../../../models/image';
import { deleteImage } from '../../../../upload_images/index'; 
import  verifyToken  from '../../../../auth/index';  


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
     
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  
export default (req, res) => verifyToken(req, res, () => handler(req, res));
  
  