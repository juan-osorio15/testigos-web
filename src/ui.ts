/**
 * Diccionario de UI. Todo microcopy visible vive aquí — una sola fuente
 * para textos repetidos. Sitio solo en español (spec · Clarifications
 * 2026-08-25: el evento es íntegramente en español).
 */

const dict = {
  // --- Compra: textos del CTA (FR-010, ajuste 2026-09-09). Todos llevan a
  //     #boletas; el header y la franja del hero usan siempre 'cta.buy'. ---
  'cta.buy': 'Comprar boletas',
  'cta.beThere': 'Quiero estar ahí',
  'cta.secure': 'Asegurar mi boleta',
  'cta.live': 'Vivir Testigos de la Memoria',

  // --- Navegación ---
  /* Prueba 2026-09-09 (sugerencia externa): etiquetas en pregunta. Para
     volver: 'El encuentro', 'Panelistas', 'Agenda', 'Lugar', 'Preguntas'. */
  'nav.opportunity': '¿Qué voy a vivir?',
  'nav.speakers': '¿Quiénes estarán?',
  'nav.schedule': '¿Qué voy a escuchar?',
  'nav.venue': '¿Dónde?',
  'nav.faq': 'Preguntas',
  'nav.aria': 'Navegación principal',

  // --- Hero ---
  'hero.tagline': 'Periodistas en la Historia',
  'hero.dates': '5 al 8 de noviembre de 2026',
  'hero.place': 'Villa de Leyva, Colombia',
  /* Línea de datos bajo el remate: edición, formato y escasez, separados por "·" */
  'hero.tileCta': 'Ver ficha',
  'hero.pitch': 'Los reporteros que estuvieron ahí se sientan a contar lo que vieron. Y a responder preguntas.',
  'hero.edition': 'Primera edición',
  'hero.format': 'Charlas abiertas y conversatorios',
  'hero.capacity': 'Aforo limitado',
  /* Contador en vivo: unidad en singular y plural */
  'hero.unitDay': 'día',
  'hero.unitDays': 'días',
  'hero.unitHour': 'hora',
  'hero.unitHours': 'horas',
  'hero.unitMinute': 'minuto',
  'hero.unitMinutes': 'minutos',
  'hero.unitSecond': 'segundo',
  'hero.unitSeconds': 'segundos',
  'hero.countdownAria': 'Tiempo que falta para el encuentro',
  'hero.countdownToday': 'Hoy empieza el encuentro',
  'hero.countdownLive': 'El encuentro está en curso',

  // --- Sección de compra ---
  /* Junto a la tienda: explicar sin adornos las dos formas de comprar */
  'tickets.heading': 'Asegura tu lugar',
  'tickets.title': 'Hay dos formas de comprar.',
  'tickets.passName': 'Pase completo',
  'tickets.passText':
    'Una sola boleta para los siete conversatorios: viernes en la tarde, sábado todo el día y domingo en la mañana. Incluye la bienvenida y el cierre.',
  'tickets.slotName': 'Boleta por franja',
  'tickets.slotText':
    'Cada franja es media jornada con sus conversatorios. Escoge la época que quieres oír contada por quienes estaban ahí. Compras solo las que quieras.',
  /* Etapas de venta (2026-09-15): en la etapa 1 solo el pase completo.
     El widget muestra las franjas con "Aún no disponible"; las fechas las
     cuenta el bloque de etapas (SalesStages). */
  'tickets.slotSoon': 'Se venden desde la etapa 2: pide que te avisemos y te escribimos cuando abran.',
  /* Bloque de etapas: dos planos que se tocan, cielo el vigente y crema el
     que viene (fórmula visual §6: los datos van en franja) */
  'stages.heading': 'Calendario de venta',
  'stages.stage1': 'Etapa 1',
  'stages.stage2': 'Etapa 2',
  'stages.now': 'En curso',
  'stages.until': 'Hasta el',
  'stages.from': 'Desde el',
  'stages.stage1Product': 'Pase completo',
  'stages.stage2Product': 'Boletas por franja',
  'stages.stage1Note': 'Solo el pase, con los siete conversatorios.',
  'stages.stage2Note': 'Por franjas. El pase completo se retira.',
  'stages.daysLeft': 'Quedan {n} días para comprar el pase',
  'stages.lastDay': 'Último día para comprar el pase',
  'tickets.notify': 'Avísame cuando abra',
  /* Modal "avísame" de las franjas; la franja escogida va como eyebrow */
  'notify.title': 'Te avisamos cuando abra la etapa 2',
  'notify.intro':
    'Déjanos tus datos y te escribimos en cuanto las boletas por franja estén a la venta.',
  'notify.submit': 'Avisarme',
  'notify.success': 'Listo. Te escribiremos en cuanto abran las boletas por franja.',
  'notify.close': 'Cerrar',
  'tickets.soon':
    'La venta de boletas abre pronto. Aforo limitado. En la etapa 1, hasta el 4 de octubre, se vende solo el pase completo; las boletas por franja se abren en la etapa 2, desde el 5 de octubre. Las charlas abiertas del 5 y 6 de noviembre son de entrada libre.',
  'tickets.widgetFallback':
    'Si el módulo de compra no carga, puedes comprar directamente en la tienda segura de Pretix:',
  'tickets.widgetLink': 'Comprar en Pretix',
  'waitlist.name': 'Nombre',
  'waitlist.email': 'Correo electrónico',
  'waitlist.phone': 'Teléfono',
  'waitlist.submit': 'Avisarme cuando abra la venta',
  /* Casilla de autorización, corta como es habitual en sitios colombianos:
     quién, para qué, por qué canales (Ley 2300) y enlace a la política, que
     detalla datos, derechos y cómo revocar (Ley 1581 y Decreto 1377). */
  'waitlist.consent':
    'Soy mayor de edad y autorizo a Eventalist a tratar mis datos para enviarme información del encuentro y de otros eventos por correo electrónico y WhatsApp, según la',
  'waitlist.consentLink': 'política de tratamiento de datos',
  'waitlist.privacy': 'Los datos no se comparten ni se venden a terceros.',
  'waitlist.noscript': 'Para registrarte necesitas activar JavaScript en tu navegador.',
  'waitlist.sending': 'Enviando…',
  'waitlist.success': 'Listo. Te escribiremos en cuanto abra la venta.',
  'waitlist.error': 'No pudimos guardar tus datos. Inténtalo de nuevo más tarde.',
  'waitlist.errorNetwork': 'No pudimos guardar tus datos. Revisa tu conexión e inténtalo de nuevo.',
  'waitlist.errorTooMany': 'Demasiados intentos. Inténtalo de nuevo en un rato.',
  'waitlist.errorConsent': 'Necesitamos tu autorización para guardar tus datos.',
  'waitlist.fieldEmail': 'Correo electrónico',
  'waitlist.fieldPhone': 'Teléfono',
  'waitlist.fieldName': 'Nombre',
  'waitlist.fieldConsent': 'Autorización',

  // --- Agenda ---
  'schedule.free': 'Entrada libre',

  // --- Speakers ---
  'speakers.prev': 'Panelista anterior',
  'speakers.next': 'Panelista siguiente',
  'speakers.links': 'Redes y enlaces de',
  'speakers.more': 'Leer más',
  'speakers.less': 'Leer menos',

  // --- Enlaces de panelistas ---
  'links.x': 'X',
  'links.instagram': 'Instagram',
  'links.linkedin': 'LinkedIn',
  'links.facebook': 'Facebook',
  'links.web': 'Sitio web',
  'links.wikipedia': 'Wikipedia',

  // --- Venue ---
  'venue.directions': 'Cómo llegar',
  'venue.mapTitle': 'Mapa de Google de Villa de Leyva con la Hospedería Duruelo',

  // --- Footer ---
  'footer.organizedBy': 'Organizan',
  'footer.partners': 'Aliados',
  'footer.supportedBy': 'Con el apoyo de',
  'footer.rights': 'Testigos de la Memoria · Villa de Leyva, 2026',
  'footer.privacy': 'Tratamiento de datos personales',
  'footer.terms': 'Términos y condiciones',

  // --- Aviso de cookies y preferencias (dictamen legal 2026-09-15) ---
  /* Corto y sin énfasis, como es habitual: nombra al responsable, los
     proveedores y la finalidad, y enlaza la política (arts. 14 y 15 del
     Decreto 1377). El detalle vive en la sección 10 de la política. */
  'consent.text':
    'Eventalist usa cookies de analítica y publicidad (Google y Meta) para medir las visitas y la campaña de boletas. Al aceptar autorizas ese uso según la política de datos.',
  'consent.more': 'Política de datos',
  'consent.accept': 'Aceptar',
  'consent.modalEyebrow': 'Cookies',
  'consent.modalTitle': 'Usamos cookies para medir el sitio y la campaña',
  'consent.modalAccept': 'Aceptar y continuar',
  'consent.modalSkip': 'Seguir sin aceptar',
  'consent.close': 'Cerrar el aviso',
  'consent.prefsLink': 'Cookies y preferencias',
  'consent.prefsTitle': 'Cookies y preferencias',
  'consent.prefsAccepted': 'Aceptaste el uso de cookies de analítica y publicidad el {date}',
  'consent.prefsNone': 'No has aceptado el uso de cookies de analítica y publicidad en este navegador.',
  'consent.prefsId': 'Identificador de tu aceptación (para consultas o reclamos):',
  'consent.revoke': 'Retirar la aceptación',
  'consent.revoked': 'Listo. Las cookies de analítica y publicidad quedaron desactivadas en este navegador.',
  'consent.policy': 'Leer la política de tratamiento de datos',

  // --- Migas de pan y páginas interiores ---
  'crumb.home': 'Inicio',
  'crumb.speakers': 'Panelistas',
  'crumb.schedule': 'Programación',
  'crumb.talks': 'Charlas abiertas',
  'crumb.directions': 'Cómo llegar',
  'crumb.lodging': 'Dónde dormir',
  'crumb.aria': 'Ruta de navegación',

  // --- Fichas de panelistas ---
  'speaker.sessions': 'En el encuentro',
  'speaker.works': 'Obras y enlaces',
  'speaker.all': 'Todos los panelistas',
  'speaker.indexLead':
    'Los periodistas que cubrieron los últimos cincuenta años de Colombia, reunidos en Villa de Leyva del 5 al 8 de noviembre de 2026.',
  'speaker.readProfile': 'Ver ficha',

  // --- Programación ---
  'schedule.updated': 'Actualizado el',
  'schedule.paid': 'Con boleta',
  'schedule.full': 'Ver la programación completa',
  'schedule.freeCta': 'Quiero saber más',
  'schedule.venueMap': 'Ver en el mapa',
  'schedule.pricesHeading': 'Boletas',

  // --- Bloque de hechos del encuentro (texto plano en toda página interior) ---
  'facts.heading': 'El encuentro en pocas líneas',
  'facts.where': 'Villa de Leyva, Boyacá, Colombia',
  'facts.when': '5 al 8 de noviembre de 2026',
  'facts.talks': 'Charlas abiertas de entrada libre el jueves 5 y el viernes 6 en la mañana, en la Casa Museo Antonio Nariño.',
  'facts.panels': 'Conversatorios con boleta del viernes 6 en la tarde al domingo 8, en la Hospedería Duruelo.',
  'facts.onSale': 'A la venta',
  'facts.soon': 'Desde el',
  'facts.soldOut': 'Agotado',
  'facts.closed': 'Venta cerrada',
  'facts.buy': 'Comprar boletas',

  // --- Pie: enlaces a páginas interiores ---
  'footer.speakers': 'Panelistas',
  'footer.schedule': 'Programación',
  'footer.talks': 'Charlas abiertas',
  'footer.directions': 'Cómo llegar',

  // --- 404 ---
  'notfound.title': 'Página no encontrada',
  'notfound.body': 'La página que buscas no existe o cambió de lugar.',
  'notfound.back': 'Ir al inicio',
} as const satisfies Record<string, string>;

export type UiKey = keyof typeof dict;

export const ui = dict;

export function t(key: UiKey): string {
  return dict[key];
}
