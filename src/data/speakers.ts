/**
 * REGLA DURA (FR-005): este array SOLO admite panelistas confirmados
 * explícitamente por el usuario o por el archivo de programación vigente.
 * Grafía exacta. Nada de horarios aquí: eso vive en agenda.ts.
 *
 * Fuente de nombres: agenda parcial entregada el 2026-08-26.
 * Bios, credenciales, redes y fotos: investigación pública del 2026-09-03
 * (ver docs/panelistas.md, con fuentes, créditos de foto y pendientes).
 * Todo está sujeto a corrección por cada panelista.
 */

import type { Lang } from '../i18n';
import photoDanielSamperPizano from '../assets/speakers/daniel-samper-pizano.jpg';
import photoDarioRestrepo from '../assets/speakers/dario-restrepo.jpg';
import photoMarisolGomez from '../assets/speakers/marisol-gomez.jpg';
import photoLuzMariaSierra from '../assets/speakers/luz-maria-sierra.jpg';
import photoMarthaSoto from '../assets/speakers/martha-soto.jpg';
import photoCeciliaOrozco from '../assets/speakers/cecilia-orozco.jpg';
import photoMartaRuiz from '../assets/speakers/marta-ruiz.jpg';
import photoGuillermoGonzalez from '../assets/speakers/guillermo-gonzalez.jpg';
import photoYolandaRuiz from '../assets/speakers/yolanda-ruiz.jpg';
import photoMariaElviraSamper from '../assets/speakers/maria-elvira-samper.jpg';
import photoLeonValencia from '../assets/speakers/leon-valencia.jpg';
import photoAnaMariaEcheverri from '../assets/speakers/ana-maria-echeverri.jpg';

export type SpeakerLinkKey = 'x' | 'instagram' | 'linkedin' | 'facebook' | 'web' | 'wikipedia';

/** Solo cuentas verificadas como de la persona; URL completa. */
export type SpeakerLinks = Partial<Record<SpeakerLinkKey, string>>;

export interface Speaker {
  slug: string;
  name: string;
  credential: string;
  bio: string;
  /**
   * Credencial y bio para la portada en inglés (/en/). Solo texto; fotos,
   * redes y obras son los mismos. `speakersFor('en')` las sustituye.
   */
  en?: { credential: string; bio: string };
  /** import de astro:assets; null → placeholder de marca con el símbolo */
  photo: ImageMetadata | null;
  /**
   * Ajuste del tratamiento b/n con grano según el original:
   * 'soft' baja el contraste (fotos con blancos muy abiertos);
   * 'plain' no filtra el color ni el contraste (originales ya en b/n),
   * solo grano ligero.
   */
  photoTreatment?: 'soft' | 'plain';
  /**
   * Punto de la foto que debe quedar a la vista al recortarla (valor de
   * `object-position`); por defecto, el centro y algo arriba. Para
   * originales donde la cara no está centrada.
   */
  photoFocus?: string;
  links?: SpeakerLinks;
  /**
   * Obras y piezas destacadas para la ficha (feature 002); solo con fuente
   * verificada. Opcional: la ficha se publica con la bio aunque no haya.
   */
  works?: { title: string; year?: number; url?: string }[];
  /** Versión de la imagen de vista previa (public/og/panelistas/<slug>-v<n>.png); subir al regenerar */
  ogVersion?: number;
  confirmed: true;
}

export const speakers: Speaker[] = [
  /* Orden del carrusel: reconocimiento entre el público general, de mayor
     a menor (criterio editorial del 2026-09-09: presencia en radio,
     televisión y columnas de gran audiencia). No es jerarquía del evento. */
  {
    slug: 'daniel-samper-pizano',
    name: 'Daniel Samper Pizano',
    credential: 'Periodista y escritor · Los Danieles',
    bio: 'Columnista de Los Danieles, la plataforma que fundó en 2020 con Daniel Coronell y Daniel Samper Ospina. En 2026 publicó “Memorias cruzadas”, un diálogo con Enrique Santos Calderón sobre sesenta años de periodismo. Creó la Unidad Investigativa de El Tiempo, donde trabajó medio siglo, y fundó Cambio 16 Colombia. Premios Rey de España, Maria Moors Cabot y Simón Bolívar. Miembro de la Academia Colombiana de la Lengua.',
    en: {
      credential: 'Journalist and writer · Los Danieles',
      bio: 'Columnist at Los Danieles, the platform he founded in 2020 with Daniel Coronell and Daniel Samper Ospina. In 2026 he published “Memorias cruzadas”, a dialogue with Enrique Santos Calderón about sixty years of journalism. He created the investigative unit of El Tiempo, where he worked for half a century, and founded Cambio 16 Colombia. Winner of the King of Spain, Maria Moors Cabot and Simón Bolívar awards. Member of the Colombian Academy of Language.',
    },
    photo: photoDanielSamperPizano,
    links: {
      x: 'https://x.com/DanielSamperPi',
      web: 'https://cambiocolombia.com/los-danieles',
      wikipedia: 'https://es.wikipedia.org/wiki/Daniel_Samper_Pizano',
    },
    confirmed: true,
  },
  {
    slug: 'yolanda-ruiz',
    name: 'Yolanda Ruiz',
    credential: 'Periodista · Simón Bolívar a la Vida y Obra 2025',
    bio: 'Periodista y escritora. Columnista de El Espectador y El País América, corresponsable del Consultorio Ético de la Fundación Gabo y anfitriona del pódcast “El diván del periodismo”. Conduce con María Elvira Samper “Menopáusicas ¡y qué!”. Premio Simón Bolívar a la Vida y Obra 2025. Primera mujer en dirigir las noticias de Caracol Radio y RCN Radio. Autora de “En el filo de la navaja” y “Los que quedan”.',
    en: {
      credential: 'Journalist · 2025 Simón Bolívar Lifetime Achievement Award',
      bio: 'Journalist and writer. Columnist for El Espectador and El País América, co-lead of the Gabo Foundation\'s ethics desk and host of the podcast “El diván del periodismo”. She co-hosts “Menopáusicas ¡y qué!” with María Elvira Samper. 2025 Simón Bolívar Lifetime Achievement Award. The first woman to run the news desks of Caracol Radio and RCN Radio. Author of “En el filo de la navaja” and “Los que quedan”.',
    },
    photo: photoYolandaRuiz,
    photoTreatment: 'plain',
    links: {
      x: 'https://x.com/YolandaRuizCe',
      instagram: 'https://www.instagram.com/yolandaruizperiodista/',
      facebook: 'https://www.facebook.com/YolandaRuizPeriodista',
      wikipedia: 'https://es.wikipedia.org/wiki/Yolanda_Ruiz',
    },
    confirmed: true,
  },
  {
    slug: 'maria-elvira-samper',
    name: 'María Elvira Samper',
    credential: 'Periodista · exdirectora de Semana y Cambio',
    bio: 'Periodista y escritora. Conduce con Yolanda Ruiz el pódcast “Menopáusicas ¡y qué!”, origen del libro “Menopáusicas y más” (2026). Coautora de la serie documental “ELN: entre fusiles y diálogos”. Dirigió la revista Semana, codirigió el noticiero QAP y fue directora de la revista Cambio. Analista de RCN Radio hasta 2022. Premio Simón Bolívar a la Vida y Obra 2010. Autora de “1989” y “Extradición”.',
    en: {
      credential: 'Journalist · former editor of Semana and Cambio',
      bio: 'Journalist and writer. She co-hosts the podcast “Menopáusicas ¡y qué!” with Yolanda Ruiz, the origin of the book “Menopáusicas y más” (2026). Co-author of the documentary series “ELN: entre fusiles y diálogos”. She edited Semana magazine, co-directed the QAP newscast and was editor of Cambio magazine. Analyst at RCN Radio until 2022. 2010 Simón Bolívar Lifetime Achievement Award. Author of “1989” and “Extradición”.',
    },
    photo: photoMariaElviraSamper,
    links: {
      x: 'https://x.com/monasamper',
      wikipedia: 'https://es.wikipedia.org/wiki/Mar%C3%ADa_Elvira_Samper',
    },
    confirmed: true,
  },
  {
    slug: 'cecilia-orozco',
    name: 'Cecilia Orozco',
    credential: 'Columnista · El Espectador',
    bio: 'Columnista de El Espectador y conductora de “Parte y Contraparte”, el programa de debate de Señal Colombia estrenado en 2025. Dirigió Noticias Uno entre 2011 y 2024 y antes los noticieros CM&, Hora Cero y Noticiero de las 7. Fue defensora del lector de El Tiempo. En 2023 recibió el Gran Premio Simón Bolívar a la Vida y Obra de un Periodista.',
    en: {
      credential: 'Columnist · El Espectador',
      bio: 'Columnist for El Espectador and host of “Parte y Contraparte”, the debate program Señal Colombia launched in 2025. She directed Noticias Uno from 2011 to 2024 and, before that, the newscasts CM&, Hora Cero and Noticiero de las 7. She served as readers\' editor of El Tiempo. In 2023 she received the Simón Bolívar Grand Prize for a Journalist\'s Life and Work.',
    },
    photo: photoCeciliaOrozco,
    links: {
      x: 'https://x.com/CeciliaOrozcoT',
      web: 'https://www.elespectador.com/opinion/columnistas/cecilia-orozco-tascon/',
      wikipedia: 'https://es.wikipedia.org/wiki/Cecilia_Orozco_Tasc%C3%B3n',
    },
    confirmed: true,
  },
  {
    slug: 'leon-valencia',
    name: 'León Valencia',
    credential: 'Director · Fundación Paz y Reconciliación',
    bio: 'Dirige la Fundación Paz y Reconciliación, que fundó en 2013, y escribe columnas en Cambio y en el portal de la fundación. Integró el comando central del ELN en los años ochenta y encabezó la Corriente de Renovación Socialista, la disidencia que dejó las armas en 1994. Contó esa experiencia en “Mis años de guerra” y en “Adiós a la política, bienvenida la guerra”. Desde la Corporación Nuevo Arco Iris impulsó las investigaciones sobre la parapolítica. Premio Simón Bolívar de opinión en 2008.',
    en: {
      credential: 'Director · Fundación Paz y Reconciliación',
      bio: 'He leads the Fundación Paz y Reconciliación, which he founded in 2013, and writes columns for Cambio and the foundation\'s website. He sat on the central command of the ELN guerrilla in the 1980s and led the Corriente de Renovación Socialista, the faction that laid down its arms in 1994. He told that story in “Mis años de guerra” and “Adiós a la política, bienvenida la guerra”. From the Corporación Nuevo Arco Iris he drove the investigations into the parapolitics scandal. 2008 Simón Bolívar Award for opinion writing.',
    },
    photo: photoLeonValencia,
    /* Retrato nuevo del 2026-09-18 (3:2, cara a la derecha del centro);
       la vista previa se regeneró con él (v2) */
    photoFocus: '62% 30%',
    ogVersion: 2,
    links: {
      x: 'https://x.com/LeonVaLenciaA',
      web: 'https://www.pares.com.co/author/leonvalencia/',
      wikipedia: 'https://es.wikipedia.org/wiki/Le%C3%B3n_Valencia',
    },
    confirmed: true,
  },
  {
    slug: 'dario-restrepo',
    name: 'Darío Restrepo',
    credential: 'Periodista · codirector del encuentro',
    bio: 'Codirige Testigos de la Memoria junto a Fernando Cordovez. Dirigió durante veinte años el sistema informativo de Citytv y El Tiempo Televisión, donde creó el programa “Historias de la gente”. Antes fue editor general de Semana, primer director de Cambio 16 en Colombia, director de Inravisión y consejero de comunicaciones de la Presidencia. Premio Simón Bolívar a la Vida y Obra de un Periodista.',
    en: {
      credential: 'Journalist · co-director of the event',
      bio: 'He co-directs Testigos de la Memoria with Fernando Cordovez. For twenty years he ran the news operation of Citytv and El Tiempo Televisión, where he created the program “Historias de la gente”. Before that he was managing editor of Semana, the first editor of Cambio 16 in Colombia, director of Inravisión and communications adviser to the Presidency. Simón Bolívar Award for a Journalist\'s Life and Work.',
    },
    photo: photoDarioRestrepo,
    links: {
      wikipedia: 'https://es.wikipedia.org/wiki/Dar%C3%ADo_Restrepo_V%C3%A9lez',
    },
    confirmed: true,
  },
  {
    slug: 'luz-maria-sierra',
    name: 'Luz María Sierra',
    credential: 'Directora · El Colombiano',
    bio: 'Directora de El Colombiano desde 2021, donde lidera la transición digital del diario más antiguo de Antioquia. Forbes Colombia la ha incluido entre las 100 mujeres más poderosas del país en 2023, 2025 y 2026. Antes fue editora general de Semana, jefa de redacción de El Tiempo y panelista de Mañanas Blu. Ha ganado cuatro premios Simón Bolívar y el premio latinoamericano de investigación del Ipys.',
    en: {
      credential: 'Editor-in-chief · El Colombiano',
      bio: 'Editor-in-chief of El Colombiano since 2021, where she leads the digital transition of Antioquia\'s oldest newspaper. Forbes Colombia listed her among the country\'s 100 most powerful women in 2023, 2025 and 2026. She was previously managing editor of Semana, news editor of El Tiempo and a panelist on Mañanas Blu. She has won four Simón Bolívar awards and the IPYS Latin American investigative journalism prize.',
    },
    photo: photoLuzMariaSierra,
    links: {
      x: 'https://x.com/LuzMaSierra',
      linkedin: 'https://www.linkedin.com/in/luz-maria-sierra-4317a338/',
    },
    confirmed: true,
  },
  {
    slug: 'marta-ruiz',
    name: 'Marta Ruiz',
    credential: 'Periodista · excomisionada de la Verdad',
    bio: 'Columnista de la revista Cambio y de La Silla Vacía. Fue comisionada de la Comisión de la Verdad (2018-2022), donde lideró el relato histórico del conflicto en el Informe Final. Cubrió la guerra y la paz durante más de veinte años, sobre todo en Semana, y dirigió VerdadAbierta.com. Premios Rey de España, Simón Bolívar y SIP. Autora de “Hechos para contar”.',
    en: {
      credential: 'Journalist · former Truth Commission member',
      bio: 'Columnist for Cambio magazine and La Silla Vacía. She served on Colombia\'s Truth Commission (2018-2022), where she led the historical account of the conflict in its Final Report. She covered war and peace for more than twenty years, mostly at Semana, and directed VerdadAbierta.com. Winner of the King of Spain, Simón Bolívar and IAPA awards. Author of “Hechos para contar”.',
    },
    photo: photoMartaRuiz,
    links: {
      x: 'https://x.com/martaruiz66',
      web: 'https://cambiocolombia.com/autor/marta-ruiz',
    },
    confirmed: true,
  },
  {
    slug: 'marisol-gomez',
    name: 'Marisol Gómez',
    credential: 'Columnista · Cambio',
    bio: 'Columnista de la revista Cambio y autora de “Una periodista en las entrañas de la política” (2024), balance de su paso por el Concejo de Bogotá. Durante 25 años fue periodista y editora de paz de El Tiempo, donde cubrió el conflicto armado y las negociaciones con las Farc, del Caguán a La Habana. Escribió “La historia secreta del proceso de paz” y “Desterrados”. Premio Simón Bolívar.',
    en: {
      credential: 'Columnist · Cambio',
      bio: 'Columnist for Cambio magazine and author of “Una periodista en las entrañas de la política” (2024), an account of her time on the Bogotá City Council. For 25 years she was a reporter and peace editor at El Tiempo, where she covered the armed conflict and the negotiations with the FARC, from Caguán to Havana. She wrote “La historia secreta del proceso de paz” and “Desterrados”. Simón Bolívar Award.',
    },
    photo: photoMarisolGomez,
    photoTreatment: 'soft',
    links: {
      x: 'https://x.com/Marisol_GomezG',
      linkedin: 'https://www.linkedin.com/in/marisol-g%C3%B3mez-giraldo-0a944b49/',
      facebook: 'https://www.facebook.com/MarisolGomezGi/',
      web: 'https://cambiocolombia.com/columnista/marisol-gomez',
    },
    confirmed: true,
  },
  {
    slug: 'martha-soto',
    name: 'Martha Soto',
    credential: 'Editora de la Unidad Investigativa · El Tiempo',
    bio: 'Editora de la Unidad Investigativa de El Tiempo desde 1998, donde ha destapado escándalos de narcotráfico, paramilitarismo y corrupción durante más de tres décadas. Autora de siete libros, entre ellos “El abogado de la mafia”, “Narcojet” y “Velásquez, el retador del poder”. Ha recibido más de treinta premios, incluidos el Simón Bolívar, el CPB y el Global Shining Light. Magíster en Estudios Políticos de la Javeriana.',
    en: {
      credential: 'Investigative unit editor · El Tiempo',
      bio: 'Editor of El Tiempo\'s investigative unit since 1998, where she has exposed drug-trafficking, paramilitary and corruption scandals for more than three decades. Author of seven books, including “El abogado de la mafia”, “Narcojet” and “Velásquez, el retador del poder”. She has received more than thirty awards, including the Simón Bolívar, the CPB and the Global Shining Light. Master\'s in Political Studies from Universidad Javeriana.',
    },
    photo: photoMarthaSoto,
    links: {
      web: 'https://www.eltiempo.com/autor/martha-soto',
    },
    confirmed: true,
  },
  {
    slug: 'guillermo-gonzalez',
    /* Nombre con los dos apellidos y bio corregida por los organizadores el 2026-09-15 */
    name: 'Guillermo González Uribe',
    credential: 'Fundador de Número · columnista de El Espectador',
    bio: 'Cubrió derechos humanos y cultura en El Espectador en los años ochenta y fue editor de su Magazín Dominical. Dirigió las revistas Gaceta y Número. Autor de “A pesar de la noche”, “Los niños de la guerra”, “Los niños de la guerra quince años después” y, con Margarita Carrillo, de “Foto Sady, recuerdos de la realidad”. Premio Planeta de Periodismo y Premio Media de LASA (Latin American Studies Association). Coautor, con Margarita Carrillo, del documental “Sady González, una luz en la memoria”, premio estímulo del Fondo de Desarrollo Cinematográfico. Escribe columna en El Espectador y colabora con diversos medios.',
    en: {
      credential: 'Founder of Número · columnist for El Espectador',
      bio: 'He covered human rights and culture for El Espectador in the 1980s and edited its Magazín Dominical. He directed the magazines Gaceta and Número. Author of “A pesar de la noche”, “Los niños de la guerra”, “Los niños de la guerra quince años después” and, with Margarita Carrillo, “Foto Sady, recuerdos de la realidad”. Planeta Journalism Award and LASA (Latin American Studies Association) Media Award. Co-author, with Margarita Carrillo, of the documentary “Sady González, una luz en la memoria”, winner of a Colombian Film Development Fund grant. He writes a column for El Espectador and contributes to several outlets.',
    },
    photo: photoGuillermoGonzalez,
    links: {
      x: 'https://x.com/guillogonzale12',
      linkedin: 'https://www.linkedin.com/in/guillermo-gonz%C3%A1lez-uribe-b2775034/',
      web: 'https://elaladearriba.wordpress.com/',
    },
    confirmed: true,
  },
  {
    /* Añadida el 2026-09-15 por los organizadores para "Surgimiento de las
       guerrillas". Investigación en docs/investigacion-ana-maria-echeverri.md.
       Última del carrusel: sin columna, radio ni televisión hoy. */
    slug: 'ana-maria-echeverri',
    name: 'Ana María Echeverri',
    credential: 'Periodista y documentalista · autora de “Yo soy yo”',
    bio: 'Periodista, cronista y documentalista. Autora de “Yo soy yo” (2024), la historia de Martín Castillo, un hombre trans, contada tras siete años de conversaciones en Villa de Leyva. Empezó como reportera gráfica de la revista Guion y fue cronista de El Tiempo, Cromos y el Magazín Dominical de El Espectador. Dirigió documentales y programas de opinión para Audiovisuales, Telepacífico y Caracol Televisión. Premios Ondas, India Catalina y Simón Bolívar.',
    en: {
      credential: 'Journalist and documentary filmmaker · author of “Yo soy yo”',
      bio: 'Journalist, feature writer and documentary filmmaker. Author of “Yo soy yo” (2024), the story of Martín Castillo, a trans man, told after seven years of conversations in Villa de Leyva. She started as a photojournalist at Guion magazine and wrote features for El Tiempo, Cromos and El Espectador\'s Magazín Dominical. She directed documentaries and opinion programs for Audiovisuales, Telepacífico and Caracol Televisión. Winner of the Ondas, India Catalina and Simón Bolívar awards.',
    },
    photo: photoAnaMariaEcheverri,
    photoTreatment: 'plain',
    links: {
      web: 'https://www.planetadelibros.com/autor/ana-maria-echeverri/000061446',
    },
    confirmed: true,
  },
];

/** Panelistas con los textos del idioma pedido; en español, el array tal cual */
export function speakersFor(lang: Lang): Speaker[] {
  if (lang === 'es') return speakers;
  return speakers.map((s) => {
    if (!s.en) throw new Error(`Speaker sin textos en inglés: ${s.slug}`);
    return { ...s, credential: s.en.credential, bio: s.en.bio };
  });
}

export function speakerBySlug(slug: string): Speaker {
  const s = speakers.find((s) => s.slug === slug);
  if (!s) throw new Error(`Speaker desconocido: ${slug}`);
  return s;
}
