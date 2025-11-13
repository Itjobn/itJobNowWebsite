import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { KV_KEY } from '@/lib/constants';

async function writeToKV(data) {
    try {
        if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
            throw new Error('KV storage is not configured');
        }
        await kv.set(KV_KEY, data);
    } catch (err) {
        console.error('KV write failed:', err);
        throw err;
    }
}

export async function POST(request) {
    try {
        // Check authorization
        const password = request.headers.get("x-edit-password");

        if (password !== process.env.CONTENT_EDIT_PASSWORD) {
            console.log(password, "passwordpassword");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const data = await request.json();

        if (!data || !data.hero) {
            return NextResponse.json(
                { error: 'Invalid data format. Content must include a hero object.' },
                { status: 400 }
            );
        }
        await writeToKV(data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating content:', error);

        if (error.message === 'KV storage is not configured') {
            return NextResponse.json(
                { error: 'KV storage is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.' },
                { status: 500 }
            );
        }


        return NextResponse.json(
            { error: `Failed to update content: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
