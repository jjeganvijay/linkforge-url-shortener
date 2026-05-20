export function buildTrackedUrl(baseUrl, params) {
  if (!baseUrl) return '';
  let url;
  try {
    url = new URL(baseUrl);
  } catch {
    return '';
  }

  const mapping = {
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    utm_campaign: params.utm_campaign,
    utm_content: params.utm_content,
    utm_term: params.utm_term,
  };

  Object.entries(mapping).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) url.searchParams.set(key, value.trim());
  });

  return url.toString();
}

