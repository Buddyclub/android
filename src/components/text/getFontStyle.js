export default ({bold, semiBold, monospace, medium, thin, italic, fonts}) => {
  const family = monospace ? 'monospace' : 'Lato';
  let weight;
  if (bold) {
    weight = fonts.black;
  } else if (semiBold) {
    weight = fonts.l_bold;
  } else if (medium) {
    weight = fonts.l_l;
  } else if (thin) {
    weight = fonts.l_thin;
  } else if (italic) {
    weight = fonts.l_bold_i;
  } else {
    weight = fonts.l_r;
  }

  const fontFamily = monospace ? family : weight;
  return {fontFamily, fontWeight: 'normal'};
};
