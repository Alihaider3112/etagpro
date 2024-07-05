import  connect  from '../../../connection/index';
import Products from '../../../models/product';
import Brand from '../../../models/brand';


export default async function handler(req, res) {
     await connect();
    if (req.method === 'POST') {
        const { brand_name,brand_id,serial_number,company_name,company_id} = req.body;

        try {
            const brand = await Brand.findById(brand_id);
            if (!brand) {
              return res.status(400).json({ message: 'Brand not found' });
            }
            const product = new Products({
                brand_name: brand_name,
                brand_id:brand_id,
                serial_number:serial_number,
                created_by: "Naveed",
                created_at: new Date(),
                updated_by: "Naveed",
                updated_at: new Date(),
                company_name:company_name,
                company_id:company_id,
            });
            const result = await product.save();
            res.status(200).json({ message: 'ok',result });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'error', error });
        }
    }  else if (req.method === 'GET') {
        try {
            const result = await Products.find({});
           res.status(200).json({ message: 'ok',result});
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    }
     else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}