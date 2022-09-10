const domain = process.env.DOMAIN || 'localhost';
const port = process.env.PORT || 3000
const ssl = parseInt(process.env.SSL || '0', 10);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PROJECT_ROOT: __dirname,
  },
  publicRuntimeConfig: {
    siteName: 'Wallbase',
    siteUrl: `http${ssl ? 's' : ''}://${domain}${port === 80 ? '' : `:${port}`}`,
    copyYear: 2022,
    facebookUrl: 'https://facebook.com/wallbase2',
    twitterUrl: 'https://twitter.com/wallbase2',
    ircUrl: 'https://qchat.rizon.net/?channels=#wallbase2',
    ircChannel: 'wallbase2',
    contactEmail: 'admin@wallbase.net',
  },
};

module.exports = nextConfig;
