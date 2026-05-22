import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

export default function OG(_req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1526 60%, #091420 100%)',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Green glow blob */}
        <div style={{
          position: 'absolute', left: '-80px', bottom: '-80px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,227,119,0.18) 0%, transparent 70%)',
          display: 'flex',
        }} />
        {/* Blue glow blob */}
        <div style={{
          position: 'absolute', right: '-60px', top: '-60px',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,107,255,0.13) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Top green bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '5px',
          background: 'linear-gradient(90deg, #00E377, #00b85c)',
          display: 'flex',
        }} />

        {/* Field center circle */}
        <div style={{
          position: 'absolute', left: '490px', top: '215px',
          width: '220px', height: '220px', borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.05)',
          display: 'flex',
        }} />

        {/* Soccer ball outline (right side) */}
        <div style={{
          position: 'absolute', right: '60px', top: '150px',
          width: '240px', height: '240px', borderRadius: '50%',
          border: '2px solid rgba(0,227,119,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '200px', height: '200px', borderRadius: '50%',
            border: '1.5px dashed rgba(0,227,119,0.15)',
            display: 'flex',
          }} />
        </div>

        {/* Logo box + KickUp */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '20px',
          position: 'absolute', top: '180px', left: '100px',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #00E377, #00b85c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,227,119,0.4)',
          }}>
            <span style={{ fontSize: '44px', fontWeight: 900, color: '#0a0e1a' }}>K</span>
          </div>
          <span style={{
            fontSize: '72px', fontWeight: 900, color: '#ffffff',
            letterSpacing: '-1px',
          }}>KickUp</span>
        </div>

        {/* Green underline */}
        <div style={{
          position: 'absolute', top: '275px', left: '100px',
          width: '420px', height: '4px', borderRadius: '2px',
          background: 'linear-gradient(90deg, #00E377, #00b85c)',
          display: 'flex',
        }} />

        {/* Tagline */}
        <div style={{
          position: 'absolute', top: '300px', left: '100px',
          fontSize: '22px', color: '#7a9ab0', letterSpacing: '0.5px',
          display: 'flex',
        }}>
          Find matches · Join teams · Book fields
        </div>

        {/* Main headline */}
        <div style={{
          position: 'absolute', bottom: '140px', left: '100px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          <span style={{ fontSize: '52px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
            Your Football Community
          </span>
          <span style={{
            fontSize: '52px', fontWeight: 900, lineHeight: 1.1,
            background: 'linear-gradient(90deg, #00E377, #00b85c)',
            color: '#00E377',
          }}>
            Starts Here.
          </span>
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute', bottom: '30px', right: '40px',
          fontSize: '20px', color: '#00E377', opacity: 0.8,
          display: 'flex',
        }}>
          kickup.my
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, #00E377, #00b85c)',
          opacity: 0.5,
          display: 'flex',
        }} />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
