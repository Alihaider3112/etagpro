import  connect  from '../../../connection/index';
import Brands from '../../../models/brand';

export default async function handler(req, res) {
     await connect();
    if (req.method === 'POST') {
        const { name,company_name,company_id} = req.body;
        try {
            const brand = new Brands({
                name: name,
                created_by: "Naveed",
                created_at: new Date(),
                updated_by: "Naveed",
                updated_at: new Date(),
                company_name:company_name,
                company_id:company_id,
            });
            const result = await brand.save();
            res.status(200).json({ message: 'ok', result });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'error', error });
        }
    }  else if (req.method === 'GET') {
        try {
            const result = await Brands.find({});
            res.status(200).json({ message: 'ok', result });
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

