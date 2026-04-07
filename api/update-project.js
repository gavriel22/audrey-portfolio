import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.POSTGRES_URL);
  const { id, title, description, link } = req.body;

  try {
    await sql`
      UPDATE projects 
      SET title = ${title}, description = ${description}, link = ${link} 
      WHERE id = ${id}
    `;
    return res.status(200).json({ message: 'Berhasil diupdate!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
