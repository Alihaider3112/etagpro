import  connect  from '../../../../connection/index';
import Users from '../../../../models/user';

export default async function handler(req, res) {
    await connect();

    if (req.method === 'GET') {
        const { id } = req.query; 
        try {
            const user = await Users.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'user not found' });
            }
            res.status(200).json({ message: 'ok', user });
         }
        catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    }  
    else if (req.method === 'PUT') {
       const { first_name,last_name,email,password } = req.body;
       const { id } = req.query; 
        try {
        const updateduser = await Users.findByIdAndUpdate(id, {
               first_name: first_name,
               last_name:last_name,
               email:email,
               password:password,
        }, { new: true }); 
          if (!updateduser) {
             return res.status(404).json({ message: 'user not found' });
            }
            res.status(200).json({ message: 'user updated successfully', user: updateduser });
     } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
    } else if(req.method === 'DELETE') {
        const { id } = req.query;
        try {
            const deleteduser = await Users.findByIdAndDelete(id);
            if (!deleteduser) {
                return res.status(404).json({ message: 'user not found' });
            }
            res.status(200).json({ message: 'user deleted successfully', user: deleteduser });
        } catch (error) {
            res.status(400).json({ message: 'Error deleting user', error });
        }
    } 
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
}

