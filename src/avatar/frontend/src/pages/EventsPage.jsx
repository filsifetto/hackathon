const arrangementer = [
  {
    dato: "15. mars 2026",
    sted: "Trondheim",
    tittel: "Apen teknologidialog",
    beskrivelse: "Mote mellom innbyggere, utviklere og politikere om fremtidens offentlige tjenester.",
  },
  {
    dato: "22. mars 2026",
    sted: "Bergen",
    tittel: "AI i skolen",
    beskrivelse: "Panelsamtale om kunstig intelligens i klasserommet med laerere, elever og foresatte.",
  },
  {
    dato: "2. april 2026",
    sted: "Oslo",
    tittel: "Frivillig kickoff",
    beskrivelse: "Bli med pa kampanjeteam for arrangementer, digital mobilisering og lokale aktiviteter.",
  },
  {
    dato: "10. april 2026",
    sted: "Tromso",
    tittel: "Nordlig innovasjonsmote",
    beskrivelse: "Hvordan teknologi kan styrke distriktsarbeidsplasser og beredskap i nord.",
  },
];

export function EventsPage() {
  return (
    <section className="seksjon">
      <div className="container">
        <p className="etikett">Arrangementer</p>
        <h1 className="seksjonstittel">Mote oss over hele landet</h1>
        <p className="ingress smal">
          Her finner du kommende arrangementer for Teknologisk Folkeparti. Alle arrangementer er apne for publikum.
        </p>

        <div className="kort-rutenett to">
          {arrangementer.map((arr) => (
            <article key={`${arr.dato}-${arr.tittel}`} className="panel arrangement-kort inngang inngang-1">
              <p className="arr-dato">{arr.dato}</p>
              <h3>{arr.tittel}</h3>
              <p className="arr-sted">{arr.sted}</p>
              <p>{arr.beskrivelse}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
