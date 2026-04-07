import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // Mengambil link database dari file .env.local secara otomatis
  const sql = neon(process.env.POSTGRES_URL);

  try {
    // Mengambil data dari tabel projects yang kita buat di dashboard Vercel
    const projects = await sql`SELECT * FROM projects ORDER BY id DESC`;
    
    // Kirim data ke frontend
    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gagal mengambil data dari database" });
  }
}