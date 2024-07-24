import connect from '../../../connection/index';
import Brand from '../../../models/brand';
import  verifyToken  from '../../../auth/index';  


const handler = async (req, res) => {

    await connect();
    if (req.method === 'GET') {
        try {
            const { page = 1, limit = 10,search,filter } = req.query; 
            const skip = (page - 1) * limit;
            const query={};
            if(search){
                query.name = { $regex: search, $options: 'i' };
            }
            if (filter) {
                try {
                    const filterObj = JSON.parse(filter);
                    Object.assign(query, filterObj);
                } catch (parseError) {
                    console.error('Error parsing filter:', parseError);
                    return res.status(400).json({ message: 'Invalid filter format', error: parseError });
                }
            }
            const result = await Brand.find(query).skip(skip).limit(parseInt(limit));

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
