/** Config Tailwind — serve solo se aggiungi classi nuove nell'HTML.
 *  Rigenera il CSS con:  npx tailwindcss@3 -i css/tailwind.input.css -o css/tailwind.css --minify
 */
module.exports = {
  content: ['./*.html', './js/main.js'],
  theme: { extend: { colors: { ink: '#252935', acid: '#8FFF00' } } }
};
