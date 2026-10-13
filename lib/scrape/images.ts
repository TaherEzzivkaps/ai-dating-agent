import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function downloadAndSaveImage(imageUrl: string, personSlug: string, index: number): Promise<string> {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!response.ok) {
      return imageUrl; // Fallback to original URL
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const ext = imageUrl.includes('.webp') ? '.webp' : imageUrl.includes('.png') ? '.png' : '.jpg';
    const filename = `${personSlug}_${index}_${Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to download image:', err);
    return imageUrl;
  }
}
