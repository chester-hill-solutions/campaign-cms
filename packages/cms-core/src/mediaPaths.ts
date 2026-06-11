export function mediaPublicPath(r2Key: string): string {
  return `/media/${encodeURIComponent(r2Key)}`
}
