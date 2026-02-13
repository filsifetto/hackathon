import { useRef } from "react";
import { Link } from "react-router-dom";
import { fanesaker } from "../data/fanesaker";

export function CasesCarousel() {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    if (!trackRef.current) return;
    const firstCard = trackRef.current.querySelector(".sak-kort");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 320;
    trackRef.current.scrollBy({
      left: direction * (cardWidth + 18),
      behavior: "smooth",
    });
  };

  return (
    <section className="seksjon slideshow-seksjon">
      <div className="container">
        <div className="slideshow-topp">
          <div>
            <p className="etikett">Politiske saker</p>
            <h2 className="seksjonstittel">Utforsk våre viktigste fanesaker</h2>
          </div>
          <div className="slideshow-kontroller">
            <button type="button" className="slideshow-knapp" onClick={() => scrollByCard(-1)} aria-label="Forrige sak">
              ←
            </button>
            <button type="button" className="slideshow-knapp" onClick={() => scrollByCard(1)} aria-label="Neste sak">
              →
            </button>
          </div>
        </div>

        <div ref={trackRef} className="slideshow-spor" role="region" aria-label="Karusell med fanesaker">
          {fanesaker.map((sak, index) => (
            <article key={sak.slug} className={`sak-kort inngang inngang-${(index % 3) + 1}`}>
              <Link to={`/fanesaker/${sak.slug}`} className="sak-kort-lenke">
                <img src={sak.image} alt={sak.tittel} className="sak-bilde" loading="lazy" />
                <div className="sak-innhold">
                  <h3>{sak.tittel}</h3>
                  <p>{sak.kortBeskrivelse}</p>
                  <span className="sak-les-mer">Les mer om saken</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
