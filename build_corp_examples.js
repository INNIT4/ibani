const fs = require('fs');

// Map plan -> pages with their sections
const planExamples = {
  bronce: {
    title: 'Firma Legal Pequeña',
    subtitle: 'Imaginemos que eres un despacho jurídico.',
    pages: [
      { num: 1, name: 'Inicio', icon: '🏛️', sections: ['Hero con eslogan institucional y foto del despacho', 'Áreas de práctica resumidas (3 íconos)', 'Por qué elegirnos (diferenciadores)', 'Caso de éxito destacado', 'Llamada a la acción principal (cotización)', 'Banner de confianza (años de experiencia, casos ganados)', 'Mapa & datos de contacto'] },
      { num: 2, name: 'Nosotros', icon: '👔', sections: ['Historia y misión del bufete', 'Equipo de abogados (fotos + especialidades)', 'Valores y filosofía legal', 'Galería de oficinas e instalaciones', 'Premios y reconocimientos', 'Timeline de fundación y crecimiento', 'Video institucional', 'Invitación a trabajar con nosotros'] },
      { num: 3, name: 'Litigio Penal', icon: '⚖️', sections: ['Qué es y cuándo lo necesitas', 'Nuestro proceso de defensa', 'Casos en los que hemos ganado', 'Preguntas frecuentes del área', 'Perfil del abogado especialista', 'Formulario de consulta urgente', 'Garantías y tiempos de respuesta', 'WhatsApp directo al área'] },
      { num: 4, name: 'Divorcios', icon: '📋', sections: ['Tipos de divorcio que manejamos', 'Proceso paso a paso', 'Costos orientativos', 'Faq divorcio express', 'Testimonios de clientes', 'Calculadora orientativa de plazos', 'Video explicativo del proceso', 'Formulario confidencial'] },
      { num: 5, name: 'Corporativo', icon: '🏢', sections: ['Servicios empresariales disponibles', 'Sectores que atendemos', 'Clientes y empresas que representamos', 'Marco contractual y confidencialidad', 'Casos de éxito empresarial', 'Nuestro equipo corporativo', 'Proceso de onboarding', 'Contacto empresarial directo'] },
      { num: 6, name: 'Portafolio / Casos', icon: '📁', sections: ['Filtro de casos por área de práctica', 'Galería de casos ganados', 'Extractos de resoluciones (sin datos personales)', 'Métricas de éxito del despacho', 'Testimonios en video de clientes', 'Estadísticas y logros anuales', 'Publicaciones en medios de comunicación', 'Invitación a agendar consulta'] },
      { num: 7, name: 'Contacto', icon: '📞', sections: ['Formulario de consulta inicial', 'Teléfonos por área de práctica', 'Mapa de ubicación interactivo', 'Horarios de atención', 'Respuesta garantizada en X horas', 'WhatsApp directo', 'Redes sociales del despacho', 'Newsletter jurídico'] },
    ]
  },
  silver: {
    title: 'Empresa Constructora Regional',
    subtitle: 'Imaginemos que diriges una constructora en expansión.',
    pages: [
      { num: 1, name: 'Inicio', icon: '🏗️', sections: ['Hero con render de obra emblemática', 'Contador de proyectos entregados', 'Tipos de obra que ejecutamos', 'Proyectos destacados (3 cards)', 'Por qué elegirnos vs. la competencia', 'Clientes y alianzas estratégicas', 'Testimonio de cliente empresa', 'Solicitar presupuesto'] },
      { num: 2, name: 'Nosotros', icon: '👷', sections: ['Historia desde la fundación', 'Equipo directivo y técnico', 'Misión, visión y valores', 'Certificaciones y licencias', 'Galería de instalaciones y equipo', 'Alianzas con proveedores', 'Responsabilidad social', 'Blog de novedades'] },
      { num: 3, name: 'Asfalto y Pavimentación', icon: '🛣️', sections: ['¿Qué incluye el servicio?', 'Proceso de ejecución', 'Tipos de asfalto que trabajamos', 'Proyectos viales terminados', 'Maquinaria especializada', 'Normativas que cumplimos', 'Presupuesto en línea', 'Contacto directo al área'] },
      { num: 4, name: 'Obra Civil y Edificación', icon: '🏠', sections: ['Alcance del servicio', 'Tipos de construcción (residencial, comercial)', 'Proceso desde proyecto hasta entrega', 'Galería de obras terminadas', 'Materiales y estándares usados', 'Tiempos de entrega estimados', 'Casos de edificios destacados', 'CTA cotizar'] },
      { num: 5, name: 'Remodelaciones', icon: '🔨', sections: ['Servicios de remodelación disponibles', 'Antes y después (galería)', 'Proceso ágil de remodelación', 'Presupuesto gratuito en 48h', 'Sectores que atendemos', 'Materiales y acabados premium', 'Testimonios de clientes satisfechos', 'Formulario de solicitud'] },
      { num: 6, name: 'Maquinaria y Equipos', icon: '🚜', sections: ['Catálogo de maquinaria disponible', 'Renta por día / semana / mes', 'Operadores certificados incluidos', 'Ficha técnica de cada equipo', 'Galería fotográfica del parque', 'Mantenimiento preventivo', 'Zonas de cobertura', 'Contacto de renta inmediata'] },
      { num: 7, name: 'Proyectos Ejecutados', icon: '📐', sections: ['Filtro por tipo de obra', 'Galería de proyectos', 'Ficha técnica de cada proyecto', 'Cliente y año de entrega', 'Metros cuadrados construidos', 'Video tour de obra terminada', 'Premios y reconocimientos', 'Solicitar proyecto similar'] },
      { num: 8, name: 'Bolsa de Trabajo', icon: '💼', sections: ['Vacantes disponibles por área', 'Perfil y requisitos de cada puesto', 'Formulario de postulación', 'Beneficios de trabajar con nosotros', 'Carta de presentación adjunta', 'Proceso de selección', 'Contacto de Recursos Humanos', 'Política de igualdad laboral'] },
      { num: 9, name: 'Blog de Noticias', icon: '📰', sections: ['Artículos más recientes', 'Categorías (obra vial, edificación, etc.)', 'Buscador interno', 'Artículo destacado de portada', 'Autor del artículo', 'Fecha y tiempo de lectura', 'Sección de comentarios', 'Newsletter de novedades'] },
      { num: 10, name: 'Contacto y Cotización', icon: '📞', sections: ['Formulario de solicitud de obra', 'Datos de contacto por departamento', 'Mapa interactivo de ubicación', 'Horarios de oficina', 'WhatsApp empresarial', 'Redes sociales corporativas', 'Botón de llamada directa', 'Correos por área (obras@, renta@, etc.)'] },
    ]
  },
  gold: {
    title: 'Sistema Universitario Privado',
    subtitle: 'Imaginemos que gestionas una institución educativa en crecimiento.',
    pages: [
      { num: 1, name: 'Campus Principal', icon: '🎓', sections: ['Hero con foto del campus y CTA de admisiones', 'Cifras de orgullo (alumnos, años, egresados exitosos)', 'Oferta académica resumida (4 categorías)', 'Eventos próximos del campus', 'Mensaje del rector', 'Rankings y acreditaciones', 'Vida universitaria en imágenes', 'Agendar visita guiada'] },
      { num: 2, name: 'Licenciaturas', icon: '📚', sections: ['Listado de carreras disponibles', 'Filtro por área del conocimiento', 'Card de cada carrera (descripción + duración)', 'Campo laboral de cada carrera', 'Perfil del egresado', 'Mapa curricular resumido', 'Testimonios de alumnos', 'Proceso de admisión'] },
      { num: 3, name: 'Maestrías y Posgrados', icon: '🎖️', sections: ['Listado de programas de posgrado', 'Requisitos de ingreso', 'Modalidades (presencial, en línea)', 'Cuerpo docente del posgrado', 'Convenios con universidades extranjeras', 'Financiamiento y becas', 'Formulario de informes', 'FAQ de posgrados'] },
      { num: 4, name: 'Cursos y Diplomados', icon: '📝', sections: ['Catálogo de cursos por área', 'Calendario de inicio', 'Modalidad y duración', 'Inversión y formas de pago', 'Constancia y certificación', 'Instructores del curso', 'Testimonios de participantes', 'Pre-registro en línea'] },
      { num: 5, name: 'Becas y Financiamiento', icon: '💰', sections: ['Tipos de becas disponibles', 'Requisitos por tipo de beca', 'Proceso de solicitud paso a paso', 'Fechas límite de aplicación', 'Convenios con CONACYT / SEP', 'Crédito educativo con banco', 'Testimonios de becarios', 'Formulario de solicitud de beca'] },
      { num: 6, name: 'Admisiones', icon: '📋', sections: ['Proceso de admisión paso a paso', 'Documentación requerida', 'Examen de admisión (fechas y temas)', 'Guía de estudio gratuita', 'Calculadora de promedio de ingreso', 'Preguntas frecuentes', 'Chat de orientación en vivo', 'Formulario de preinscripción'] },
      { num: 7, name: 'Vida Universitaria', icon: '🎉', sections: ['Actividades extracurriculares', 'Deportes y ligas internas', 'Clubs estudiantiles', 'Galería de eventos del año', 'Vinculación y servicio social', 'Centro de prácticas profesionales', 'Red de egresados', 'Bienestar estudiantil'] },
      { num: 8, name: 'Cuerpo Docente', icon: '👨‍🏫', sections: ['Directorio de profesores por área', 'Perfil completo de cada docente', 'Publicaciones académicas', 'Proyectos de investigación activos', 'Premios y reconocimientos', 'Agenda de conferencias', 'Perfiles en ResearchGate / LinkedIn', 'Unirse como docente'] },
      { num: 9, name: 'Blog Universitario', icon: '✍️', sections: ['Artículos por área académica', 'Noticias del campus', 'Entrevistas a egresados destacados', 'Investigaciones publicadas', 'Convocatorias y oportunidades', 'Eventos internacionales', 'Buscador de artículos', 'Suscripción al newsletter'] },
      { num: 10, name: 'Investigación y Proyectos', icon: '🔬', sections: ['Líneas de investigación activas', 'Proyectos financiados', 'Convenios con empresas', 'Publicaciones científicas', 'Laboratorios y centros de investigación', 'Convocatorias abiertas', 'Resultados de investigaciones recientes', 'Postular a investigación'] },
      { num: 11, name: 'Egresados y Bolsa de Trabajo', icon: '🤝', sections: ['Red de egresados', 'Vacantes disponibles para egresados', 'Empresas aliadas', 'Caso de éxito de exalumno', 'Actualizar perfil profesional', 'Eventos de networking', 'Directorio de egresados por generación', 'Registrar empresa'] },
      { num: 12, name: 'Noticias y Press', icon: '📰', sections: ['Comunicados de prensa recientes', 'Menciones en medios de comunicación', 'Logros del campus', 'Agenda de actividades', 'Convocatorias abiertas', 'Descargas de logos y brand kit', 'Contacto de relaciones públicas', 'Suscripción a boletín'] },
      { num: 13, name: 'Contacto General', icon: '📞', sections: ['Formulario de contacto por área', 'Directorio de departamentos', 'Mapa del campus con accesos', 'Horarios de cada departamento', 'Transporte y cómo llegar', 'WhatsApp de informes', 'Redes sociales institucionales', 'Correos por departamento'] },
      { num: 14, name: 'Preguntas Frecuentes (FAQ)', icon: '❓', sections: ['FAQ de Admisiones', 'FAQ de Becas', 'FAQ de Titulación', 'FAQ de Servicios Escolares', 'FAQ de Vida Universitaria', 'Buscador interno de preguntas', 'Si no encuentras tu respuesta (formulario)', 'Chat en línea'] },
      { num: 15, name: 'Aviso de Privacidad / Legal', icon: '🔒', sections: ['Política de privacidad de datos', 'Uso de cookies y tecnologías', 'Política de reembolso y cancelaciones', 'Términos de uso de plataformas digitales', 'Derechos ARCO', 'Responsable del tratamiento de datos', 'Formulario de ejercicio de derechos', 'Actualización y vigencia del aviso'] },
    ]
  },
  platino: {
    title: 'Red Nacional de Logística y Aduanas',
    subtitle: 'Imaginemos que administras una red logística con operaciones en varios estados.',
    pages: [
      { num: 1, name: 'Inicio Corporativo', icon: '🌐', sections: ['Hero con mapa de cobertura nacional', 'Indicadores (toneladas movidas, años, estados)', 'Divisiones de la empresa (5 íconos)', 'Clientes corporativos (logos)', 'Informe de sostenibilidad', 'Alianzas estratégicas internacionales', 'Noticias recientes', 'Contacto corporativo VIP'] },
      { num: 2, name: 'Importación', icon: '📦', sections: ['¿Qué importamos?', 'Proceso de importación', 'Documentación requerida', 'Tiempos y costos promedio', 'Regímenes aduanales que manejamos', 'Partners en origen internacional', 'HSCodes frecuentes', 'Cotización en línea'] },
      { num: 3, name: 'Exportación', icon: '✈️', sections: ['Mercados destino que atendemos', 'Proceso de exportación paso a paso', 'Certificaciones fitosanitarias', 'Empaque y embalaje certificado', 'Regulaciones por país destino', 'Tratados comerciales que aprovechamos', 'Casos de éxito de exportación', 'Iniciar proceso'] },
      { num: 4, name: 'Seguros y Fianzas Aduanales', icon: '🛡️', sections: ['Tipos de seguros que ofrecemos', 'Cobertura de riesgos logísticos', 'Proceso de reclamación', 'Calculadora de prima orientativa', 'Partners aseguradores internacionales', 'Marco legal y normativo', 'Preguntas frecuentes de seguros', 'Solicitar póliza'] },
      { num: 5, name: 'Cadena de Frío', icon: '❄️', sections: ['¿Qué es la cadena de frío?', 'Productos que manejamos (alimentos, medicamentos)', 'Temperatura y controles disponibles', 'Flota especializada', 'Certificaciones HACCP / FDA', 'Trazabilidad en tiempo real', 'Mapa de instalaciones frigoríficas', 'Solicitar servicio'] },
      { num: 6, name: 'Rastreo Satelital', icon: '🛰️', sections: ['Plataforma de tracking en vivo', 'Cómo acceder a tu cuenta de rastreo', 'Alertas de desvío o incidente', 'Reporte histórico de rutas', 'Integración con ERP del cliente', 'App móvil de rastreo', 'Soporte técnico 24/7', 'Demo de la plataforma'] },
      { num: 7, name: 'Almacenaje y Distribución', icon: '🏭', sections: ['Metros cuadrados de bodegas', 'Tipos de almacenaje disponible', 'Sistemas WMS de inventario', 'Distribución de última milla', 'Zonas primarias y secundarias', 'Seguridad y vigilancia 24h', 'Dirección de cada bodega', 'Solicitar visita a instalaciones'] },
      { num: 8, name: 'Nosotros', icon: '👥', sections: ['Historia y fundación', 'Equipo directivo', 'Red de colaboradores', 'Presencia nacional (estados)', 'Certificaciones y premios', 'Filosofía empresarial', 'Responsabilidad social logística', 'Únete al equipo'] },
      { num: 9, name: 'Clientes y Casos de Éxito', icon: '🏆', sections: ['Sectores que servimos', 'Clientes por logo', 'Estudios de caso detallados', 'Testimonios en video', 'Métricas de eficiencia', 'NPS y satisfacción del cliente', 'Referencias disponibles', 'Convertirte en cliente'] },
      { num: 10, name: 'Blog y Tendencias Logísticas', icon: '📝', sections: ['Artículos sobre comercio exterior', 'Actualización de aranceles', 'Tendencias en supply chain', 'Guías de importación por producto', 'Calendario de eventos del sector', 'Entrevistas a especialistas', 'Glosario aduanal', 'Suscribirse al newsletter'] },
      { num: 11, name: 'Recursos y Descargas', icon: '📥', sections: ['Formatos aduanales descargables', 'Guías de armonización', 'Tarifario actualizado', 'Fichas de clientes para registro', 'Marco normativo vigente', 'Calculadoras de impuestos', 'Presentaciones de servicios', 'Registro para acceso a recursos'] },
      { num: 12, name: 'Bolsa de Trabajo', icon: '💼', sections: ['Vacantes abiertas por región', 'Perfiles requeridos', 'Formulario de postulación', 'Beneficios laborales', 'Plan de carrera', 'Proceso de selección', 'Política de diversidad', 'Convenios con universidades'] },
      { num: 13, name: 'Prensa y Media', icon: '📺', sections: ['Comunicados recientes', 'Apariciones en medios', 'Galería de eventos corporativos', 'Descargas de brand kit', 'Contacto de comunicación', 'Sala de prensa virtual', 'Timeline de hitos corporativos', 'Informe anual descargable'] },
      { num: 14, name: 'Intranet y Portal de Clientes', icon: '🔐', sections: ['Login de colaboradores', 'Login de clientes (tracking + docs)', 'Noticias internas', 'Manuales operativos', 'Indicadores KPI del cliente', 'Solicitudes en línea', 'Mesa de ayuda', 'Chat interno'] },
      { num: 15, name: 'Sucursales y Cobertura', icon: '📍', sections: ['Mapa interactivo de sucursales', 'Ficha de cada sucursal (horario, contacto)', 'Zonas de cobertura por estado', 'Puntos de inspección aduanal', 'Teléfonos locales', 'Cómo llegar (Google Maps embed)', 'WhatsApp por región', 'Formulario de contacto local'] },
      { num: 16, name: 'FAQ y Soporte', icon: '❓', sections: ['Preguntas de importación', 'Preguntas de exportación', 'Preguntas de cadena de frío', 'Preguntas de rastreo', 'Chat en línea 24/7', 'Base de conocimiento', 'Ticket de soporte', 'Número de emergencias logísticas'] },
      { num: 17, name: 'Normatividad y Cumplimiento', icon: '⚖️', sections: ['Marco legal aduanal vigente', 'Actualizaciones arancelarias', 'NOM aplicables', 'Política anticorrupción', 'Código de conducta', 'Auditorías y certificaciones', 'Agente aduanal responsable', 'Contacto de cumplimiento'] },
      { num: 18, name: 'Alianzas Internacionales', icon: '🌍', sections: ['Partners en USA, Europa, Asia', 'Agentes en destino', 'Convenios de servicio compartido', 'Países donde operamos', 'Ventajas de nuestra red global', 'Relocation y logística VIP', 'Envíos puerta a puerta globales', 'Contactar área internacional'] },
      { num: 19, name: 'Sustentabilidad Corporativa', icon: '🌱', sections: ['Política de sostenibilidad', 'Flota verde y huella de carbono', 'Metas ambientales 2025-2030', 'Programas de reciclaje en bodegas', 'Certificación ESG', 'Reporte de impacto ambiental', 'Alianzas con organizaciones eco', 'Sello de empresa responsable'] },
      { num: 20, name: 'Contacto Corporativo', icon: '📞', sections: ['Formulario VIP de cotización', 'Directorio de ejecutivos de cuenta', 'WhatsApp empresarial por división', 'Mapa de oficinas centrales', 'Horarios de atención comercial', 'Correos institucionales por área', 'Línea directa de emergencias', 'Solicitar reunión ejecutiva'] },
    ]
  },
  diamante: {
    title: 'Casa Financiera y Crediticia',
    subtitle: 'Imaginemos que operas una institución financiera con múltiples productos.',
    pages: [
      { num: 1, name: 'Portada Institucional', icon: '🏦', sections: ['Hero con propuesta de valor financiera', 'Productos más solicitados (4 tarjetas)', 'Indicadores (créditos otorgados, clientes, años)', 'Calculadora rápida de crédito', 'Testimonios de clientes', 'Alianzas bancarias y regulatorias', 'Blog financiero', 'Cotizar sin costo'] },
      { num: 2, name: 'Crédito Personal', icon: '💳', sections: ['Monto y plazos disponibles', 'Tabla de amortización interactiva', 'Requisitos mínimos', 'Proceso de solicitud en línea', 'CAT y tasa de interés', 'Preguntas frecuentes', 'Testimonios de clientes del producto', 'Solicitar ahora'] },
      { num: 3, name: 'Crédito Nómina', icon: '💼', sections: ['¿Cómo funciona el descuento vía nómina?', 'Empresas convenio disponibles', 'Montos máximos por salario', 'Beneficios vs. crédito personal', 'Proceso exprés de aprobación', 'Tasa preferencial para empleados públicos', 'Calculadora de descuento mensual', 'Afiliación de empresa al convenio'] },
      { num: 4, name: 'Crédito Refaccionario', icon: '🔧', sections: ['¿Para qué sirve?', 'Sectores que lo utilizan', 'Garantías requeridas', 'Tasas y plazos disponibles', 'Proceso de valuación de garantías', 'Casos de éxito empresarial', 'Tabla comparativa de plazos', 'Solicitar crédito refaccionario'] },
      { num: 5, name: 'Crédito Hipotecario', icon: '🏠', sections: ['Tipos de crédito hipotecario', 'Requisitos de propiedad', 'Enganche y mensualidades', 'Tabla interactiva de amortización', 'Proceso de avalúo incluido', 'FAQ hipotecas', 'Calculadora de capacidad de pago', 'Iniciar expediente hipotecario'] },
      { num: 6, name: 'Tarjetas Empresariales', icon: '💰', sections: ['Líneas de crédito disponibles', 'Beneficios y cashback', 'Control de gastos por empleado', 'Límites y sublímites por usuario', 'Integración contable', 'Seguro de viaje incluido', 'Proceso de activación', 'Solicitar tarjeta empresa'] },
      { num: 7, name: 'Seguros Financieros', icon: '🛡️', sections: ['Seguro de vida ligado a crédito', 'Seguro de desempleo', 'Seguro de daños para garantías', 'Coberturas disponibles', 'Proceso de reclamación', 'Calculadora de prima mensual', 'FAQ de seguros', 'Contratar cobertura'] },
      { num: 8, name: 'Sucursales por Ciudad', icon: '📍', sections: ['Mapa nacional de sucursales', 'Ficha de cada sucursal (horario, parqueo)', 'Contacto local de cada sucursal', 'Ejecutivo de cuenta asignado', 'Cita previa en sucursal', 'Servicios disponibles en sucursal', 'Accesibilidad y discapacidad', 'Localizar cajero aliado cercano'] },
      { num: 9, name: 'Área Empresarial', icon: '🏢', sections: ['Productos exclusivos para empresas', 'Factoraje y descuento de facturas', 'Arrendamiento financiero', 'Línea de crédito revolvente', 'Proceso de análisis crediticio B2B', 'Ejecutivo empresarial dedicado', 'Términos y garantías corporativas', 'Reunión de diagnóstico financiero'] },
      { num: 10, name: 'Relación con Inversores', icon: '📊', sections: ['Información financiera pública', 'Resultados trimestrales', 'Calificación crediticia y rating', 'Junta de accionistas', 'Política de dividendos', 'Memoria anual descargable', 'Contacto de relaciones con inversores', 'Formulario de consulta institucional'] },
      { num: 11, name: 'Educación Financiera', icon: '📚', sections: ['Blog de finanzas personales', 'Calculadoras financieras gratuitas', 'Guías descargables (ahorro, deuda)', 'Videos educativos', 'Webinars próximos', 'Glosario financiero', 'FAQ general de finanzas', 'Suscripción al boletín'] },
      { num: 12, name: 'Noticias y Comunicados', icon: '📰', sections: ['Comunicados de tasas y cambios', 'Noticias del sector financiero', 'Cambios regulatorios', 'Nuevos productos o promociones', 'Apariciones en medios', 'Galería de eventos institucionales', 'Descargas de brand kit', 'Contacto de comunicación'] },
      { num: 13, name: 'Cumplimiento y Regulación', icon: '⚖️', sections: ['Marco normativo (CNBV, SHCP)', 'Políticas AML / KYC', 'Código de ética corporativo', 'Política de privacidad de datos', 'Derechos ARCO', 'Canal de denuncias', 'Auditorías externas', 'Contacto de cumplimiento'] },
      { num: 14, name: 'FAQ y Soporte', icon: '❓', sections: ['FAQ de cada producto (sección acordeón)', 'Chat en línea 24/7', 'Base de conocimiento', 'Ticket de soporte', 'Rastrear mi solicitud', 'Número de atención a clientes', 'Formulario de queja formal', 'Tiempo de resolución garantizado'] },
      { num: 15, name: 'Trabaja con Nosotros', icon: '👥', sections: ['Vacantes por área y ciudad', 'Beneficios laborales', 'Proceso de selección', 'Formulario de postulación', 'Política de diversidad e inclusión', 'Plan de carrera y capacitación', 'Testimonios de colaboradores', 'Convenios con universidades'] },
      { num: 16, name: 'Portal de Clientes', icon: '🔐', sections: ['Login seguro 2FA', 'Saldo y movimientos en tiempo real', 'Descarga de estados de cuenta', 'Realizar pagos en línea', 'Solicitar ampliación de crédito', 'Actualizar datos personales', 'Configurar alertas y notificaciones', 'Soporte técnico del portal'] },
      { num: 17, name: 'Calculadoras', icon: '🧮', sections: ['Calculadora de crédito personal', 'Calculadora hipotecaria', 'Calculadora de CAT', 'Comparador de productos', 'Simulador de ahorro', 'Calculadora de seguro', 'Herramienta de presupuesto mensual', 'Descargar resultados en PDF'] },
      { num: 18, name: 'Términos y Condiciones', icon: '📄', sections: ['Contrato de adhesión por producto', 'Tarifas y comisiones vigentes', 'Circular única de bancos aplicable', 'Política de modificaciones', 'Confidencialidad y datos personales', 'Jurisdicción y ley aplicable', 'Descargar contrato en PDF', 'Vigencia y versiones anteriores'] },
      { num: 19, name: 'Sostenibilidad Financiera', icon: '🌱', sections: ['Política ESG corporativa', 'Créditos verdes disponibles', 'Impacto social de nuestros créditos', 'Alianzas con causas sociales', 'Reporte de impacto anual', 'Metas ambientales 2030', 'Certificaciones de empresa responsable', 'Participa en nuestros programas sociales'] },
      { num: 20, name: 'Aviso Legal', icon: '🔒', sections: ['Uso del sitio web', 'Propiedad intelectual', 'Limitación de responsabilidad', 'Política de cookies y tracking', 'Notificaciones legales', 'Resolución de disputas', 'Vigencia del aviso legal', 'Contacto del área legal'] },
      { num: 21, name: 'Promociones Vigentes', icon: '🎁', sections: ['Tasa especial por temporada', 'Bono de pago anticipado', 'Programa de referidos', 'Descuentos por domiciliación', 'Promoción de apertura de cuenta', 'Vigencia de cada promoción', 'Términos aplicables', 'Apartar promoción en línea'] },
      { num: 22, name: 'Agentes y Distribuidores', icon: '🤝', sections: ['¿Quiénes son nuestros agentes?', 'Cómo convertirte en agente autorizado', 'Materiales de venta descargables', 'Comisiones y esquema de compensación', 'Zona exclusiva de agentes (login)', 'Capacitación disponible', 'Reglamento de agentes', 'Solicitar ser agente'] },
      { num: 23, name: 'Contacto Institucional', icon: '📞', sections: ['Formulario de contacto general', 'Líneas directas por producto', 'WhatsApp por área', 'Correos institucionales', 'Mapa de oficinas centrales', 'Horarios de atención', 'Solicitar reunión con ejecutivo', 'Relaciones públicas y prensa'] },
      { num: 24, name: 'Descargas y Formularios', icon: '📥', sections: ['Solicitudes de crédito en PDF', 'Formatos de garantías', 'Cartas de instrucción', 'Poderes notariales requeridos', 'Formularios de ARCO', 'Contratos de cada producto', 'Manuales de uso del portal', 'Guía de requisitos por crédito'] },
      { num: 25, name: 'Historia y Gobierno Corporativo', icon: '🏛️', sections: ['Historia de la institución', 'Consejo de administración', 'Comités directivos', 'Código de gobierno corporativo', 'Organigrama general', 'Filosofía institucional', 'Participación en cámaras y asociaciones', 'Memoria institucional descargable'] },
    ]
  },
  esmeralda: {
    title: 'Grupo Industrial y Fabricante Global',
    subtitle: 'Imaginemos que lideras un corporativo industrial de alto impacto con múltiples divisiones.',
    pages: [
      { num: 1, name: 'Portal Principal del Grupo', icon: '🌐', sections: ['Hero con visión global del grupo', 'Divisiones de la empresa (mega menú)', 'Indicadores clave (empleados, países, facturación)', 'Noticias corporativas en tiempo real', 'Últimas publicaciones de cada división', 'Mapa de operaciones global', 'Acceso a portales internos', 'Contacto corporativo ejecutivo'] },
      { num: 2, name: 'División Manufactura', icon: '🏭', sections: ['Capacidad de producción instalada', 'Líneas de productos fabricados', 'Proceso de manufactura lean', 'Certificaciones ISO y IATF', 'Clientes industriales globales', 'Planta productiva virtual (video 360°)', 'Solicitar muestra o prototipo', 'Partners de manufactura'] },
      { num: 3, name: 'División Exportaciones', icon: '✈️', sections: ['Mercados destino actuales', 'Catálogo de productos para exportación', 'Fichas técnicas por producto', 'Normativas de exportación cumplidas', 'Agentes en país de destino', 'Packaging y logística internacional', 'Historial de exportaciones', 'Cotización para distribuidores'] },
      { num: 4, name: 'División Construcción', icon: '🏗️', sections: ['Tipos de obra que ejecutan', 'Proyectos activos y terminados', 'Maquinaria especializada', 'Equipo de ingeniería y dirección', 'Certificaciones de constructora', 'Normativas gubernamentales cumplidas', 'Presupuesto en línea', 'Cronograma tipo de un proyecto'] },
      { num: 5, name: 'División Energía', icon: '⚡', sections: ['Proyectos de energía renovable', 'Plantas solares y eólicas', 'Capacidad instalada en MW', 'Clientes del sector energético', 'Estudios de factibilidad', 'Política ambiental y de emisiones', 'Certificaciones energéticas', 'Solicitar proyecto energético'] },
      { num: 6, name: 'División Tecnología', icon: '💻', sections: ['Software desarrollado internamente', 'Plataformas SaaS ofertadas', 'APIs y documentación técnica', 'Clientes tecnológicos', 'Casos de uso y demos', 'Planes de licenciamiento', 'Centro de soporte técnico', 'Solicitar demo de producto'] },
      { num: 7, name: 'Centro de Investigación', icon: '🔬', sections: ['Líneas de investigación activas', 'Investigadores y doctores del equipo', 'Publicaciones científicas recientes', 'Convenios con universidades', 'Patentes registradas', 'Laboratorios y equipamiento', 'Proyectos financiados por CONACYT/SEP', 'Postular a investigación colaborativa'] },
      { num: 8, name: 'Gobierno Corporativo', icon: '🏛️', sections: ['Consejo de administración', 'Comités directivos', 'Código de gobernanza', 'Reporte de gobierno corporativo', 'Política anticorrupción y antisoborno', 'Transparencia y rendición de cuentas', 'Auditores externos', 'Contacto del área de compliance'] },
      { num: 9, name: 'Relación con Inversores', icon: '📊', sections: ['Resultados financieros trimestrales', 'Calificación crediticia y rating', 'Política de dividendos', 'Junta anual de accionistas', 'Memoria anual interactiva', 'Información bursátil (si aplica)', 'Sala de inversores virtual', 'Contacto de IR'] },
      { num: 10, name: 'Proveedores y Cadena de Suministro', icon: '🔗', sections: ['Portal de proveedores (login)', 'Requisitos de homologación', 'Proceso de registro de proveedor', 'Política de compras sustentables', 'Licitaciones abiertas', 'Sistema de evaluación', 'Código de conducta para proveedores', 'Contacto de compras'] },
      { num: 11, name: 'Sustentabilidad y ESG', icon: '🌱', sections: ['Política ambiental corporativa', 'Metas de reducción de CO2', 'Programas sociales en comunidades', 'Gobierno y ética empresarial', 'Reporte ESG descargable', 'Certificaciones ambientales', 'Contribución a los ODS de la ONU', 'Noticias de sustentabilidad'] },
      { num: 12, name: 'Noticias y Sala de Prensa', icon: '📰', sections: ['Comunicados corporativos recientes', 'Noticias por división de negocio', 'Apariciones en medios internacionales', 'Galería de eventos y ferias', 'Descargas de brand kit completo', 'Contacto de comunicación global', 'Archivos históricos de prensa', 'Suscripción a newsletter corporativo'] },
      { num: 13, name: 'Recursos Humanos Global', icon: '👥', sections: ['Vacantes por país y división', 'Cultura organizacional', 'Beneficios por nivel jerárquico', 'Plan de carrera internacional', 'Proceso de selección global', 'Política de diversidad e inclusión', 'Testimonios de colaboradores de varios países', 'Portal de postulación en línea'] },
      { num: 14, name: 'Capacitación y Academia', icon: '🎓', sections: ['Catálogo de cursos internos', 'Plataforma LMS de aprendizaje', 'Becas para colaboradores', 'Certificaciones internas', 'Talleres de liderazgo ejecutivo', 'Programa de mentoring', 'Vinculación con universidades', 'Registro para cursos'] },
      { num: 15, name: 'Cumplimiento y Legal (Compliance)', icon: '⚖️', sections: ['Marco normativo por país', 'Política de privacidad global (GDPR + LFPDPPP)', 'Política AML y KYC corporativa', 'Canal ético de denuncias anónimas', 'Código de ética y conducta', 'Política antisoborno', 'Auditorías internas', 'Contacto del departamento legal'] },
      { num: 16, name: 'Fundación y Responsabilidad Social', icon: '❤️', sections: ['Misión de la fundación corporativa', 'Programas sociales activos', 'Áreas de impacto (educación, salud, medio ambiente)', 'Beneficiarios por región', 'Donaciones y alianzas ONG', 'Cómo participar o donar', 'Galería de proyectos cumplidos', 'Reporte de impacto social anual'] },
      { num: 17, name: 'Presencia Internacional', icon: '🗺️', sections: ['Mapa interactivo de países de operación', 'Ficha de cada país (equipo, servicios, contacto)', 'Regulaciones locales cumplidas', 'Idiomas de atención por región', 'Oficinas representativas', 'Partners locales certificados', 'Zona horaria y disponibilidad por país', 'Contacto regional directo'] },
      { num: 18, name: 'Innovación y Transformación Digital', icon: '🚀', sections: ['Roadmap de digitalización', 'Proyectos de IA y automatización activos', 'Startups internas (spin-offs)', 'Open innovation y hackathons', 'Lab de innovación abierta', 'Alianzas con centros tech', 'Publicaciones sobre innovación', 'Únete al ecosistema de innovación'] },
      { num: 19, name: 'Catálogos de Productos', icon: '📋', sections: ['Catálogo por división', 'Fichas técnicas descargables (PDF)', 'Buscador de productos por código o categoría', 'Especificaciones técnicas estandarizadas', 'Solicitar muestra de producto', 'Disponibilidad y lead times', 'Imágenes de producto en alta resolución', 'Cotizar pedido mínimo'] },
      { num: 20, name: 'Alianzas Estratégicas', icon: '🤝', sections: ['Partners tecnológicos globales', 'Distribuidores exclusivos por región', 'Convenios universitarios', 'Asociaciones de industria', 'Joint ventures activos', 'Programa de certificación de partners', 'Beneficios del programa de alianza', 'Solicitar convertirse en partner'] },
      { num: 21, name: 'Descargas y Documentación', icon: '📥', sections: ['Manuales técnicos de producto', 'Fichas de seguridad (MSDS)', 'Certificados de calidad', 'Documentos aduanales tipo', 'Brand guidelines corporativas', 'Formularios de garantía', 'Catálogos anteriores (histórico)', 'Solicitar documentación adicional'] },
      { num: 22, name: 'Postventa y Garantías', icon: '🔧', sections: ['Política de garantía por producto', 'Proceso de reclamación paso a paso', 'Centros de servicio autorizado', 'Refacciones y repuestos disponibles', 'SLA de tiempo de respuesta', 'Registro de producto para garantía', 'Formulario de reporte técnico', 'WhatsApp de soporte postventa'] },
      { num: 23, name: 'Portal de Clientes', icon: '🔐', sections: ['Login seguro 2FA por empresa', 'Pedidos activos y en tránsito', 'Historial de compras y facturas', 'Descarga de documentación', 'Solicitar cotización express', 'Gestión de garantías en línea', 'Chat con ejecutivo de cuenta', 'Actualizar datos de facturación'] },
      { num: 24, name: 'FAQ y Centro de Ayuda', icon: '❓', sections: ['FAQ por división de negocio', 'Base de conocimiento técnica', 'Videos tutoriales de productos', 'Buscador de respuestas', 'Chat en vivo 24/7', 'Ticket de soporte con seguimiento', 'Número de emergencias técnicas', 'Formulario de retroalimentación'] },
      { num: 25, name: 'Eventos y Ferias', icon: '🎪', sections: ['Calendario de ferias internacionales', 'Stands y presencia en expos', 'Galería de ediciones anteriores', 'Registro para próximos eventos', 'Agenda de demostraciones en feria', 'Material para asistentes', 'Webinars y conferencias online', 'Noticias de eventos recientes'] },
      { num: 26, name: 'Historia y Legado', icon: '🏅', sections: ['Timeline interactivo desde fundación', 'Hitos históricos de la empresa', 'Galería histórica de instalaciones', 'Premios y reconocimientos acumulados', 'Evolución de productos', 'Fundadores y visión original', 'Cultura empresarial heredada', 'Documental institucional en video'] },
      { num: 27, name: 'Seguridad Industrial', icon: '⛑️', sections: ['Política de seguridad corporativa', 'Índice de incidentes (cero accidentes)', 'Protocolos por área de riesgo', 'EPP requerido por zona', 'Capacitación en seguridad', 'Simulacros y planes de contingencia', 'Comité de seguridad', 'Reporte de incidente en línea'] },
      { num: 28, name: 'Calidad y Certificaciones', icon: '✅', sections: ['Sistema de gestión de calidad (ISO 9001)', 'Proceso de auditoría interna', 'Política de mejora continua', 'Laboratorio de control de calidad', 'Certificaciones por división', 'Clientes auditores bienvenidos', 'Premios de calidad obtenidos', 'Documentación del SGC descargable'] },
      { num: 29, name: 'Área de Prensa Ejecutiva', icon: '📡', sections: ['Perfil ejecutivo de cada director', 'Entrevistas disponibles para medios', 'Sala de multimedia (fotos, videos, logos)', 'Guía de voceros autorizados', 'Solicitar entrevista o declaración', 'Cobertura mediática reciente', 'Agenda de apariciones públicas', 'Contacto de relaciones institucionales'] },
      { num: 30, name: 'Aviso Legal y Privacidad Global', icon: '🔒', sections: ['Política de privacidad global (multilingual)', 'Cookies y tecnologías de rastreo', 'Derechos por jurisdicción (GDPR, LFPDPPP, CCPA)', 'Ejercicio de derechos ARCO / DSR', 'Responsable de datos por región', 'Notificaciones legales internacionales', 'Historial de actualizaciones legales', 'Contacto del DPO (Data Protection Officer)'] },
    ]
  }
};

// Build the HTML for the example section
function buildExampleSection(plan, data) {
  const pagesHtml = data.pages.map(pg => `
          <div class="corp-page-card">
            <div class="corp-page-card__header">
              <span class="corp-page-card__icon">${pg.icon}</span>
              <div>
                <span class="corp-page-card__num">Página ${pg.num}</span>
                <h3 class="corp-page-card__name">${pg.name}</h3>
              </div>
            </div>
            <ul class="corp-page-card__sections">
              ${pg.sections.map((s, i) => `<li><span class="sec-num">${i + 1}</span>${s}</li>`).join('\n              ')}
            </ul>
          </div>`).join('\n');

  return `
    <!-- EXAMPLE SECTION -->
    <section class="corp-example-section">
      <div class="container">
        <div class="corp-example-head reveal s3d-l">
          <div class="section-head__eyebrow"><span class="label">Ejemplo Real</span></div>
          <h2 class="corp-example-title">Cómo se vería el sitio:<br><em>${data.title}</em></h2>
          <p class="corp-example-sub">${data.subtitle} Estas son las ${data.pages.length} páginas con sus secciones respectivas.</p>
        </div>
        <div class="corp-pages-grid">
${pagesHtml}
        </div>
      </div>
    </section>
`;
}

const css = `
    /* ── Corp Example Section ──────────────────────────────── */
    .corp-example-section {
      padding: var(--space-24) 0;
      background: var(--bg-2);
    }
    .corp-example-head {
      text-align: center;
      margin-bottom: var(--space-16);
    }
    .corp-example-title {
      font-family: var(--font-display);
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 300;
      line-height: 1.15;
      letter-spacing: -0.02em;
      color: var(--ink);
      margin: var(--space-3) 0 var(--space-4);
    }
    .corp-example-title em {
      font-style: italic;
      color: var(--accent);
    }
    .corp-example-sub {
      font-size: var(--text-base);
      color: var(--ink-2);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.7;
    }
    .corp-pages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--space-5);
    }
    .corp-page-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: var(--space-6);
      transition: box-shadow 0.3s, transform 0.3s;
    }
    .corp-page-card:hover {
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
      transform: translateY(-3px);
    }
    .corp-page-card__header {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--border);
    }
    .corp-page-card__icon {
      font-size: 1.8rem;
      line-height: 1;
      flex-shrink: 0;
    }
    .corp-page-card__num {
      display: block;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: .18em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 2px;
    }
    .corp-page-card__name {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--ink);
      margin: 0;
    }
    .corp-page-card__sections {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
    .corp-page-card__sections li {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      font-size: var(--text-sm);
      color: var(--ink-2);
      line-height: 1.5;
    }
    .sec-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--bg-3);
      border: 1px solid var(--border);
      font-size: 0.6rem;
      font-weight: 700;
      color: var(--ink-3);
      flex-shrink: 0;
      margin-top: 1px;
    }
    @media (max-width: 640px) {
      .corp-pages-grid { grid-template-columns: 1fr; }
    }
`;

const plans = ['bronce', 'silver', 'gold', 'platino', 'diamante', 'esmeralda'];

for (const slug of plans) {
  const filepath = `servicios/sitios-corporativos/${slug}.html`;
  let c = fs.readFileSync(filepath, 'utf8');
  const data = planExamples[slug];

  // Inject CSS before </style>
  if (!c.includes('corp-example-section')) {
    c = c.replace(/(\s*<\/style>)/, css + '\n$1');

    // Inject the HTML section before <!-- COMPARE -->
    const exampleHtml = buildExampleSection(slug, data);
    c = c.replace(/(\s*<!-- COMPARE -->)/, exampleHtml + '\n$1');
  }

  fs.writeFileSync(filepath, c, 'utf8');
  console.log(`✓ ${slug} — ${data.pages.length} pages injected`);
}

console.log('\nAll example sections built!');
