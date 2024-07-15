import  connect  from '../../../connection/index';
import Users from '../../../models/user';


export default async function handler(req, res) {
    await connect();

    if (req.method === 'POST') {
        const { first_name,last_name,email,password } = req.body;
        try {
            const user = new Users({
                first_name:first_name,
                last_name:last_name,
                email:email,
                password:password,
            });
            const result = await user.save();
            res.status(200).json({ message: 'ok', result });
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    } else if (req.method === 'GET') {
        try {
            const result = await Users.find({});
            res.status(200).json({ message: 'ok', result });
        } catch (error) {
            res.status(400).json({ message: 'error', error });
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
