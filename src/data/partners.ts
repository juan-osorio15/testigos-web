/**
 * Aliados del encuentro, por peso (indicación de los organizadores,
 * 2026-09-08). Los logos van en crema monocromo sobre la tinta del pie:
 * PNG con transparencia generados desde los archivos originales que
 * enviaron (Duruelo desde su PDF vectorial; Conexión Zaquencipa desde
 * un JPEG con fondo café, por eso se ve algo más blando; Relato desde
 * su versión en blanco, teñida al crema del resto el 2026-09-17; Alma
 * Bazar desde su JPEG con fondo azul, quedándose solo con el sello
 * granate pasado a crema, el 2026-09-18).
 */
import type { UiKey } from '../ui';
import logoConexion from '../assets/partners/conexion-zaquencipa.png';
import logoCasaMuseo from '../assets/partners/casa-museo.png';
import logoDuruelo from '../assets/partners/duruelo.png';
import logoBanrepTunja from '../assets/partners/banrep-tunja.png';
import logoRelato from '../assets/partners/relato.png';
import logoAlmaBazar from '../assets/partners/alma-bazar.png';

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
       y entidades locales que apoyen, a menor tamaño que las sedes */
    label: 'footer.supportedBy',
    size: 'sm',
    partners: [
      { name: 'Relato, Librería y Centro Cultural', logo: logoRelato },
      { name: 'Centro Cultural Banco de la República, Tunja', logo: logoBanrepTunja },
      { name: 'Alma Bazar', logo: logoAlmaBazar, shape: 'square' },
    ],
  },
];
