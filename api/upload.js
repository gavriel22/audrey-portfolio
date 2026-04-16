import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Hanya metode POST yang diizinkan' });
  }

  try {
    const { filename, fileBase64 } = req.body;
    if (!filename || !fileBase64) return res.status(400).json({ error: 'Data file tidak valid' });

    // Validasi ekstensi file
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileExtension = '.' + filename.split('.').pop().toLowerCase();
    
    if (!filename.includes('.') || !allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({ error: 'Format file tidak didukung. Hanya gunakan JPG, JPEG, PNG, atau PDF.' });
    }

    // Vercel Blob akan menerima object Buffer dari pemisahan prefix Base64
    const base64Data = fileBase64.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Validasi ukuran file (Maksimal 4MB)
    const MAX_SIZE = 4 * 1024 * 1024; // 4MB dalam bytes
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({ error: 'Ukuran file terlalu besar. Maksimal 4MB.' });
    }

    const blob = await put(filename, buffer, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}