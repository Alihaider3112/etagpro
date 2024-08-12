import connect from '../../../connection/index';
import Users from '../../../models/user';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'myverysecuresecretkey2912';

export default async function handler(req, res) {
    await connect();

    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            const user = await Users.findOne({email,password});
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({token});
        } catch (error) {
            res.status(400).json({ message: 'Error', error });
        }
    }
     else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
