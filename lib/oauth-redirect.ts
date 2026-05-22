/** Put query params before `#hash` so Next.js `useSearchParams` can read them. */
export function buildOAuthReturnUrl(
  siteUrl: string,
  returnTo: string,
  query: Record<string, string>,
): string {
  const base = siteUrl.replace(/\/$/, '')
  const hashIndex = returnTo.indexOf('#')
  const pathPart = hashIndex === -1 ? returnTo : returnTo.slice(0, hashIndex)
  const hashPart = hashIndex === -1 ? '' : returnTo.slice(hashIndex)
  const params = new URLSearchParams(query)
  const separator = pathPart.includes('?') ? '&' : '?'
  return `${base}${pathPart}${separator}${params.toString()}${hashPart}`
}
