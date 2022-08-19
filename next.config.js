/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PROJECT_ROOT: __dirname,
  },
  publicRuntimeConfig: {
    siteName: 'Wallbase',
    copyYear: 2022,
    facebookUrl: 'https://facebook.com/wallbase2',
    twitterUrl: 'https://twitter.com/wallbase2',
    ircUrl: 'https://qchat.rizon.net/?channels=#wallbase2',
    ircChannel: 'wallbase2',
  },
};

module.exports = nextConfig;
