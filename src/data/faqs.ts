/**
 * FAQs (FR-007). Contenido mínimo: gratis vs. boleta, cómo llegar,
 * seguridad del pago (Wompi) y reembolsos. Sin precios ni tipos de
 * boleta, y sin mencionar infraestructura de boletería (decisión del
 * usuario 2026-09-02): la venta la procesa el widget (FR-008).
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: '¿Qué es gratis y qué requiere boleta?',
    answer:
      'Las charlas abiertas del jueves 5 y del viernes 6 en la mañana, en la Casa Museo Antonio Nariño, son de entrada libre. Los conversatorios, del viernes 6 en la tarde al domingo 8, en la Hospedería Duruelo, requieren boleta: habrá pase completo y boletas por franja, con aforo limitado.',
  },
  {
    question: '¿Es seguro pagar en esta página?',
    answer:
      'Sí. Los pagos se procesan a través de Wompi, la pasarela de pagos del Grupo Bancolombia, y recibimos todos los medios de pago.',
  },
  {
    question: '¿Cómo llego a Villa de Leyva?',
    answer:
      'Desde Bogotá son entre 3 y 4 horas por carretera, saliendo por la Autopista Norte hacia Tunja. También hay buses directos y frecuentes desde la Terminal Salitre. Desde Tunja, el trayecto toma unos 45 minutos.',
  },
  {
    question: '¿Dónde me hospedo?',
    answer:
      'Villa de Leyva tiene una oferta amplia de hoteles y hospederías a pocas cuadras de ambas sedes. El evento cae en fin de semana, así que conviene reservar con anticipación.',
  },
  {
    question: '¿Por qué debería ir si no soy periodista?',
    answer:
      'Porque esta no es una reunión para periodistas. Es una conversación para quienes quieren entender mejor la Colombia que hemos vivido y las historias que ayudaron a construir nuestra memoria colectiva.',
  },
  {
    question: '¿Las charlas abiertas del 5 y 6 de noviembre requieren inscripción?',
    answer:
      'La entrada es libre. Los detalles de cupos e inscripción se publicarán en esta página.',
  },
  {
    question: '¿Puedo pedir un reembolso o cambiar mi boleta?',
    answer:
      'Sí. Junto con tu boleta recibirás por correo las condiciones de cambio y reembolso y el canal para gestionarlos.',
  },
];
