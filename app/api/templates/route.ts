import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'templates');
    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json({ files: [] });
    }
    const files = fs.readdirSync(templatesDir);
    
    // grid_ 로 시작하는 파일 제외, .png 파일만 필터링
    const pngFiles = files
      .filter(f => f.toLowerCase().endsWith('.png') && !f.toLowerCase().startsWith('grid_'))
      .sort();
      
    return NextResponse.json({ files: pngFiles });
  } catch (error) {
    console.error('Failed to read templates directory:', error);
    return NextResponse.json({ files: [] }, { status: 500 });
  }
}
