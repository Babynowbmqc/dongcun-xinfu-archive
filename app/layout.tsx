import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dongcun-xinfu.grassyridge6.chatgpt.site'),
  title: 'Dongcun Xinfu Experimental Teochew Theatre',
  description:
    'The bilingual living archive of Dongcun Xinfu: an open-source, nomadic experimental Teochew theatre from Chaoshan.',
  openGraph: {
    title: 'Dongcun Xinfu Experimental Teochew Theatre',
    description:
      'A bilingual living archive of shanzhai theatre, village rituals, sewing, puppetry and drifting stages.',
    url: 'https://dongcun-xinfu.grassyridge6.chatgpt.site',
    siteName: 'Dongcun Xinfu',
    type: 'website',
    images: [
      {
        url: 'https://dongcun-xinfu.grassyridge6.chatgpt.site/og.png',
        width: 1200,
        height: 630,
        alt: 'Dongcun Xinfu Experimental Teochew Theatre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dongcun Xinfu Experimental Teochew Theatre',
    description:
      'A bilingual living archive of shanzhai theatre, village rituals, sewing, puppetry and drifting stages.',
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
