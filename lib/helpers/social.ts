type Network = 'facebook' | 'twitter' | 'pinterest' | 'reddit';

/**
 * Returns the URL that will allow to share a page on a social network when
 * the user opens it.
 */
export function getSocialShareLink(network: Network, url: string, description: string) {
  const encUrl = encodeURIComponent(url);
  const encDesc = encodeURIComponent(description);
  switch (network) {
    case 'facebook':
      return `http://www.facebook.com/sharer/sharer.php?u=${encUrl}`;
    case 'pinterest':
      return `http://pinterest.com/pin/create/button/?url=${encUrl}&media=x&description=${encDesc}`;
    case 'twitter':
      return `http://twitter.com/share?text=${encUrl}&url=${encUrl}`;
    case 'reddit':
      return `http://reddit.com/submit?url=${encUrl}&title=${encDesc}`;
  }
}
