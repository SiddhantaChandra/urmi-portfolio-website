// components/StructuredData.js - Rich snippets for better SERP appearance
export default function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Urmi Chakraborty",
    "jobTitle": "Entertainment Journalist and Content Writer",
    "description": "Professional entertainment journalist with 2+ years experience covering anime, Hollywood, Bollywood for The Telegraph Online and ABP Digital",
    "url": "https://urmichakraborty.com",
    "image": "https://urmichakraborty.com/Urmi.webp",
    "email": "urmi24112001@gmail.com",
    "telephone": "+91-9831718925",
    "sameAs": [
      "https://www.linkedin.com/in/urmi-chakraborty-809678183/",
      "https://muckrack.com/urmi-chakraborty-1",
      "https://twitter.com/urmic660"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal", 
      "addressCountry": "India"
    },
    "worksFor": [
      {
        "@type": "Organization",
        "name": "ABP Digital",
        "description": "Digital news organization"
      }
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "The Heritage College",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kolkata",
        "addressCountry": "India"
      }
    },
    "knowsAbout": [
      "Entertainment Journalism",
      "Content Writing", 
      "SEO Writing",
      "Editorial Services",
      "Anime Coverage",
      "Bollywood Entertainment",
      "Hollywood Entertainment"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Entertainment Journalist",
      "responsibilities": [
        "Entertainment news reporting",
        "Celebrity interviews",
        "Event coverage",
        "Content writing and editing",
        "SEO optimization"
      ]
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Urmi Chakraborty - Entertainment Journalist Portfolio",
    "url": "https://urmichakraborty.com",
    "description": "Professional portfolio of entertainment journalist Urmi Chakraborty featuring journalism samples, content writing work, and professional experience",
    "author": {
      "@type": "Person",
      "name": "Urmi Chakraborty"
    },
    "inLanguage": "en-US",
    "copyrightYear": "2025",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://urmichakraborty.com/articles?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Urmi Chakraborty Journalism & Content Writing Services",
    "description": "Professional entertainment journalism, content writing, and editorial services",
    "url": "https://urmichakraborty.com",
    "telephone": "+91-9831718925",
    "email": "urmi24112001@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "addressCountry": "India"
    },
    "serviceType": [
      "Entertainment Journalism",
      "Content Writing",
      "SEO Writing", 
      "Editorial Services",
      "Celebrity Interviews",
      "Event Coverage"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Journalism & Writing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Entertainment Journalism",
            "description": "Professional entertainment news coverage, celebrity interviews, event reporting"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Content Writing",
            "description": "SEO-optimized content writing for various industries and niches"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service", 
            "name": "Editorial Services",
            "description": "Professional editing, proofreading, and content optimization"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema)
        }}
      />
    </>
  );
} 