-- Habilitar extensión vectorial para RAG (requiere privilegios de superusuario)
CREATE EXTENSION IF NOT EXISTS vector;

-- Eliminar tablas en orden inverso en caso de que existan para permitir reinicialización
DROP TABLE IF EXISTS admin_audit_log CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS error_reports CASCADE;
DROP TABLE IF EXISTS user_queries CASCADE;
DROP TABLE IF EXISTS normative_relations CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS legal_documents CASCADE;
DROP TABLE IF EXISTS official_sources CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Tabla de Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'editor')),
    preferences JSONB DEFAULT '{}'::jsonb,
    followed_topics TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de Fuentes Oficiales
CREATE TABLE official_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    institution TEXT NOT NULL,
    main_url TEXT NOT NULL,
    source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('gaceta', 'website_attt', 'municipal', 'other')),
    check_frequency_days INTEGER NOT NULL DEFAULT 7,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'broken')),
    last_checked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Documentos Legales
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doc_type VARCHAR(30) NOT NULL CHECK (doc_type IN ('ley', 'decreto_ejecutivo', 'resolucion', 'reglamento', 'acuerdo_municipal')),
    doc_number VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    emission_date DATE NOT NULL,
    publication_date DATE NOT NULL,
    effective_date DATE,
    gazette_number VARCHAR(50),
    gazette_url TEXT,
    institution TEXT NOT NULL,
    status_vigency VARCHAR(25) NOT NULL DEFAULT 'unconfirmed' 
        CHECK (status_vigency IN ('vigente', 'parcialmente_vigente', 'modificado', 'reglamentado', 'derogado', 'suspendido', 'pendiente_revision', 'unconfirmed')),
    official_url TEXT NOT NULL,
    file_path TEXT, -- Ruta en el storage
    file_hash VARCHAR(64) NOT NULL,
    full_text TEXT,
    last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    review_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Artículos (Segmentos para RAG)
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE NOT NULL,
    article_number VARCHAR(30) NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    start_page INTEGER,
    end_page INTEGER,
    keywords TEXT[] DEFAULT '{}'::text[],
    embedding VECTOR(1536), -- Vector de 1536 dimensiones (compatible con text-embedding-3-small u otros)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices para búsquedas semánticas y de texto completo
CREATE INDEX IF NOT EXISTS idx_articles_embedding ON articles USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_articles_content_fts ON articles USING gin(to_tsvector('spanish', content));
CREATE INDEX IF NOT EXISTS idx_articles_document_id ON articles(document_id);

-- 5. Tabla de Relaciones Normativas (Historial de reformas)
CREATE TABLE normative_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_doc_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE NOT NULL, -- El documento que modifica
    target_doc_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE NOT NULL, -- El documento modificado
    relation_type VARCHAR(20) NOT NULL 
        CHECK (relation_type IN ('modifica', 'deroga', 'reglamenta', 'adiciona', 'sustituye')),
    justification TEXT,
    review_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabla de Consultas (Historial e IA)
CREATE TABLE user_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sources_used JSONB DEFAULT '[]'::jsonb, -- Referencia a artículos e IDs usados en RAG
    feedback_score INTEGER CHECK (feedback_score IN (-1, 0, 1)), -- -1: Negativo, 1: Positivo
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabla de Reportes de Error
CREATE TABLE error_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    report_type VARCHAR(30) NOT NULL CHECK (report_type IN ('broken_link', 'incorrect_doc', 'article_error', 'obsolete_norm', 'unclear_ai_answer', 'other')),
    description TEXT NOT NULL,
    document_id UUID REFERENCES legal_documents(id) ON DELETE SET NULL,
    query_id UUID REFERENCES user_queries(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'dismissed')),
    resolution_details TEXT,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabla de Alertas
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    document_id UUID REFERENCES legal_documents(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabla de Auditoría Administrativa
CREATE TABLE admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    action TEXT NOT NULL,
    target_table VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    old_value JSONB,
    new_value JSONB,
    justification TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
