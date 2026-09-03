'use client';

import React, { useState, useEffect } from 'react';
import { KnowledgeDoc } from '@/types/clinic';
import { DocumentReaderModal } from '../DocumentReaderModal';
import {
  BookOpen,
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  Search,
  Sparkles,
  ExternalLink,
  Layers,
  Database,
  Eye,
  Lock,
  Plus,
} from 'lucide-react';

const INITIAL_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc-1',
    title: 'VIP Retention SOP',
    category: 'Retention',
    type: 'PDF',
    chunks: 34,
    status: 'Ready',
    updated: '2 min ago',
    description: 'Outlines the 90-day retention framework, high-value outreach cadences, and clinical drop-off protocols for VIP aesthetic clients.',
    isBuiltIn: true,
  },
  {
    id: 'doc-2',
    title: 'Injectables Pricing 2026',
    category: 'Pricing',
    type: 'PDF',
    chunks: 28,
    status: 'Ready',
    updated: '18 min ago',
    description: 'Comprehensive price schedule for Botox ($15/unit), Dysport, dermal fillers ($850-$950/syringe), and Liquid Facelift bundles.',
    isBuiltIn: true,
  },
  {
    id: 'doc-3',
    title: 'Neurotoxin & Filler Rebooking Protocol',
    category: 'Treatment',
    type: 'PDF',
    chunks: 42,
    status: 'Ready',
    updated: '35 min ago',
    description: 'Clinical standard operating procedures for 10-14 week neurotoxin touch-ups, masseter rebooking, and combination biostimulators.',
    isBuiltIn: true,
  },
  {
    id: 'doc-4',
    title: 'Consultation Objection Handling Script',
    category: 'Sales',
    type: 'TXT',
    chunks: 31,
    status: 'Ready',
    updated: '1 hr ago',
    description: 'Scripts for patient coordinators to overcome hesitation, navigate budget conversations, and present CareCredit 0% financing.',
    isBuiltIn: true,
  },
  {
    id: 'doc-5',
    title: 'Laser Genesis & RF Microneedling SOP',
    category: 'Operations',
    type: 'PDF',
    chunks: 49,
    status: 'Ready',
    updated: 'Just now',
    description: 'Operational and clinical guidelines for Morpheus8 RF microneedling 3-session packages and Laser Genesis post-care compliance.',
    isBuiltIn: true,
  },
];

const STORAGE_KEY = 'aura_clinic_knowledge_docs';

export const KnowledgeView: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(INITIAL_DOCS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDocForModal, setActiveDocForModal] = useState<KnowledgeDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Load docs from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setDocs(JSON.parse(saved));
        } catch (e) {
          setDocs(INITIAL_DOCS);
        }
      }
    }
  }, []);

  const saveDocs = (updated: KnowledgeDoc[]) => {
    setDocs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const totalChunks = docs.reduce((sum, d) => sum + d.chunks, 0);

  const filteredDocs = docs.filter((d) => {
    if (selectedCategory !== 'all' && d.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenPdfReader = (doc: KnowledgeDoc) => {
    setActiveDocForModal(doc);
    setIsModalOpen(true);
  };

  const handleUpdateDocContent = (docId: string, updatedPages: { title: string; content: string }[]) => {
    const updated = docs.map((d) => {
      if (d.id === docId) {
        return {
          ...d,
          contentPages: updatedPages,
          updated: 'Just now (Edited)',
        };
      }
      return d;
    });
    saveDocs(updated);
    if (activeDocForModal && activeDocForModal.id === docId) {
      setActiveDocForModal({ ...activeDocForModal, contentPages: updatedPages, updated: 'Just now (Edited)' });
    }
  };

  const handleDeleteUploadedDoc = (docId: string) => {
    const updated = docs.filter((d) => d.id !== docId);
    saveDocs(updated);
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: KnowledgeDoc = {
        id: `upload-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Clinical Protocol',
        type: file.name.endsWith('.pdf') ? 'PDF' : 'TXT',
        chunks: Math.floor(Math.random() * 20) + 15,
        status: 'Ready',
        updated: 'Just now',
        description: `Uploaded clinical practice document: ${file.name}. Vectorized into Supabase pgvector.`,
        isBuiltIn: false,
        contentPages: [
          {
            title: `SECTION 1: ${file.name.toUpperCase()}`,
            content: `AURA CLINIC — CLINICAL UPLOADED PROTOCOL\nDocument: ${file.name}\nUploaded by: Dr. Chloe Vance, MD\n\nContent vectorized into 1024-dim semantic embeddings via Railway n8n and Jina v3.\nThis document is now available for real-time RAG context retrieval by your AI Practice Coach.`,
          },
        ],
      };

      saveDocs([newDoc, ...docs]);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12 w-full">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            Clinic Knowledge
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-sans">
            Give your AI Coach trusted policies, treatment guides, pricing, scripts, and SOPs.
          </p>
        </div>

        <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto">
          <UploadCloud className="w-4 h-4 text-amber-300" />
          <span>Upload document</span>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleSimulateUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span>Documents</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{docs.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">5 core SOPs active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Knowledge Chunks</span>
            </div>
            <h3 className="text-2xl font-bold font-sans text-slate-900 mt-1">{totalChunks}</h3>
            <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">Indexed vectors</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <Database className="w-4 h-4 text-amber-700" />
              <span>Last Indexed</span>
            </div>
            <h3 className="text-sm font-bold font-sans text-slate-900 mt-2">2 min ago</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">pgvector sync ready</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>RAG Engine</span>
            </div>
            <h3 className="text-sm font-bold font-sans text-emerald-800 mt-2">Active & Grounded</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">Jina v3 1024-dim</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Left Library, Right Drag & Drop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Knowledge Library Table */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 font-sans">Knowledge library</h3>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {['all', 'Retention', 'Pricing', 'Treatment', 'Sales', 'Operations'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${
                      selectedCategory === cat
                        ? 'bg-[#1E3A2B] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search protocols, pricing guides, or clinical SOPs..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Docs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-2">Document</th>
                    <th className="py-2.5 px-2">Category</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2">Chunks</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-2">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <p className="font-bold text-slate-900 font-sans">{d.title}</p>
                              {d.isBuiltIn && (
                                <span title="Core Practice SOP (Non-deletable)">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{d.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-slate-600 font-medium">{d.category}</td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                          {d.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-700 font-bold">{d.chunks}</td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ● Ready
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-1">
                        <button
                          onClick={() => handleOpenPdfReader(d)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#1E3A2B] hover:bg-[#EBF3EA] text-[#1E3A2B] text-[11px] font-bold inline-flex items-center space-x-1 shadow-xs transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{d.isBuiltIn ? 'Read / Edit SOP' : 'Read PDF'}</span>
                        </button>

                        {!d.isBuiltIn && (
                          <button
                            onClick={() => handleDeleteUploadedDoc(d.id)}
                            className="p-1 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                            title="Delete uploaded document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* SOP Spotlight Banner */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold text-slate-900 font-sans">
                  VIP Retention SOP (SOP-RET-001)
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 font-mono">
                  34 chunks indexed
                </span>
              </div>

              <button
                onClick={() => handleOpenPdfReader(docs[0])}
                className="text-xs font-bold text-[#1E3A2B] hover:underline flex items-center space-x-1"
              >
                <span>Open luxury PDF viewer</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              This clinical SOP defines the 90-day VIP retention framework for high-value patients. It includes automated email check-in templates, 14-day touch-up schedules, and pricing incentives.
            </p>
          </div>

        </div>

        {/* Right 1 Col: Upload & RAG Settings */}
        <div className="space-y-4">
          
          {/* Upload Area */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Add clinic knowledge</h3>

            <label className="border-2 border-dashed border-slate-200 hover:border-[#1E3A2B] hover:bg-[#EBF3EA]/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 font-sans">
                {isUploading ? 'Vectorizing and chunking...' : 'Drop a PDF or TXT file here'}
              </p>
              <p className="text-[10px] text-slate-400 font-sans">Maximum 10 MB · Semantic chunking</p>
              <span className="px-3 py-1 rounded-xl bg-[#1E3A2B] text-white text-[11px] font-bold mt-1 shadow-xs">
                Choose file
              </span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleSimulateUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Document successfully vectorized into pgvector!</span>
              </div>
            )}
          </div>

          {/* RAG Settings Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Retrieval settings</h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Semantic search</span>
              <span className="font-bold text-emerald-700 font-mono">On (Jina v3)</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">Top results (k)</span>
              <span className="font-bold text-slate-900 font-mono">5 chunks</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-600">Similarity threshold</span>
              <span className="font-bold text-slate-900 font-mono">0.72</span>
            </div>

            <p className="text-[10px] text-slate-400 pt-1 leading-relaxed font-sans">
              These settings help your AI Coach retrieve only the most relevant clinical protocols for patient questions.
            </p>
          </div>

        </div>

      </div>

      {/* Full-Screen Continuous Document Reader Modal with In-App Editing */}
      <DocumentReaderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doc={activeDocForModal}
        onUpdateDocContent={handleUpdateDocContent}
        onDeleteDoc={handleDeleteUploadedDoc}
      />

    </div>
  );
};
