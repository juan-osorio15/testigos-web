/**
 * Aliados del encuentro, por peso (indicación de los organizadores,
 * 2026-09-08). Los logos van en crema monocromo sobre la tinta del pie:
 * PNG con transparencia generados desde los archivos originales que
 * enviaron (Duruelo desde su PDF vectorial; Conexión Zaquencipa desde
 * un JPEG con fondo café, por eso se ve algo más blando).
 */
import type { UiKey } from '../ui';
import logoConexion from '../assets/partners/conexion-zaquencipa.png';
import logoCasaMuseo from '../assets/partners/casa-museo.png';
import logoDuruelo from '../assets/partners/duruelo.png';
import logoBanrepTunja from '../assets/partners/banrep-tunja.png';

export interface Partner {
  name: string;
  logo: ImageMetadata;
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
    label: 'footer.supportedBy',
    size: 'lg',
    partners: [
      { name: 'Casa Museo Antonio Nariño', logo: logoCasaMuseo },
      { name: 'Hospedería y Centro de Convenciones Duruelo', logo: logoDuruelo },
    ],
  },
  {
    /* Apoyo menor: aquí se suman los comercios locales que apoyen */
    label: 'footer.supporters',
    size: 'sm',
    partners: [{ name: 'Centro Cultural Banco de la República, Tunja', logo: logoBanrepTunja }],
  },
];
