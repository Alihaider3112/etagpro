import connect from '../../../../connection/index';
import Brand from '../../../../models/brand';
import verifyToken  from '../../../../auth/index';  


const handler = async (req, res) => {
    await connect();
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const result = await Brand.findById(id);
                if (!result) {
                    return res.status(404).json({ message: 'Brand not found' });
                }
                res.status(200).json({ message: 'ok', result });
                
            } catch (error) {
                console.error('Error fetching brand:', error);
                res.status(500).json({ message: 'Server Error', error: error.message });
            }
            break;
        case 'PUT':
            try {
                const { name, company_name, company_id } = req.body;
                const updatedBrand = await Brand.findByIdAndUpdate(
                    id,
                    { name, company_name, company_id, updated_by: "Asad", updated_at: Date.now() },
                    { new: true }
                );
                if (!updatedBrand) {
                    return res.status(404).json({ message: 'Brand not found' });
                }
                res.status(200).json({ message: 'Brand updated successfully', brand: updatedBrand });
            } catch (error) {
                console.error('Error updating brand:', error);
                res.status(500).json({ message: 'Error updating Brand', error: error.message });
            }
            break;
        case 'DELETE':
            try {
                const deletedBrand = await Brand.findByIdAndDelete(id);
                if (!deletedBrand) {
                    return res.status(404).json({ message: 'Brand not found' });
                }
                res.status(200).json({ message: 'Brand deleted successfully', brand: deletedBrand });
            } catch (error) {
                console.error('Error deleting brand:', error);
                res.status(500).json({ message: 'Error deleting Brand', error: error.message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default (req, res) => verifyToken(req, res, () => handler(req, res));
