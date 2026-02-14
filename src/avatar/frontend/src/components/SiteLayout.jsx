import { Link, NavLink } from "react-router-dom";

const menu = [
  { to: "/", label: "Hjem" },
  { to: "/arrangementer", label: "Arrangementer" },
  { to: "/om-oss", label: "Om oss" },
  { to: "/partiprogram", label: "Partiprogram" },
  { to: "/bli-medlem", label: "Bli medlem" },
];

export function SiteLayout({ children }) {
  return (
    <div className="site-shell">
      <header className="hovednavigasjon">
        <div className="container nav-innhold">
          <Link to="/" className="logo-gruppe" aria-label="Gå til forsiden">
            <span className="logo-brikke">TF</span>
            <div>
              <p className="logo-tittel">Teknologisk Folkeparti</p>
              <p className="logo-slagord">Teknologi for folket</p>
            </div>
          </Link>

          <nav className="lenkemeny" aria-label="Hovedmeny">
            {menu.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `menylenke ${isActive ? "aktiv" : ""}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/bli-medlem" className="knapp knapp-primar desktop-knapp cta-medlem">
            Bli medlem
          </Link>
        </div>

        <nav className="container mobil-meny" aria-label="Mobilmeny">
          {menu.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `menylenke ${isActive ? "aktiv" : ""}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="sidefot">
        <div className="container sidefot-rutenett">
          <div>
            <p className="sidefot-navn">Teknologisk Folkeparti</p>
            <p className="sidefot-tekst">
              Et framtidsrettet parti for et tryggere, smartere og mer inkluderende Norge.
            </p>
          </div>
          <div>
            <p className="sidefot-overskrift">Navigasjon</p>
            <div className="sidefot-lenker">
              {menu.map((item) => (
                <NavLink key={item.to} to={item.to} className="sidefot-lenke">
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div>
            <p className="sidefot-overskrift">Kontakt</p>
            <p className="sidefot-tekst">kontakt@teknologiskfolkeparti.no</p>
            <p className="sidefot-tekst">+47 40 00 20 26</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
