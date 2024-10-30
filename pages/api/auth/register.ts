import {NextApiRequest, NextApiResponse} from 'next';
import knex from 'knex';
import bcrypt from 'bcrypt';
import knexConfig from '../../../knexfile';
import {StatusCode} from "@/lib/statusCodes";
import {transformResponse} from "@/lib/interceptors/transformInterceptor";

const db = knex(knexConfig);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const {username, password, email, firstName, lastName} = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({error: 'Username, password, and email are required.'});
        }

        try {
            const existingUser = await db('users').where('username', username).orWhere('email', email).first();
            if (existingUser) {
                return res.status(409).json({error: 'Username or email already exists.'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const [user] = await db('users').insert({
                username,
                password: hashedPassword,
                email,
                first_name: firstName,
                last_name: lastName,
            }).returning('*');

            res.status(StatusCode.CREATED).json(transformResponse({
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                },
                message: 'User created successfully',
                statusCode: StatusCode.CREATED,
            }));

        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to register user.'});
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
