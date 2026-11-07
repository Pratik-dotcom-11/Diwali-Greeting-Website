'use client';

import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center', color: '#fff', background: '#300719', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontSize: '32px', marginBottom: '12px', color: '#ffe49a' }}>Page Not Found</h2>
      <p style={{ color: '#e8c7d2', marginBottom: '24px' }}>Could not find the requested festive page.</p>
      <Link href="/" style={{ padding: '12px 24px', background: 'linear-gradient(135deg,#ffe99a,#f4bd38)', color: '#4b0925', borderRadius: '999px', fontWeight: 'bold', textDecoration: 'none' }}>
        Return to Diwali Diya
      </Link>
    </div>
  );
}
