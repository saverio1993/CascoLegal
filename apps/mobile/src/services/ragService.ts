import seedData from '../../../../packages/database/seed.sql';

// Estructuras de datos locales para simular la base de datos
export interface Article {
  id: string;
  documentNumber: string;
  documentTitle: string;
  documentType: string;
  articleNumber: string;
  title: string;
  content: string;
  statusVigency: string;
  gazetteNumber: string;
  gazetteUrl: string;
  officialUrl: string;
  keywords: string[];
}

// Datos cargados a mano correspondientes al seed.sql para simulación offline y RAG local
export const LOCAL_DATABASE: Article[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    documentNumber: '640',
    documentTitle: 'Reglamento de Tránsito Vehicular de la República de Panamá',
    documentType: 'Decreto Ejecutivo',
    articleNumber: '104',
    title: 'Medidas de protección para motocicletas y bicicletas',
    content: 'Los conductores de motocicletas, bicicletas y sus pasajeros deberán portar casco de protección y chalecos o aditamentos reflectivos, de acuerdo con el reglamento que para este efecto expida la Autoridad del Tránsito y Transporte Terrestre.',
    statusVigency: 'vigente', // o modificado según interpretación de resoluciones
    gazetteNumber: '25700',
    gazetteUrl: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf',
    officialUrl: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf',
    keywords: ['casco', 'chaleco', 'reflectivo', 'proteccion', 'seguridad', 'pasajero', 'noche', 'obligatorio']
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    documentNumber: '640',
    documentTitle: 'Reglamento de Tránsito Vehicular de la República de Panamá',
    documentType: 'Decreto Ejecutivo',
    articleNumber: '132',
    title: 'Clasificación de las Licencias de Conducir',
    content: 'Las licencias de conducir se clasifican de la siguiente manera: Tipo A: Bicicletas y ciclomotores de pedales. Tipo B: Motocicletas, motonetas, triciclos y cuadriciclos a motor. Tipo C: Automóviles, camionetas y microbuses de servicio particular de hasta nueve (9) pasajeros.',
    statusVigency: 'vigente',
    gazetteNumber: '25700',
    gazetteUrl: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf',
    officialUrl: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf',
    keywords: ['licencia', 'tipo b', 'motocicleta', 'requisito', 'edad', 'manejar']
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    documentNumber: '640',
    documentTitle: 'Reglamento de Tránsito Vehicular de la República de Panamá',
    documentType: 'Decreto Ejecutivo',
    articleNumber: '241',
    title: 'Causas de Retiro de Vehículos con Grúa',
    content: 'La Autoridad del Tránsito y Transporte Terrestre o la Policía Nacional procederán al retiro del vehículo de la vía pública con grúa y su retención en los siguientes casos: a. Cuando el vehículo no se encuentre en condiciones óptimas de seguridad para transitar. b. Cuando el conductor se encuentre en estado de embriaguez comprobada o bajo el efecto de estupefacientes. c. Cuando el conductor no porte licencia de conducir o esta se encuentre suspendida o cancelada. d. Cuando el vehículo no porte la placa única nacional o las calcomanías obligatorias de vigencia.',
    statusVigency: 'vigente',
    gazetteNumber: '25700',
    gazetteUrl: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf',
    officialUrl: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf',
    keywords: ['retencion', 'grua', 'placa', 'embriaguez', 'licencia', 'operativo', 'llevarse', 'moto', 'retener']
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    documentNumber: '19',
    documentTitle: 'Que adiciona el Artículo 40-A al Reglamento de Tránsito Vehicular (Decreto Ejecutivo N° 640 de 2006) sobre las motocicletas de entrega a domicilio (delivery)',
    documentType: 'Decreto Ejecutivo',
    articleNumber: '40-A',
    title: 'Identificación de motocicletas de delivery y carga comercial',
    content: 'Las motocicletas destinadas al servicio de transporte de carga, mensajería, entrega a domicilio o delivery de alimentos, mercancías o enseres, deberán llevar el número de la placa única nacional impreso y plenamente visible en la parte trasera de la caja, bolso o contenedor utilizado para transportar la carga. En caso de que el conductor no utilice una caja o bolso de carga por la naturaleza del servicio, este deberá portar obligatoriamente un chaleco reflectivo que contenga en su parte posterior el número de la placa única nacional impreso. La tipografía del número de placa impreso debe ser Arial, con un tamaño mínimo de 7 centímetros de altura, de color rojo sobre un fondo blanco reflectivo.',
    statusVigency: 'vigente',
    gazetteNumber: '29641-A',
    gazetteUrl: 'https://www.gacetaoficial.gob.pa/pdfTemp/29641_A/94595.pdf',
    officialUrl: 'https://www.gacetaoficial.gob.pa/pdfTemp/29641_A/94595.pdf',
    keywords: ['delivery', 'mensajeria', 'placa', 'chaleco', 'caja', 'rotulacion', 'rojo', 'blanco', 'reflectivo', 'pedidosya', 'repartidor', 'mochila']
  },
  {
    id: '33333333-3333-3333-3333-333333333305',
    documentNumber: '973',
    documentTitle: 'Medidas de seguridad vial para los conductores de motocicletas (OAL 973)',
    documentType: 'Resolución OAL',
    articleNumber: 'Primero',
    title: 'Uso obligatorio de prenda reflectiva en horario nocturno',
    content: 'Se establece el uso obligatorio de prendas de vestir reflectivas o de alta visibilidad para todos los conductores de motocicletas, motociclos, triciclos y sus acompañantes en el horario comprendido entre las 6:00 p.m. y las 6:00 a.m. durante su circulación en las vías públicas de la República de Panamá. El chaleco deberá llevar impreso en la parte posterior el número de placa de la motocicleta. Queda expresamente prohibido el uso de chalecos reflectivos de color verde limón.',
    statusVigency: 'vigente',
    gazetteNumber: '27349',
    gazetteUrl: 'https://www.gacetaoficial.gob.pa/pdfTemp/27349/46083.pdf',
    officialUrl: 'https://www.gacetaoficial.gob.pa/pdfTemp/27349/46083.pdf',
    keywords: ['chaleco', 'placa', 'verde', 'prohibido', 'color', 'azul', 'gris', 'naranja', 'horario', 'noche', '6:00', 'acompañante', 'pasajero']
  }
];

export interface RAGResponse {
  briefAnswer: string;
  officialGrounds: {
    documentTitle: string;
    documentType: string;
    documentNumber: string;
    articleNumber: string;
    content: string;
    statusVigency: string;
    gazetteNumber: string;
    gazetteUrl: string;
  }[];
  considerations: string;
  disclaimer: string;
  confidenceScore: 'alta' | 'media' | 'no_confirmada';
}

/**
 * Simula el proceso de búsqueda híbrida RAG (semántica y léxica)
 */
export function queryRAGSystem(queryText: string): RAGResponse {
  const normalizedQuery = queryText.toLowerCase();

  // Búsqueda léxica e indexación simple por coincidencia de palabras clave y contenido
  const scoredArticles = LOCAL_DATABASE.map(art => {
    let score = 0;
    
    // Coincidencia en palabras clave
    art.keywords.forEach(keyword => {
      if (normalizedQuery.includes(keyword)) score += 3;
    });

    // Coincidencia en contenido del artículo
    const words = normalizedQuery.split(' ');
    words.forEach(word => {
      if (word.length > 3 && art.content.toLowerCase().includes(word)) {
        score += 1;
      }
    });

    // Coincidencia directa en título de documento o número de artículo
    if (normalizedQuery.includes(art.articleNumber.toLowerCase())) score += 5;
    if (normalizedQuery.includes(art.documentNumber)) score += 4;

    return { article: art, score };
  });

  // Ordenar por puntaje y tomar los relevantes
  const matchingResults = scoredArticles
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(res => res.article);

  const disclaimer = 'AVISO LEGAL: Esta es una herramienta de consulta informativa basada en reglamentos oficiales de la República de Panamá. No constituye asesoramiento legal profesional de ningún tipo. Para casos formales, consulte a un abogado calificado o remítase directamente a las resoluciones emitidas por la ATTT.';

  if (matchingResults.length === 0) {
    return {
      briefAnswer: 'De acuerdo con la documentación oficial cargada y validada en el sistema, no se encontró una disposición oficial suficiente para confirmar o responder a esta consulta en los términos indicados.',
      officialGrounds: [],
      considerations: 'Es posible que el tema consultado esté fuera del alcance de las leyes de tránsito específicas de motocicletas, o que pertenezca a decretos municipales locales que aún no se han indexado en el panel administrativo.',
      disclaimer,
      confidenceScore: 'no_confirmada'
    };
  }

  // Generar la respuesta basada en el artículo con mayor puntuación
  const bestMatch = matchingResults[0];
  let briefAnswer = '';
  let considerations = '';

  // Respuestas temáticas adaptadas para sonar naturales (simulando el LLM RAG)
  if (normalizedQuery.includes('chaleco') || normalizedQuery.includes('vest')) {
    briefAnswer = 'En Panamá, es obligatorio usar chaleco reflectivo con el número de placa de tu motocicleta impreso en la espalda. El chaleco puede ser de color azul, naranja o gris. Está prohibido el uso de chalecos verde limón, reservados para las autoridades.';
    considerations = 'Los repartidores de delivery que utilicen cajas de carga deben rotular la placa en la parte trasera de la caja en lugar de usar el chaleco (a menos que no lleven caja, en cuyo caso sí usan chaleco con placa).';
  } else if (normalizedQuery.includes('delivery') || normalizedQuery.includes('pedidos') || normalizedQuery.includes('repart')) {
    briefAnswer = 'Sí, según el Decreto Ejecutivo 19 de 2022, las motocicletas de entrega a domicilio deben rotular su número de placa en la parte trasera de la caja o bolso de carga. La placa debe estar impresa en color rojo sobre fondo blanco reflectivo, con tipografía Arial de mínimo 7 cm de altura.';
    considerations = 'Si no llevas bolso o caja por la naturaleza de la carga, estás obligado a portar un chaleco reflectivo con el número de placa impreso bajo las mismas especificaciones.';
  } else if (normalizedQuery.includes('ret') || normalizedQuery.includes('grua') || normalizedQuery.includes('llevar')) {
    briefAnswer = 'Sí, tu motocicleta puede ser retenida y removida con grúa por las autoridades de tránsito en casos específicos como: conducir sin licencia (o suspendida), que el vehículo no porte la placa o calcomanía vigente, no tener las condiciones mínimas de seguridad, o estar bajo efectos del alcohol.';
    considerations = 'Las causales están tipificadas en el artículo 241 del Reglamento de Tránsito. Asegúrate de portar siempre tu documentación al día para evitar la remoción física del vehículo.';
  } else if (normalizedQuery.includes('licencia') || normalizedQuery.includes('tipo')) {
    briefAnswer = 'Para conducir motocicletas en Panamá necesitas obligatoriamente la licencia de conducir Tipo B. El Reglamento de Tránsito prohíbe conducir vehículos motorizados de dos ruedas con licencias destinadas únicamente a autos (como la Tipo C).';
    considerations = 'Para tramitar la Tipo B debes ser mayor de 18 años, no tener multas pendientes (estar en Paz y Salvo con la ATTT) y aprobar los exámenes prácticos en Sertracen.';
  } else if (normalizedQuery.includes('casco')) {
    briefAnswer = 'Sí, el uso del casco de seguridad es obligatorio tanto para el conductor de la motocicleta como para su acompañante (pasajero). La norma también exige portar prendas reflectivas.';
    considerations = 'El casco debe estar certificado. Adicionalmente, el artículo 104 remite a las especificaciones y reglamentaciones adicionales expedidas por la ATTT en materia de visibilidad.';
  } else {
    briefAnswer = `De acuerdo con el Artículo ${bestMatch.articleNumber} del ${bestMatch.documentType} N° ${bestMatch.documentNumber}, se establece lo siguiente: ${bestMatch.title}.`;
    considerations = 'Consulte el documento oficial adjunto mediante el código QR de verificación oficial.';
  }

  return {
    briefAnswer,
    officialGrounds: matchingResults.map(art => ({
      documentTitle: art.documentTitle,
      documentType: art.documentType,
      documentNumber: art.documentNumber,
      articleNumber: art.articleNumber,
      content: art.content,
      statusVigency: art.statusVigency,
      gazetteNumber: art.gazetteNumber,
      gazetteUrl: art.gazetteUrl
    })),
    considerations,
    disclaimer,
    confidenceScore: 'alta'
  };
}

/**
 * Simula el verificador de afirmaciones (Fact-Checker)
 */
export interface FactCheckResult {
  claim: string;
  status: 'confirmada' | 'parcialmente_confirmada' | 'no_confirmada' | 'contradicha' | 'insuficiente';
  confidenceLevel: 'alto' | 'medio' | 'bajo';
  explanation: string;
  evidences: {
    sourceName: string;
    articleNumber: string;
    content: string;
    url: string;
  }[];
}

export function verifyClaim(claimText: string): FactCheckResult {
  const normalized = claimText.toLowerCase();

  // Caso: Extintor en motos (Mito común / Multa ilegal)
  if (normalized.includes('extintor') || normalized.includes('fuego') || normalized.includes('incendio')) {
    return {
      claim: claimText,
      status: 'contradicha',
      confidenceLevel: 'alto',
      explanation: 'FALSO. No es obligatorio que las motocicletas porten un extintor de incendios en Panamá. El Artículo 7 del Reglamento de Tránsito exige extintor únicamente para vehículos de transporte público y de carga comercial. Ningún agente puede multarte ni retener tu moto por no llevar un extintor.',
      evidences: [
        {
          sourceName: 'Decreto Ejecutivo N° 640 de 2006 (Reglamento de Tránsito)',
          articleNumber: '7',
          content: 'Todo vehículo a motor que circule por las vías públicas de la República de Panamá debe portar un equipo de seguridad... (la obligatoriedad del extintor aplica a vehículos de transporte público y de carga comercial según aclaratorias institucionales de la ATTT).',
          url: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf'
        }
      ]
    };
  }

  // Caso: Chaleco de día (Mito / Multa ilegal para particulares)
  if (normalized.includes('chaleco') && (normalized.includes('dia') || normalized.includes('todo el dia') || normalized.includes('tarde') || normalized.includes('mañana'))) {
    return {
      claim: claimText,
      status: 'contradicha',
      confidenceLevel: 'alto',
      explanation: 'FALSO (para particulares). Según la Resolución OAL N° 973 del 6 de agosto de 2013 de la ATTT, el uso del chaleco reflectivo (o prenda de alta visibilidad) es obligatorio únicamente en horario de 6:00 p.m. a 6:00 a.m. Durante el día (de 6:00 a.m. a 6:00 p.m.), los motociclistas particulares NO están obligados por ley a portar chaleco reflectivo. Multar de día por esto es ilegal.',
      evidences: [
        {
          sourceName: 'Resolución OAL N° 973 del 6 de agosto de 2013 (ATTT)',
          articleNumber: 'Primero (Modificación)',
          content: 'Establece la obligatoriedad de utilizar prendas de vestir reflectivas o de alta visibilidad en el horario comprendido entre las 6:00 p.m. y las 6:00 a.m. para conductores y acompañantes de motocicletas...',
          url: 'https://www.gacetaoficial.gob.pa/pdfTemp/27349/46083.pdf'
        }
      ]
    };
  }

  // Caso: Chaleco obligatorio de noche desde 6pm
  if (normalized.includes('chaleco') && (normalized.includes('6') || normalized.includes('noche') || normalized.includes('horario'))) {
    return {
      claim: claimText,
      status: 'parcialmente_confirmada',
      confidenceLevel: 'alto',
      explanation: 'El uso del chaleco reflectivo (con el número de placa impreso) es obligatorio para los motociclistas durante todo el día (y especialmente de noche para visibilidad) según la Resolución OAL N° 973 de 2013. Sin embargo, no existe una ley o decreto que límite la obligatoriedad exclusivamente a partir de las 6:00 p.m., sino que aplica durante toda la circulación en la vía pública.',
      evidences: [
        {
          sourceName: 'Resolución OAL N° 973 de 2013 (ATTT)',
          articleNumber: 'Modificación',
          content: 'Se establece el uso obligatorio de chaleco reflectivo de color azul, naranja o gris para todos los conductores de motocicletas y sus acompañantes durante su circulación en las vías de la República de Panamá...',
          url: 'https://www.gacetaoficial.gob.pa/pdfTemp/27349/46083.pdf'
        }
      ]
    };
  }

  // Caso: Verde limón prohibido
  if (normalized.includes('verde') || normalized.includes('limon') || normalized.includes('verde limon')) {
    return {
      claim: claimText,
      status: 'confirmada',
      confidenceLevel: 'alto',
      explanation: 'Confirmado. La Resolución OAL N° 973 de 2013 (que mantiene esta disposición de la OAL 904) prohíbe de forma expresa el uso de chalecos reflectivos verde limón para particulares, siendo un tono exclusivo de las unidades policiales y oficiales de la ATTT.',
      evidences: [
        {
          sourceName: 'Resolución OAL N° 973 de 2013 (ATTT)',
          articleNumber: 'Modificación',
          content: 'Queda expresamente prohibido el uso de chalecos reflectivos de color verde limón, ya que este color es de uso exclusivo para las autoridades de tránsito (ATTT) y unidades de la Policía Nacional.',
          url: 'https://www.gacetaoficial.gob.pa/pdfTemp/27349/46083.pdf'
        }
      ]
    };
  }

  // Caso: Retención de moto por no usar casco o placa
  if (normalized.includes('retener') || normalized.includes('llevar') || normalized.includes('grua')) {
    return {
      claim: claimText,
      status: 'confirmada',
      confidenceLevel: 'alto',
      explanation: 'Confirmado. El artículo 241 del Reglamento de Tránsito autoriza a las autoridades a remover la motocicleta con grúa si el conductor no porta licencia de conducir, si el vehículo no posee la placa única nacional o las calcomanías correspondientes.',
      evidences: [
        {
          sourceName: 'Decreto Ejecutivo N° 640 de 2006 (Reglamento de Tránsito)',
          articleNumber: '241',
          content: 'La Autoridad del Tránsito y Transporte Terrestre o la Policía Nacional procederán al retiro del vehículo de la vía pública con grúa y su retención en los siguientes casos... d. Cuando el vehículo no porte la placa única nacional o las calcomanías obligatorias de vigencia.',
          url: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf'
        }
      ]
    };
  }

  // Respuesta por defecto
  return {
    claim: claimText,
    status: 'insuficiente',
    confidenceLevel: 'bajo',
    explanation: 'No se encontraron regulaciones específicas de tránsito en la base de datos de CascoLegal que puedan confirmar o desmentir esta afirmación exacta. Se aconseja remitirse a un oficial para verificar o revisar las normativas generales de la ATTT.',
    evidences: []
  };
}
