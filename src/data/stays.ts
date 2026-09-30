/**
 * Dónde quedarse (sección "¿Dónde me quedo?", 2026-09-29): hoteles aliados
 * con una oferta solo para asistentes. Orden fijo: Duruelo primero
 * (indicación del usuario). Contacto por WhatsApp con mensaje prellenado,
 * llamada y, si hay, correo: cero fricción, un toque y ya está hablando
 * con la persona que arma la reserva.
 *
 * Fuentes: Duruelo, oferta y contacto de Jazmín Casallas dados por el
 * usuario el 2026-09-29. Posada de San Antonio, oferta del 10 % dada por el
 * usuario; número confirmado y correo de reservas del sitio oficial
 * (hotellaposadadesanantonio.com, 2026-09-29).
 *
 * Fotos de los sitios oficiales, descargadas el 2026-09-29 con permiso del
 * usuario (derechos reservados de cada hotel, usadas para promocionarlos):
 * Duruelo, suite Úbeda con vista al valle (duruelo.com.co, 1280 × 960,
 * recorte 3:2); Posada, patio colonial (hotellaposadadesanantonio.com,
 * 5504 × 3998, recorte 3:2 a 1920 px).
 */
import type { Lang } from '../i18n';
import photoDuruelo from '../assets/venues/duruelo-suite.jpg';
import photoPosada from '../assets/venues/posada-san-antonio.jpg';

export interface Stay {
  id: string;
  name: string;
  /** La oferta en una línea ("10 % de descuento"); misma forma en todos los hoteles */
  offer: string;
  /** Por qué este hotel, en dos frases */
  pitch: string;
  /** A quién se le escribe y su cargo; null si es la recepción */
  contact: { name: string; role: string } | null;
  /** Número en formato local para mostrar y para marcar (+57 delante) */
  phone: string;
  /** Mensaje con el que se abre WhatsApp */
  whatsappText: string;
  email?: string;
  address: string;
  mapsUrl: string;
  photo: ImageMetadata;
  photoAlt: string;
  en: Pick<Stay, 'offer' | 'pitch' | 'whatsappText' | 'photoAlt'> & {
    contact: Stay['contact'];
  };
}

export const stays: Stay[] = [
  {
    id: 'duruelo',
    name: 'Hospedería Duruelo',
    offer: 'Paquete especial con descuento',
    pitch:
      'Es la sede de los conversatorios: sales de tu habitación y llegas a la charla. Jazmín arma contigo el paquete para los días del encuentro.',
    contact: { name: 'Jazmín Casallas', role: 'Coordinadora comercial' },
    phone: '311 506 4410',
    whatsappText:
      'Hola, Jazmín. Voy a Testigos de la Memoria en Villa de Leyva (5 al 8 de noviembre) y quiero el paquete especial para asistentes.',
    address: 'Carrera 3 n.º 12-88, Villa de Leyva',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Hospeder%C3%ADa+Duruelo+Villa+de+Leyva',
    photo: photoDuruelo,
    photoAlt: 'Suite de la Hospedería Duruelo con la ventana abierta sobre el valle de Villa de Leyva',
    en: {
      offer: 'Special discounted package',
      pitch:
        'It is the venue for the panel conversations: walk out of your room and into the talk. Jazmín will put together a package for the days of the event.',
      contact: { name: 'Jazmín Casallas', role: 'Sales coordinator' },
      whatsappText:
        'Hi Jazmín, I am attending Testigos de la Memoria in Villa de Leyva (November 5–8) and would like the special package for attendees.',
      photoAlt: 'A suite at Hospedería Duruelo with its window open onto the Villa de Leyva valley',
    },
  },
  {
    id: 'posada-san-antonio',
    name: 'Hotel La Posada de San Antonio',
    offer: '10 % de descuento',
    pitch:
      'Tres casas coloniales restauradas en el centro histórico, a pocas cuadras de la Casa Museo. El desayuno va incluido y el hotel tiene además spa y restaurante.',
    contact: null,
    phone: '310 280 7326',
    whatsappText:
      'Hola. Voy a Testigos de la Memoria en Villa de Leyva (5 al 8 de noviembre) y quiero reservar con el 10 % de descuento para asistentes.',
    email: 'reservas@hotellaposadadesanantonio.com',
    address: 'Carrera 8 n.º 11-80, Villa de Leyva',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Hotel+La+Posada+de+San+Antonio+Villa+de+Leyva',
    photo: photoPosada,
    photoAlt: 'Patio colonial de La Posada de San Antonio, con balcones de madera, flores y una fuente de piedra',
    en: {
      offer: '10% off',
      pitch:
        'Three restored colonial houses in the historic center, a few blocks from Casa Museo. Breakfast is included, and the hotel also has a spa and a restaurant.',
      contact: null,
      whatsappText:
        'Hello. I am attending Testigos de la Memoria in Villa de Leyva (November 5–8) and would like to book with the 10% attendee discount.',
      photoAlt: 'Colonial courtyard at La Posada de San Antonio, with wooden balconies, flowers and a stone fountain',
    },
  },
];

export function staysFor(lang: Lang): Stay[] {
  if (lang === 'es') return stays;
  return stays.map((s) => ({ ...s, ...s.en }));
}

/** Enlace de WhatsApp con el mensaje prellenado */
export function whatsappUrl(stay: Pick<Stay, 'phone' | 'whatsappText'>): string {
  return `https://wa.me/57${stay.phone.replace(/\D/g, '')}?text=${encodeURIComponent(stay.whatsappText)}`;
}

export function telUrl(stay: Pick<Stay, 'phone'>): string {
  return `tel:+57${stay.phone.replace(/\D/g, '')}`;
}
