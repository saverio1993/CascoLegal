'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  FileText, 
  Clock, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Database, 
  Settings, 
  UserCheck, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

// Estructuras de datos simulando el base schema.sql
interface LegalDocument {
  id: string;
  docType: string;
  docNumber: string;
  title: string;
  publicationDate: string;
  statusVigency: string;
  reviewStatus: string;
  reformNotes?: string;
  url: string;
}

export default function AdminDashboard() {
  const [documents, setDocuments] = useState<LegalDocument[]>([
    {
      id: 'doc-1',
      docType: 'Decreto Ejecutivo',
      docNumber: '640',
      title: 'Reglamento de Tránsito Vehicular de Panamá',
      publicationDate: '2006-12-28',
      statusVigency: 'parcialmente_vigente',
      reviewStatus: 'approved',
      url: 'https://www.transito.gob.pa/sites/default/files/documentos/decreto_ejecutivo_no.640_del_27_de_diciembre_de_2006.pdf'
    },
    {
      id: 'doc-2',
      docType: 'Decreto Ejecutivo',
      docNumber: '19',
      title: 'Que adiciona el Artículo 40-A al Reglamento de Tránsito (Delivery)',
      publicationDate: '2022-10-10',
      statusVigency: 'vigente',
      reviewStatus: 'approved',
      url: 'https://www.gacetaoficial.gob.pa/pdfTemp/29641_A/94595.pdf'
    },
    {
      id: 'doc-3',
      docType: 'Resolución OAL',
      docNumber: '904',
      title: 'Uso obligatorio de chalecos con placa identificada',
      publicationDate: '2013-07-05',
      statusVigency: 'vigente',
      reviewStatus: 'approved',
      url: 'https://www.transito.gob.pa/resolucion-oal-904-2013'
    }
  ]);

  const [pendingDocs, setPendingDocs] = useState<LegalDocument[]>([
    {
      id: 'doc-pending-1',
      docType: 'Resolución Municipal',
      docNumber: 'Acuerdo 45',
      title: 'Regulación de circulación nocturna de motos en el Distrito de Panamá',
      publicationDate: '2026-07-10',
      statusVigency: 'pendiente_revision',
      reviewStatus: 'pending',
      reformNotes: 'Propone restricciones de horario nocturno de 10:00 PM a 4:00 AM',
      url: 'https://muni.panama.gob.pa/acuerdos/acuerdo-45-2026'
    }
  ]);

  const [auditLog, setAuditLog] = useState([
    {
      id: 'audit-1',
      user: 'admin@cascolegal.pa',
      action: 'Aprobación de Documento',
      table: 'legal_documents',
      justification: 'Carga inicial del Decreto 19 de 2022 de delivery',
      timestamp: 'Hace 2 horas'
    },
    {
      id: 'audit-2',
      user: 'admin@cascolegal.pa',
      action: 'Creación de Relación',
      table: 'normative_relations',
      justification: 'Vinculación de Art. 40-A como adición al Reglamento de Tránsito',
      timestamp: 'Hace 2 horas'
    }
  ]);

  const handleApprove = (id: string, docTitle: string) => {
    const docToApprove = pendingDocs.find(doc => doc.id === id);
    if (!docToApprove) return;

    // Mover de pendiente a aprobado
    setPendingDocs(prev => prev.filter(doc => doc.id !== id));
    setDocuments(prev => [
      ...prev,
      { ...docToApprove, reviewStatus: 'approved', statusVigency: 'vigente' }
    ]);

    // Registrar en auditoría
    setAuditLog(prev => [
      {
        id: `audit-${Date.now()}`,
        user: 'admin@cascolegal.pa',
        action: 'Aprobación de Documento',
        table: 'legal_documents',
        justification: `Aprobación humana del documento: ${docTitle}`,
        timestamp: 'Justo ahora'
      },
      ...prev
    ]);
  };

  const handleReject = (id: string) => {
    setPendingDocs(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 'bold' }}>Panel Administrativo de Curación Humana</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>cascolegal Panamá — Asegurando la integridad de la base vectorial RAG</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <UserCheck size={16} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.85rem' }}>admin@cascolegal.pa (Administrador)</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Fuentes Oficiales</span>
            <Globe size={18} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>3 Activas</div>
          <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.25rem' }}>Sincronización automatizada ok</p>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Documentos Publicados</span>
            <FileText size={18} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>{documents.length} Documentos</div>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>5 artículos vectorizados</p>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Pendientes de Aprobación</span>
            <Clock size={18} style={{ color: pendingDocs.length > 0 ? '#f59e0b' : '#94a3b8' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: pendingDocs.length > 0 ? '#f59e0b' : '#f8fafc' }}>
            {pendingDocs.length} Pendientes
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>Detección de reformas activa</p>
        </div>

        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '1.5rem', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <span>Consultas de Usuarios</span>
            <Database size={18} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>142 Consultas</div>
          <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.25rem' }}>Precisión RAG del 98.4%</p>
        </div>
      </div>

      {/* Main Split Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Documents management */}
        <div>
          {/* Pending Approval Section */}
          <div style={{ backgroundColor: '#151e33', border: '1px solid #24355a', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', borderBottom: '1px solid #24355a', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} style={{ color: '#f59e0b' }} />
              Cola de Ingestión y Revisión Humana Obligatoria
            </h2>

            {pendingDocs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                <CheckCircle size={32} style={{ color: '#10b981', margin: '0 auto 10px auto' }} />
                No hay documentos pendientes de revisión en este momento.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingDocs.map(doc => (
                  <div key={doc.id} style={{ backgroundColor: '#1b253d', border: '1px solid #2e4375', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {doc.docType} N° {doc.docNumber}
                        </span>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{doc.title}</h3>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Publicado: {doc.publicationDate}</span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid #f59e0b', marginBottom: '1rem' }}>
                      <strong>Detección del Parser Legal:</strong> {doc.reformNotes}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#94a3b8', fontSize: '0.75rem', border: '1px solid #334155', borderRadius: '6px', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        Ver PDF Original
                      </a>
                      <button 
                        onClick={() => handleReject(doc.id)}
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Rechazar
                      </button>
                      <button 
                        onClick={() => handleApprove(doc.id, doc.title)}
                        style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        Aprobar y Vectorizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Approved & Published Section */}
          <div style={{ backgroundColor: '#151e33', border: '1px solid #24355a', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', borderBottom: '1px solid #24355a', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
              Base de Datos de Leyes Aprobadas
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documents.map(doc => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid #24355a', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{doc.docType} N° {doc.docNumber}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>{doc.title}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {doc.statusVigency.replace('_', ' ')}
                    </span>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.75rem' }}>
                      PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Audit Log & AI Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Audit Logs */}
          <div style={{ backgroundColor: '#151e33', border: '1px solid #24355a', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', borderBottom: '1px solid #24355a', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} style={{ color: '#10b981' }} />
              Auditoría Administrativa
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {auditLog.map(log => (
                <div key={log.id} style={{ borderBottom: '1px solid #1e293b', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#10b981', margin: '4px 0' }}>{log.action}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{log.justification}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RAG Settings */}
          <div style={{ backgroundColor: '#151e33', border: '1px solid #24355a', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', borderBottom: '1px solid #24355a', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} />
              Configuración RAG
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Modelo Reranker</span>
                <span>Cohere Rerank v3 (Activo)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Modelo LLM</span>
                <span>Gemini 3.5 Flash</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Límite de Confianza</span>
                <span>Cosine &gt; 0.70</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Chunking Model</span>
                <span>Artículos Atómicos (Aprobado)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
