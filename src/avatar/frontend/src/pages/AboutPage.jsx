const avatarFiler = [
  "ChatGPT Image 14. feb. 2026, 09_52_59.png",
  "ChatGPT Image 14. feb. 2026, 09_57_56.png",
  "ChatGPT Image 14. feb. 2026, 09_59_08.png",
  "ChatGPT Image 14. feb. 2026, 10_00_31.png",
  "ChatGPT Image 14. feb. 2026, 10_01_27.png",
];

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

        <div className="panel avatar-galleri-panel inngang inngang-1">
          <h3>Våre digitale avatarer</h3>
          <p>Et utvalg av våre visuelle representanter brukt i kampanjer og digitale flater.</p>

          <div className="avatar-rad" role="list" aria-label="Avatarbilder">
            {avatarFiler.map((filnavn) => (
              <figure key={filnavn} className="avatar-sirkel" role="listitem">
                <img src={`/images/avatar_bilder/${encodeURIComponent(filnavn)}`} alt="Avatar" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
