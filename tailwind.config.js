/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

/* ------------------------------------------------------------
 SAMMENDRAG – hva denne `tailwind.config.js` gjør
 ------------------------------------------------------------
 • Exporterer Tailwind-konfig som brukes når CSS bygges.
   Den styrer HVA som skannes for klassenavn, og HVORDAN tema/plugger utvides.

 • content: ["./src/**/ /*.{html,ts}"]
   - Angir hvilke filer Tailwind skal skanne for utility-klasser.
   - Viktig for tre-shaking: kun klasser som faktisk finnes i disse filene blir med i output.
   - Inkluderer *.html (templates) og *.ts (Angular inline-templates i komponenter).
   - Hvis du har klasser i andre steder (f.eks. *.md, *.json, libs), legg dem inn her.

 • theme: { extend: {} }
   - Stedet du utvider standardtemaet (farger, spacing, fontFamily, boxShadow, keyframes, osv.).
   - Eksempel:
       theme: {
         extend: {
           colors: { brand: '#34d399' },
           fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
           keyframes: { ... }, animation: { ... }
         }
       }

 • plugins: []
   - Liste over Tailwind-plugins du vil aktivere.
   - Vanlige valg: require('@tailwindcss/forms'), require('@tailwindcss/typography'),
     require('@tailwindcss/aspect-ratio'), osv.

 • Angular + Tailwind v4 merknad
   - I v4 er denne fila *valgfri*; mye kan konfigureres rett i CSS via `@theme`/`@layer`.
   - Har du denne fila, brukes den fortsatt og gir eksplisitt kontroll på skanning/tema/plugger.
   - Lager du dynamiske klassenavn i runtime (f.eks. `bg-${color}-500`), må du sørge for at
     de blir med i build (safeliste i config v3-stil, eller definer dem eksplisitt i CSS/@layer).

 • Kort sagt
   - `content` = hvor Tailwind leter etter klasser (for tre-shaking).
   - `theme.extend` = dine tilpasninger av design-tokens.
   - `plugins` = ekstra Tailwind-funksjonalitet.
   - Nyttig selv i v4 hvis du vil ha konfig i JS fremfor CSS.
 ------------------------------------------------------------ */
