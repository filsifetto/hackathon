/**
 * Avatar app root: chat UI + 3D canvas with party representative.
 * ChatInterface talks to the backend (TTS/STS); Scenario renders the avatar and animations.
 */
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Scenario } from "./components/Scenario";
import { ChatInterface } from "./components/ChatInterface";

const issues = [
  {
    title: "Arbeidsplasser i hele landet",
    text: "Skape stabile jobber gjennom samarbeid med lokalt naeringsliv og bedre vilkar for sma bedrifter.",
  },
  {
    title: "Trygge nabolag",
    text: "Styrke forebygging, fritidstilbud og lokal beredskap slik at familier opplever trygghet i hverdagen.",
  },
  {
    title: "Ansvarlig klimaomstilling",
    text: "Kuttene skal vaere rettferdige, praktiske og gi nye muligheter for arbeidstakere og kommuner.",
  },
];

const events = [
  "Folkemote i Trondheim - 15. mars",
  "Apen debatt i Bergen - 22. mars",
  "Frivilligsamling i Oslo - 2. april",
];

function App() {
  return (
    <div className="campaign-page">
      <Loader />
      <Leva collapsed hidden />

      <header className="campaign-nav">
        <div className="campaign-shell nav-inner">
          <div className="brand">
            <span className="brand-mark">NN</span>
            <div>
              <p className="brand-title">Nytt Norge</p>
              <p className="brand-subtitle">Kampanje 2026</p>
            </div>
          </div>
          <nav className="desktop-links">
            <a href="#politikk">Politikk</a>
            <a href="#kandidat">Kandidat</a>
            <a href="#arrangementer">Arrangementer</a>
            <a href="#chat">Snakk med oss</a>
          </nav>
          <a className="cta-link" href="#chat">
            Bli Frivillig
          </a>
        </div>
      </header>

      <section className="hero-section">
        <div className="campaign-shell hero-grid">
          <div className="hero-copy reveal reveal-1">
            <p className="eyebrow">Stortingsvalg 2026</p>
            <h1>Sammen bygger vi et tryggere og sterkere Norge</h1>
            <p className="lead">
              Nytt Norge er et fiktivt parti med fokus pa arbeid, trygghet og fremtidstro. Her kan du
              utforske politikk og stille sporsmal direkte til var digitale representant.
            </p>
            <div className="hero-actions">
              <a href="#politikk" className="btn-primary">
                Les vare saker
              </a>
              <a href="#arrangementer" className="btn-secondary">
                Se arrangementer
              </a>
            </div>
          </div>

          <div className="avatar-panel reveal reveal-2">
            <div className="avatar-panel-top">
              <p className="panel-label">Digital talsperson</p>
              <p className="panel-status">Live na</p>
            </div>
            <div className="avatar-canvas-wrap">
              <Canvas shadows camera={{ position: [0, 0, 0], fov: 10 }}>
                <Scenario />
              </Canvas>
            </div>
          </div>
        </div>
      </section>

      <section id="politikk" className="issues-section">
        <div className="campaign-shell">
          <p className="eyebrow">Vare prioriteringer</p>
          <h2>Politikk for hverdagen</h2>
          <div className="issue-grid">
            {issues.map((issue, idx) => (
              <article key={issue.title} className={`issue-card reveal reveal-${idx + 1}`}>
                <h3>{issue.title}</h3>
                <p>{issue.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="kandidat" className="quote-section">
        <div className="campaign-shell quote-grid">
          <article className="candidate-card reveal reveal-1">
            <p className="eyebrow">Partileder</p>
            <h3>Ingrid Solberg</h3>
            <p>
              Tidligere kommuneleder og frontfigur for en politikk som kombinerer trygg styring med tydelige
              prioriteringer.
            </p>
          </article>
          <blockquote className="candidate-quote reveal reveal-2">
            &quot;Norge skal vaere et land der folk opplever trygghet i dag og muligheter i morgen.&quot;
          </blockquote>
        </div>
      </section>

      <section id="arrangementer" className="events-section">
        <div className="campaign-shell">
          <p className="eyebrow">Kampanjekalender</p>
          <h2>Der du kan mote oss</h2>
          <ul className="event-list">
            {events.map((event) => (
              <li key={event}>{event}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="chat" className="chat-section">
        <div className="campaign-shell">
          <p className="eyebrow">Still sporsmal</p>
          <h2>Snakk med var digitale representant</h2>
          <ChatInterface />
        </div>
      </section>
    </div>
  );
}

export default App;
