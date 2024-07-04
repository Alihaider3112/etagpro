import  connect  from '../../../../connection/index';
import Brand from '../../../../models/brand';

export default async function handler(req, res) {
    await connect();

    if (req.method === 'GET') {
        const { id } = req.query; 
        // console.log(id);
        try {
            const brand = await Brand.findById(id);
            // console.log(company);
            if (!brand) {
                return res.status(404).json({ message: 'Brand not found' });
            }
            res.status(200).json({ message: 'ok', brand });
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    } 
    else if (req.method === 'PUT') {
       const { name,company_name,company_id } = req.body;
       const { id } = req.query; 
        try {
        const updatedBrand = await Brand.findByIdAndUpdate(id, {
               name: name,
               company_name:company_name,
               company_id:company_id,
               updated_by:"Asad",
               updated_at:Date.now(),
        }, { new: true }); 
          if (!updatedBrand) {
             return res.status(404).json({ message: 'Brand not found' });
            }
            res.status(200).json({ message: 'Brand updated successfully', Brand: updatedBrand });
     } catch (error) {
        res.status(400).json({ message: 'Error updating Brand', error });
    }
    } else if(req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const deletedBrand = await Brand.findByIdAndDelete(id);
            if (!deletedBrand) {
                return res.status(404).json({ message: 'Brand not found' });
            }
            res.status(200).json({ message: 'Brand deleted successfully', Brand: deletedBrand });
        } catch (error) {
            res.status(400).json({ message: 'Error deleting Brand', error });
        }
    } 
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
}
