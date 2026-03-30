
export default function StructuredData() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Newton Frank F',
        url: 'https://newtonfrank.vercel.app',
        image: 'https://newtonfrank.vercel.app/newton-profile.jpg',
        sameAs: [
            'https://github.com/newtonfrank',
            'https://linkedin.com/in/newtonfrank',
            'https://newtonfrank.vercel.app',
        ],
        jobTitle: 'Frontend Developer',
        description: 'Frontend developer building React interfaces, real-time dashboards, and scalable component systems.',
        workLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tumakuru',
                addressRegion: 'Karnataka',
                addressCountry: 'India'
            }
        },
        knowsAbout: [
            'JavaScript',
            'React.js',
            'Next.js',
            'Node.js',
            'Express',
            'MongoDB',
            'MySQL',
            'AWS',
            'Docker',
            'Solidity',
            'Web3.js',
            'UI Design'
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
