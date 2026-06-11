/** Stable Unsplash URLs for the local demo (no API key required). */
const unsplash = (id: string, params: string) =>
  `https://images.unsplash.com/${id}?${params}`

export const stockImages = {
  heroPortrait: {
    src: unsplash('photo-1500648767791-00dcc994a43e', 'w=800&h=1000&fit=crop&crop=faces'),
    alt: 'Jordan Ellis, community organizer',
    width: 800,
    height: 1000,
    srcSet: [
      unsplash('photo-1500648767791-00dcc994a43e', 'w=400&h=500&fit=crop&crop=faces') + ' 400w',
      unsplash('photo-1500648767791-00dcc994a43e', 'w=800&h=1000&fit=crop&crop=faces') + ' 800w',
    ].join(', '),
    sizes: '(min-width: 40rem) 360px, 100vw',
  },
  heroBackground: {
    src: unsplash('photo-1529156069898-49953e39b3ac', 'w=1200&h=900&fit=crop'),
  },
  imagePlaceholder: {
    src: unsplash('photo-1449824913935-59a10b8d2000', 'w=1200&h=675&fit=crop'),
    alt: 'City street',
  },
} as const
