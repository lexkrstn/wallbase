export function makeQueryString(formData: Record<string, string | number>) {
  return Object.keys(formData)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`)
    .join('&');;
}
