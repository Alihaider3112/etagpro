import  connect  from '../../../../connection/index';
import Companies from '../../../../models/company';

export default async function handler(req, res) {
    await connect();

    if (req.method === 'GET') {
        const { id } = req.query; 
        // console.log(id);
        try {
            const company = await Companies.findById(id);
            // console.log(company);
            if (!company) {
                return res.status(404).json({ message: 'Company not found' });
            }
            res.status(200).json({ message: 'ok', company });
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    } else if (req.method === 'PUT') {
        const { name } = req.body;
        const { id } = req.query; 
        try {
            const updatedCompany = await Companies.findByIdAndUpdate(id, {
                name: name,
            }, { new: true }); 
            if (!updatedCompany) {
                return res.status(404).json({ message: 'Company not found' });
            }
            res.status(200).json({ message: 'Company updated successfully', company: updatedCompany });
        } catch (error) {
            res.status(400).json({ message: 'Error updating company', error });
        }
    } else if(req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const deletedCompany = await Companies.findByIdAndDelete(id);
            if (!deletedCompany) {
                return res.status(404).json({ message: 'Company not found' });
            }
            res.status(200).json({ message: 'Company deleted successfully', company: deletedCompany });
        } catch (error) {
            res.status(400).json({ message: 'Error deleting company', error });
        }
    } 
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
}

       


