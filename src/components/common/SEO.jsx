import React, { useEffect } from 'react';

export default function SEO({
  title = 'PGFinder — Find Your Perfect PG Accommodation',
  description = 'PGFinder connects PG Seekers with PG Owners. Discover verified PGs based on location, budget, room type, and facilities.',
  canonicalUrl = window.location.href,
  ogImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  schemaData = null,
}) {
  useEffect(() => {
    // 1. Dynamic Document Title
    document.title = title;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Open Graph Tags
    const setOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setOgTag('og:title', title);
    setOgTag('og:description', description);
    setOgTag('og:url', canonicalUrl);
    setOgTag('og:image', ogImage);
    setOgTag('og:type', 'website');

    // 4. Schema.org Structured Data
    if (schemaData) {
      let scriptTag = document.getElementById('jsonld-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'jsonld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    }
  }, [title, description, canonicalUrl, ogImage, schemaData]);

  return null;
}
