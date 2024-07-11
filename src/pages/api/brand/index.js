import connect from '../../../connection/index';
import Brand from '../../../models/brand';

export default async function handler(req, res) {
    await connect();

    if (req.method === 'GET') {
        try {
            const result = await Brand.find();
            res.status(200).json({ message: 'ok', result });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error });
        }
    } else if (req.method === 'POST') {
        try {
            const { name, company_name, company_id } = req.body;
            const newBrand = new Brand({ name, company_name, company_id });
            await newBrand.save();
            res.status(201).json({ message: 'Brand created successfully', result: newBrand });
        } catch (error) {
            res.status(500).json({ message: 'Error creating Brand', error });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
