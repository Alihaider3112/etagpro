import connect from '../../../connection/index';
import Companies from '../../../models/company';

export default async function handler(req, res) {
    await connect();
    
    if (req.method === 'GET') {
        try {
            const result = await Companies.find({});
            res.status(200).json({ message: 'ok', result });
        } catch (error) {
            console.error('Error fetching companies:', error);
            res.status(400).json({ message: 'error', error });
        }
    } else if (req.method === 'POST') {
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
            console.error('Error adding company:', error);
            res.status(400).json({ message: 'error', error });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
