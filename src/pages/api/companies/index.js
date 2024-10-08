import  connect  from '../../../connection/index';
import Companies from '../../../models/company';
import  verifyToken  from '../../../auth/index';  

const handler = async (req, res) => {
    try {
        
    
    await connect();

    if (req.method === 'POST') {
        const { name } = req.body;

        try {
            const company = new Companies({
                name: name,
                created_by: "Naveed",
                created_at: new Date(),
                updated_by: "Naveed",
                updated_at: new Date(),
            });
            const result = await company.save();
            res.status(200).json({ message: 'ok', result });
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    } else if (req.method === 'GET') {
        try {
            const { page = 1, limit = 10,search,filter } = req.query; 
            const totalCount = await Companies.countDocuments({});
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
            const result = await Companies.find(query).skip(skip).limit(parseInt(limit));

            res.status(200).json({
                message: 'ok',
                result,
                totalCount
            });
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} catch (error) {
    res.status(400).json({ message: 'error', error });
}
};

export default (req, res) => verifyToken(req, res, () => handler(req, res));