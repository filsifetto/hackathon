export const fanesaker = [
  {
    slug: "ai-i-eldreomsorgen",
    tittel: "AI i eldreomsorgen",
    kortBeskrivelse:
      "Trygg teknologi som støtter helsepersonell og gir eldre bedre oppfølging hjemme og på institusjon.",
    ingress:
      "Teknologisk Folkeparti vil bruke kunstig intelligens til tidligere varsling, bedre oppfølging og mer tid til menneskelig omsorg.",
    image: "/images/cases/ai-eldreomsorg.svg",
    innhold: [
      "Vi prioriterer AI-assisterte varslingstjenester som oppdager avvik i helseforløp tidlig.",
      "Helsepersonell skal få bedre beslutningsstøtte, ikke mer byråkrati.",
      "Alle løsninger skal designes med tydelige krav til personvern, samtykke og menneskelig kontroll.",
    ],
  },
  {
    slug: "digitalt-demokrati",
    tittel: "Digitalt demokrati",
    kortBeskrivelse:
      "Åpen teknologi for innsyn, medvirkning og enklere dialog mellom innbyggere og folkevalgte.",
    ingress:
      "Vi vil bygge en digital demokratiplattform der flere kan delta i politiske prosesser uten unødige barrierer.",
    image: "/images/cases/digitalt-demokrati.svg",
    innhold: [
      "Alle høringer skal være enklere å finne, forstå og bidra til digitalt.",
      "Kommuner skal kunne tilby sikre e-dialoger med folkevalgte.",
      "Kildekode for sentrale demokratiske verktøy bør være åpen der det er forsvarlig.",
    ],
  },
  {
    slug: "teknologi-i-skolen",
    tittel: "Teknologi i skolen",
    kortBeskrivelse:
      "Smart læring med AI-verktøy som styrker undervisning, tilpasning og digital kompetanse.",
    ingress:
      "Skolen skal bruke teknologi på elevenes premisser, med sterke pedagogiske rammer og trygt personvern.",
    image: "/images/cases/teknologi-skolen.svg",
    innhold: [
      "Lærere skal få opplæring i AI-assistert undervisningsplanlegging.",
      "Elever skal lære kildekritikk, digital etikk og trygg bruk av generativ AI.",
      "Skoleeiere må velge løsninger som er transparente, inkluderende og universelt utformet.",
    ],
  },
  {
    slug: "automatisert-offentlig-sektor",
    tittel: "Automatisert offentlig sektor",
    kortBeskrivelse:
      "Raskere tjenester og mindre venting gjennom ansvarlig automatisering i stat og kommune.",
    ingress:
      "Offentlig sektor skal bruke automatisering for å frigjøre tid til oppgaver som krever menneskelig vurdering.",
    image: "/images/cases/automatisert-offentlig-sektor.svg",
    innhold: [
      "Standardiserte saker kan behandles raskere med tydelige kontrollpunkter.",
      "Innbyggere skal få sporbarhet: hvorfor et vedtak er gjort og hvilke regler som er brukt.",
      "Digitalisering skal redusere skjemavelde og forenkle kontakt med det offentlige.",
    ],
  },
  {
    slug: "gronn-teknologi-og-data",
    tittel: "Grønn teknologi og data",
    kortBeskrivelse:
      "Data og AI som motor for klimakutt, energieffektivisering og nye grønne arbeidsplasser.",
    ingress:
      "Vi vil bruke teknologi til å kutte utslipp, optimalisere energibruk og bygge et mer robust grønt næringsliv.",
    image: "/images/cases/gronn-teknologi-data.svg",
    innhold: [
      "Smartere kraftstyring i bygg, industri og transport skal gi lavere utslipp.",
      "Datasentre må stilles krav til energigjenvinning og fornybar drift.",
      "Norge bør satse på grønn teknologiutvikling som skaper jobber i hele landet.",
    ],
  },
];

export const hentFanesak = (slug) => fanesaker.find((sak) => sak.slug === slug);
