'use client';

import React, { useState } from 'react';
import { ingestKnowledge } from '@/lib/n8nClient';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Database,
  ArrowRight,
  BookOpen,
  Eye,
  X,
  Search,
  Check,
} from 'lucide-react';

interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  chunks: number;
  content: string;
  status: string;
  createdAt: string;
}

const INITIAL_KNOWLEDGE_LIBRARY: KnowledgeItem[] = [
  {
    id: 'kb-01',
    title: 'Neurotoxin & Dermal Filler 6-8 Week Rebooking Protocol',
    category: 'Injectables',
    chunks: 2,
    content: 'Client Retention Protocols for Aesthetic Clinics: Best practice requires scheduling a follow-up 6 to 8 weeks after any neurotoxin or dermal filler procedure. Clinics implementing automated 14-day check-in SMS messages experience a 38% higher rebooking rate.',
    status: 'Vectorized in pgvector',
    createdAt: '2026-09-02',
  },
  {
    id: 'kb-02',
    title: 'HydraFacial to Laser Genesis Membership Upsell SOP',
    category: 'Skin & Laser',
    chunks: 3,
    content: 'Skin Rejuvenation SOP: Patients booking monthly HydraFacial treatments have a 64% likelihood of accepting a Laser Genesis package upgrade when presented with visual skin tone progress scans during treatment #3.',
    status: 'Vectorized in pgvector',
    createdAt: '2026-09-02',
  },
  {
    id: 'kb-03',
    title: '90-Day Inactive VIP Patient Concierge Outreach Guide',
    category: 'VIP Retention',
    chunks: 3,
    content: 'VIP Patient Reactivation: For clients with cumulative spend over $3,500 who have not visited in 90+ days, clinical providers should initiate personal concierge outreach offering a complimentary 15-minute diagnostic skin analysis. Average reactivation rate: 42%.',
    status: 'Vectorized in pgvector',
    createdAt: '2026-09-02',
  },
  {
    id: 'kb-04',
    title: 'Morpheus8 RF Microneedling 3-Session Package SOP',
    category: 'Advanced Aesthetics',
    chunks: 4,
    content: 'Morpheus8 Clinical Guidelines: RF Microneedling achieves optimal collagen remodeling across 3 sessions spaced 4–6 weeks apart. Patients should be rebooked for session 2 before leaving the consultation room.',
    status: 'Vectorized in pgvector',
    createdAt: '2026-09-02',
  },
];

const PRESET_PROTOCOLS = [
  {
    title: 'Neurotoxin & Filler 6-8 Week Rebooking Protocol',
    category: 'Injectables',
    content: 'Client Retention Protocols for Aesthetic Clinics: Best practice requires scheduling a follow-up 6 to 8 weeks after any neurotoxin or dermal filler procedure. Clinics implementing automated 14-day check-in SMS messages experience a 38% higher rebooking rate.',
  },
  {
    title: 'HydraFacial to Laser Genesis Membership Upsell SOP',
    category: 'Skin & Laser',
    content: 'Skin Rejuvenation SOP: Patients booking monthly HydraFacial treatments have a 64% likelihood of accepting a Laser Genesis package upgrade when presented with visual skin tone progress scans during treatment #3.',
  },
  {
    title: '90-Day Inactive VIP Patient Outreach Guide',
    category: 'VIP Retention',
    content: 'VIP Patient Reactivation: For clients with cumulative spend over $3,500 who have not visited in 90+ days, clinical providers should initiate personal concierge outreach offering a complimentary 15-minute diagnostic skin analysis. Average reactivation rate: 42%.',
  },
];

export const KnowledgeBaseTab: React.FC = () => {
  const [textContent, setTextContent] = useState('');
  const [docName, setDocName] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [library, setLibrary] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE_LIBRARY);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');

  const handleIngest = async (customContent?: string, customName?: string) => {
    const contentToIngest = customContent || textContent;
    const nameToIngest = customName || docName || 'Clinical SOP Protocol';

    if (!contentToIngest.trim()) return;

    setIsIngesting(true);
    setStatusMessage(null);

    try {
      await ingestKnowledge({
        content: contentToIngest,
        document_id: 'doc-' + Date.now(),
        file_name: nameToIngest,
      });

      const newItem: KnowledgeItem = {
        id: 'kb-' + Date.now(),
        title: nameToIngest,
        category: 'Clinical Protocol',
        chunks: Math.max(1, Math.ceil(contentToIngest.length / 450)),
        content: contentToIngest,
        status: 'Vectorized in pgvector',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setLibrary((prev) => [newItem, ...prev]);

      setStatusMessage({
        type: 'success',
        text: `Successfully vectorized "${nameToIngest}" into Supabase pgvector with Jina AI 1024-dim embeddings!`,
      });

      setTextContent('');
      setDocName('');
    } catch (err: any) {
      console.error('[Ingest Error]:', err);
      setStatusMessage({
        type: 'error',
        text: `Ingestion failed: ${err.message}`,
      });
    } finally {
      setIsIngesting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTextContent(text);
    };
    reader.readAsText(file);
  };

  const filteredLibrary = library.filter(
    (item) =>
      item.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      item.category.toLowerCase().includes(librarySearch.toLowerCase()) ||
      item.content.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 relative overflow-hidden bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-sm">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">RAG Knowledge Base & Vector Hub</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                1024-dim Jina v3 Embeddings
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload clinic treatment guidelines, pricing structures, and retention scripts. The AI Coach references these during executive coaching.
            </p>
          </div>
        </div>

        {/* View All Knowledge Button */}
        <button
          onClick={() => setIsLibraryModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition shadow-sm self-start md:self-auto"
        >
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>View All Knowledge ({library.length} SOPs)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: Upload & Ingest Box */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200 space-y-4 bg-white shadow-sm">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Ingest Document or SOP Text
            </span>

            {/* Document Title & File Upload Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Document Name (e.g. 2026 Injectable Pricing SOP)"
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 font-medium"
              />

              <label className="flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer transition shadow-sm">
                <UploadCloud className="w-4 h-4 text-amber-700" />
                <span>Upload TXT / PDF File</span>
                <input type="file" accept=".txt,.pdf,.md" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Textarea */}
            <textarea
              rows={7}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste clinical SOPs, treatment descriptions, pricing sheets, or customer retention guidelines here..."
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
            />

            {/* Ingest Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-mono font-medium">
                {textContent.length} characters ({Math.max(1, Math.ceil(textContent.length / 450))} chunks)
              </span>

              <button
                onClick={() => handleIngest()}
                disabled={!textContent.trim() || isIngesting}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isIngesting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
                <span>{isIngesting ? 'Vectorizing with Jina...' : 'Vectorize into Knowledge Base'}</span>
              </button>
            </div>

            {/* Status Alert */}
            {statusMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center space-x-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 font-medium'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COL: Quick Preset Protocols */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200 space-y-3 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Quick Clinical Presets
              </span>
              <span className="text-[10px] text-amber-700 font-bold">1-Click Ingest</span>
            </div>

            <div className="space-y-2.5">
              {PRESET_PROTOCOLS.map((p, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition flex flex-col justify-between space-y-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{p.title}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">{p.content}</p>
                  </div>

                  <button
                    onClick={() => handleIngest(p.content, p.title)}
                    disabled={isIngesting}
                    className="flex items-center space-x-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 hover:underline transition self-end pt-1"
                  >
                    <span>Ingest Protocol</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* VIEW ALL KNOWLEDGE MODAL */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Vectorized Knowledge Library</h3>
                  <p className="text-xs text-slate-500">
                    {library.length} Clinical Protocols & SOPs indexed in Supabase pgvector
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsLibraryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar in Modal */}
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  placeholder="Search stored protocols, SOPs, categories..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Knowledge Table */}
            <div className="p-4 overflow-y-auto space-y-3">
              {filteredLibrary.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-500">
                  No matching protocols found in knowledge base.
                </div>
              ) : (
                filteredLibrary.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-amber-300 transition space-y-2 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <span className="font-mono">{item.chunks} chunks</span>
                        <span>•</span>
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
                          <Check className="w-3 h-3" />
                          <span>{item.status}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                      {item.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Embedding Model: Jina-Embeddings-v3 (1024 Dimensions)</span>
              <button
                onClick={() => setIsLibraryModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold transition shadow-sm"
              >
                Close Library
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
