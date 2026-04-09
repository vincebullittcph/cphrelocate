import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─── Data ───

const LANGUAGES = [
  { lang: "English", flag: "🇬🇧", agent: "Sarah M.", slot: "Morning & afternoon" },
  { lang: "Español", flag: "🇪🇸", agent: "Carlos R.", slot: "Morning & afternoon" },
  { lang: "Français", flag: "🇫🇷", agent: "Marie D.", slot: "Morning slots" },
  { lang: "Deutsch", flag: "🇩🇪", agent: "Jana K.", slot: "Afternoon slots" },
  { lang: "Português", flag: "🇧🇷", agent: "Ana L.", slot: "Morning & afternoon" },
  { lang: "हिन्दी", flag: "🇮🇳", agent: "Priya S.", slot: "Morning slots" },
  { lang: "中文", flag: "🇨🇳", agent: "Wei Z.", slot: "Afternoon slots" },
  { lang: "Dansk", flag: "🇩🇰", agent: "Mikkel H.", slot: "All day" },
];

const MAP_PINS = [
  { id: "norrebro", lat: 55.6920, lng: 12.5530, label: "Nørrebro", type: "neighbourhood", color: "#e8734a", desc: "The real Copenhagen — multicultural, loud, alive", rent: "10,000–14,000 DKK" },
  { id: "osterbro", lat: 55.7050, lng: 12.5770, label: "Østerbro", type: "neighbourhood", color: "#65c9c7", desc: "The family favourite — tree-lined, safe, green", rent: "12,000–18,000 DKK" },
  { id: "frederiksberg", lat: 55.6790, lng: 12.5280, label: "Frederiksberg", type: "neighbourhood", color: "#89d8d3", desc: "The elegant middle ground — gardens, restaurants, calm", rent: "11,000–16,000 DKK" },
  { id: "vesterbro", lat: 55.6690, lng: 12.5520, label: "Vesterbro", type: "neighbourhood", color: "#e8734a", desc: "The reinvented quarter — gritty meets gentrified", rent: "10,000–15,000 DKK" },
  { id: "nordhavn", lat: 55.7100, lng: 12.6000, label: "Nordhavn", type: "neighbourhood", color: "#65c9c7", desc: "The new build frontier — modern, harbour views", rent: "13,000–20,000 DKK" },
  { id: "valby", lat: 55.6610, lng: 12.5150, label: "Valby", type: "neighbourhood", color: "#89d8d3", desc: "The smart suburban pick — space, value, 15 min to centre", rent: "8,000–12,000 DKK" },
  { id: "cis", lat: 55.7070, lng: 12.6050, label: "Copenhagen Intl School", type: "school", color: "#29275f", desc: "IB curriculum, 80+ nationalities, harbour campus in Nordhavn" },
  { id: "roklub", lat: 55.6950, lng: 12.5880, label: "Københavns Roklub", type: "club", color: "#29275f", desc: "Founded 1866 — rowing club where expats build real friendships" },
  { id: "ihcph", lat: 55.6810, lng: 12.5660, label: "International House CPH", type: "landmark", color: "#29275f", desc: "One-stop for CPR, tax, SIRI — and our office is here" },
  { id: "torvehallerne", lat: 55.6840, lng: 12.5710, label: "Torvehallerne", type: "landmark", color: "#d3d3d3", desc: "The food hall at the edge of Nørrebro — a Copenhagen essential" },
];

const BLOG_POSTS = [
  {
    slug: "norrebro-guide", pinId: "norrebro", tag: "Neighbourhood", title: "Nørrebro: the neighbourhood that doesn't try to impress you",
    author: "Marie Dupont", authorRole: "Housing consultant — 7 years in Copenhagen", date: "March 2026", readTime: "8 min",
    heroColor: "#29275f",
    intro: "Every relocation agent in Copenhagen will mention Nørrebro. Most will describe it as 'vibrant' or 'multicultural' and leave it at that. Having helped over 200 families find homes here, I want to give you the version I'd give a friend.",
    sections: [
      { heading: "Who actually lives here", body: "Nørrebro is Copenhagen's most diverse neighbourhood — and it feels it. On Blågårdsgade you'll hear Arabic, Danish, English, and Somali within the same block. Students share the area with young families, artists, and people who've lived here for 40 years.\n\nThe demographics are shifting. Ten years ago, a 3-room apartment on Elmegade cost 7,500 DKK. Today you're looking at 12,000–14,000 DKK. Gentrification is real. Some old character is being traded for specialty coffee shops and natural wine bars." },
      { heading: "The housing reality", body: "Nørrebro apartments tend to be older — high ceilings, wooden floors, coal stove remnants converted to shelving. Beautiful, but also: single-glazed windows, limited storage, kitchens that were an afterthought in 1890s floor plans.\n\nCompetition for rentals is intense. An open-house viewing might draw 40–50 people. Through our landlord network we arrange private viewings before properties go public — this is genuinely the biggest advantage of using a relocation agent here.\n\nBuying: prices per square metre have crossed 55,000 DKK in the sought-after streets around the Lakes." },
      { heading: "Daily life: groceries, coffee, routines", body: "Locals shop at the Netto on Nørrebrogade or the Fakta on Blågårdsgade. For better produce, the Turkish and Middle Eastern shops on Nørrebrogade offer quality at half the price of Irma.\n\nCoffee culture is excellent. The Coffee Collective on Jægersborggade is world-class — not just 'good for Copenhagen.' Jægersborggade itself: ceramics, vinyl, craft chocolate, and a small playground that makes it work for families too.\n\nAssistens Cemetery (where Hans Christian Andersen and Kierkegaard are buried) functions as a public park. Locals jog through it, sunbathe between the graves, walk dogs. Not morbid — extremely Danish." },
      { heading: "The honest downsides", body: "Nørrebro is noisy. If your apartment faces Nørrebrogade, expect bus traffic, bar-goers on weekends, and the occasional 3am argument.\n\nParking is almost impossible. Most residents bike or use public transport.\n\nSome streets still have visible social issues — particularly around Blågårds Plads. It's safe, but it can feel uncomfortable if you're not used to urban grittiness.\n\nConstant construction and renovation. Accept the scaffolding as part of the scenery." },
      { heading: "The verdict", body: "Nørrebro rewards people who want to live in a real neighbourhood, not a postcard. If you need quiet, space, and a garage — look at Valby. If you want to feel the pulse of a city that's still figuring itself out — Nørrebro is hard to beat.\n\nI've lived in 4 Copenhagen neighbourhoods. I keep coming back to this one." },
    ]
  },
  {
    slug: "copenhagen-international-school", pinId: "cis", tag: "School", title: "Copenhagen International School: what parents actually need to know",
    author: "Priya Sharma", authorRole: "Family & schools advisor — 6 years in Copenhagen", date: "February 2026", readTime: "7 min",
    heroColor: "#0f4e4d",
    intro: "I've accompanied over 150 families on school visits across Copenhagen. CIS is the school I get asked about most. Here's what I tell parents when the marketing materials aren't in the room.",
    sections: [
      { heading: "The basics", body: "Copenhagen International School sits on the waterfront in Nordhavn, in a striking building covered in 12,000 solar panels. Around 950 students from 3 to 19, representing 80+ nationalities. IB curriculum throughout — PYP, MYP, and the Diploma Programme.\n\nTuition: approximately 95,000 DKK/year for the youngest to 155,000 DKK for the Diploma. Many corporate packages cover this. Privately, it's a significant commitment." },
      { heading: "What families love", body: "The diversity is genuine — not tokenistic. In a typical class of 22, you might have 15 nationalities. For children who've moved before, this is comforting: they're not the 'foreign kid.'\n\nFacilities are exceptional. Science labs, art studios, theatre, sports halls. The harbour location means sailing and kayaking are part of PE. The IB is rigorous and globally recognised — if you move again, the continuity helps." },
      { heading: "What to think twice about", body: "CIS is a bubble. For families wanting their children to integrate into Danish society — learn Danish, make local friends — CIS may slow that down.\n\nThe social scene is transient. When your child's best friend leaves after two years because a corporate assignment ended, it's hard.\n\nThe commute from Frederiksberg or Valby means 30–40 minutes each way. And after 2–3 years, some families find that Danish public schools or semi-private options offer excellent education at a fraction of the cost." },
      { heading: "Alternatives worth considering", body: "Rygaards International School (Hellerup) — smaller, feels more like a community. Birkerød Gymnasium has an IB programme in a suburban setting. For families open to Danish-language schooling, public schools in Østerbro and Gentofte are genuinely strong.\n\nThe 'best' school is the one that fits your child, your timeline, and your family's priorities. There's no universal right answer." },
      { heading: "Practical tips", body: "Apply early — CIS has waitlists for popular year groups. Contact admissions 6–12 months ahead.\n\nVisit in person. We arrange these as part of our school-finding service. Talk to current parents — not the ones the school introduces you to, the ones in the pickup line. We can connect you.\n\nDon't assume CIS is the default. Every year, families wish they'd explored alternatives. Do the research." },
    ]
  },
  {
    slug: "joining-a-forening", pinId: "roklub", tag: "Integration", title: "The fastest way to stop feeling like a foreigner: join a forening",
    author: "Jana Kovačević", authorRole: "Settling-in coordinator — relocated 4 times before CPH", date: "January 2026", readTime: "6 min",
    heroColor: "#3d3a7a",
    intro: "After my fourth international relocation, I thought I'd cracked the code for making friends abroad. Then I moved to Denmark and realised the rules were completely different.",
    sections: [
      { heading: "Why Denmark is different", body: "In most countries, friendships form through proximity and spontaneity. In Denmark, social circles form early — often in school — and stay remarkably closed. Danes aren't unfriendly. They're just... full. Their weekends are planned, their friend groups established.\n\nThis isn't a personality flaw. It's a cultural structure. Once you understand it, you can work with it." },
      { heading: "The forening: Denmark's secret social infrastructure", body: "A 'forening' (association/club) is how Danes organise everything — sports, hobbies, politics, gardening, board games. There are over 100,000 in Denmark. Copenhagen's portal foreningsportalen.kk.dk lists hundreds.\n\nForeninger are one of the few spaces where Danes are genuinely open to new people. The activity gives you something to do together (Danes bond through doing, not talking), and regularity builds familiarity that becomes friendship.\n\nIt takes time. Don't expect a home invitation after session one. But by month three or four, you'll notice a shift." },
      { heading: "Københavns Roklub: a case study", body: "One of our clients, a software engineer from Brazil, joined Københavns Roklub six months after arriving. He'd never rowed before. Within a year: a regular crew, a WhatsApp group beyond rowing, invitations to two Jul dinners.\n\nFounded 1866, it sits on the harbour at Søndre Frihavn. Membership around 2,500–3,500 DKK/year. They offer beginner courses and genuinely welcome new members.\n\nThe point isn't specifically rowing. It's the pattern: regular attendance + shared effort + post-activity socialising = the Danish friendship formula." },
      { heading: "Other clubs worth trying", body: "GI Boldklub (Nørrebro) — one of the world's oldest football clubs. Casual adult divisions. The social events matter as much as matches.\n\nMakerværket (Vesterbro) — woodworking, 3D printing, laser cutting. International crowd, relaxed atmosphere.\n\nVolunteering: Røde Kors, neighbourhood associations. The work is meaningful and bonds form naturally.\n\nBeer-tasting foreninger exist. It's Denmark. Of course they do." },
      { heading: "Honest warnings", body: "Language matters. A Danish-speaking running club will be slower socially for you unless you're conversational. Many clubs have English-speaking sections — ask before joining.\n\nDon't join and skip sessions. Danes value consistency. Showing up weekly matters more than being brilliant.\n\nNot every forening is welcoming. Some have been the same 12 people for 20 years. Do a trial session first.\n\nBuilding a social life in Denmark is a long game. Expect 1–2 years. That's normal." },
    ]
  },
  {
    slug: "first-month-copenhagen", pinId: "ihcph", tag: "Practical guide", title: "Your first 30 days in Copenhagen: a realistic timeline",
    author: "Carlos Rodríguez", authorRole: "Immigration specialist — 12 years in Copenhagen", date: "March 2026", readTime: "9 min",
    heroColor: "#1a5c5a",
    intro: "I've walked over a thousand people through their first month in Denmark. Here's the realistic version — what happens, what you can control, and what you just have to wait for.",
    sections: [
      { heading: "Before you land", body: "If your employer hasn't filed your work permit through SIRI, that needs to happen now. Fast-track can be same-day for certified companies. Pay Limit and Positive List: 1–4 weeks. Some cases drag to 2–3 months.\n\nGather documents: passport, employment contract, proof of accommodation, educational certificates, marriage/birth certificates. All originals or certified copies. Get apostilles now." },
      { heading: "Days 1–3: arrival", body: "First priority: roof and SIM card. If we've arranged temporary housing, keys are waiting. Otherwise, expect 12,000–18,000 DKK/month for a furnished studio centrally.\n\nGet a Danish SIM (Lebara, Lycamobile, any kiosk). You need a working Danish number for every registration that follows.\n\nJet lag, disorientation, the smell of a stranger's apartment — this is the hardest part emotionally. It gets better." },
      { heading: "Days 3–7: the CPR number", body: "The CPR is your key to functioning in Denmark. Without it: no bank account, no health card, no GP, no MitID.\n\nYou visit Borgerservice or International House (where we're based). You need passport, work permit, and proof of address. We handle the entire process, usually same-day.\n\nYou now have 180 days (extended from 90 in 2024) to open a bank account. But don't wait." },
      { heading: "Days 7–14: MitID, bank, GP", body: "MitID is Denmark's digital identity — needed for banking, tax, e-Boks. Requires a Borgerservice visit with passport and CPR letter.\n\nBank account: Danske Bank, Nordea, Jyske Bank. Process takes 1–2 weeks. You'll need CPR, passport, proof of employment and address.\n\nGP: once you have CPR, you're auto-assigned one. Yellow health card arrives by mail in 1–2 weeks." },
      { heading: "Days 14–30: housing, schools, routine", body: "Permanent housing search intensifies. Average time through our network: 2–3 weeks. Open market without help: 4–8 weeks and more frustration.\n\nSchool applications should already be submitted. Childcare waitlists are 3–12 months — we register as early as legally possible.\n\nGet a Rejsekort. Buy a bike (2,000–4,000 DKK used from DBA.dk). This isn't lifestyle advice — it's practical." },
      { heading: "What actually happens at week 4", body: "The administrative fog clears. You have CPR, bank, MitID, health card, phone, hopefully a permanent address. The logistics are handled.\n\nThen culture shock actually hits — not at arrival, but once the adrenaline fades. Colleagues leave at 4pm and don't invite you to dinner. The supermarket closes at 8. It's dark by 3:30 in winter.\n\nIt's normal. Every person we help goes through this. The ones who thrive join something and give themselves grace.\n\nYou didn't just change your address. You changed your life. Thirty days is a start." },
    ]
  },
];

const SERVICES = [
  { icon: "🛂", title: "Immigration & work permits", desc: "Fast-track, pay-limit, researcher, EU/EEA, Positive List, company transfers. We've filed thousands of applications and worked inside SIRI.", details: ["Application preparation & filing","Document review & compliance","SIRI liaison & follow-up","Permit renewals & extensions","Family reunification","Citizenship applications"] },
  { icon: "🏠", title: "Home-finding", desc: "1–2% vacancy rate. We source 30+ properties a week through our landlord network — many before they hit portals. No landlord commissions. Ever.", details: ["Off-market 'pocket listings'","Lease negotiation","Rent benchmarking","Move-in inspection (1,000+ photos)","Temporary housing","Home purchase advisory"] },
  { icon: "🗺️", title: "Orientation tours", desc: "Not a tourist tour — a 'could I live here?' tour. Neighbourhoods, commute routes, schools, grocery options, local life.", details: ["Half-day or full-day","Tailored to priorities","School visits included","Housing market briefing","Cost of living overview","Preview trip coordination"] },
  { icon: "📋", title: "Settling in", desc: "CPR, MitID, bank, GP, Rejsekort, utilities — things that take expats 10 days. We do it in one business day from International House.", details: ["CPR registration","MitID setup","Bank account opening","GP registration","Transport setup","Utilities & internet"] },
  { icon: "🏫", title: "Schools & childcare", desc: "We visit schools with you, compare curricula, check availability, and give honest advice — not brochure talk.", details: ["International school matching","Danish public school guidance","Childcare applications","SFO & after-school","Special needs navigation","School visit coordination"] },
  { icon: "🔑", title: "Tenancy & departure", desc: "Move-out refurbishments can cost €6,000+ if mishandled. Our inspector has 30+ years and saves clients thousands.", details: ["Lease review","Move-out inspection","Renovation management","Deposit recovery","Landlord mediation","Departure coordination"] },
];

const PARTNERS = [
  { name: "Heimstaden", type: "Institutional landlord" },{ name: "Balder", type: "Property developer" },{ name: "DEAS", type: "Property manager" },
  { name: "Homie", type: "Refurbishment partner" },{ name: "BoligPortal", type: "Rental platform" },{ name: "International House CPH", type: "Municipal partner" },
];

const USEFUL_LINKS = [
  { category: "See & do", links: [
    { name: "Visit Copenhagen", url: "https://www.visitcopenhagen.com/", desc: "Comprehensive guide to what's on, where to eat, and what to see" },
    { name: "AOK (Alt om København)", url: "https://www.aok.dk/english", desc: "Local guide to Copenhagen attractions, sights, and dining" },
    { name: "Copenhagen Relocations on Facebook", url: "https://www.facebook.com/relocate.dk/", desc: "Tips, local activities, and updates from our team" },
  ]},
  { category: "Getting around", links: [
    { name: "Krak", url: "https://www.krak.dk/", desc: "Danish map and local business directory" },
    { name: "Rejseplanen", url: "https://www.rejseplanen.dk/", desc: "Public transport travel planner — trains, buses, metro" },
    { name: "DMI Weather", url: "https://www.dmi.dk/en/vejr/", desc: "Danish weather forecasting — check before you dress" },
    { name: "Velorbis", url: "https://velorbis.com/", desc: "Quality bicycles with English-speaking support" },
  ]},
  { category: "Buy & sell", links: [
    { name: "DBA.dk", url: "https://www.dba.dk", desc: "Denmark's largest marketplace for used goods — furniture, bikes, everything" },
    { name: "PostNord Denmark", url: "https://www.postnord.dk", desc: "Danish postal services — parcels, mail, tracking" },
  ]},
  { category: "Settling in", links: [
    { name: "New in Denmark (SIRI)", url: "https://www.nyidanmark.dk/en-us/", desc: "Official immigration and residence permit information" },
    { name: "Life in Denmark", url: "https://lifeindenmark.borger.dk", desc: "Government guide to practical life in Denmark" },
    { name: "Copenhagen Post", url: "https://cphpost.dk/", desc: "English-language Danish news" },
    { name: "Expat in Denmark (DI)", url: "https://di.dk/expatsignup", desc: "Newsletter for expatriates from the Confederation of Danish Industry" },
  ]},
  { category: "Community & social", links: [
    { name: "Meetup Copenhagen", url: "https://www.meetup.com", desc: "Find groups for everything — language exchange, hiking, tech, parents" },
    { name: "LINK København", url: "https://www.linkdenmark.com/", desc: "Women's networking organisation" },
    { name: "Toastmasters Denmark", url: "https://toastmasters.dk/", desc: "Public speaking and leadership — great for meeting people" },
    { name: "International Women's Club CPH", url: "https://iwcc.dk/", desc: "Social and cultural activities for international women" },
  ]},
  { category: "Family & fun", links: [
    { name: "Tivoli Gardens", url: "https://www.tivoligardens.com/en", desc: "Copenhagen's iconic amusement park — open since 1843" },
    { name: "LEGOLAND Billund", url: "https://www.legoland.dk", desc: "A day trip the kids will never forget" },
    { name: "Dansk Bureauet", url: "https://danskbureauet.dk/en/", desc: "Private Danish language lessons — flexible scheduling" },
    { name: "High-Paw", url: "https://www.high-paw.dk/", desc: "Pet and house care services" },
  ]},
];

const TEAM = [
  { name: "Sarah Mitchell", role: "Senior relocation consultant", flags: "🇬🇧 🇺🇸", story: "Moved from London in 2014. Knows what it's like with two kids and no CPR number.", years: 9 },
  { name: "Carlos Rodríguez", role: "Immigration specialist", flags: "🇪🇸 🇲🇽 🇨🇴", story: "Former SIRI case handler. Insider knowledge to get permits through first time.", years: 12 },
  { name: "Marie Dupont", role: "Housing consultant", flags: "🇫🇷 🇧🇪", story: "Sources 30+ apartments a week. Personal relationships with every major landlord.", years: 7 },
  { name: "Jana Kovačević", role: "Settling-in coordinator", flags: "🇩🇪 🇭🇷 🇦🇹", story: "Relocated 4 times across Europe. Turned that chaos into a system.", years: 5 },
  { name: "Priya Sharma", role: "Family & schools advisor", flags: "🇮🇳 🇬🇧", story: "Two kids in Danish schools. Knows every option and which one fits.", years: 6 },
  { name: "Wei Zhang", role: "Corporate accounts", flags: "🇨🇳 🇸🇬", story: "Manages programs for 15+ companies. Makes HR teams look good.", years: 8 },
  { name: "Ana Lourenço", role: "Relocation consultant", flags: "🇧🇷 🇵🇹", story: "Left São Paulo for CPH in 2017. Helps families find their feet — and their bakery.", years: 6 },
  { name: "Mikkel Hansen", role: "Operations & tenancy", flags: "🇩🇰", story: "Born in Copenhagen. Lease negotiations, inspections, deposit recovery. Landlords respect him.", years: 15 },
];

// ─── Shared UI ───

const F = "'Libre Franklin',Arial,sans-serif";
const G = "Garamond,Georgia,serif";

function Nav({ page, setPage }) {
  return (
    <nav style={{ position:"fixed",top:0,width:"100%",zIndex:100,background:"rgba(250,249,246,0.94)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(41,39,95,0.06)",padding:"0 clamp(16px,3vw,48px)" }}>
      <div style={{ maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",height:60 }}>
        <div style={{ cursor:"pointer",display:"flex",alignItems:"baseline",gap:6 }} onClick={()=>{setPage("home");window.scrollTo(0,0)}}>
          <span style={{ fontFamily:G,fontSize:19,fontWeight:700,color:"#29275f" }}>Copenhagen</span>
          <span style={{ fontFamily:G,fontSize:19,color:"#65c9c7" }}>Relocations</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:20,flexWrap:"wrap" }}>
          {[["Services","services"],["For HR","hr"],["City map","guides"],["Life in DK","life"],["Useful links","links"],["Team","about"]].map(([l,p])=>(
            <span key={p} onClick={()=>{setPage(p);window.scrollTo(0,0)}} style={{ fontSize:12.5,color:page===p?"#29275f":"#999",fontWeight:page===p?600:400,cursor:"pointer",fontFamily:F }}>{l}</span>
          ))}
          <button onClick={()=>{setPage("book");window.scrollTo(0,0)}} style={{ background:"#29275f",color:"#fff",border:"none",borderRadius:100,padding:"8px 18px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F }}>Book a call</button>
        </div>
      </div>
    </nav>
  );
}

function Badge({ children, light }) {
  return <span style={{ display:"inline-block",background:light?"rgba(255,255,255,0.12)":"rgba(101,201,199,0.12)",color:light?"#fff":"#29275f",padding:"4px 12px",borderRadius:100,fontSize:10.5,fontWeight:600,letterSpacing:"0.05em",textTransform:"uppercase",fontFamily:F }}>{children}</span>;
}

function SH({ badge, title, sub }) {
  return <div style={{ marginBottom:32 }}>
    {badge&&<div style={{ marginBottom:8 }}><Badge>{badge}</Badge></div>}
    <h2 style={{ fontFamily:G,fontSize:"clamp(1.6rem,3vw,2.3rem)",color:"#29275f",lineHeight:1.15,marginBottom:sub?6:0 }}>{title}</h2>
    {sub&&<p style={{ fontSize:15,color:"#999",lineHeight:1.7,maxWidth:560,fontFamily:F }}>{sub}</p>}
  </div>;
}

function LangCTA({ setPage }) {
  return <div style={{ background:"#29275f",borderRadius:18,padding:"clamp(24px,4vw,44px)",margin:"44px 0" }}>
    <div style={{ textAlign:"center",marginBottom:24 }}>
      <h3 style={{ fontFamily:G,fontSize:"clamp(1.2rem,2.2vw,1.7rem)",color:"#fff",marginBottom:4 }}>Speak to someone who gets it — in your language</h3>
      <p style={{ fontSize:13,color:"rgba(255,255,255,0.5)",fontFamily:F,maxWidth:440,margin:"0 auto",lineHeight:1.6 }}>Free 15-min call. No sales pitch. Honest answers about relocating to Denmark.</p>
    </div>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:6 }}>
      {LANGUAGES.map((l,i)=>(
        <button key={i} onClick={()=>{setPage("book");window.scrollTo(0,0)}} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"12px 6px",cursor:"pointer",textAlign:"center",transition:"background 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(101,201,199,0.1)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
          <div style={{ fontSize:20 }}>{l.flag}</div>
          <div style={{ fontSize:11,color:"#fff",fontWeight:500,fontFamily:F }}>{l.lang}</div>
          <div style={{ fontSize:9,color:"rgba(255,255,255,0.35)",fontFamily:F }}>{l.agent}</div>
        </button>
      ))}
    </div>
  </div>;
}

function W({ children }) { return <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 clamp(16px,3vw,48px)" }}>{children}</div>; }

// ─── Interactive Copenhagen Map (Leaflet) ───

// Creates a colored circle marker icon for each pin
function createPinIcon(color, isActive) {
  const size = isActive ? 18 : 13;
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:${isActive ? "0 0 0 4px rgba(41,39,95,0.12), 0 4px 12px rgba(0,0,0,0.15)" : "0 2px 6px rgba(0,0,0,0.1)"};transition:all 0.2s"></div>`,
  });
}

// Fits the map bounds to show all pins on first load
function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(MAP_PINS.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds.pad(0.15));
  }, [map]);
  return null;
}

function CopenhagenMap({ setPage, setActivePin, activePin }) {
  // Center of Copenhagen
  const center = [55.686, 12.566];

  return (
    <div style={{ borderRadius: 18, overflow: "hidden", position: "relative" }}>
      <MapContainer center={center} zoom={13} style={{ height: 480, width: "100%" }} scrollWheelZoom={false} zoomControl={false}>
        {/* Clean, muted map tiles that match the site's aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/" target="_blank">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds />

        {MAP_PINS.map(pin => {
          const post = BLOG_POSTS.find(p => p.pinId === pin.id);
          return (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={createPinIcon(pin.color, activePin === pin.id)}
              eventHandlers={{ click: () => setActivePin(activePin === pin.id ? null : pin.id) }}
            >
              <Popup>
                <div style={{ minWidth: 220, fontFamily: F }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    <Badge>{pin.type}</Badge>
                    {pin.rent && <span style={{ fontSize: 10, color: "#65c9c7", fontWeight: 600, fontFamily: F, alignSelf: "center" }}>{pin.rent}</span>}
                  </div>
                  <div style={{ fontFamily: G, fontSize: 15, color: "#29275f", marginBottom: 4 }}>{pin.label}</div>
                  <p style={{ fontSize: 12, color: "#888", lineHeight: 1.5, fontFamily: F, marginBottom: 10 }}>{pin.desc}</p>
                  {post ? (
                    <button onClick={() => { setPage("post-" + post.slug); window.scrollTo(0, 0); }} style={{ background: "#29275f", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: F, width: "100%" }}>
                      Read the full guide →
                    </button>
                  ) : (
                    <button onClick={() => { setPage("book"); window.scrollTo(0, 0); }} style={{ background: "#65c9c7", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: F, width: "100%" }}>
                      Ask us about this area →
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend overlay */}
      <div style={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 12, zIndex: 1000, background: "rgba(250,249,246,0.9)", borderRadius: 8, padding: "6px 12px" }}>
        {[["Neighbourhood", "#e8734a"], ["School / Club", "#29275f"], ["Landmark", "#65c9c7"]].map(([l, c]) => (
          <div key={l} style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            <span style={{ fontSize: 9, color: "#999", fontFamily: F }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pages ───

function HomePage({ setPage }) {
  const [activePin, setActivePin] = useState(null);
  const trust = [{n:"20+",l:"Years in Copenhagen"},{n:"60+",l:"Combined SIRI expertise"},{n:"8",l:"Languages spoken"},{n:"1st",l:"Danish DSP with EuRA seal"}];
  const steps = [{n:"01",t:"You call us",d:"15 min. In your language. We understand your situation."},{n:"02",t:"We build your program",d:"Tailored — immigration, housing, settling-in."},{n:"03",t:"Your agent takes over",d:"One consultant. One number. They know your file."},{n:"04",t:"You land in Copenhagen",d:"Apartment ready. Paperwork filed. School visits booked."},{n:"05",t:"You're home",d:"CPR, bank, GP, transport — done in a day."}];
  return <>
    <section style={{ paddingTop:88 }}><W>
      <Badge>Copenhagen's trusted relocation partner since 1995</Badge>
      <h1 style={{ fontFamily:G,fontSize:"clamp(2rem,4.5vw,3.4rem)",color:"#29275f",lineHeight:1.08,margin:"16px 0 12px",maxWidth:680 }}>Relocating to Denmark is a human experience. <span style={{ color:"#65c9c7" }}>We keep it that way.</span></h1>
      <p style={{ fontSize:15,color:"#999",lineHeight:1.7,maxWidth:500,marginBottom:22,fontFamily:F }}>Work permits. Apartments. Schools. CPR numbers. We handle the entire move — so you can focus on starting your new life.</p>
      <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:32 }}>
        <button onClick={()=>{setPage("book");window.scrollTo(0,0)}} style={{ background:"#29275f",color:"#fff",border:"none",borderRadius:100,padding:"12px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F }}>Book a free call — in your language →</button>
        <button onClick={()=>{setPage("services");window.scrollTo(0,0)}} style={{ background:"transparent",color:"#29275f",border:"2px solid rgba(41,39,95,0.12)",borderRadius:100,padding:"12px 24px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F }}>What we do</button>
      </div>
      <div style={{ background:"linear-gradient(135deg,#29275f,#3d3a7a)",borderRadius:16,height:300,position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"url('https://www.relocate.dk/wp-content/uploads/2016/10/cphr-39361.jpg') center/cover",opacity:0.3 }}/>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,margin:"28px 0 44px" }}>
        {trust.map((t,i)=><div key={i} style={{ background:"#29275f",borderRadius:10,padding:"18px 14px",textAlign:"center" }}>
          <div style={{ fontFamily:G,fontSize:26,color:"#65c9c7",fontWeight:700 }}>{t.n}</div>
          <div style={{ fontSize:10,color:"rgba(255,255,255,0.55)",marginTop:1,fontFamily:F,lineHeight:1.3 }}>{t.l}</div>
        </div>)}
      </div>
    </W></section>

    <section><W>
      <div style={{ background:"#f2efe8",borderRadius:16,padding:"clamp(24px,3vw,40px)",borderLeft:"4px solid #65c9c7",marginBottom:44 }}>
        <h3 style={{ fontFamily:G,fontSize:"clamp(1.2rem,2vw,1.6rem)",color:"#29275f",marginBottom:8,lineHeight:1.3 }}>"Relocating cannot be automated. It takes someone who's been there."</h3>
        <p style={{ fontSize:13,color:"#999",lineHeight:1.7,maxWidth:520,fontFamily:F }}>Every agent has relocated internationally themselves. That lived experience is something no platform can replicate.</p>
      </div>
    </W></section>

    <section><W>
      <SH badge="What we do" title="Full-service relocation support" />
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,marginBottom:44 }}>
        {SERVICES.slice(0,4).map((s,i)=><div key={i} style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:12,padding:"22px 20px",cursor:"pointer",transition:"transform 0.2s" }}
          onClick={()=>{setPage("services");window.scrollTo(0,0)}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
          <div style={{ fontSize:22,marginBottom:8 }}>{s.icon}</div>
          <h3 style={{ fontFamily:G,fontSize:16,color:"#29275f",marginBottom:4 }}>{s.title}</h3>
          <p style={{ fontSize:12,color:"#999",lineHeight:1.6,fontFamily:F }}>{s.desc.slice(0,100)}…</p>
        </div>)}
      </div>
    </W></section>

    {/* Interactive map */}
    <section><W>
      <SH badge="Explore Copenhagen" title="Your city, mapped by people who live here" sub="Click a pin to discover neighbourhoods, schools, clubs, and landmarks. Each guide is written by one of our agents." />
      <CopenhagenMap setPage={setPage} activePin={activePin} setActivePin={setActivePin} />
      <div style={{ textAlign:"center",marginTop:16 }}>
        <span onClick={()=>{setPage("guides");window.scrollTo(0,0)}} style={{ fontSize:13,color:"#65c9c7",fontWeight:600,cursor:"pointer",fontFamily:F }}>See all city guides →</span>
      </div>
    </W></section>

    <section><W>
      <SH badge="How it works" title="From first call to feeling at home" />
      <div style={{ marginBottom:44 }}>{steps.map((s,i)=><div key={i} style={{ display:"flex",gap:16,padding:"18px 0",borderBottom:i<4?"1px solid rgba(41,39,95,0.04)":"none" }}>
        <div style={{ fontFamily:G,fontSize:22,color:"#65c9c7",fontWeight:700,minWidth:36 }}>{s.n}</div>
        <div><div style={{ fontSize:14,fontWeight:600,color:"#29275f",marginBottom:2,fontFamily:F }}>{s.t}</div><div style={{ fontSize:12,color:"#999",fontFamily:F }}>{s.d}</div></div>
      </div>)}</div>
    </W></section>

    <section><W><LangCTA setPage={setPage} /></W></section>

    {/* EuRA teaser */}
    <section><W>
      <div style={{ display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:24,margin:"0 0 44px",alignItems:"center" }}>
        <div>
          <Badge>Quality guarantee</Badge>
          <h3 style={{ fontFamily:G,fontSize:"clamp(1.2rem,2vw,1.7rem)",color:"#29275f",margin:"12px 0 8px" }}>What the EuRA seal actually means for you</h3>
          <p style={{ fontSize:13,color:"#999",lineHeight:1.7,fontFamily:F,marginBottom:16 }}>We're the first and only Danish relocation provider to hold the EuRA Global Quality Seal. It's the world's first accreditation for relocation — and it means every process we run is externally audited to the highest industry standard.</p>
          <span onClick={()=>{setPage("eura");window.scrollTo(0,0)}} style={{ fontSize:13,color:"#65c9c7",fontWeight:600,cursor:"pointer",fontFamily:F }}>Learn what this means for your move →</span>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
          {[["EuRA Global Quality Seal","Industry's gold standard"],["EcoVadis Bronze","Top 35% sustainability"],["Cartus Excellence","Global mobility award"],["ISO 9001","Certified since 2010"]].map(([t,d],i)=><div key={i} style={{ background:"#29275f",borderRadius:10,padding:14 }}>
            <div style={{ fontSize:12,fontWeight:600,color:"#65c9c7",fontFamily:F }}>{t}</div>
            <div style={{ fontSize:10,color:"rgba(255,255,255,0.4)",fontFamily:F }}>{d}</div>
          </div>)}
        </div>
      </div>
    </W></section>

    {/* B2B */}
    <section><W>
      <div style={{ background:"linear-gradient(135deg,#f2efe8,#e8f4f3)",borderRadius:16,padding:"clamp(24px,3vw,40px)",display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)",gap:28,marginBottom:44 }}>
        <div>
          <Badge>For companies</Badge>
          <h3 style={{ fontFamily:G,fontSize:"clamp(1.2rem,2vw,1.6rem)",color:"#29275f",margin:"12px 0 8px" }}>Recruiting internationally?</h3>
          <p style={{ fontSize:13,color:"#999",lineHeight:1.7,fontFamily:F,marginBottom:16 }}>Your hire's relocation experience shapes their first impression of your company. We turn it into a retention advantage.</p>
          <button onClick={()=>{setPage("book");window.scrollTo(0,0)}} style={{ background:"#29275f",color:"#fff",border:"none",borderRadius:100,padding:"10px 20px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F }}>Let's talk partnership →</button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
          {["End-to-end immigration compliance","Dedicated account manager","Scalable — 1 hire to 100","EuRA & EcoVadis certified","Tenancy management & departure"].map((t,i)=><div key={i} style={{ display:"flex",gap:6,alignItems:"center" }}>
            <div style={{ width:16,height:16,borderRadius:"50%",background:"#65c9c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",flexShrink:0 }}>✓</div>
            <span style={{ fontSize:12,color:"#29275f",fontFamily:F }}>{t}</span>
          </div>)}
        </div>
      </div>
    </W></section>

    <section><W>
      <div style={{ fontSize:10,color:"#ccc",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600,marginBottom:10,fontFamily:F }}>Our network</div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20 }}>
        {PARTNERS.map((p,i)=><div key={i} style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:8,padding:"8px 14px" }}>
          <div style={{ fontSize:12,fontWeight:600,color:"#29275f",fontFamily:F }}>{p.name}</div>
          <div style={{ fontSize:9,color:"#ccc",fontFamily:F }}>{p.type}</div>
        </div>)}
      </div>
    </W></section>
  </>;
}

function EuRAPage({ setPage }) {
  return <section style={{ paddingTop:88 }}><W>
    <div style={{ maxWidth:720 }}>
      <SH badge="Quality guarantee" title="The EuRA Global Quality Seal — and why it matters for your move" sub="We're often asked what this certification actually means in practice. Here's the straightforward answer." />

      <div style={{ background:"#29275f",borderRadius:16,padding:"clamp(24px,3vw,40px)",marginBottom:32 }}>
        <h3 style={{ fontFamily:G,fontSize:20,color:"#fff",marginBottom:8 }}>What is EuRA?</h3>
        <p style={{ fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.75,fontFamily:F }}>
          The European Relocation Association (EuRA) is the professional industry body for relocation providers, representing 500+ member companies worldwide. Their Global Quality Seal Plus (EGQS+) is the world's first accreditation programme specifically designed for relocation services. It's built on ISO 9001 process management principles, but goes further — it was designed by relocation professionals to reflect the actual complexity of moving people across borders.
        </p>
      </div>

      <h3 style={{ fontFamily:G,fontSize:20,color:"#29275f",marginBottom:12 }}>What the certification requires</h3>
      <p style={{ fontSize:14,color:"#888",lineHeight:1.75,fontFamily:F,marginBottom:20 }}>
        To earn and maintain the seal, a company must pass an external audit covering every aspect of service delivery. This isn't a self-assessment or a paid badge. An independent auditor evaluates:
      </p>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:32 }}>
        {[
          ["Documented processes","Every service — from immigration filing to move-in inspections — follows a documented, repeatable process. No winging it."],
          ["KPIs and performance tracking","We set measurable targets for response times, case completion, and client satisfaction — and we're audited against them."],
          ["Client feedback systems","Systematic collection and analysis of feedback from every transferee and corporate client. Issues are tracked to resolution."],
          ["Compliance and risk management","Business continuity plans, data protection policies, and compliance frameworks are mandatory — not optional."],
          ["Staff competence","Training requirements, qualification standards, and professional development for every team member."],
          ["Continuous improvement","Year-over-year evidence that processes are being refined based on data, not just maintained."],
        ].map(([t,d],i)=><div key={i} style={{ background:"#f2efe8",borderRadius:12,padding:18 }}>
          <div style={{ fontSize:13,fontWeight:600,color:"#29275f",fontFamily:F,marginBottom:4 }}>{t}</div>
          <div style={{ fontSize:12,color:"#888",lineHeight:1.6,fontFamily:F }}>{d}</div>
        </div>)}
      </div>

      <h3 style={{ fontFamily:G,fontSize:20,color:"#29275f",marginBottom:12 }}>What it means for you — concretely</h3>
      <div style={{ borderLeft:"4px solid #65c9c7",paddingLeft:20,marginBottom:32 }}>
        {[
          ["Your case won't fall through the cracks","Every step of your relocation is tracked in a documented system. If your consultant is out sick, another team member can pick up exactly where they left off."],
          ["You can expect consistent quality","Whether you're our first client of the year or our 500th, the process is the same. Quality doesn't depend on who you get — it's built into how we work."],
          ["Problems get caught early","Our KPI tracking means we know when something is taking too long before you have to tell us. We flag delays, not the other way around."],
          ["Your feedback actually changes things","Post-assignment surveys aren't a formality. They feed into an annual improvement cycle that the auditor reviews. When enough people say the same thing, we change how we work."],
          ["Your data is protected","GDPR compliance, data handling procedures, and access controls are baked into the certification requirements."],
        ].map(([t,d],i)=><div key={i} style={{ marginBottom:18 }}>
          <div style={{ fontSize:14,fontWeight:600,color:"#29275f",fontFamily:F,marginBottom:2 }}>{t}</div>
          <div style={{ fontSize:13,color:"#888",lineHeight:1.65,fontFamily:F }}>{d}</div>
        </div>)}
      </div>

      <h3 style={{ fontFamily:G,fontSize:20,color:"#29275f",marginBottom:12 }}>Why it's rare</h3>
      <p style={{ fontSize:14,color:"#888",lineHeight:1.75,fontFamily:F,marginBottom:20 }}>
        Copenhagen Relocations is the first and only Danish destination service provider to hold the EuRA Global Quality Seal. While many companies in our industry describe themselves as "quality-focused," the seal is the only way to verify it independently. The certification process requires significant investment in documentation, systems, and staff training — which is why most providers don't pursue it.
      </p>
      <p style={{ fontSize:14,color:"#888",lineHeight:1.75,fontFamily:F,marginBottom:20 }}>
        For corporate clients choosing between relocation providers, the seal eliminates guesswork. For individuals, it means you're working with a company that operates to a verifiable standard — not just one that sounds good on a website.
      </p>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:32 }}>
        {[["EuRA Global Quality Seal","First Danish DSP"],["EcoVadis Bronze","Top 35% sustainability"],["Cartus Excellence Award","Global mobility"],["ISO 9001","Since 2010"]].map(([t,d],i)=><div key={i} style={{ background:"#29275f",borderRadius:10,padding:14,textAlign:"center" }}>
          <div style={{ fontSize:11,fontWeight:600,color:"#65c9c7",fontFamily:F }}>{t}</div>
          <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)",fontFamily:F,marginTop:2 }}>{d}</div>
        </div>)}
      </div>

      <div style={{ background:"#f2efe8",borderRadius:14,padding:24,marginBottom:8 }}>
        <h3 style={{ fontFamily:G,fontSize:18,color:"#29275f",marginBottom:6 }}>For HR and global mobility managers</h3>
        <p style={{ fontSize:13,color:"#888",lineHeight:1.7,fontFamily:F,marginBottom:14 }}>
          If you're evaluating relocation providers for your company's Denmark operations, the EuRA seal is the most efficient way to shortlist. It tells you that processes are documented, audited, and continuously improved — without needing to run your own vendor assessment from scratch. We're happy to share our latest audit results and quality manual on request.
        </p>
        <button onClick={()=>{setPage("book");window.scrollTo(0,0)}} style={{ background:"#29275f",color:"#fff",border:"none",borderRadius:100,padding:"10px 20px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:F }}>Request our quality documentation →</button>
      </div>
    </div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function GuidesPage({ setPage }) {
  const [activePin, setActivePin] = useState(null);
  return <section style={{ paddingTop:88 }}><W>
    <SH badge="City guides" title="Copenhagen, mapped by the people who help you move here" sub="Click a pin on the map, or browse the guides below." />
    <CopenhagenMap setPage={setPage} activePin={activePin} setActivePin={setActivePin} />
    <div style={{ marginTop:32,display:"flex",flexDirection:"column",gap:14 }}>
      {BLOG_POSTS.map((p,i)=><div key={i} onClick={()=>{setPage("post-"+p.slug);window.scrollTo(0,0)}} style={{ display:"grid",gridTemplateColumns:"200px minmax(0,1fr)",borderRadius:12,overflow:"hidden",border:"1px solid rgba(41,39,95,0.04)",background:"#fff",cursor:"pointer",transition:"transform 0.2s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
        <div style={{ background:p.heroColor,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:16 }}>
          <Badge light>{p.tag}</Badge>
        </div>
        <div style={{ padding:"20px 24px" }}>
          <h3 style={{ fontFamily:G,fontSize:18,color:"#29275f",lineHeight:1.3,marginBottom:6 }}>{p.title}</h3>
          <p style={{ fontSize:12,color:"#999",lineHeight:1.6,fontFamily:F,marginBottom:6 }}>{p.intro.slice(0,140)}…</p>
          <div style={{ fontSize:11,color:"#ccc",fontFamily:F }}>By {p.author} · {p.date} · {p.readTime}</div>
        </div>
      </div>)}
    </div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function PostPage({ post, setPage }) {
  return <section style={{ paddingTop:88 }}><W>
    <div style={{ maxWidth:700,margin:"0 auto" }}>
      <span onClick={()=>{setPage("guides");window.scrollTo(0,0)}} style={{ fontSize:12,color:"#65c9c7",cursor:"pointer",fontFamily:F,fontWeight:500 }}>← Back to city guides</span>
      <div style={{ marginTop:16,marginBottom:6 }}><Badge>{post.tag}</Badge></div>
      <h1 style={{ fontFamily:G,fontSize:"clamp(1.6rem,3vw,2.4rem)",color:"#29275f",lineHeight:1.15,marginBottom:14 }}>{post.title}</h1>
      <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:28,paddingBottom:20,borderBottom:"1px solid rgba(41,39,95,0.05)" }}>
        <div style={{ width:40,height:40,borderRadius:"50%",background:"#29275f",display:"flex",alignItems:"center",justifyContent:"center",color:"#65c9c7",fontFamily:G,fontSize:15,fontWeight:700 }}>{post.author.split(" ").map(n=>n[0]).join("")}</div>
        <div>
          <div style={{ fontSize:13,fontWeight:600,color:"#29275f",fontFamily:F }}>{post.author}</div>
          <div style={{ fontSize:11,color:"#bbb",fontFamily:F }}>{post.authorRole} · {post.date} · {post.readTime}</div>
        </div>
      </div>
      <div style={{ background:post.heroColor,borderRadius:14,height:200,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28 }}>
        <span style={{ fontSize:12,color:"rgba(255,255,255,0.35)",fontFamily:F }}>📷 Article image placeholder</span>
      </div>
      <p style={{ fontSize:15,color:"#666",lineHeight:1.8,fontFamily:F,marginBottom:32,fontStyle:"italic" }}>{post.intro}</p>
      {post.sections.map((s,i)=><div key={i} style={{ marginBottom:32 }}>
        <h2 style={{ fontFamily:G,fontSize:20,color:"#29275f",marginBottom:10 }}>{s.heading}</h2>
        {s.body.split("\n\n").map((p,j)=><p key={j} style={{ fontSize:14,color:"#666",lineHeight:1.8,fontFamily:F,marginBottom:12 }}>{p}</p>)}
      </div>)}
      <div style={{ background:"#f2efe8",borderRadius:12,padding:20,display:"flex",gap:14,alignItems:"center",marginBottom:8 }}>
        <div style={{ width:44,height:44,borderRadius:"50%",background:"#29275f",display:"flex",alignItems:"center",justifyContent:"center",color:"#65c9c7",fontFamily:G,fontSize:16,fontWeight:700,flexShrink:0 }}>{post.author.split(" ").map(n=>n[0]).join("")}</div>
        <div>
          <div style={{ fontSize:13,fontWeight:600,color:"#29275f",fontFamily:F }}>Written by {post.author}</div>
          <div style={{ fontSize:12,color:"#999",fontFamily:F }}>{post.authorRole}</div>
          <div style={{ fontSize:12,color:"#65c9c7",marginTop:3,fontFamily:F,cursor:"pointer",fontWeight:500 }} onClick={()=>{setPage("book");window.scrollTo(0,0)}}>Book a call with our team →</div>
        </div>
      </div>
    </div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function ServicesPage({ setPage }) {
  const [exp,setExp]=useState(null);
  return <section style={{ paddingTop:88 }}><W>
    <SH badge="Our services" title="Everything you need to relocate to Denmark" sub="Each program is tailored. No templates." />
    <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>
      {SERVICES.map((s,i)=><div key={i} style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:12,padding:22,cursor:"pointer" }} onClick={()=>setExp(exp===i?null:i)}>
        <div style={{ display:"flex",gap:12,alignItems:"flex-start" }}>
          <div style={{ fontSize:22 }}>{s.icon}</div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:G,fontSize:17,color:"#29275f",marginBottom:4 }}>{s.title}</h3>
            <p style={{ fontSize:12,color:"#999",lineHeight:1.7,fontFamily:F }}>{s.desc}</p>
            {exp===i&&<div style={{ marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>{s.details.map((d,j)=><div key={j} style={{ display:"flex",gap:5,alignItems:"center" }}><div style={{ width:4,height:4,borderRadius:"50%",background:"#65c9c7" }}/><span style={{ fontSize:11,color:"#29275f",fontFamily:F }}>{d}</span></div>)}</div>}
          </div>
          <div style={{ fontSize:14,color:"#65c9c7",transform:exp===i?"rotate(45deg)":"",transition:"transform 0.2s" }}>+</div>
        </div>
      </div>)}
    </div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function LifePage({ setPage }) {
  const t=[{title:"Danish culture — what to expect",icon:"🇩🇰",body:"Danes are warm once you're in. But getting 'in' takes time. Join a club. Danes bond through shared activities, not small talk."},{title:"The CPR number",icon:"📋",body:"Your key to everything — bank, GP, MitID, phone contract. We handle the process same-day from International House."},{title:"Tax and cost of living",icon:"💰",body:"High taxes, but universal healthcare, free schools, parental leave. Many hires qualify for the 27% Researcher Tax Scheme."},{title:"Healthcare",icon:"🏥",body:"Free once you have a GP. Call 1813 before ER visits. Dental isn't covered. Many expats use private insurance for mental health."},{title:"Getting around",icon:"🚲",body:"Cycling is the default. Budget 3,000–5,000 DKK for a used bike. S-train and Metro for longer commutes. Get a Rejsekort."},{title:"Winter and darkness",icon:"❄️",body:"7 hours of daylight in December. Vitamin D, a good jacket, and candlelight. Summer makes it worth it."},{title:"Learning Danish",icon:"🗣️",body:"Everyone speaks English, but Danish unlocks belonging. Free classes available through the municipality. Aim for trying, not fluency."},{title:"Making friends",icon:"👋",body:"Danish social circles form early and stay closed. Join clubs, volunteer, be patient. Expect 1–2 years. That's normal."}];
  return <section style={{ paddingTop:88 }}><W>
    <SH badge="Life in Denmark" title="The guide we wish we'd had" sub="Written by people who've lived it." />
    <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:20 }}>{t.map((t,i)=><div key={i} style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:12,padding:22 }}>
      <div style={{ display:"flex",gap:10 }}><div style={{ fontSize:18 }}>{t.icon}</div><div><h3 style={{ fontFamily:G,fontSize:16,color:"#29275f",marginBottom:6 }}>{t.title}</h3><p style={{ fontSize:13,color:"#999",lineHeight:1.7,fontFamily:F }}>{t.body}</p></div></div>
    </div>)}</div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function AboutPage({ setPage }) {
  return <section style={{ paddingTop:88 }}><W>
    <SH badge="Our team" title="People who've been in your shoes" />
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginBottom:36 }}>{TEAM.map((t,i)=><div key={i} style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:12,padding:20 }}>
      <div style={{ width:42,height:42,borderRadius:"50%",background:"#29275f",display:"flex",alignItems:"center",justifyContent:"center",color:"#65c9c7",fontFamily:G,fontSize:15,fontWeight:700,marginBottom:10 }}>{t.name.split(" ").map(n=>n[0]).join("")}</div>
      <div style={{ fontSize:14,fontWeight:600,color:"#29275f",fontFamily:F }}>{t.name}</div>
      <div style={{ fontSize:11,color:"#65c9c7",fontWeight:500,fontFamily:F }}>{t.role}</div>
      <div style={{ fontSize:14,margin:"4px 0",letterSpacing:3 }}>{t.flags}</div>
      <p style={{ fontSize:11,color:"#999",lineHeight:1.6,fontFamily:F,marginTop:4 }}>{t.story}</p>
      <div style={{ fontSize:9,color:"#ccc",marginTop:4,fontFamily:F }}>{t.years} years with us</div>
    </div>)}</div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function BookPage({ setPage }) {
  const [sel,setSel]=useState(null);
  return <section style={{ paddingTop:88 }}><W><div style={{ maxWidth:820,margin:"0 auto" }}>
    <SH badge="Book a free call" title="15 minutes. Your language. No commitment." sub="Honest answers about visas, housing, schools, costs — whatever's on your mind." />
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8,marginBottom:32 }}>{LANGUAGES.map((l,i)=><div key={i} onClick={()=>setSel(i)} style={{ background:sel===i?"#29275f":"#fff",border:sel===i?"2px solid #29275f":"1px solid rgba(41,39,95,0.05)",borderRadius:10,padding:16,cursor:"pointer",textAlign:"center",transition:"all 0.15s" }}>
      <div style={{ fontSize:26,marginBottom:4 }}>{l.flag}</div>
      <div style={{ fontSize:13,fontWeight:600,color:sel===i?"#fff":"#29275f",fontFamily:F }}>{l.lang}</div>
      <div style={{ fontSize:11,color:sel===i?"#65c9c7":"#999",fontFamily:F,marginTop:2 }}>with {l.agent}</div>
    </div>)}</div>
    {sel!==null&&<div style={{ background:"#f2efe8",borderRadius:14,padding:"clamp(20px,3vw,32px)",textAlign:"center",marginBottom:32 }}>
      <h3 style={{ fontFamily:G,fontSize:18,color:"#29275f",marginBottom:4 }}>Book with {LANGUAGES[sel].agent} {LANGUAGES[sel].flag}</h3>
      <div style={{ background:"#fff",border:"2px dashed rgba(41,39,95,0.08)",borderRadius:10,padding:44,color:"#ccc",fontSize:12,fontFamily:F,marginTop:12 }}>📅 Calendly embed placeholder</div>
    </div>}
    <div style={{ background:"#29275f",borderRadius:14,padding:"clamp(18px,3vw,28px)",textAlign:"center" }}>
      <h3 style={{ fontFamily:G,fontSize:16,color:"#fff",marginBottom:4 }}>Prefer to reach out directly?</h3>
      <div style={{ display:"flex",gap:8,justifyContent:"center",marginTop:10 }}>
        <a href="tel:+4570209580" style={{ background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:100,padding:"8px 16px",color:"#fff",textDecoration:"none",fontSize:12,fontFamily:F }}>📞 +45 70 20 95 80</a>
        <a href="mailto:contact@relocate.dk" style={{ background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:100,padding:"8px 16px",color:"#fff",textDecoration:"none",fontSize:12,fontFamily:F }}>✉️ contact@relocate.dk</a>
      </div>
    </div>
  </div></W></section>;
}

function HRPage({ setPage }) {
  const programs = [
    { title: "Immigration & compliance", desc: "Work permits, fast-track, Pay Limit, Positive List, EU/EEA, company transfers. We've filed thousands of applications and worked inside SIRI. Full compliance documentation for your records.", icon: "🛂" },
    { title: "Home-finding", desc: "We source 30+ properties a week through our landlord network. Your hire gets private viewings, lease negotiation, and a move-in inspection with 1,000+ photos. No landlord commissions.", icon: "🏠" },
    { title: "Settling-in day", desc: "CPR, MitID, bank, GP, Rejsekort, utilities — done in one business day from International House. Your hire is operational within a week, not a month.", icon: "📋" },
    { title: "Schools & childcare", desc: "We visit schools with the family, compare curricula, check availability, and handle applications. Childcare waitlists are 3–12 months — we register as early as legally possible.", icon: "🏫" },
    { title: "Orientation & culture", desc: "Not a tourist tour — a practical 'could I live here?' walkthrough. Neighbourhoods, commute routes, grocery options, and an honest briefing on Danish workplace culture.", icon: "🗺️" },
    { title: "Tenancy & departure", desc: "Move-out refurbishments can cost €6,000+ if mishandled. Our inspector has 30+ years of experience and saves clients thousands. Full departure coordination included.", icon: "🔑" },
  ];
  const reasons = [
    { stat: "87%", label: "of failed relocations cite poor settling-in support", source: "EuRA / BGRS survey" },
    { stat: "3×", label: "faster time-to-productivity with structured relocation", source: "Mercer Mobility" },
    { stat: "€47k", label: "average cost of a failed international assignment", source: "PwC Global Mobility" },
    { stat: "92%", label: "client satisfaction rate across all programs", source: "Copenhagen Relocations internal" },
  ];
  return <section style={{ paddingTop:88 }}><W>
    <SH badge="For companies & HR" title="Relocation that makes your company the obvious choice" sub="Your hire's relocation experience shapes their first impression. We turn it into a retention advantage." />

    {/* Why it matters */}
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10,marginBottom:36 }}>
      {reasons.map((r,i)=><div key={i} style={{ background:"#29275f",borderRadius:12,padding:18,textAlign:"center" }}>
        <div style={{ fontFamily:G,fontSize:28,color:"#65c9c7",fontWeight:700 }}>{r.stat}</div>
        <div style={{ fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:F,lineHeight:1.4,marginTop:4 }}>{r.label}</div>
        <div style={{ fontSize:9,color:"rgba(255,255,255,0.25)",fontFamily:F,marginTop:4 }}>{r.source}</div>
      </div>)}
    </div>

    {/* How it works for HR */}
    <h3 style={{ fontFamily:G,fontSize:"clamp(1.2rem,2vw,1.6rem)",color:"#29275f",marginBottom:16 }}>How it works</h3>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:4,marginBottom:32 }}>
      {[
        { step:"1", title:"You brief us", desc:"One call. We understand the hire's profile, timeline, family situation, and your company's requirements." },
        { step:"2", title:"We build the program", desc:"Tailored scope — immigration, housing, settling-in, schools. Fixed pricing. No surprises." },
        { step:"3", title:"One consultant, one number", desc:"Your hire gets a dedicated agent who knows their file. You get a single point of contact and regular status updates." },
        { step:"4", title:"Reporting & compliance", desc:"Document trail, timeline tracking, and post-assignment feedback. Everything your global mobility team needs." },
      ].map((s,i)=><div key={i} style={{ background:"#f2efe8",borderRadius:12,padding:18 }}>
        <div style={{ fontFamily:G,fontSize:22,color:"#65c9c7",fontWeight:700,marginBottom:6 }}>0{s.step}</div>
        <div style={{ fontSize:13,fontWeight:600,color:"#29275f",fontFamily:F,marginBottom:4 }}>{s.title}</div>
        <div style={{ fontSize:12,color:"#888",lineHeight:1.6,fontFamily:F }}>{s.desc}</div>
      </div>)}
    </div>

    {/* Program components */}
    <h3 style={{ fontFamily:G,fontSize:"clamp(1.2rem,2vw,1.6rem)",color:"#29275f",marginBottom:16 }}>What's included</h3>
    <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10,marginBottom:32 }}>
      {programs.map((p,i)=><div key={i} style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:12,padding:20 }}>
        <div style={{ fontSize:20,marginBottom:8 }}>{p.icon}</div>
        <h4 style={{ fontFamily:G,fontSize:16,color:"#29275f",marginBottom:4 }}>{p.title}</h4>
        <p style={{ fontSize:12,color:"#999",lineHeight:1.6,fontFamily:F }}>{p.desc}</p>
      </div>)}
    </div>

    {/* Credentials */}
    <div style={{ background:"#29275f",borderRadius:16,padding:"clamp(24px,3vw,40px)",marginBottom:32 }}>
      <h3 style={{ fontFamily:G,fontSize:20,color:"#fff",marginBottom:16 }}>Why companies choose us</h3>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        {[
          ["EuRA Global Quality Seal","First and only Danish DSP to hold the industry's gold standard. Externally audited processes, KPIs, and compliance."],
          ["20+ years in Copenhagen","Since 1995. We've relocated thousands of employees for companies from startups to multinationals."],
          ["8 languages in-house","English, Spanish, French, German, Portuguese, Hindi, Chinese, Danish. Your hire speaks to someone who gets it."],
          ["Scalable programs","One hire or a hundred. Dedicated account management for ongoing partnerships. Flexible scope."],
          ["EcoVadis Bronze","Top 35% globally for sustainability. Because your company's ESG commitments extend to your supply chain."],
          ["Full compliance trail","Document management, timeline tracking, GDPR-compliant data handling. Everything your legal and HR teams need."],
        ].map(([t,d],i)=><div key={i} style={{ background:"rgba(255,255,255,0.04)",borderRadius:10,padding:16 }}>
          <div style={{ fontSize:13,fontWeight:600,color:"#65c9c7",fontFamily:F,marginBottom:4 }}>{t}</div>
          <div style={{ fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.6,fontFamily:F }}>{d}</div>
        </div>)}
      </div>
    </div>

    {/* Partners */}
    <div style={{ marginBottom:32 }}>
      <div style={{ fontSize:10,color:"#ccc",textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600,marginBottom:10,fontFamily:F }}>Trusted by companies working with</div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
        {PARTNERS.map((p,i)=><div key={i} style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:8,padding:"8px 14px" }}>
          <div style={{ fontSize:12,fontWeight:600,color:"#29275f",fontFamily:F }}>{p.name}</div>
          <div style={{ fontSize:9,color:"#ccc",fontFamily:F }}>{p.type}</div>
        </div>)}
      </div>
    </div>

    {/* CTA */}
    <div style={{ background:"#f2efe8",borderRadius:16,padding:"clamp(24px,3vw,40px)",textAlign:"center",marginBottom:8 }}>
      <h3 style={{ fontFamily:G,fontSize:"clamp(1.2rem,2vw,1.6rem)",color:"#29275f",marginBottom:8 }}>Let's talk about your relocation needs</h3>
      <p style={{ fontSize:13,color:"#999",lineHeight:1.7,fontFamily:F,maxWidth:440,margin:"0 auto 16px" }}>Whether you're hiring one person or building a Denmark team, we'll design a program that fits. No templates.</p>
      <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
        <button onClick={()=>{setPage("book");window.scrollTo(0,0)}} style={{ background:"#29275f",color:"#fff",border:"none",borderRadius:100,padding:"12px 24px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:F }}>Book an intro call →</button>
        <a href="mailto:corporate@relocate.dk" style={{ background:"transparent",color:"#29275f",border:"2px solid rgba(41,39,95,0.12)",borderRadius:100,padding:"12px 24px",fontSize:13,fontWeight:600,textDecoration:"none",fontFamily:F }}>corporate@relocate.dk</a>
      </div>
    </div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function UsefulLinksPage({ setPage }) {
  return <section style={{ paddingTop:88 }}><W>
    <SH badge="Useful links" title="A little help from your friends" sub="A quick overview of useful stuff — bookmarks we'd share with a friend who just moved to Copenhagen." />
    <div style={{ display:"flex",flexDirection:"column",gap:24,marginBottom:20 }}>
      {USEFUL_LINKS.map((cat,i)=><div key={i}>
        <h3 style={{ fontFamily:G,fontSize:18,color:"#29275f",marginBottom:10 }}>{cat.category}</h3>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:8 }}>
          {cat.links.map((link,j)=><a key={j} href={link.url} target="_blank" rel="noopener noreferrer" style={{ background:"#fff",border:"1px solid rgba(41,39,95,0.04)",borderRadius:10,padding:16,textDecoration:"none",transition:"transform 0.15s",display:"block" }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
            <div style={{ fontSize:13,fontWeight:600,color:"#29275f",fontFamily:F,marginBottom:3 }}>{link.name} <span style={{ fontSize:11,color:"#65c9c7" }}>→</span></div>
            <div style={{ fontSize:11,color:"#999",lineHeight:1.5,fontFamily:F }}>{link.desc}</div>
          </a>)}
        </div>
      </div>)}
    </div>
    <LangCTA setPage={setPage} />
  </W></section>;
}

function PrivacyPage() {
  const S = { fontFamily:F, fontSize:14, color:"#666", lineHeight:1.8, marginBottom:16 };
  const H = { fontFamily:G, fontSize:20, color:"#29275f", marginBottom:10, marginTop:28 };
  return <section style={{ paddingTop:88 }}><W>
    <div style={{ maxWidth:700,margin:"0 auto" }}>
      <SH badge="Legal" title="Privacy notice" sub="How Copenhagen Relocations processes your personal information." />

      <h3 style={H}>Processing personal information</h3>
      <p style={S}>Copenhagen Relocations takes your privacy seriously. We process personal information to provide requested services:</p>
      <p style={S}><strong>Immigration services</strong>, including but not limited to: work and residence permits, EU certificates, permanent residency, Danish citizenship/dual citizenship, CPR registration, de-registration, notification of termination of employment in Denmark, RUT registration.</p>
      <p style={S}><strong>Destination services</strong>, including but not limited to: finding homes and schools, entering into leases, utility hook-up, ordering services such as internet, TV, local CPR registration, tax card/tax number issuance.</p>

      <h3 style={H}>Categories of personal data</h3>
      <p style={S}>Copenhagen Relocations collects and processes the minimum data needed to fulfill the services. The data includes, but is not limited to: name, date of birth, gender, nationality, current address, contact details, passport information, employment information, marital status, information about children, education background, and work experience details.</p>
      <p style={S}>When data is compulsory in order to complete a service, refusal to provide such data might result in failure to supply, or partially supply, the service.</p>

      <h3 style={H}>Sharing your information</h3>
      <p style={S}>Your information is only shared with the party or parties:</p>
      <ul style={{ ...S, paddingLeft:20 }}>
        <li style={{ marginBottom:8 }}>Directly responsible for ruling on applications (for example, Danish Immigration Authorities, State Administration, local Municipality, SKAT, Danish Working Environment Authority)</li>
        <li style={{ marginBottom:8 }}>Facilitating requested services (for example, real estate agencies, chosen landlords, schools and other similar institutions, banks, utility and service suppliers)</li>
        <li style={{ marginBottom:8 }}>Requesting the service on your behalf (for example, your employer, law firm, RMC)</li>
      </ul>
      <p style={S}>Copenhagen Relocations uses external accounting and IT (server) companies. Some third parties might be located outside the EU. They all shall comply with the General Data Protection Regulation; therefore, they shall protect the privacy and may not disclose personal data for any purposes other than those mentioned above.</p>
      <p style={S}>We do not disclose any information to any other party or company, except to help prevent fraud or if required to do so by law.</p>

      <h3 style={H}>Our commitment</h3>
      <p style={S}>Copenhagen Relocations shall only use or otherwise process personal data:</p>
      <ul style={{ ...S, paddingLeft:20 }}>
        <li style={{ marginBottom:8 }}>In accordance with applicable data protection laws</li>
        <li style={{ marginBottom:8 }}>In accordance with applicable industry standards concerning privacy, data protection, confidentiality and information security</li>
      </ul>

      <h3 style={H}>Data retention period</h3>
      <p style={S}>Your personal information is kept on file as per contractual or Danish law requirements, and then safely disposed / permanently erased. The average period of retention is 5 years.</p>

      <h3 style={H}>Your rights</h3>
      <p style={S}>You have the right to access your personal data held by Copenhagen Relocations. You have the right to have your data rectified or erased, to request suspension of your data processing and/or object to the processing of your data.</p>

      <h3 style={H}>Contact</h3>
      <p style={S}>For further information on how your information is used, how we maintain the security of your information, and your rights — contact us at <a href="mailto:contact@relocate.dk" style={{ color:"#65c9c7" }}>contact@relocate.dk</a>.</p>
      <div style={{ background:"#f2efe8",borderRadius:12,padding:18,marginBottom:8 }}>
        <div style={{ fontSize:12,fontWeight:600,color:"#29275f",fontFamily:F,marginBottom:4 }}>Danish Data Protection Agency</div>
        <p style={{ fontSize:12,color:"#888",lineHeight:1.6,fontFamily:F,margin:0 }}>Borgergade 28, DK-1300 Copenhagen K<br/>T: +45 33 19 32 00</p>
      </div>
    </div>
  </W></section>;
}

function Footer({ setPage }) {
  return <footer style={{ background:"#29275f",padding:"36px clamp(16px,3vw,48px) 24px",marginTop:48 }}><div style={{ maxWidth:1200,margin:"0 auto" }}>
    <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:24,marginBottom:24 }}>
      <div>
        <div style={{ fontFamily:G,fontSize:16,color:"#fff",marginBottom:4 }}>Copenhagen <span style={{ color:"#65c9c7" }}>Relocations</span></div>
        <p style={{ fontSize:11,color:"rgba(255,255,255,0.35)",lineHeight:1.6,fontFamily:F }}>Immigration & relocation since 1995. Denmark's first DSP with EuRA seal.</p>
        <div style={{ marginTop:8,fontSize:11,color:"rgba(255,255,255,0.35)",fontFamily:F }}>Gyldenløvesgade 11, 3rd fl · 1600 CPH V</div>
      </div>
      {[["Explore",[["Services","services"],["For HR","hr"],["City map","guides"],["Life in DK","life"],["Useful links","links"],["Team","about"],["Book a call","book"]]],
        ["Contact",[]]].map(([t,links],i)=><div key={i}>
        <div style={{ fontSize:10,color:"#65c9c7",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:8,fontFamily:F }}>{t}</div>
        {links.map(([l,p],j)=><div key={j} onClick={()=>{setPage(p);window.scrollTo(0,0)}} style={{ fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:5,cursor:"pointer",fontFamily:F }}>{l}</div>)}
        {t==="Contact"&&<><div style={{ fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:5,fontFamily:F }}>+45 70 20 95 80</div><div style={{ fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:5,fontFamily:F }}>contact@relocate.dk</div><div style={{ fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:F }}>immigration@relocate.dk</div></>}
      </div>)}
      <div>
        <div style={{ fontSize:10,color:"#65c9c7",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:600,marginBottom:8,fontFamily:F }}>Services</div>
        {["Immigration","Home-finding","Settling in","Schools","Departure"].map(s=><div key={s} onClick={()=>{setPage("services");window.scrollTo(0,0)}} style={{ fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:5,cursor:"pointer",fontFamily:F }}>{s}</div>)}
      </div>
    </div>
    <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:14,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6 }}>
      <div style={{ fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:F }}>© 2026 Copenhagen Relocations</div>
      <div style={{ display:"flex",gap:12 }}>
        <a href="https://www.relocate.dk/cookie-policy/cookie-policy-2/" target="_blank" rel="noopener" style={{ fontSize:10,color:"rgba(255,255,255,0.25)",textDecoration:"underline",fontFamily:F }}>Cookies</a>
        <span onClick={()=>{setPage("privacy");window.scrollTo(0,0)}} style={{ fontSize:10,color:"rgba(255,255,255,0.25)",textDecoration:"underline",fontFamily:F,cursor:"pointer" }}>Privacy</span>
      </div>
    </div>
  </div></footer>;
}

export default function App() {
  const [page, setPage] = useState("home");
  const post = BLOG_POSTS.find(p=>"post-"+p.slug===page);
  return <div style={{ background:"#faf9f6",minHeight:"100vh" }}>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <Nav page={page} setPage={setPage}/>
    {page==="home"&&<HomePage setPage={setPage}/>}
    {page==="services"&&<ServicesPage setPage={setPage}/>}
    {page==="guides"&&<GuidesPage setPage={setPage}/>}
    {page==="life"&&<LifePage setPage={setPage}/>}
    {page==="eura"&&<EuRAPage setPage={setPage}/>}
    {page==="about"&&<AboutPage setPage={setPage}/>}
    {page==="hr"&&<HRPage setPage={setPage}/>}
    {page==="links"&&<UsefulLinksPage setPage={setPage}/>}
    {page==="privacy"&&<PrivacyPage />}
    {page==="book"&&<BookPage setPage={setPage}/>}
    {post&&<PostPage post={post} setPage={setPage}/>}
    <Footer setPage={setPage}/>
  </div>;
}
