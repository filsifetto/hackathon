import { programSections } from "../data/programSections";

export function ProgramPage() {
  return (
    <section className="seksjon">
      <div className="container">
        <p className="etikett">Partiprogram</p>
        <h1 className="seksjonstittel">Politikk for et tryggere og smartere Norge</h1>
        <p className="ingress smal">
          Programinnholdet er strukturert fra partiets kildedokumenter, med konkrete prioriteringer innen teknologi,
          velferd, utdanning og demokrati.
        </p>

        <div className="kort-rutenett to">
          {programSections.map((del, index) => (
            <article key={del.id} className={`panel program-kort inngang inngang-${(index % 3) + 1}`}>
              <p className="program-seksjon-tag">{del.id}</p>
              <h3>{del.overskrift}</h3>
              <p>{del.beskrivelse}</p>
              <ul>
                {del.punkter.map((punkt) => (
                  <li key={punkt}>{punkt}</li>
                ))}
              </ul>
              <p className="program-kilder">Kildegrunnlag: {del.kilder.join(" • ")}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
