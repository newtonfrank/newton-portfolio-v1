import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Newton Frank F | Frontend Developer',
        short_name: 'Newton Portfolio',
        description: 'Portfolio of Newton Frank F, a Frontend Developer specialized in React, Next.js, and Modern Web.',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        theme_color: '#050505',
        icons: [
            {
                src: '/favicon.png',
                sizes: 'any',
                type: 'image/png',
            },
        ],
    };
}
