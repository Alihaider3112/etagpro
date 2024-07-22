import  connect  from '../../../../connection/index';
import Companies from '../../../../models/company';
import  verifyToken  from '../../../../auth/index';  


const handler = async (req, res) => {
    await connect();
    if (req.method === 'GET') {
        const { id } = req.query; 
       
        try {
            const company = await Companies.findById(id);
            if (!company) {
                return res.status(404).json({ message: 'company not found' });
            }
            res.status(200).json({ message: 'ok', company });
         }
        catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    }  
    else if (req.method === 'PUT') {
       const { name } = req.body;
       const { id } = req.query; 
        try {
        const updatedcompany = await Companies.findByIdAndUpdate(id, {
               name:name,
               updated_by:"Asad",
               updated_at:Date.now(),
        }, { new: true }); 
          if (!updatedcompany) {
             return res.status(404).json({ message: 'company not found' });
            }
            res.status(200).json({ message: 'company updated successfully', company: updatedcompany });
     } catch (error) {
        res.status(400).json({ message: 'Error updating company', error });
    }
    } else if(req.method === 'DELETE') {
        const { id } = req.query;

        try {
            const deletedcompany = await Companies.findByIdAndDelete(id);
            if (!deletedcompany) {
                return res.status(404).json({ message: 'company not found' });
            }
            res.status(200).json({ message: 'company deleted successfully', company: deletedcompany });
        } catch (error) {
            res.status(400).json({ message: 'Error deleting company', error });
        }
    } 
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
}

export default (req, res) => verifyToken(req, res, () => handler(req, res));
