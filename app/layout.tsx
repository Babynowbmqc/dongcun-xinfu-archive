import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dongcun-xinfu.grassyridge6.chatgpt.site'),
  title: 'Dongcun Xinfu Shanzhai Chaoshan Opera Troupe',
  description:
    'The bilingual living archive of Dongcun Xinfu Shanzhai Chaoshan Opera Troupe: an open-source, itinerant troupe rooted in Chaoshan.',
  openGraph: {
    title: 'Dongcun Xinfu Shanzhai Chaoshan Opera Troupe',
    description:
      'A bilingual living archive of Shanzhai Chaoshan opera, village rituals, sewing, puppetry and drifting stages.',
    url: 'https://dongcun-xinfu.grassyridge6.chatgpt.site',
    siteName: 'Dongcun Xinfu',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dongcun Xinfu Shanzhai Chaoshan Opera Troupe',
    description:
      'A bilingual living archive of Shanzhai Chaoshan opera, village rituals, sewing, puppetry and drifting stages.',
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
