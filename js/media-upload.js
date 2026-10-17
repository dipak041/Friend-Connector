import {validateMedia} from './model.js';

// Public unsigned-upload configuration; no Cloudinary API secret belongs here.
export const cloudinaryConfig = Object.freeze({
  cloudName: 'zlvzklj5',
  uploadPreset: 'social_uploads'
});

export async function uploadMedia(file) {
  validateMedia(file);
  const body = new FormData();
  body.append('file', file);
  body.append('upload_preset', cloudinaryConfig.uploadPreset);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
      method: 'POST', body, signal: controller.signal
    });
    let result;
    try { result = await response.json(); }
    catch { throw Error('Cloudinary returned an invalid response. Please try again.'); }
    if (!response.ok) {
      throw Error(`Cloudinary upload failed: ${result?.error?.message || `HTTP ${response.status}`}`);
    }
    let url;
    try { url = new URL(result.secure_url); } catch { /* Handled below. */ }
    if (!url || url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com'
        || !url.pathname.startsWith(`/${cloudinaryConfig.cloudName}/`)) {
      throw Error('Cloudinary did not return a valid secure media URL.');
    }
    return result.secure_url;
  } catch (error) {
    if (error.name === 'AbortError') throw Error('Upload timed out. Please try again with a smaller file.');
    if (error instanceof TypeError) throw Error('Could not reach Cloudinary. Check your connection and try again.');
    throw error;
  } finally { clearTimeout(timeout); }
}
