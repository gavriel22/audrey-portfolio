import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.POSTGRES_URL);
  const { id } = req.body;

  try {
    await sql`DELETE FROM projects WHERE id = ${id}`;
    return res.status(200).json({ message: 'Terhapus secara permanen' });
  } catch(error) {
    return res.status(500).json({ error: error.message });
  }
}
