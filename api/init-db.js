import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.POSTGRES_URL);

  try {
    // Membuat tabel generic untuk menyimpan struktur data JSON yang utuh per komponen
    await sql`
      CREATE TABLE IF NOT EXISTS global_content (
        section_name VARCHAR(50) PRIMARY KEY,
        data JSONB
      );
    `;
    return res.status(200).json({ message: 'Tabel global_content sukses dites/dibuat!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
