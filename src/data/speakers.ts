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

import photoDanielSamperPizano from '../assets/speakers/daniel-samper-pizano.jpg';
import photoDarioRestrepo from '../assets/speakers/dario-restrepo.jpg';
import photoJorgeCardona from '../assets/speakers/jorge-cardona.jpg';
import photoMarisolGomez from '../assets/speakers/marisol-gomez.jpg';
import photoLuzMariaSierra from '../assets/speakers/luz-maria-sierra.jpg';
import photoCeciliaOrozco from '../assets/speakers/cecilia-orozco.jpg';
import photoMartaRuiz from '../assets/speakers/marta-ruiz.jpg';
import photoGuillermoGonzalez from '../assets/speakers/guillermo-gonzalez.jpg';
import photoYolandaRuiz from '../assets/speakers/yolanda-ruiz.jpg';
import photoMariaElviraSamper from '../assets/speakers/maria-elvira-samper.jpg';

export type SpeakerLinkKey = 'x' | 'instagram' | 'linkedin' | 'facebook' | 'web' | 'wikipedia';

/** Solo cuentas verificadas como de la persona; URL completa. */
export type SpeakerLinks = Partial<Record<SpeakerLinkKey, string>>;

export interface Speaker {
  slug: string;
  name: string;
  credential: string;
  bio: string;
  /** import de astro:assets; null → placeholder de marca con el símbolo */
  photo: ImageMetadata | null;
  /**
   * Ajuste del tratamiento b/n con grano según el original:
   * 'soft' baja el contraste (fotos con blancos muy abiertos);
   * 'plain' no filtra el color ni el contraste (originales ya en b/n),
   * solo grano ligero.
   */
  photoTreatment?: 'soft' | 'plain';
  links?: SpeakerLinks;
  confirmed: true;
}

export const speakers: Speaker[] = [
  {
    slug: 'daniel-samper-pizano',
    name: 'Daniel Samper Pizano',
    credential: 'Periodista y escritor · Los Danieles',
    bio: 'Columnista de Los Danieles, la plataforma que fundó en 2020 con Daniel Coronell y Daniel Samper Ospina. En 2026 publicó “Memorias cruzadas”, un diálogo con Enrique Santos Calderón sobre sesenta años de periodismo. Creó la Unidad Investigativa de El Tiempo, donde trabajó medio siglo, y dirigió Cambio 16. Premios Rey de España, Maria Moors Cabot y Simón Bolívar. Miembro de la Academia Colombiana de la Lengua.',
    photo: photoDanielSamperPizano,
    links: {
      x: 'https://x.com/DanielSamperPi',
      web: 'https://cambiocolombia.com/los-danieles',
      wikipedia: 'https://es.wikipedia.org/wiki/Daniel_Samper_Pizano',
    },
    confirmed: true,
  },
  {
    slug: 'dario-restrepo',
    name: 'Darío Restrepo',
    credential: 'Periodista · codirector del encuentro',
    bio: 'Codirige Testigos de la Memoria junto a Fernando Cordovez. Dirigió durante veinte años el sistema informativo de Citytv y El Tiempo Televisión, donde creó el programa “Historias de la gente”. Antes fue editor general de Semana, primer director de Cambio 16 en Colombia, director de Inravisión y consejero de comunicaciones de la Presidencia. Premio Simón Bolívar a la Vida y Obra de un Periodista.',
    photo: photoDarioRestrepo,
    links: {
      wikipedia: 'https://es.wikipedia.org/wiki/Dar%C3%ADo_Restrepo_V%C3%A9lez',
    },
    confirmed: true,
  },
  {
    slug: 'jorge-cardona',
    name: 'Jorge Cardona',
    credential: 'Exeditor general · El Espectador',
    bio: 'Escritor, periodista y columnista de El Espectador, diario del que fue editor general entre 2005 y 2021. Acaba de publicar “Rastros de una pasión” (2026) y “Sin medias tintas” (2025), tres siglos de Colombia contados desde El Espectador. Premio Simón Bolívar a la Vida y Obra de un Periodista (2020). Autor de “Días de memoria” y “Diario del conflicto”. Filósofo y profesor universitario.',
    photo: photoJorgeCardona,
    links: {
      web: 'https://www.elespectador.com/opinion/columnistas/jorge-cardona/',
    },
    confirmed: true,
  },
  {
    slug: 'marisol-gomez',
    name: 'Marisol Gómez',
    credential: 'Columnista · Cambio',
    bio: 'Columnista de la revista Cambio y autora de “Una periodista en las entrañas de la política” (2024), balance de su paso por el Concejo de Bogotá. Durante 25 años fue periodista y editora de paz de El Tiempo, donde cubrió el conflicto armado y las negociaciones con las Farc, del Caguán a La Habana. Escribió “La historia secreta del proceso de paz” y “Desterrados”. Premio Simón Bolívar.',
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
    slug: 'luz-maria-sierra',
    name: 'Luz María Sierra',
    credential: 'Directora · El Colombiano',
    bio: 'Directora de El Colombiano desde 2021, donde lidera la transición digital del diario más antiguo de Antioquia. Forbes Colombia la ha incluido entre las 100 mujeres más poderosas del país en 2023, 2025 y 2026. Antes fue editora general de Semana, jefa de redacción de El Tiempo y panelista de Mañanas Blu. Ha ganado cuatro premios Simón Bolívar y el premio latinoamericano de investigación del Ipys.',
    photo: photoLuzMariaSierra,
    links: {
      x: 'https://x.com/LuzMaSierra',
      linkedin: 'https://www.linkedin.com/in/luz-maria-sierra-4317a338/',
    },
    confirmed: true,
  },
  {
    slug: 'cecilia-orozco',
    name: 'Cecilia Orozco',
    credential: 'Columnista · El Espectador',
    bio: 'Columnista de El Espectador y conductora de “Parte y Contraparte”, el programa de debate de Señal Colombia estrenado en 2025. Dirigió Noticias Uno entre 2011 y 2024 y antes los noticieros CM&, Hora Cero y Noticiero de las 7. Fue defensora del lector de El Tiempo. En 2023 recibió el Gran Premio Simón Bolívar a la Vida y Obra de un Periodista.',
    photo: photoCeciliaOrozco,
    links: {
      x: 'https://x.com/CeciliaOrozcoT',
      web: 'https://www.elespectador.com/opinion/columnistas/cecilia-orozco-tascon/',
      wikipedia: 'https://es.wikipedia.org/wiki/Cecilia_Orozco_Tasc%C3%B3n',
    },
    confirmed: true,
  },
  {
    slug: 'marta-ruiz',
    name: 'Marta Ruiz',
    credential: 'Periodista · excomisionada de la Verdad',
    bio: 'Columnista de la revista Cambio y de La Silla Vacía. Fue comisionada de la Comisión de la Verdad (2018-2022), donde lideró el relato histórico del conflicto en el Informe Final. Cubrió la guerra y la paz durante más de veinte años, sobre todo en Semana, y dirigió VerdadAbierta.com. Premios Rey de España, Simón Bolívar y SIP. Autora de “Hechos para contar”.',
    photo: photoMartaRuiz,
    links: {
      x: 'https://x.com/martaruiz66',
      web: 'https://cambiocolombia.com/autor/marta-ruiz',
    },
    confirmed: true,
  },
  {
    slug: 'guillermo-gonzalez',
    name: 'Guillermo González',
    credential: 'Fundador de Número · columnista de El Espectador',
    bio: 'Periodista, editor y escritor. Columnista de El Espectador y director de El Ala de Arriba. Fundó y dirigió durante 18 años la revista Número (1993-2011). Antes dirigió Gaceta de Colcultura y el Magazín Dominical de El Espectador, donde empezó como reportero en 1977. Premio Planeta de Periodismo 2002 por “Los niños de la guerra”. Autor de “A pesar de la noche” y “Foto Sady, recuerdos de la realidad”.',
    photo: photoGuillermoGonzalez,
    links: {
      x: 'https://x.com/guillogonzale12',
      linkedin: 'https://www.linkedin.com/in/guillermo-gonz%C3%A1lez-uribe-b2775034/',
      web: 'https://elaladearriba.wordpress.com/',
    },
    confirmed: true,
  },
  {
    slug: 'yolanda-ruiz',
    name: 'Yolanda Ruiz',
    credential: 'Periodista · Simón Bolívar a la Vida y Obra 2025',
    bio: 'Periodista y escritora. Columnista de El Espectador y El País América, corresponsable del Consultorio Ético de la Fundación Gabo y anfitriona del pódcast “El diván del periodismo”. Conduce con María Elvira Samper “Menopáusicas ¡y qué!”. Premio Simón Bolívar a la Vida y Obra 2025. Primera mujer en dirigir las noticias de Caracol Radio y RCN Radio. Autora de “En el filo de la navaja” y “Los que quedan”.',
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
    photo: photoMariaElviraSamper,
    links: {
      x: 'https://x.com/monasamper',
      wikipedia: 'https://es.wikipedia.org/wiki/Mar%C3%ADa_Elvira_Samper',
    },
    confirmed: true,
  },
];

export function speakerBySlug(slug: string): Speaker {
  const s = speakers.find((s) => s.slug === slug);
  if (!s) throw new Error(`Speaker desconocido: ${slug}`);
  return s;
}
