import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Impulso BioCycle';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0A0A0A 0%, #0F1A14 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '20px',
            fontWeight: 600,
            color: '#A1A1AA',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            B
          </div>
          Impulso<span style={{ color: '#10B981' }}>BioCycle</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginTop: 'auto',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 600,
              lineHeight: 1.1,
              maxWidth: '900px',
              letterSpacing: '-0.02em',
            }}
          >
            Contamination isn't <span style={{ color: '#10B981' }}>inevitable.</span>
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 600,
              lineHeight: 1.1,
              maxWidth: '900px',
              letterSpacing: '-0.02em',
            }}
          >
            It's a problem of <span style={{ color: '#10B981' }}>applied intelligence.</span>
          </div>
        </div>

        <div
          style={{
            fontSize: '20px',
            color: '#A1A1AA',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
            }}
          />
          Join the waitlist · biocycle.ai
        </div>
      </div>
    ),
    size,
  );
}
