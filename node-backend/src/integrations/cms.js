const BASE = "https://directory.cms.gov/fhir";
const ALLOWED = new Set(["Practitioner","PractitionerRole","Location","Organization","HealthcareService","InsurancePlan"]);
const ALLOWED_FILTERS = new Set(["name","address-city","address-state","address-postalcode","identifier","specialty","_count"]);
export async function searchCms(resource="Practitioner", filters={}) {
  if (!ALLOWED.has(resource)) throw Object.assign(new Error("Unsupported FHIR resource"),{status:400});
  const url = new URL(`${BASE}/${resource}`);
  for (const [key,value] of Object.entries(filters)) {
    if (ALLOWED_FILTERS.has(key) && typeof value==="string" && value.trim()) url.searchParams.set(key,value.trim().slice(0,120));
  }
  url.searchParams.set("_count","20");
  const res=await fetch(url,{headers:{"Accept":"application/fhir+json"},signal:AbortSignal.timeout(12000)});
  if (!res.ok) throw Object.assign(new Error(`CMS returned ${res.status}`),{status:502});
  return res.json(); // Original FHIR bundle; do not assume every search parameter is supported
}
