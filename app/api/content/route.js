import { NextResponse } from 'next/server';
import { defaultContent } from '@/lib/constants';
import { getContentFromKV } from '@/lib/content';

export async function GET() {
    try {
        const content = await getContentFromKV();
        const response = { data: content };
        console.log('API Response:', JSON.stringify(response, null, 2));
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error reading content:', error);
        const response = { data: defaultContent };
        console.log('API Response (fallback):', JSON.stringify(response, null, 2));
        return NextResponse.json(response);
    }
}

