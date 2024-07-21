import connect from '../../../connection/index';
import Products from '../../../models/product';
import Brand from '../../../models/brand';
import  verifyToken  from '../../../auth/index';  

const handler = async (req, res) => {

  await connect();
  if (req.method === 'POST') {
    const { brand_name, brand_id, serial_number, company_name, company_id } = req.body;

    try {
      const brand = await Brand.findById(brand_id);
      if (!brand) {
        return res.status(400).json({ message: 'Brand not found' });
      }
      const product = new Products({
        brand_name,
        brand_id,
        serial_number,
        company_name,
        company_id,
        created_by: "Naveed",
        created_at: new Date(),
        updated_by: "Naveed",
        updated_at: new Date(),
      });

      const result = await product.save();
      res.status(200).json({ message: 'ok', result });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: 'error', error });
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10 } = req.query; 
      const skip = (page - 1) * limit;

      const result = await Products.find({})
                                    .skip(skip)
                                    .limit(parseInt(limit));

      res.status(200).json({
          message: 'ok',
          result,
      });
    } catch (error) {
      res.status(400).json({ message: 'error', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default (req, res) => verifyToken(req, res, () => handler(req, res));

