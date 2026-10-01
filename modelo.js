// Modelo de cálculo de la Guía de Orientación Vocacional UNACAR (versión 3)
// Factores: 15. Carreras: 29, con pesos 0–3 por factor construidos con la USP.
(function (root) {
  const FACTORES = [
    { id: 1,  key: "cientifico",   label: "Científico-biológico",    short: "Científico", area: "C. Biologicas",   apt: "F", color: "#2f7d5b", desc: "Interés por los seres vivos, la naturaleza y el ambiente, y facilidad para observar, experimentar y explicar fenómenos naturales." },
    { id: 2,  key: "numerico",     label: "Numérico",                short: "Numérico",   area: "Calculo",         apt: "B", color: "#1f5f99", desc: "Comodidad con números, cálculos, fórmulas y análisis cuantitativo, incluidas las finanzas y la estadística." },
    { id: 3,  key: "fisico_mat",   label: "Físico-matemático y técnico", short: "Físico-mat.", area: "C. Fisicas", apt: "C", color: "#3c6e8f", desc: "Interés por la física, la química y la ingeniería, y facilidad para entender máquinas, estructuras y sistemas técnicos." },
    { id: 4,  key: "artistico",    label: "Artístico",               short: "Artístico",  area: "Artisticas",      apt: "D", color: "#c2553a", desc: "Sensibilidad estética y gusto por crear con imágenes, formas y colores: dibujo, diseño, fotografía o escena." },
    { id: 5,  key: "musical",      label: "Musical",                 short: "Musical",    area: "Musicales",       apt: "E", color: "#a14a7f", desc: "Sensibilidad por el ritmo, la melodía y el sonido, para escuchar, interpretar o producir música." },
    { id: 6,  key: "social",       label: "Social",                  short: "Social",     area: "Humanitarias",    apt: "G", color: "#5a8f3c", desc: "Interés por ayudar, enseñar y acompañar a otras personas, y facilidad para comprenderlas." },
    { id: 7,  key: "manual",       label: "Destreza manual",         short: "Manual",     area: null,              apt: "H", color: "#8a6a3b", desc: "Facilidad para usar herramientas y trabajar con las manos con precisión." },
    { id: 8,  key: "practico",     label: "Práctico",                short: "Práctico",   area: null,              apt: "I", color: "#6b7d2f", desc: "Facilidad para resolver situaciones concretas y tomar decisiones en el momento." },
    { id: 9,  key: "ejecutivo",    label: "Ejecutivo",               short: "Ejecutivo",  area: "Ejecutivas",      apt: "J", color: "#6d4fa0", desc: "Interés por dirigir, organizar y coordinar personas, proyectos y recursos." },
    { id: 10, key: "verbal",       label: "Verbal-literario",        short: "Verbal",     area: "Literarias",      apt: "A", color: "#9c4d3c", desc: "Gusto por leer, escribir, explicar e idiomas; facilidad para expresar ideas con palabras." },
    { id: 11, key: "oficina",      label: "Trabajo de oficina",      short: "Oficina",    area: null,              apt: "K", color: "#4f6f8a", desc: "Facilidad para el orden, los procedimientos, los registros y el manejo de información." },
    { id: 12, key: "negocios",     label: "Negocios",                short: "Negocios",   area: "Negocios",        apt: null, color: "#c98a1e", desc: "Interés por el comercio, las empresas, las ventas y el emprendimiento." },
    { id: 13, key: "persuasivo",   label: "Persuasivo",              short: "Persuasivo", area: "Persuasivas",     apt: "L", color: "#b03a5b", desc: "Gusto por argumentar, negociar y convencer, y facilidad para hablar en público." },
    { id: 14, key: "act_fisica",   label: "Actividad física",        short: "Act. física", area: "Actividad fisica", apt: "M", color: "#d0662a", desc: "Interés por el deporte, el movimiento y el cuerpo, y buen desempeño físico." },
    { id: 15, key: "tecnologico",  label: "Tecnológico-informático", short: "Tecnológico", area: "Tecnologicas",    apt: "N", color: "#2a7f9e", desc: "Interés por la programación, las computadoras y la tecnología digital, y facilidad para aprenderlas." }
  ];

  // Orden de pesos: [Científico, Numérico, Físico-mat, Artístico, Musical, Social, Manual, Práctico,
  //                  Ejecutivo, Verbal, Oficina, Negocios, Persuasivo, Act. física, Tecnológico]
  const CARRERAS = [
    { name: "Lic. en Derecho",                        fac: "Facultad de Derecho", w: [0,0,0,0,0,2,0,1,2,3,3,1,3,0,0] },
    { name: "Lic. en Criminología y Criminalística",   fac: "Facultad de Derecho", w: [3,1,1,0,0,2,2,2,1,2,2,0,1,0,0] },
    { name: "Lic. en Administración de Empresas",      fac: "Facultad de Ciencias Económicas Administrativas", w: [0,2,0,0,0,2,0,1,3,1,2,3,2,0,0] },
    { name: "Lic. en Contaduría",                      fac: "Facultad de Ciencias Económicas Administrativas", w: [0,3,0,0,0,1,0,1,1,0,3,2,0,0,0] },
    { name: "Lic. en Administración Turística",        fac: "Facultad de Ciencias Económicas Administrativas", w: [0,1,0,1,0,3,0,3,2,2,1,2,1,0,0] },
    { name: "Lic. en Mercadotecnia",                   fac: "Facultad de Ciencias Económicas Administrativas", w: [0,1,0,3,1,2,0,1,1,2,0,3,3,0,0] },
    { name: "Lic. en Negocios Internacionales",        fac: "Facultad de Ciencias Económicas Administrativas", w: [0,3,0,0,0,1,0,1,2,2,1,3,3,0,0] },
    { name: "Lic. en Educación",                       fac: "Facultad de Ciencias Educativas", w: [1,1,0,1,1,3,0,2,3,3,2,0,2,0,0] },
    { name: "Lic. en Lengua Inglesa",                  fac: "Facultad de Ciencias Educativas", w: [0,0,0,1,1,2,0,1,2,3,1,1,2,0,0], requisito: { item: "A6", min: 3, texto: "gusto y facilidad por aprender otro idioma" } },
    { name: "Lic. en Comunicación y Gestión Cultural", fac: "Facultad de Ciencias Educativas", w: [0,0,0,3,2,2,1,1,3,3,1,1,2,0,0] },
    { name: "Lic. en Ingeniería Química",              fac: "Facultad de Química", w: [2,3,3,0,0,0,1,1,1,0,1,0,0,0,0] },
    { name: "Lic. en Ingeniería Petrolera",            fac: "Facultad de Química", w: [1,3,3,0,0,1,1,2,2,0,1,1,0,1,0] },
    { name: "Lic. en Ingeniería Geológica",            fac: "Facultad de Química", w: [2,2,3,1,0,0,1,2,1,0,0,0,0,2,0] },
    { name: "Lic. en Ingeniería en Sistemas Computacionales", fac: "Facultad de Ciencias de la Información", w: [0,3,1,0,0,0,0,2,1,0,1,1,0,0,3] },
    { name: "Lic. en Ingeniería en Diseño Multimedia", fac: "Facultad de Ciencias de la Información", w: [0,2,2,3,1,1,1,1,1,1,0,1,1,0,3] },
    { name: "Lic. en Ingeniería en Tecnologías de Cómputo y Comunicaciones", fac: "Facultad de Ciencias de la Información", w: [0,2,3,0,0,0,2,2,1,0,0,0,0,0,3] },
    { name: "Lic. en Ingeniería Mecatrónica",          fac: "Facultad de Ingeniería", w: [0,2,3,0,0,0,3,2,1,0,0,0,0,0,3] },
    { name: "Lic. en Ingeniería Civil",                fac: "Facultad de Ingeniería", w: [0,3,3,1,0,1,1,2,2,0,1,1,0,1,1] },
    { name: "Lic. en Ingeniería Mecánica",             fac: "Facultad de Ingeniería", w: [0,2,3,0,0,0,3,2,1,0,0,0,0,0,1] },
    { name: "Lic. en Ingeniería Geofísica",            fac: "Facultad de Ingeniería", w: [2,3,3,0,0,0,1,1,1,0,0,0,0,1,2] },
    { name: "Lic. en Ingeniería en Energía",           fac: "Facultad de Ingeniería", w: [2,3,3,0,0,0,1,2,1,0,1,1,0,0,1] },
    { name: "Lic. en Arquitectura Sustentable",        fac: "Facultad de Ingeniería", w: [1,2,3,3,0,1,2,1,1,0,0,1,1,0,2] },
    { name: "Lic. en Educación Física y Deporte",      fac: "Facultad de Ciencias de la Salud", w: [2,0,1,0,1,2,2,2,3,0,0,0,1,3,0] },
    { name: "Lic. en Enfermería",                      fac: "Facultad de Ciencias de la Salud", w: [2,1,0,0,0,3,3,3,1,0,1,0,0,0,0] },
    { name: "Lic. en Nutrición",                       fac: "Facultad de Ciencias de la Salud", w: [3,2,0,0,0,2,0,1,1,1,1,1,1,1,0] },
    { name: "Lic. en Psicología",                      fac: "Facultad de Ciencias de la Salud", w: [2,1,0,1,0,3,0,1,2,3,2,0,2,0,0] },
    { name: "Lic. en Fisioterapia",                    fac: "Facultad de Ciencias de la Salud", w: [3,1,1,0,0,3,3,2,1,1,1,0,0,2,0] },
    { name: "Lic. en Medicina",                        fac: "Facultad de Ciencias de la Salud", w: [3,1,1,0,0,3,2,2,1,1,1,0,0,0,0] },
    { name: "Lic. en Biología Marina",                 fac: "Facultad de Ciencias Naturales y Exactas", w: [3,2,1,0,0,0,1,2,0,1,0,0,0,2,1] }
  ];

  // Indicador de perfil poco diferenciado (se recalibra con datos reales)
  const UMBRAL_R = 0.40, UMBRAL_RANGO = 0.20;

  // Carreras que el instrumento distingue poco entre sí: se presentan como familia
  const FAMILIAS = [
    ["Lic. en Ingeniería Química", "Lic. en Ingeniería Petrolera"],
    ["Lic. en Mercadotecnia", "Lic. en Negocios Internacionales"],
    ["Lic. en Ingeniería Civil", "Lic. en Ingeniería en Energía", "Lic. en Ingeniería Geofísica"]
  ];

  const MITAD = Math.ceil(FACTORES.length / 2); // un núcleo debe estar entre los 8 factores más altos del alumno

  function pearson(x, y) {
    const n = x.length, mx = x.reduce((a, b) => a + b) / n, my = y.reduce((a, b) => a + b) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { const dx = x[i] - mx, dy = y[i] - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy; }
    return sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
  }

  // intereses: {idReactivo: "a"|"b"}, aptitudes: {idReactivo: 1..4}
  function calcular(items, aptItems, intereses, aptitudes) {
    const areaCount = {}, areaMax = {};
    items.forEach(q => {
      q.options.forEach(o => { areaMax[o.area] = (areaMax[o.area] || 0) + 1; });
      const ch = q.options.find(o => o.key === intereses[q.id] || o.key === intereses[String(q.id)]);
      if (ch) areaCount[ch.area] = (areaCount[ch.area] || 0) + 1;
    });
    const secSum = {}, secN = {};
    aptItems.forEach(q => {
      const v = Number(aptitudes[q.id]);
      if (!v) return;
      secSum[q.section] = (secSum[q.section] || 0) + v; secN[q.section] = (secN[q.section] || 0) + 1;
    });

    const factores = FACTORES.map(f => {
      const fuentes = [];
      const interes = f.area ? (areaCount[f.area] || 0) / (areaMax[f.area] || 1) : null;
      const aptitud = f.apt && secN[f.apt] ? (secSum[f.apt] / secN[f.apt] - 1) / 3 : null;
      if (interes !== null) fuentes.push(interes);
      if (aptitud !== null) fuentes.push(aptitud);
      const score = fuentes.length ? fuentes.reduce((a, b) => a + b) / fuentes.length : 0;
      return { ...f, interes, aptitud, score, pct: Math.round(score * 100) };
    });

    // rango intraindividual
    factores.forEach(f => { f.rango = 1 + factores.filter(g => g.score > f.score).length; });
    const vec = factores.map(f => f.score);

    const carreras = CARRERAS.map(c => {
      const r = pearson(vec, c.w);
      const nucleos = c.w.map((p, i) => p === 3 ? factores[i] : null).filter(Boolean);
      const faltantes = nucleos.filter(f => f.rango > MITAD);
      let requisitoOk = true;
      if (c.requisito) requisitoOk = Number(aptitudes[c.requisito.item] || 0) >= c.requisito.min;
      const pasa = faltantes.length === 0 && requisitoOk;
      let nivel = "baja";
      if (pasa && r >= 0.5) nivel = "alta"; else if (pasa && r >= 0.40) nivel = "media";
      return { ...c, r, afinidad: Math.max(0, Math.round(r * 100)), nucleos, faltantes, requisitoOk, pasa, nivel,
        coincidencias: c.w.map((p, i) => p >= 2 && factores[i].rango <= MITAD ? factores[i] : null).filter(Boolean) };
    }).sort((a, b) => (b.pasa - a.pasa) || (b.r - a.r));

    const rangoPerfil = Math.max(...vec) - Math.min(...vec);
    const indiferenciado = carreras[0].r < UMBRAL_R || rangoPerfil < UMBRAL_RANGO;
    return { factores, carreras, indiferenciado, rangoPerfil };
  }

  const api = { FACTORES, CARRERAS, FAMILIAS, MITAD, UMBRAL_R, UMBRAL_RANGO, calcular, pearson };
  if (typeof module !== "undefined") module.exports = api; else root.ModeloVocacional = api;
})(this);
