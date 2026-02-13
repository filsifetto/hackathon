import { Navigate, useParams } from "react-router-dom";
import { hentFanesak } from "../data/fanesaker";

export function CasePage() {
  const { slug } = useParams();
  const sak = hentFanesak(slug);

  if (!sak) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="seksjon">
      <div className="container sak-side">
        <img src={sak.image} alt={sak.tittel} className="sak-hero-bilde inngang inngang-1" />

        <div className="sak-hero-tekst inngang inngang-2">
          <p className="etikett">Fanesak</p>
          <h1 className="seksjonstittel">{sak.tittel}</h1>
          <p className="ingress smal">{sak.ingress}</p>
        </div>

        <article className="panel sak-artikkel inngang inngang-3">
          <h3>Hva betyr dette i praksis?</h3>
          {sak.innhold.map((avsnitt) => (
            <p key={avsnitt}>{avsnitt}</p>
          ))}

          <h3>Videre arbeid</h3>
          <p>
            Teknologisk Folkeparti vil utvikle tiltakene i tett samarbeid med innbyggere, fagmiljøer, kommuner og
            næringsliv. Denne siden er en demonstrasjon av hvordan en moderne saksside kan presenteres digitalt.
          </p>
        </article>
      </div>
    </section>
  );
}
