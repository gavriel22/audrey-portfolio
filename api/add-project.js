// api/add-project.js
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Hanya izinkan metode POST (mengirim data)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.POSTGRES_URL);
  const { title, description, link } = req.body;

  try {
    // Perintah SQL untuk memasukkan data baru
    await sql`
      INSERT INTO projects (title, description, link) 
      VALUES (${title}, ${description}, ${link})
    `;
    
    return res.status(200).json({ message: 'Project berhasil ditambahkan!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}