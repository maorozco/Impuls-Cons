import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#10B981',
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: 22,
          borderRadius: 6,
          border: '1px solid rgba(16, 185, 129, 0.4)',
        }}
      >
        B
      </div>
    ),
    size,
  );
}
