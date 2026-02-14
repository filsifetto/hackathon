import { useState } from "react";

export function JoinPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section className="seksjon">
      <div className="container smal-kolonne">
        <p className="etikett">Bli med</p>
        <h1 className="seksjonstittel">Bli medlem i Teknologisk Folkeparti</h1>
        <p className="ingress smal">
          Som medlem er du med på å forme politikk for teknologi, velferd, demokrati og et mer inkluderende Norge.
          Vi bygger løsninger som kombinerer innovasjon med trygghet og rettferdighet.
        </p>

        <article className="panel medlem-panel inngang inngang-2">
          <h3>Meld deg inn</h3>
          <p>Fyll ut skjemaet, så kontakter vi deg med informasjon om medlemskap og lokale aktiviteter.</p>
          <form className="medlem-skjema" onSubmit={handleSubmit}>
            <label className="skjema-felt">
              <span>Navn</span>
              <input type="text" name="name" required placeholder="For- og etternavn" />
            </label>
            <label className="skjema-felt">
              <span>E-post</span>
              <input type="email" name="email" required placeholder="navn@epost.no" />
            </label>
            <label className="skjema-felt">
              <span>Postnummer</span>
              <input type="text" name="postalCode" inputMode="numeric" pattern="[0-9]{4}" required placeholder="0000" />
            </label>
            <button type="submit" className="knapp knapp-primar medlem-knapp">
              Send
            </button>
          </form>
          {submitted ? <p className="medlem-kvittering">Takk. Vi har mottatt innmeldingen din.</p> : null}
        </article>
      </div>
    </section>
  );
}
