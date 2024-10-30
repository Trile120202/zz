import { NextApiRequest, NextApiResponse } from 'next';
import knex from 'knex';
import knexConfig from '../../../knexfile';

const db = knex(knexConfig);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const roles = await db('roles').select('*');
        res.status(200).json(roles);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching roles', error });
      }
      break;

    case 'POST':
      try {
        const { name, description } = req.body;
        const [id] = await db('roles').insert({ name, description });
        const newRole = await db('roles').where({ id }).first();
        res.status(201).json(newRole);
      } catch (error) {
        res.status(500).json({ message: 'Error creating role', error });
      }
      break;

    case 'PUT':
      try {
        const { id, name, description } = req.body;
        await db('roles').where({ id }).update({ name, description });
        const updatedRole = await db('roles').where({ id }).first();
        res.status(200).json(updatedRole);
      } catch (error) {
        res.status(500).json({ message: 'Error updating role', error });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await db('roles').where({ id }).del();
        res.status(200).json({ message: 'Role deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting role', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
