const ENDPOINT="https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK="places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.websiteUri,places.location";
export async function searchPlaces(query) {
  const key=process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw Object.assign(new Error("Google Places API key not configured"),{status:503});
  if (!query || query.length>160) throw Object.assign(new Error("Enter a search query under 160 characters"),{status:400});
  const response=await fetch(ENDPOINT,{
    method:"POST",
    headers:{"Content-Type":"application/json","X-Goog-Api-Key":key,"X-Goog-FieldMask":FIELD_MASK},
    body:JSON.stringify({textQuery:query,pageSize:10}),
    signal:AbortSignal.timeout(12000)
  });
  if (!response.ok) throw Object.assign(new Error(`Google Places returned ${response.status}`),{status:502});
  const data=await response.json();
  return (data.places??[]).map(p=>({
    placeId:p.id,name:p.displayName?.text??"Unknown facility",
    address:p.formattedAddress??"",mapsUrl:p.googleMapsUri??null,
    websiteUrl:p.websiteUri??null,location:p.location??null,
    bookingUrl:null, // Practice homepages are NOT confirmed booking URLs
    providerVerified:false
  }));
}
