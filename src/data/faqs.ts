import type { LocalizedString } from '../i18n/ui';

/**
 * FAQs (FR-007). Contenido mínimo obligatorio: gratis vs. boleta,
 * cómo llegar, dudas de compra/reembolso → Pretix. Sin precios ni tipos
 * de boleta: eso es dominio exclusivo de Pretix (FR-008).
 */

export interface Faq {
  question: LocalizedString;
  answer: LocalizedString;
}

export const faqs: Faq[] = [
  {
    question: {
      es: '¿Qué es gratis y qué requiere boleta?',
      en: 'What is free and what requires a ticket?',
    },
    answer: {
      es: 'Los talleres de periodismo del jueves 5 de noviembre, en la Casa Museo Antonio Nariño, son de entrada libre. Los conversatorios del 6 al 8 de noviembre, en la Hospedería Duruelo, requieren boleta.',
      en: 'The journalism workshops on Thursday, November 5 at Casa Museo Antonio Nariño are free to attend. The conversations from November 6–8 at Hospedería Duruelo require a ticket.',
    },
  },
  {
    question: {
      es: '¿Dónde compro las boletas?',
      en: 'Where do I buy tickets?',
    },
    answer: {
      es: 'En esta misma página, en la sección de boletas. La compra se procesa en Pretix, una plataforma segura de boletería; ahí verás las opciones disponibles.',
      en: 'Right here on this page, in the tickets section. Checkout is processed by Pretix, a secure ticketing platform, where you will see the available options.',
    },
  },
  {
    question: {
      es: '¿Cómo llego a Villa de Leyva?',
      en: 'How do I get to Villa de Leyva?',
    },
    answer: {
      es: 'Desde Bogotá son entre 3 y 4 horas por carretera, saliendo por la Autopista Norte hacia Tunja. También hay buses directos y frecuentes desde la Terminal Salitre. Desde Tunja, el trayecto toma unos 45 minutos.',
      en: 'From Bogotá it takes 3 to 4 hours by road, leaving via the Autopista Norte toward Tunja. There are also frequent direct buses from the Salitre terminal. From Tunja, the trip takes about 45 minutes.',
    },
  },
  {
    question: {
      es: '¿Dónde me hospedo?',
      en: 'Where should I stay?',
    },
    answer: {
      es: 'Villa de Leyva tiene una oferta amplia de hoteles y hospederías a pocas cuadras de ambas sedes. El evento cae en fin de semana, así que conviene reservar con anticipación.',
      en: 'Villa de Leyva has a wide range of hotels and inns within a few blocks of both venues. The event falls on a weekend, so booking early is a good idea.',
    },
  },
  {
    question: {
      es: '¿Necesito ser periodista para asistir?',
      en: 'Do I need to be a journalist to attend?',
    },
    answer: {
      es: 'No. El encuentro está pensado para cualquier persona interesada en la historia reciente de Colombia y en cómo se ha contado.',
      en: "No. The gathering is for anyone interested in Colombia's recent history and how it has been told.",
    },
  },
  {
    question: {
      es: '¿Los talleres del 5 de noviembre requieren inscripción?',
      en: 'Do the November 5 workshops require registration?',
    },
    answer: {
      es: 'La entrada es libre. Los detalles de cupos e inscripción se anunciarán junto con la programación completa.',
      en: 'Entry is free. Details on capacity and registration will be announced along with the full program.',
    },
  },
  {
    question: {
      es: '¿Puedo pedir un reembolso o cambiar mi boleta?',
      en: 'Can I get a refund or change my ticket?',
    },
    answer: {
      es: 'Las compras se gestionan a través de Pretix: desde el enlace de confirmación de tu pedido puedes consultar las opciones de cambio o reembolso vigentes.',
      en: 'Purchases are managed through Pretix: from your order confirmation link you can review the current change and refund options.',
    },
  },
];
