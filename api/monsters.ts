import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../src/utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  switch (req.method) {
    case 'GET':
      const monsters = await db.collection('monsters').find({}).toArray();
      res.json(monsters);
      break;
    case 'POST':
      const newMonster = req.body;
      const result = await db.collection('monsters').insertOne(newMonster);
      res.json(result);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}