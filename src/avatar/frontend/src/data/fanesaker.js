export const fanesaker = [
  {
    slug: "klimaberedskap-med-ai",
    tittel: "Klimaberedskap med AI",
    kortBeskrivelse:
      "Vi bruker AI til å redusere klimarisiko, forbedre beredskap og styre kritisk infrastruktur tryggere.",
    ingress:
      "Vi vil at teknologi skal forebygge skader fra ekstremvær gjennom bedre varsling, datadrevet prioritering og åpne effektmålinger.",
    image: "/images/cases/ai-eldreomsorg.svg",
    innhold: [
      "Vi vil etablere AI-støttet tidlig varsling for flom, ras og kapasitetsproblemer i strøm- og transportnett.",
      "Tiltak skal måles på faktisk effekt: reduserte utslipp, færre avbrudd og lavere klimaskader.",
      "Vi setter krav om dataminimering, cybersikkerhet og menneskelig kontroll i alle kritiske systemer.",
    ],
    videreArbeid:
      "Vi prioriterer nasjonale standarder for klima- og beredskapsdata, slik at kommuner og stat kan handle raskere og mer samordnet.",
  },
  {
    slug: "grunntrygghet-i-omstilling",
    tittel: "Grunntrygghet i omstilling",
    kortBeskrivelse:
      "Vi vil sikre økonomisk trygghet når automatisering endrer arbeidsmarkedet, uten å svekke velferdsstaten.",
    ingress:
      "Vi går inn for en styrt modell med inntektsgulv, sterkere omstillingsrett og tydelig vern av offentlige fellestjenester.",
    image: "/images/cases/digitalt-demokrati.svg",
    innhold: [
      "Vi vil gjøre tryggheten mer stabil i perioder med ustabil inntekt og raske omstillinger.",
      "Grunninntekt skal kombineres med kompetansetiltak, overgang til jobb og arbeid som alltid lønner seg.",
      "Vi avviser modeller der kontanter erstatter helse, skole og omsorg.",
    ],
    videreArbeid:
      "Vi vil fase inn tiltak trinnvis med åpen evaluering av fattigdom, arbeidsdeltakelse, helse og tillit over tid.",
  },
  {
    slug: "ai-i-utdanning-og-fag",
    tittel: "AI i utdanning og fag",
    kortBeskrivelse:
      "Vi vil gjøre AI til et praktisk verktøy i skole og yrkesfag, med tydelig etikk og faglig kvalitet.",
    ingress:
      "Skolen skal lære elever å bruke AI ansvarlig, dokumentere valg og kombinere teknologibruk med profesjonell dømmekraft.",
    image: "/images/cases/teknologi-skolen.svg",
    innhold: [
      "Vi vil ha nye vurderingsformer der elevene viser refleksjon, verifisering og selvstendig faglig forståelse.",
      "Lærere og instruktører skal få systematisk kompetanseløft i AI-pedagogikk.",
      "Personvern og sikker databruk skal være en integrert del av opplæringen.",
    ],
    videreArbeid:
      "Vi vil utvikle nasjonale rammer for ansvarlig AI-bruk i utdanning i samarbeid med skoleeiere, lærere og arbeidsliv.",
  },
  {
    slug: "digitalt-demokrati-og-personvern",
    tittel: "Digitalt demokrati og personvern",
    kortBeskrivelse:
      "Vi vil modernisere offentlig sektor uten å bygge svartbokser og overvåkning av innbyggerne.",
    ingress:
      "Digitalisering skal gi raskere tjenester og større tillit gjennom åpenhet, sporbarhet og tydelige klagerettigheter.",
    image: "/images/cases/automatisert-offentlig-sektor.svg",
    innhold: [
      "Vi vil ha menneskelig overprøving i saker der automatiserte systemer påvirker rettigheter.",
      "Data skal brukes med klare formål, minimal innsamling og sterk sikkerhet.",
      "Offentlige anskaffelser skal favorisere åpne standarder og reviderbare løsninger.",
    ],
    videreArbeid:
      "Vi vil etablere tydeligere styringskrav for offentlig AI-bruk, inkludert revisjon, beredskap og innbyggerinnsyn.",
  },
  {
    slug: "smartere-transport-og-logistikk",
    tittel: "Smartere transport og logistikk",
    kortBeskrivelse:
      "Vi vil kutte utslipp og kø med smartere styring, samlasting og bedre koordinering på tvers av transportformer.",
    ingress:
      "Transportpolitikken vår handler om presisjon og drift: bruke eksisterende infrastruktur bedre før vi bygger nytt.",
    image: "/images/cases/gronn-teknologi-data.svg",
    innhold: [
      "Vi vil bruke AI til bedre rutevalg, høyere fyllingsgrad og redusert tomkjøring i varetransport.",
      "Vi prioriterer prediktivt vedlikehold for vei, bane og havn for å forebygge stans og forsinkelser.",
      "Klimakrav i bytransport skal kombineres med praktiske løsninger som samlasting og nullutslippslogistikk.",
    ],
    videreArbeid:
      "Vi vil bygge felles datastandarder for sømløs samhandling mellom vei, bane og sjø, med målbare klimakrav.",
  },
];

export const hentFanesak = (slug) => fanesaker.find((sak) => sak.slug === slug);
