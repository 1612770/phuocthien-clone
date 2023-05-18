import Head from 'next/head';
import React from 'react';

interface SEOProps {
  title: string;
  description?: string;
}

function SEO({ title, description }: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" key="description" content={description} />
    </Head>
  );
}

export default SEO;
