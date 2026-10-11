import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dongcun-xinfu.grassyridge6.chatgpt.site'),
  title: 'Dongcun Xinfu Shanzhai Teochew Opera Troupe',
  description:
    'The bilingual living archive of Dongcun Xinfu Shanzhai Teochew Opera Troupe: an open-source, itinerant troupe rooted in Chaoshan.',
  openGraph: {
    title: 'Dongcun Xinfu Shanzhai Teochew Opera Troupe',
    description:
      'A bilingual living archive of Shanzhai Teochew opera, village rituals, sewing, puppetry and drifting stages.',
    url: 'https://dongcun-xinfu.grassyridge6.chatgpt.site',
    siteName: 'Dongcun Xinfu',
    type: 'website',
    images: [
      {
        url: 'https://dongcun-xinfu.grassyridge6.chatgpt.site/og.png',
        width: 1200,
        height: 630,
        alt: 'Dongcun Xinfu Shanzhai Teochew Opera Troupe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dongcun Xinfu Shanzhai Teochew Opera Troupe',
    description:
      'A bilingual living archive of Shanzhai Teochew opera, village rituals, sewing, puppetry and drifting stages.',
    images: ['https://dongcun-xinfu.grassyridge6.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
