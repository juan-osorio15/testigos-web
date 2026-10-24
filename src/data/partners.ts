/**
 * Aliados del encuentro, por peso (indicación de los organizadores,
 * 2026-09-08). Los logos van en crema monocromo sobre la tinta del pie:
 * PNG con transparencia generados desde los archivos originales que
 * enviaron (Duruelo desde su PDF vectorial; Conexión Zaquencipa desde
 * un JPEG con fondo café, por eso se ve algo más blando; Relato desde
 * su versión en blanco, teñida al crema del resto el 2026-09-17; Alma
 * Bazar desde su JPEG con fondo azul, quedándose solo con el sello
 * granate pasado a crema, el 2026-09-18; Hotel La Posada de San Antonio
 * desde su PDF en tinta sobre blanco (logo nuevo del 2026-10-05), con la
 * tinta como alfa; Cabañas Ojo de Agua desde su JPEG turquesa y gris
 * sobre blanco, con la distancia al blanco como alfa, el 2026-10-05; Casa
 * Boutique El Carmel desde su PNG blanco con transparencia, teñido al
 * crema, el 2026-10-05; el original mide 150 px y no hay uno mayor).
 * El 2026-10-15: El Carmel otra vez, desde su PDF nuevo (tinta café sobre
 * beige, con la tinta como alfa); El Ático y Casa Boutique igual, desde
 * tinta sobre blanco; Icono Editorial desde su PNG con círculo verde, solo
 * con las letras; Mesón de los Virreyes desde su bloque granate, que pasa
 * a crema con el dibujo calado; El Riachuelo desde su JPEG en colores, con
 * la maceta en crema y el letrero calado.
 * El 2026-10-24: Paella de Leyva desde su PNG blanco con transparencia,
 * teñido al crema y recortado.
 */
import type { UiKey } from '../ui';
import logoConexion from '../assets/partners/conexion-zaquencipa.png';
import logoCasaMuseo from '../assets/partners/casa-museo.png';
import logoDuruelo from '../assets/partners/duruelo.png';
import logoBanrepTunja from '../assets/partners/banrep-tunja.png';
import logoRelato from '../assets/partners/relato.png';
import logoAlmaBazar from '../assets/partners/alma-bazar.png';
import logoPosada from '../assets/partners/posada-san-antonio.png';
import logoOjoDeAgua from '../assets/partners/ojo-de-agua.png';
import logoElCarmel from '../assets/partners/el-carmel.png';
import logoIcono from '../assets/partners/icono-editorial.png';
import logoCasaBoutique from '../assets/partners/casa-boutique.png';
import logoMeson from '../assets/partners/meson-virreyes.png';
import logoAtico from '../assets/partners/el-atico.png';
import logoRiachuelo from '../assets/partners/el-riachuelo.png';
import logoPaella from '../assets/partners/paella-de-leyva.png';

export interface Partner {
  name: string;
  logo: ImageMetadata;
  /**
   * Sellos casi cuadrados (p. ej. Alma Bazar): a la altura fija del grupo
   * quedarían ilegibles al lado de los logotipos apaisados, así que el pie
   * les da algo más de alto.
   */
  shape?: 'square';
}

export interface PartnerGroup {
  /** Etiqueta del grupo (diccionario de UI) */
  label: UiKey;
  /** Peso visual: alto de los logos en el pie */
  size: 'lg' | 'md' | 'sm';
  partners: Partner[];
}

/** Organiza junto a las personas de `event.organizers` */
export const organizerPartners: Partner[] = [
  { name: 'Conexión Zaquencipa', logo: logoConexion },
];

export const partnerGroups: PartnerGroup[] = [
  {
    /* Las dos sedes: aliados principales, a tamaño grande */
    label: 'footer.partners',
    size: 'lg',
    partners: [
      { name: 'Casa Museo Antonio Nariño', logo: logoCasaMuseo },
      { name: 'Hospedería y Centro de Convenciones Duruelo', logo: logoDuruelo },
    ],
  },
  {
    /* Apoyo menor (decisión del 2026-09-18): aquí se suman los comercios
       y entidades locales que apoyen, a menor tamaño que las sedes. Orden
       del 2026-10-15: primero Relato, el Centro Cultural de Tunja, la
       Posada y El Carmel; luego los demás, de los más elegantes a los
       menos. */
    label: 'footer.supportedBy',
    size: 'sm',
    partners: [
      { name: 'Relato, Librería y Centro Cultural', logo: logoRelato },
      { name: 'Centro Cultural Banco de la República, Tunja', logo: logoBanrepTunja },
      { name: 'Hotel La Posada de San Antonio', logo: logoPosada, shape: 'square' },
      { name: 'Casa Boutique El Carmel', logo: logoElCarmel, shape: 'square' },
      { name: 'Icono Editorial', logo: logoIcono },
      { name: 'Casa Boutique Hotel', logo: logoCasaBoutique },
      { name: 'Hotel Mesón de los Virreyes', logo: logoMeson, shape: 'square' },
      { name: 'Alma Bazar', logo: logoAlmaBazar, shape: 'square' },
      /* Trazo fino y lema pequeño: al alto de los apaisados no se leía */
      { name: 'Cabañas Ojo de Agua', logo: logoOjoDeAgua, shape: 'square' },
      { name: 'El Ático', logo: logoAtico },
      { name: 'El Riachuelo Cocina', logo: logoRiachuelo, shape: 'square' },
      { name: 'Paella de Leyva', logo: logoPaella, shape: 'square' },
    ],
  },
];
