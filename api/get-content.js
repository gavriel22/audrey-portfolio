import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.POSTGRES_URL);
  const { section } = req.query;

  try {
    if (section) {
      const result = await sql`SELECT data FROM global_content WHERE section_name = ${section}`;
      if (result.length > 0) {
        return res.status(200).json(result[0].data);
      }
      return res.status(404).json({ error: 'No data found for this section' });
    } else {
      // Bila perlu memuat semuanya di awal
      const result = await sql`SELECT section_name, data FROM global_content`;
      const allData = {};
      result.forEach(row => {
        allData[row.section_name] = row.data;
      });
      return res.status(200).json(allData);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Gagal memuat konten global." });
  }
}
