-- Semillas iniciales para cascolegal Panamá
-- Nota: En producción, los embeddings se generarán usando la API del proveedor de IA.

-- 1. Insertar usuario administrador por defecto
INSERT INTO users (id, email, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@cascolegal.pa', 'Administrador General cascolegal', 'admin');

-- 2. Insertar Fuentes Oficiales
INSERT INTO official_sources (id, name, institution, main_url, source_type, check_frequency_days, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Gaceta Oficial Digital', 'República de Panamá', 'https://www.gacetaoficial.gob.pa', 'gaceta', 1, 'active'),
  ('11111111-1111-1111-1111-111111111112', 'Sitio Web Oficial ATTT', 'Autoridad del Tránsito y Transporte Terrestre', 'https://www.transito.gob.pa', 'website_attt', 3, 'active'),
  ('11111111-1111-1111-1111-111111111113', 'Legispan - Asamblea Nacional', 'Asamblea Nacional de Panamá', 'https://www.asamblea.gob.pa', 'other', 7, 'active');

-- 3. Insertar Documentos Legales
-- A. Reglamento de Tránsito (Decreto Ejecutivo 640 de 2006)
INSERT INTO legal_documents (id, doc_type, doc_number, title, emission_date, publication_date, effective_date, gazette_number, gazette_url, institution, status_vigency, official_url, file_hash, review_status, last_verified_at)
VALUES
  (
    '22222222-2222-2222-2222-222222222221', 
    'decreto_ejecutivo', 
    '640', 
    'Reglamento de Tránsito Vehicular de la República de Panamá', 
    '2006-12-27', 
    '2006-12-28', 
    '2007-01-01', 
    '25700', 
    'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf', 
    'Ministerio de Gobierno y Justicia / ATTT', 
    'parcialmente_vigente', 
    'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf', 
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', -- Hash simulado
    'approved',
    now()
  );

-- B. Decreto Ejecutivo 19 de 2022 (Delivery / Adiciona Art. 40-A al Reglamento)
INSERT INTO legal_documents (id, doc_type, doc_number, title, emission_date, publication_date, effective_date, gazette_number, gazette_url, institution, status_vigency, official_url, file_hash, review_status, last_verified_at)
VALUES
  (
    '22222222-2222-2222-2222-222222222222', 
    'decreto_ejecutivo', 
    '19', 
    'Que adiciona el Artículo 40-A al Reglamento de Tránsito Vehicular (Decreto Ejecutivo N° 640 de 2006) sobre las motocicletas de entrega a domicilio (delivery)', 
    '2022-10-07', 
    '2022-10-10', 
    '2022-10-11', 
    '29641-A', 
    'https://www.gacetaoficial.gob.pa/pdfTemp/29641_A/94595.pdf', 
    'Ministerio de Gobierno / ATTT', 
    'vigente', 
    'https://www.gacetaoficial.gob.pa/pdfTemp/29641_A/94595.pdf', 
    '8795c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b866', -- Hash simulado
    'approved',
    now()
  );

-- C. Resolución OAL N° 973 de 2013 (Uso obligatorio de chaleco reflectivo en horario nocturno)
INSERT INTO legal_documents (id, doc_type, doc_number, title, emission_date, publication_date, effective_date, gazette_number, gazette_url, institution, status_vigency, official_url, file_hash, review_status, last_verified_at)
VALUES
  (
    '22222222-2222-2222-2222-222222222223', 
    'resolucion', 
    '973', 
    'Que establece medidas de seguridad vial para los conductores de motocicletas, incluyendo el uso obligatorio de prendas reflectivas con número de placa en horario nocturno (6:00 PM a 6:00 AM).', 
    '2013-08-06', 
    '2013-08-09', 
    '2013-08-15', 
    '27349', 
    'https://www.gacetaoficial.gob.pa/pdfTemp/27349/46083.pdf', 
    'Autoridad del Tránsito y Transporte Terrestre', 
    'vigente', 
    'https://www.gacetaoficial.gob.pa/pdfTemp/27349/46083.pdf', 
    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', -- Hash simulado
    'approved',
    now()
  );

-- 4. Insertar Artículos Clave de los Documentos Legales
-- A. Artículos del Decreto Ejecutivo 640 de 2006 (Reglamento de Tránsito)
-- Art. 104: Casco y prendas reflectivas
INSERT INTO articles (id, document_id, article_number, title, content, start_page, end_page, keywords)
VALUES
  (
    '33333333-3333-3333-3333-333333333301', 
    '22222222-2222-2222-2222-222222222221', 
    '104', 
    'Medidas de protección para motocicletas y bicicletas', 
    'Los conductores de motocicletas, bicicletas y sus pasajeros deberán portar casco de protección y chalecos o aditamentos reflectivos, de acuerdo con el reglamento que para este efecto expida la Autoridad del Tránsito y Transporte Terrestre.',
    12,
    12,
    ARRAY['casco', 'chaleco', 'reflectivo', 'proteccion', 'seguridad']
  );

-- Art. 132 (Parte sobre Licencia Tipo B)
INSERT INTO articles (id, document_id, article_number, title, content, start_page, end_page, keywords)
VALUES
  (
    '33333333-3333-3333-3333-333333333302', 
    '22222222-2222-2222-2222-222222222221', 
    '132', 
    'Clasificación de las Licencias de Conducir', 
    'Las licencias de conducir se clasifican de la siguiente manera:
Tipo A: Bicicletas y ciclomotores de pedales.
Tipo B: Motocicletas, motonetas, triciclos y cuadriciclos a motor.
Tipo C: Automóviles, camionetas y microbuses de servicio particular de hasta nueve (9) pasajeros.',
    15,
    15,
    ARRAY['licencia', 'tipo b', 'motocicleta', 'requisito']
  );

-- Art. 241 (Retención de licencia y retiro con grúa)
INSERT INTO articles (id, document_id, article_number, title, content, start_page, end_page, keywords)
VALUES
  (
    '33333333-3333-3333-3333-333333333303', 
    '22222222-2222-2222-2222-222222222221', 
    '241', 
    'Causas de Retiro de Vehículos con Grúa', 
    'La Autoridad del Tránsito y Transporte Terrestre o la Policía Nacional procederán al retiro del vehículo de la vía pública con grúa y su retención en los siguientes casos: 
a. Cuando el vehículo no se encuentre en condiciones óptimas de seguridad para transitar.
b. Cuando el conductor se encuentre en estado de embriaguez comprobada o bajo el efecto de estupefacientes.
c. Cuando el conductor no porte licencia de conducir o esta se encuentre suspendida o cancelada.
d. Cuando el vehículo no porte la placa única nacional o las calcomanías obligatorias de vigencia.',
    28,
    29,
    ARRAY['retencion', 'grua', 'placa', 'embriaguez', 'licencia', 'operativo']
  );

-- B. Decreto Ejecutivo 19 de 2022 (Delivery / Adiciona Art. 40-A)
INSERT INTO articles (id, document_id, article_number, title, content, start_page, end_page, keywords)
VALUES
  (
    '33333333-3333-3333-3333-333333333304', 
    '22222222-2222-2222-2222-222222222222', 
    '40-A', 
    'Identificación de motocicletas de delivery y carga comercial', 
    'Las motocicletas destinadas al servicio de transporte de carga, mensajería, entrega a domicilio o delivery de alimentos, mercancías o enseres, deberán llevar el número de la placa única nacional impreso y plenamente visible en la parte trasera de la caja, bolso o contenedor utilizado para transportar la carga.
En caso de que el conductor no utilice una caja o bolso de carga por la naturaleza del servicio, este deberá portar obligatoriamente un chaleco reflectivo que contenga en su parte posterior el número de la placa única nacional impreso.
La tipografía del número de placa impreso debe ser Arial, con un tamaño mínimo de 7 centímetros de altura, de color rojo sobre un fondo blanco reflectivo.',
    1,
    1,
    ARRAY['delivery', 'mensajeria', 'placa', 'chaleco', 'caja', 'rotulacion', 'rojo', 'blanco', 'reflectivo']
  );

-- C. Resolución OAL N° 973 de 2013 (Uso obligatorio de chaleco con placa de noche)
INSERT INTO articles (id, document_id, article_number, title, content, start_page, end_page, keywords)
VALUES
  (
    '33333333-3333-3333-3333-333333333305', 
    '22222222-2222-2222-2222-222222222223', 
    'Primero', 
    'Uso obligatorio de prenda reflectiva en horario nocturno', 
    'Se establece el uso obligatorio de prendas de vestir reflectivas o de alta visibilidad para todos los conductores de motocicletas, motociclos, triciclos y sus acompañantes en el horario comprendido entre las 6:00 p.m. y las 6:00 a.m. durante su circulación en las vías públicas de la República de Panamá. El chaleco deberá llevar impreso en la parte posterior el número de placa de la motocicleta. Queda expresamente prohibido el uso de chalecos reflectivos de color verde limón.',
    1,
    1,
    ARRAY['chaleco', 'placa', 'verde', 'prohibido', 'color', 'azul', 'gris', 'naranja', 'horario', 'noche', '6:00']
  );

-- 5. Insertar Relaciones Normativas
INSERT INTO normative_relations (id, source_doc_id, target_doc_id, relation_type, justification, review_status)
VALUES
  (
    '44444444-4444-4444-4444-444444444401', 
    '22222222-2222-2222-2222-222222222222', -- Decreto 19 de 2022
    '22222222-2222-2222-2222-222222222221', -- Reglamento (Decreto 640 de 2006)
    'adiciona',
    'Adiciona el Artículo 40-A sobre los requisitos de rotulación de placa para motocicletas de servicio comercial o delivery.',
    'approved'
  );
