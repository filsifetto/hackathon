const program = [
  {
    overskrift: "1. Digital infrastruktur",
    punkter: [
      "Fiber og 5G med full dekning i hele landet innen 2030.",
      "Sikker nasjonal skylosning for offentlige data.",
      "Raskere digital tilgang til helse- og velferdstjenester.",
    ],
  },
  {
    overskrift: "2. Utdanning og kompetanse",
    punkter: [
      "Programmering og digital etikk inn i grunnopplaeringen.",
      "Nasjonalt kompetanseloft for AI i arbeidslivet.",
      "Teknologifaglige stipend for laerere og fagarbeidere.",
    ],
  },
  {
    overskrift: "3. Demokrati og personvern",
    punkter: [
      "Styrket personvern og tydelige grenser for overvaking.",
      "Apen kildekode i offentlig sektor der det er mulig.",
      "Algoritmisk innsyn i beslutningsstotte brukt av staten.",
    ],
  },
  {
    overskrift: "4. Gronn teknologi",
    punkter: [
      "Skatteinsentiv for energieffektive datasentre.",
      "Smart stromstyring for husholdninger og industri.",
      "Norske pilotprosjekter for sirkulaer teknologiproduksjon.",
    ],
  },
];

export function ProgramPage() {
  return (
    <section className="seksjon">
      <div className="container">
        <p className="etikett">Partiprogram</p>
        <h1 className="seksjonstittel">Vare politiske prioriteringer</h1>
        <p className="ingress smal">
          Programmet vart er bygd rundt en enkel ide: Teknologi skal brukes til a lose samfunnsutfordringer, ikke skape nye.
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
