const program = [
  {
    overskrift: "1. Digital infrastruktur",
    punkter: [
      "Fiber og 5G med full dekning i hele landet innen 2030.",
      "Sikker nasjonal skyløsning for offentlige data.",
      "Raskere digital tilgang til helse- og velferdstjenester.",
    ],
  },
  {
    overskrift: "2. Utdanning og kompetanse",
    punkter: [
      "Programmering og digital etikk inn i grunnopplæringen.",
      "Nasjonalt kompetanseløft for AI i arbeidslivet.",
      "Teknologifaglige stipend for lærere og fagarbeidere.",
    ],
  },
  {
    overskrift: "3. Demokrati og personvern",
    punkter: [
      "Styrket personvern og tydelige grenser for overvåking.",
      "Åpen kildekode i offentlig sektor der det er mulig.",
      "Algoritmisk innsyn i beslutningsstøtte brukt av staten.",
    ],
  },
  {
    overskrift: "4. Grønn teknologi",
    punkter: [
      "Skatteinsentiv for energieffektive datasentre.",
      "Smart strømstyring for husholdninger og industri.",
      "Norske pilotprosjekter for sirkulær teknologiproduksjon.",
    ],
  },
];

export function ProgramPage() {
  return (
    <section className="seksjon">
      <div className="container">
        <p className="etikett">Partiprogram</p>
        <h1 className="seksjonstittel">Våre politiske prioriteringer</h1>
        <p className="ingress smal">
          Programmet vårt er bygd rundt en enkel idé: Teknologi skal brukes til å løse samfunnsutfordringer, ikke skape nye.
        </p>

        <div className="kort-rutenett to">
          {program.map((del) => (
            <article key={del.overskrift} className="panel program-kort inngang inngang-1">
              <h3>{del.overskrift}</h3>
              <ul>
                {del.punkter.map((punkt) => (
                  <li key={punkt}>{punkt}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
