import connect from '../../../connection/index';
import Brand from '../../../models/brand';
import  verifyToken  from '../../../auth/index';  


const handler = async (req, res) => {

    await connect();
    if (req.method === 'GET') {
        try {
            const { page = 1, limit = 10 } = req.query; 
            const skip = (page - 1) * limit;

            const result = await Brand.find({})
                                          .skip(skip)
                                          .limit(parseInt(limit));

            res.status(200).json({
                message: 'ok',
                result,
            });
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

export default (req, res) => verifyToken(req, res, () => handler(req, res));
