import  connect  from '../../../../connection/index';
import Products from '../../../../models/product';
import  verifyToken  from '../../../../auth/index';  

const handler = async (req, res) => {

    await connect();
    if (req.method === 'GET') {
        const { id } = req.query; 
        try {
            const product = await Products.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'ok', product });
         }
        catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    }  
    else if (req.method === 'PUT') {
        const { brand_name,brand_id,serial_number,company_name,company_id,image_url } = req.body;
       const { id } = req.query; 
        try {
        const updatedProduct = await Products.findByIdAndUpdate(id, {
               brand_name: brand_name,
               brand_id:brand_id,
               serial_number:serial_number,
               company_name:company_name,
               company_id:company_id,
               image_url:image_url,
               updated_by:"Asad",
               updated_at:Date.now(),
        }, { new: true }); 
          if (!updatedProduct) {
             return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated successfully', Product: updatedProduct });
     } catch (error) {
        res.status(400).json({ message: 'Error updating Product', error });
    }
    } else if(req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const deletedProduct = await Products.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully', Product: deletedProduct });
        } catch (error) {
            res.status(400).json({ message: 'Error deleting Product', error });
        }
    } 
    else {
        res.setHeader('Allow', ['GET','PUT','DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
}

export default (req, res) => verifyToken(req, res, () => handler(req, res));
