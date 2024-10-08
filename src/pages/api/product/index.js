import connect from '../../../connection/index';
import Products from '../../../models/product';
import Brand from '../../../models/brand';
import verifyToken from '../../../auth/index';
import Image from '../../../models/image';

const handler = async (req, res) => {
  await connect();

  if (req.method === 'POST') {
    const { brand_name, brand_id, serial_number, company_name, company_id, image_url, image_id } = req.body;

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
        image_url,
        created_by: "Naveed",
        created_at: new Date(),
        updated_by: "Naveed",
        updated_at: new Date(),
      });

      const result = await product.save();
      await Image.findByIdAndUpdate(image_id, { $set: { product_id: result.id } });

      res.status(200).json({ message: 'ok', result });
    } catch (error) {
      console.error('Error in POST /api/product:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  } else if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, search, filter } = req.query;
      const skip = (page - 1) * limit;
      const query = {};

      if (search) {
        query.brand_name = { $regex: search, $options: 'i' };
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

      const totalCount = await Products.countDocuments(query);
      const result = await Products.find(query).skip(skip).limit(parseInt(limit));

      res.status(200).json({
        message: 'ok',
        result,
        totalCount,
        query
      });
    } catch (error) {
      console.error('Error in GET /api/product:', error);
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default (req, res) => verifyToken(req, res, () => handler(req, res));
