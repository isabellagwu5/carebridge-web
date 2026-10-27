// Browser-side API client. Never put the Google API key or Zocdoc credentials here.
export async function getJson(path) {
  const res=await fetch(path);
  const data=await res.json();
  if (!res.ok) throw new Error(data.error||`HTTP ${res.status}`);
  return data;
}
export function searchCmsPractitioners(name) {
  return getJson(`/api/cms/Practitioner?name=${encodeURIComponent(name)}`);
}
export function searchClinics(query) {
  return getJson(`/api/places?q=${encodeURIComponent(query)}`);
}
export function zocdocIntegrationStatus() {
  return getJson("/api/zocdoc/status");
}
