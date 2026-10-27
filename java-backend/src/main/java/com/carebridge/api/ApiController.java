package com.carebridge.api;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class ApiController {
 private final RestClient client = RestClient.builder().build();
 @Value("${GOOGLE_PLACES_API_KEY:}") private String googleKey;
 private static String enc(String s){return URLEncoder.encode(s,StandardCharsets.UTF_8);}
 private static String safe(String s){return s==null?"":s.trim().substring(0,Math.min(120,s.trim().length()));}
 @GetMapping("/health")
 public Map<String,Object> health(){return Map.of("ok",true);}
 @GetMapping("/cms/{resource}")
 public Object cms(@PathVariable String resource,@RequestParam(required=false) String name,
     @RequestParam(required=false,name="address-city") String city,
     @RequestParam(required=false,name="address-state") String state,
     @RequestParam(required=false,name="address-postalcode") String zip) {
   if(!List.of("Practitioner","PractitionerRole","Location","Organization","HealthcareService","InsurancePlan").contains(resource))
       throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Unsupported FHIR resource");
   StringBuilder url=new StringBuilder("https://directory.cms.gov/fhir/").append(resource).append("?_count=20");
   if(name!=null&&!name.isBlank())url.append("&name=").append(enc(safe(name)));
   if(city!=null&&!city.isBlank())url.append("&address-city=").append(enc(safe(city)));
   if(state!=null&&!state.isBlank())url.append("&address-state=").append(enc(safe(state)));
   if(zip!=null&&!zip.isBlank())url.append("&address-postalcode=").append(enc(safe(zip)));
   try {
     return client.get().uri(URI.create(url.toString())).accept(MediaType.valueOf("application/fhir+json"))
       .retrieve().body(Map.class);
   } catch(Exception ex){throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"CMS provider request failed");}
 }
 @GetMapping("/places")
 public Object places(@RequestParam(name="q") String query) {
   if(googleKey.isBlank())throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,"Google API key missing");
   if(query.isBlank()||query.length()>160)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid query");
   try{
     Map<?,?> body=client.post().uri("https://places.googleapis.com/v1/places:searchText")
       .header("X-Goog-Api-Key",googleKey)
       .header("X-Goog-FieldMask","places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.websiteUri,places.location")
       .contentType(MediaType.APPLICATION_JSON)
       .body(Map.of("textQuery",query,"pageSize",10))
       .retrieve().body(Map.class);
     // Preserve Google field structure. Frontend JS adapter differs from Node-normalized version.
     java.util.List<?> raw = body!=null && body.get("places") instanceof java.util.List<?> l?l:java.util.List.of();
     var places=new java.util.ArrayList<Map<String,Object>>();
     for(Object p:raw){
       if(!(p instanceof Map<?,?> m))continue;
       Object display=m.get("displayName");
       String title=display instanceof Map<?,?> d?String.valueOf(d.containsKey("text")?d.get("text"):"Unknown facility"):"Unknown facility";
       var place=new java.util.HashMap<String,Object>();
       place.put("name",title);
       place.put("address",(m.containsKey("formattedAddress")?m.get("formattedAddress"):""));
       place.put("placeId",(m.containsKey("id")?m.get("id"):""));
       place.put("websiteUrl",m.get("websiteUri"));
       place.put("mapsUrl",m.get("googleMapsUri"));
       place.put("bookingUrl",null);
       place.put("providerVerified",false);
       places.add(place);
     }
     return Map.of("places",places);
   }catch(Exception ex){throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,"Places API request failed");}
 }
 @GetMapping("/zocdoc/status")
 public Map<String,Object> zocdocStatus(){
  return Map.of("connected",false,"requiresPartnerApproval",true,
   "docs","https://www.zocdoc.com/business/developers/",
   "message","Zocdoc API credentials and approved partner documentation are required.");
 }
 @GetMapping("/zocdoc/availability")
 public Object zocdocAvailability(){
  throw new ResponseStatusException(HttpStatus.NOT_IMPLEMENTED,"Awaiting official Zocdoc partner integration");
 }
}
