import { searchCmsPractitioners, searchClinics, zocdocIntegrationStatus } from "./api.js";

const $ = id => document.getElementById(id);
const keys = ["visit-reason", "medications", "allergies", "questions"];
const labels = { "visit-reason":"Reason for visit",medications:"Medication notes",allergies:"Allergy notes",questions:"Questions" };

const english = {
 hub:"YOUR HEALTH HUB",navHome:"Overview",navFind:"Find care",navPassport:"Care Passport",navGuide:"Care guide",
 sidebarTitle:"Built for clarity, not diagnosis.",sidebarNote:"Developer prototype · CMS directory + Google Places · No appointment booking or medical record hosting.",
 topLabel:"YOUR HEALTHCARE COMPANION",demo:"INTERACTIVE DEMO",emergencyTitle:"Medical emergency?",emergencyText:"Call 911 or seek emergency care. CareBridge does not diagnose or determine urgency.",
 heroKicker:"A BETTER WAY TO FIND YOUR WAY",heroOne:"Care should",heroTwo:"feel within reach.",
 heroBody:"Explore real healthcare directories, check practice information and prepare for a visit—without sharing medical details to search.",
 ctaFind:"Explore care options →",ctaPassport:"Open Care Passport",toolsHeading:"One connected experience",toolsBody:"Three tools for navigating healthcare.",
 featureFind:"Find care",featureFindBody:"Search practitioner directories and local practices.",
 featurePassport:"Care Passport",featurePassportBody:"Prepare a visit note using fictional example information.",
 featureGuide:"Care guide",featureGuideBody:"Learn how to evaluate providers and scheduling links.",
 findKicker:"01 / HEALTHCARE ACCESS",findTitle:"Find real healthcare resources.",
 findLead:"Search public CMS practitioner records or nearby facilities from Google Places. Results are source-specific, not confirmed insurance or appointment matches.",
 searchTitle:"Search directory",sourceLabel:"Data source",clinicianLabel:"Clinician name",cmsHint:"CMS directory search: names may match multiple registered practitioners; profile and licensure status must be independently checked.",
 placeLabel:"Practice type and location",placesHint:"Google Places may show practice websites, but they are not necessarily booking pages.",
 searchButton:"Search →",searchPrivacy:"Search queries are sent to this app's backend and its selected directory provider. Do not enter symptoms or personal medical details.",
 resultsHeading:"Directory results",resultsEmpty:"Results will appear here after searching.",
 bookingTitle:"Appointment availability",bookingBody:"Live booking is not connected. Practice websites are labeled as websites, not appointment-confirmation links. Zocdoc requires approved partner access.",
 zocdocButton:"Check Zocdoc integration",passportKicker:"02 / VISIT PREPARATION",passportTitle:"Your Care Passport.",
 passportLead:"Create a patient-written appointment note you can print. This demo does not save or upload notes to a server.",
 passportWarning:"Prototype safety: enter fictional data only. Notes stay in page memory and are cleared on reload or when deleted.",
 consentText:"I understand this is a prototype and will only use fictional information.",
 reasonLabel:"Reason for visit",medsLabel:"Medication notes",allergyLabel:"Allergy notes",questionsLabel:"Questions for the clinician",
 sampleButton:"Fill fictional example",deleteButton:"Delete notes",previewTitle:"Your visit, prepared.",
 previewDisclaimer:"Patient-entered notes only. Not an official medical record, diagnosis, or clinician-verified translation.",
 printButton:"Print / Save PDF",copyButton:"Copy summary",
 guideKicker:"03 / CARE KNOWLEDGE",guideTitle:"Understand the information.",
 guideLead:"Public listings help you find a starting point, but they do not replace confirming details with a practice.",
 guide1Title:"Provider verification",guide1Text:"An NPI identifies a healthcare provider; it does not by itself prove an active license or qualifications. Verify credentials through the appropriate licensing authority.",
 guide2Title:"Insurance coverage",guide2Text:"Ask both the practice and your insurer whether the specific clinician and appointment type are in network.",
 guide3Title:"Languages and access",guide3Text:"Confirm the clinician's spoken language and ask the organization for qualified interpreting services when needed.",
 guide4Title:"Reviews and appointments",guide4Text:"Avoid sharing sensitive health information in public reviews. A practice website does not guarantee scheduling availability.",
 footer:"CareBridge · Development prototype · Not medical advice · No live appointment inventory"
};
const translations = {
 en: english,
 zh: {navHome:"首页",navFind:"寻找医疗服务",navPassport:"就诊资料卡",navGuide:"就医指南",heroOne:"让医疗服务",heroTwo:"触手可及。",ctaFind:"查找医疗服务 →",ctaPassport:"打开就诊资料卡",findTitle:"查找真实医疗资源。",findLead:"搜索 CMS 医护人员公共目录或 Google Places 的医疗机构。保险与预约信息尚未核实。",searchTitle:"搜索目录",clinicianLabel:"医护人员姓名",placeLabel:"医疗机构类型与地点",searchButton:"搜索 →",resultsHeading:"搜索结果",resultsEmpty:"搜索后将在此显示结果。",passportTitle:"你的就诊资料卡。",consentText:"我了解这是原型，只会输入虚构资料。",deleteButton:"删除笔记",printButton:"打印 / 保存 PDF",guideTitle:"了解医疗信息。",emergencyTitle:"医疗紧急情况？",emergencyText:"请拨打 911 或前往急诊。CareBridge 不提供诊断或紧急程度评估。"},
 es: {navHome:"Inicio",navFind:"Buscar atención",navPassport:"Pasaporte médico",navGuide:"Guía",heroOne:"La atención debe",heroTwo:"estar a tu alcance.",ctaFind:"Buscar atención →",findTitle:"Encuentra recursos médicos reales.",searchTitle:"Buscar directorio",clinicianLabel:"Nombre del profesional",placeLabel:"Tipo de clínica y ubicación",searchButton:"Buscar →",resultsHeading:"Resultados",passportTitle:"Tu pasaporte de atención.",consentText:"Entiendo que este es un prototipo y solo usaré datos ficticios.",deleteButton:"Eliminar notas",printButton:"Imprimir / PDF",guideTitle:"Comprender la información.",emergencyTitle:"¿Emergencia médica?",emergencyText:"Llama al 911 o acude a urgencias. CareBridge no diagnostica."},
 fr: {navHome:"Accueil",navFind:"Trouver des soins",navPassport:"Passeport santé",navGuide:"Guide",heroOne:"Les soins doivent",heroTwo:"être accessibles.",ctaFind:"Trouver des soins →",findTitle:"Trouvez des ressources médicales réelles.",searchTitle:"Rechercher",clinicianLabel:"Nom du professionnel",placeLabel:"Type d'établissement et lieu",searchButton:"Rechercher →",resultsHeading:"Résultats",passportTitle:"Votre passeport de soins.",consentText:"Je comprends que c'est un prototype et n'utiliserai que des données fictives.",deleteButton:"Effacer les notes",printButton:"Imprimer / PDF",guideTitle:"Comprendre les informations.",emergencyTitle:"Urgence médicale ?",emergencyText:"Appelez le 911 ou rendez-vous aux urgences. CareBridge ne pose pas de diagnostic."},
 ar: {navHome:"الرئيسية",navFind:"البحث عن الرعاية",navPassport:"جواز الرعاية",navGuide:"الدليل",heroOne:"يجب أن تكون الرعاية",heroTwo:"في متناول الجميع.",ctaFind:"البحث عن الرعاية ←",findTitle:"ابحث عن موارد رعاية صحية حقيقية.",searchTitle:"البحث في الدليل",clinicianLabel:"اسم الممارس",placeLabel:"نوع المنشأة والموقع",searchButton:"بحث",resultsHeading:"النتائج",passportTitle:"جواز الرعاية الخاص بك.",consentText:"أفهم أن هذا نموذج تجريبي وسأستخدم بيانات خيالية فقط.",deleteButton:"حذف الملاحظات",printButton:"طباعة / PDF",guideTitle:"فهم المعلومات.",emergencyTitle:"حالة طبية طارئة؟",emergencyText:"اتصل بالرقم 911 أو اطلب رعاية الطوارئ. لا يقدم CareBridge تشخيصًا."},
 ko: {navHome:"홈",navFind:"진료 찾기",navPassport:"진료 패스포트",navGuide:"안내",heroOne:"의료 서비스는",heroTwo:"가까워야 합니다.",ctaFind:"진료 찾기 →",findTitle:"실제 의료 기관 정보 찾기",searchTitle:"디렉터리 검색",clinicianLabel:"의료인 이름",placeLabel:"기관 유형 및 지역",searchButton:"검색 →",resultsHeading:"검색 결과",passportTitle:"나의 진료 패스포트",consentText:"이것이 데모이며 가상 정보만 입력할 것임을 이해합니다.",deleteButton:"메모 삭제",printButton:"인쇄 / PDF",guideTitle:"정보 이해하기",emergencyTitle:"의료 응급 상황인가요?",emergencyText:"911에 전화하거나 응급실에 가세요. CareBridge는 진단하지 않습니다."}
};
let lang = "en";
function t(key){ return translations[lang]?.[key] ?? english[key] ?? key; }
function translate(){
 lang = $("language").value;
 document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
 document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
 document.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
 if (!$("passport-consent").checked) $("passport-status").textContent="";
 renderPreview();
}
$("language").addEventListener("change",translate);
function navigate(page){
 document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active",s.id===page));
 document.querySelectorAll("button[data-page]").forEach(b => {
  const active=b.dataset.page===page;b.classList.toggle("active",active);
  if (active) b.setAttribute("aria-current","page"); else b.removeAttribute("aria-current");
 });
 window.scrollTo(0,0);
}
document.querySelectorAll("button[data-page]").forEach(b => b.addEventListener("click",()=>navigate(b.dataset.page)));
$("source").addEventListener("change",()=>{
 const places = $("source").value==="places";
 $("cms-fields").hidden=places;$("places-fields").hidden=!places;
});
function text(node,value){node.textContent=value;}
function addLink(container,url,label){
 if(typeof url!=="string" || !/^https:\/\//i.test(url)) return;
 const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=label;container.append(a);
}
function addCard(info){
 const card=document.createElement("article");card.className="result-card";
 const source=document.createElement("span");source.className="source-tag";source.textContent=info.source;
 const heading=document.createElement("h3");heading.textContent=info.name;
 const description=document.createElement("p");description.textContent=info.detail||"";
 const note=document.createElement("p");note.textContent=info.note;
 card.append(source,heading,description,note);
 if(info.url) addLink(card,info.url,info.linkLabel);
 $("results-list").append(card);
}
function providerName(p){
 const n=p.name?.[0];
 return n?.text || [ ...(n?.given||[]), n?.family ].filter(Boolean).join(" ") || "Unnamed practitioner";
}
$("provider-search").addEventListener("submit",async(e)=>{
 e.preventDefault();
 const source=$("source").value;
 const query=(source==="cms"?$("clinician").value:$("place-query").value).trim();
 if(!query){text($("result-count"),"Please enter a search term.");return;}
 $("results-list").replaceChildren();text($("result-count"),"Searching...");
 try{
  if(source==="cms"){
   const data=await searchCmsPractitioners(query);
   const entries=(data.entry||[]).map(x=>x.resource).filter(p=>p?.resourceType==="Practitioner");
   text($("result-count"),`${entries.length} CMS practitioner records returned. Insurance, credentials, languages and bookings are not verified.`);
   entries.forEach(p=>addCard({
    source:"CMS National Provider Directory",
    name:providerName(p),detail:`FHIR practitioner ID: ${p.id||"Not supplied"}`,
    note:"Public directory identity record. Contact the practice to confirm license, location, insurance and availability."
   }));
  }else{
   const data=await searchClinics(query);
   const places=data.places||[];
   text($("result-count"),`${places.length} Google Places results. Practice and booking information must be confirmed.`);
   places.forEach(p=>addCard({
    source:"Google Places",name:p.name||"Unnamed healthcare facility",
    detail:p.address||"No address listed",
    note:"Official practice website is not necessarily a booking page. Coverage, languages and appointments are unverified.",
    url:p.websiteUrl||p.mapsUrl,linkLabel:p.websiteUrl?"Visit practice website (verify booking)":"View place on Google Maps"
   }));
  }
 }catch(err){text($("result-count"),`Search unavailable: ${err.message}`);}
});
$("check-zocdoc").addEventListener("click",async()=>{
 text($("zocdoc-status"),"Checking partner connection...");
 try {const status=await zocdocIntegrationStatus();text($("zocdoc-status"),status.message||"No connection details available.");}
 catch(err){text($("zocdoc-status"),err.message);}
});
$("passport-consent").addEventListener("change",()=>{
 $("passport-fields").disabled=!$("passport-consent").checked;
 if(!$("passport-consent").checked) deleteNotes();
});
function renderPreview(){
 const preview=$("passport-preview-content");preview.replaceChildren();
 keys.forEach(id=>{
  const wrap=document.createElement("section");wrap.className="preview-item";
  const heading=document.createElement("h3");heading.textContent=labels[id];
  const value=document.createElement("p");value.textContent=$(id).value.trim()||"Not entered";
  wrap.append(heading,value);preview.append(wrap);
 });
}
keys.forEach(id=>$(id).addEventListener("input",renderPreview));
$("sample-note").addEventListener("click",()=>{
 const sample={"visit-reason":"Fictional: I would like to prepare for a routine visit.","medications":"Fictional example: no medication information entered.","allergies":"Fictional example: no allergy information entered.","questions":"What documents should I bring to the next appointment?"};
 keys.forEach(k=>$(k).value=sample[k]);renderPreview();
});
function deleteNotes(){
 keys.forEach(k=>$(k).value="");renderPreview();text($("passport-status"),"Notes cleared from this page.");
}
$("delete-note").addEventListener("click",deleteNotes);
$("print").addEventListener("click",()=>{if(!$("passport-consent").checked)return;text($("passport-status"),"Check your browser print and PDF settings before saving.");window.print();});
$("copy").addEventListener("click",async()=>{
 if(!$("passport-consent").checked)return;
 const summary="CareBridge — Patient-written appointment notes (fictional prototype)\n\n"+keys.map(k=>labels[k]+":\n"+($(k).value.trim()||"Not entered")).join("\n\n");
 try{await navigator.clipboard.writeText(summary);text($("passport-status"),"Copied to clipboard. Clipboard contents remain outside the app's control.");}
 catch{text($("passport-status"),"Clipboard unavailable. Use Print / Save PDF instead.");}
});
renderPreview();
translate();
