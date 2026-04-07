import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = neon(process.env.POSTGRES_URL);
  const { section, data } = req.body;

  try {
    // Upsert (Update if exist, Insert if not) menggunakan parameter safely escaped JSON.stringify -> jsonb
    await sql`
      INSERT INTO global_content (section_name, data) 
      VALUES (${section}, ${JSON.stringify(data)}::jsonb)
      ON CONFLICT (section_name) 
      DO UPDATE SET data = EXCLUDED.data
    `;
    
    return res.status(200).json({ message: `Data ${section} sukses disimpan!` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
