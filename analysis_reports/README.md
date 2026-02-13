# Analysis Reports

This directory contains pipeline analysis reports for the hackathon avatar application.

## Contents

- **template_reference/** — LaTeX template (NTNU-style) used as the basis for reports. Contains `main.tex`, `packages.sty`, `Sections/`, `Appendices/`, `Images/`, etc.
- **Pipeline analysis report** — Time, spending, and bottleneck analysis of the party avatar pipeline:
  - `main.tex` — Report main file
  - `title.tex`, `packages.sty`, `references.bib`
  - `Sections/` — Introduction, Pipeline overview, Time analysis, Spending analysis, Bottlenecks, Conclusion
  - `Appendices/` — Pipeline flow diagram and key files

## Building the report

From this directory:

```bash
pdflatex main.tex
biber main
pdflatex main.tex
pdflatex main.tex
```

Output: `main.pdf`.
