/**
 * FAQs (FR-007). Contenido mínimo obligatorio: gratis vs. boleta,
 * cómo llegar, dudas de compra/reembolso → Pretix. Sin precios ni tipos
 * de boleta: eso es dominio exclusivo de Pretix (FR-008).
 */

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: '¿Qué es gratis y qué requiere boleta?',
    answer:
      'Los talleres de periodismo del jueves 5 de noviembre, en la Casa Museo Antonio Nariño, son de entrada libre. Los conversatorios del 6 al 8 de noviembre, en la Hospedería Duruelo, requieren boleta.',
  },
  {
    question: '¿Dónde compro las boletas?',
    answer:
      'En esta misma página, en la sección de boletas. La compra se procesa en Pretix, una plataforma segura de boletería; ahí verás las opciones disponibles.',
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
    question: '¿Necesito ser periodista para asistir?',
    answer:
      'No. El encuentro está pensado para cualquier persona interesada en la historia reciente de Colombia y en cómo se ha contado.',
  },
  {
    question: '¿Los talleres del 5 de noviembre requieren inscripción?',
    answer:
      'La entrada es libre. Los detalles de cupos e inscripción se anunciarán junto con la programación completa.',
  },
  {
    question: '¿Puedo pedir un reembolso o cambiar mi boleta?',
    answer:
      'Las compras se gestionan a través de Pretix: desde el enlace de confirmación de tu pedido puedes consultar las opciones de cambio o reembolso vigentes.',
  },
];
