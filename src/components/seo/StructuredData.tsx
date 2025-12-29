
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
        description: 'A passionate Frontend Developer with expertise in React.js, Next.js, and modern web technologies.',
        workLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tumakuru',
                addressRegion: 'Karnataka',
                addressCountry: 'India'
            }
        },
        knowsAbout: ['React.js', 'Next.js', 'TypeScript', 'Web Development', 'UI/UX Design', 'JavaScript', 'Tailwind CSS']
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
