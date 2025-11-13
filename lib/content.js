import { kv } from '@vercel/kv';
import { defaultContent, KV_KEY } from './constants';

/**
 * Shared function to read content from KV storage
 * Used by both the API route and server components
 */
export async function getContentFromKV() {
    try {
        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
            return defaultContent;
        }
        const content = await kv.get(KV_KEY);
        return content || defaultContent;
    } catch (err) {
        console.error('KV read failed:', err);
        return defaultContent;
    }
}

