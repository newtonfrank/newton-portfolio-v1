export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Newton Frank",
    url: "https://newtonfrank.vercel.app",
    image: "https://newtonfrank.vercel.app/og.jpg",
    sameAs: ["https://github.com/newtonfrank", "https://linkedin.com/in/newtonfrank"],
    jobTitle: "Fullstack Developer & Product Designer",
    description:
      "Fullstack developer and product designer building real-time dashboards, scalable UI systems, and polished product interfaces.",
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "India",
      },
    },
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React.js",
      "Next.js",
      "Node.js",
      "Real-time dashboards",
      "Design systems",
      "UI/UX Design",
      "AWS",
      "Solidity",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
