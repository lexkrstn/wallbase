export function makeQueryString(formData: Record<string, string | number>) {
  return Object.keys(formData)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`)
    .join('&');;
}

export function parseQueryString(queryString: string) {
  return queryString.slice(1)
    .split('&')
    .map(assignment => assignment.split('='))
    .reduce((record, [key, value]) => ({
      ...record,
      [key]: value,
    }), {} as Record<string, string>);
}
