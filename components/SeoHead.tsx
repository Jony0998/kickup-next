import Head from 'next/head';
import { useRouter } from 'next/router';

interface SeoHeadProps {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    twitterHandle?: string;
}

const DEFAULT_SEO = {
    title: 'KickUp',
    description: 'Join local football and futsal matches, find fields, and level up your game with KickUp.',
    siteName: 'KickUp',
    url: 'https://kickup.uz',
    ogImage: '/og-image.jpg',
    twitterHandle: '@kickup_uz',
};

export default function SeoHead({
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    twitterHandle,
}: SeoHeadProps) {
    const router = useRouter();
    const fullTitle = title ? `${title} | ${DEFAULT_SEO.siteName}` : DEFAULT_SEO.title;
    const fullDescription = description || DEFAULT_SEO.description;
    const url = `${DEFAULT_SEO.url}${router.asPath}`;
    const image = ogImage || DEFAULT_SEO.ogImage;
    
    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <link rel="canonical" href={canonical || url} />

            {/* Open Graph */}
            <meta property="og:site_name" content={DEFAULT_SEO.siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDescription} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={ogType} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content={twitterHandle || DEFAULT_SEO.twitterHandle} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDescription} />
            <meta name="twitter:image" content={image} />

            {/* Favicon — butun tizim uchun bitta favicon.svg */}
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="icon" href="/favicon.svg" />
            <meta name="theme-color" content="#00E377" />
        </Head>
    );
}
