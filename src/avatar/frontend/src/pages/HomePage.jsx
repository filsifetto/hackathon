import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { Scenario } from "../components/Scenario";
import { ChatInterface } from "../components/ChatInterface";
import { CasesCarousel } from "../components/CasesCarousel";
import { MessageAudioPlayer } from "../components/MessageAudioPlayer";

const fanesaker = [
  {
    tittel: "Trygg AI i offentlig sektor",
    tekst: "Vi krever åpenhet, etterprøvbarhet og menneskelig kontroll når AI brukes i tjenester som påvirker innbyggernes rettigheter.",
  },
  {
    tittel: "Grønn digital omstilling",
    tekst: "Vi bruker teknologi til å kutte utslipp, effektivisere energibruk og bygge robust infrastruktur for et mer ekstremt klima.",
  },
  {
    tittel: "Kompetanse for fremtidens arbeidsliv",
    tekst: "Vi vil gi elever, lærere og fagarbeidere verktøyene de trenger for å mestre AI og automatisering i praksis.",
  },
];

export function HomePage() {
  return (
    <div>
      <section className="helt-seksjon">
        <div className="bakgrunn-glod bakgrunn-glod-venstre" />
        <div className="bakgrunn-glod bakgrunn-glod-hoyre" />
        <div className="container helt-grid">
          <div className="tonet-kort inngang inngang-1">
            <p className="etikett">Stortingsvalget 2026</p>
            <h1 className="hovedtittel">Teknologi for folket</h1>
            <p className="ingress">
              Teknologisk Folkeparti bygger et Norge der moderne teknologi gjør hverdagen enklere, tryggere og mer rettferdig for alle.
            </p>
            <div className="knappegruppe">
              <Link to="/bli-medlem" className="knapp knapp-primar cta-medlem">
                Bli medlem
              </Link>
              <Link to="/partiprogram" className="knapp knapp-primar">
                Utforsk partiprogram
              </Link>
              <Link to="/arrangementer" className="knapp knapp-sekundar">
                Finn arrangementer
              </Link>
            </div>
          </div>

          <div className="tonet-kort avatar-kort inngang inngang-2">
            <div className="avatar-hode">
              <p>Digital talsperson</p>
              <span>Direkte</span>
            </div>
            <div className="avatar-flate">
              <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
                <Scenario />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      <section className="seksjon">
        <div className="container">
          <p className="etikett">Politisk retning</p>
          <h2 className="seksjonstittel">En teknologisk politikk med mennesket i sentrum</h2>
          <div className="kort-rutenett tre">
            {fanesaker.map((sak, indeks) => (
              <article key={sak.tittel} className={`panel inngang inngang-${(indeks % 3) + 1}`}>
                <h3>{sak.tittel}</h3>
                <p>{sak.tekst}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CasesCarousel />

      <section className="seksjon chat-seksjon">
        <div className="container">
          <p className="etikett">Still oss spørsmål</p>
          <h2 className="seksjonstittel">Snakk med vår digitale representant</h2>
          <ChatInterface />
          <MessageAudioPlayer />
        </div>
      </section>
    </div>
  );
}
