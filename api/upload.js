import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Hanya metode POST yang diizinkan' });
  }

  try {
    const { filename, fileBase64 } = req.body;
    if (!filename || !fileBase64) return res.status(400).json({ error: 'Data file tidak valid' });

    // Vercel Blob akan menerima object Buffer dari pemisahan prefix Base64
    const base64Data = fileBase64.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const blob = await put(filename, buffer, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}