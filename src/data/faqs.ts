/**
 * FAQs (FR-007). Contenido mínimo: gratis vs. boleta, cómo llegar,
 * seguridad del pago (Wompi). Sin precios ni tipos de
 * boleta, y sin mencionar infraestructura de boletería (decisión del
 * usuario 2026-09-02): la venta la procesa el widget (FR-008).
 */

import type { Lang } from '../i18n';

export interface Faq {
  question: string;
  answer: string;
  /** Versión para la portada en inglés (/en/); `faqsFor('en')` la sustituye */
  en?: { question: string; answer: string };
}

export const faqs: Faq[] = [
  {
    question: '¿Qué es gratis y qué requiere boleta?',
    answer:
      'Las charlas abiertas del jueves 5 y del viernes 6 en la mañana, en la Casa Museo Antonio Nariño, son de entrada libre. Los conversatorios, del viernes 6 en la tarde al domingo 8, en la Hospedería Duruelo, requieren boleta: habrá pase completo y boletas por franja, con aforo limitado.',
    en: {
      question: 'What is free and what requires a ticket?',
      answer:
        'The open talks on Thursday, November 5 and Friday morning, November 6, at Casa Museo Antonio Nariño, are free to attend. The panel conversations, from Friday afternoon, November 6, through Sunday, November 8, at Hospedería Duruelo, require a ticket: there will be a full pass and half-day tickets, with limited seating.',
    },
  },
  {
    question: '¿Es seguro pagar en esta página?',
    answer:
      'Sí. Los pagos se procesan a través de Wompi, la pasarela de pagos del Grupo Bancolombia, y recibimos todos los medios de pago.',
    en: {
      question: 'Is it safe to pay on this site?',
      answer:
        'Yes. Payments are processed through Wompi, the payment gateway of Grupo Bancolombia, and we accept all payment methods.',
    },
  },
  {
    question: '¿Cómo llego a Villa de Leyva?',
    answer:
      'Desde Bogotá son entre 3 y 4 horas por carretera, saliendo por la Autopista Norte hacia Tunja. También hay buses directos y frecuentes desde la Terminal Salitre. Desde Tunja, el trayecto toma unos 45 minutos.',
    en: {
      question: 'How do I get to Villa de Leyva?',
      answer:
        'From Bogotá it is a 3 to 4 hour drive, leaving via the Autopista Norte toward Tunja. There are also frequent direct buses from the Salitre bus terminal. From Tunja, the trip takes about 45 minutes.',
    },
  },
  {
    question: '¿Dónde me hospedo?',
    answer:
      'Villa de Leyva tiene una oferta amplia de hoteles y hospederías a pocas cuadras de ambas sedes. El evento cae en fin de semana, así que conviene reservar con anticipación.',
    en: {
      question: 'Where do I stay?',
      answer:
        'Villa de Leyva has a wide range of hotels and guesthouses a few blocks from both venues. The event falls on a weekend, so it\'s best to book in advance.',
    },
  },
  {
    question: '¿Por qué debería ir si no soy periodista?',
    answer:
      'Porque esta no es una reunión para periodistas. Es una conversación para quienes quieren entender mejor la Colombia que hemos vivido y las historias que ayudaron a construir nuestra memoria colectiva.',
    en: {
      question: 'Why should I go if I\'m not a journalist?',
      answer:
        'Because this is not a gathering for journalists. It\'s a conversation for anyone who wants a better understanding of the Colombia we have lived through and the stories that helped build our collective memory.',
    },
  },
  {
    question: '¿Las charlas abiertas del 5 y 6 de noviembre requieren inscripción?',
    answer:
      'La entrada es libre. Los detalles de cupos e inscripción se publicarán en esta página.',
    en: {
      question: 'Do the open talks on November 5 and 6 require registration?',
      answer:
        'Admission is free. Details on capacity and registration will be published on this page.',
    },
  },
];

/** FAQs en el idioma pedido; en español, el array tal cual */
export function faqsFor(lang: Lang): Faq[] {
  if (lang === 'es') return faqs;
  return faqs.map((f) => {
    if (!f.en) throw new Error(`faqs: pregunta sin versión en inglés: "${f.question}"`);
    return { ...f, question: f.en.question, answer: f.en.answer };
  });
}
