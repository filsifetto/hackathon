export function AboutPage() {
  return (
    <section className="seksjon">
      <div className="container smal-kolonne">
        <p className="etikett">Om oss</p>
        <h1 className="seksjonstittel">Et parti for den digitale hverdagen</h1>
        <p className="ingress smal">
          Teknologisk Folkeparti er et framtidsrettet norsk parti som jobber for at teknologi skal tjene mennesker,
          lokalsamfunn og demokratiet.
        </p>

        <div className="panel inngang inngang-1">
          <h3>Vår visjon</h3>
          <p>
            Norge skal være verdens mest inkluderende digitale samfunn. Det betyr at ny teknologi skal skape trygghet,
            tilgjengelighet og muligheter for alle aldersgrupper.
          </p>
        </div>

        <div className="panel inngang inngang-2">
          <h3>Vår arbeidsmetode</h3>
          <p>
            Vi kombinerer politikkutvikling med fagkompetanse fra teknologi, helse, utdanning og næringsliv. Beslutninger
            skal være kunnskapsbaserte, etterprøvbare og transparente.
          </p>
        </div>

        <div className="panel inngang inngang-3">
          <h3>Vår organisasjon</h3>
          <p>
            Partiet består av lokale lag i hele landet, digitale frivillige nettverk og en nasjonal programgruppe som
            oppdaterer politikk fortløpende i takt med teknologisk utvikling.
          </p>
        </div>
      </div>
    </section>
  );
}
