import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';

const VIDEO_PATH = join(process.cwd(), 'public', 'founder-video.mp4');

export async function GET(req: NextRequest) {
  let stat: ReturnType<typeof statSync>;
  try {
    stat = statSync(VIDEO_PATH);
  } catch {
    return new NextResponse('Video not found', { status: 404 });
  }

  const fileSize = stat.size;
  const rangeHeader = req.headers.get('range');

  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 10 * 1024 * 1024 - 1, fileSize - 1);
    const chunkSize = end - start + 1;

    const nodeStream = createReadStream(VIDEO_PATH, { start, end });
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  const nodeStream = createReadStream(VIDEO_PATH);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Length': String(fileSize),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
