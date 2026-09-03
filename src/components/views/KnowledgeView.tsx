'use client';

import React, { useState } from 'react';
import { KnowledgeDoc } from '@/types/clinic';
import { ingestKnowledge } from '@/lib/n8nClient';
import {
  Upload,
  BookOpen,
  Layers,
  Clock,
  CheckCircle2,
  Search,
  ChevronDown,
  MoreVertical,
  FileText,
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
    description:
      'This SOP outlines the 90-day VIP retention framework for high-value patients. It includes outreach cadences, rebooking incentives, and service recommendations based on treatment history.\n\nFollow the 3-touch sequence to re-engage inactive VIPs and maximize lifetime value.',
  },
  {
    id: 'doc-2',
    title: 'Injectables Pricing 2026',
    category: 'Pricing',
    type: 'PDF',
    chunks: 28,
    status: 'Ready',
    updated: '18 min ago',
    description:
      'Comprehensive 2026 price schedule for neurotoxins (Botox, Dysport, Xeomin), dermal fillers (Juvederm, Restylane), and biostimulators (Sculptra). Outlines syringe package discounts and membership tiers.',
  },
  {
    id: 'doc-3',
    title: 'Neurotoxin & Filler Rebooking Protocol',
    category: 'Treatment',
    type: 'PDF',
    chunks: 42,
    status: 'Ready',
    updated: '35 min ago',
    description:
      'Clinical standard operating procedure requiring mandatory 14-day post-procedure check-in SMS and scheduling 6–8 week touch-ups before the patient leaves the clinic.',
  },
  {
    id: 'doc-4',
    title: 'Consultation Objection Script',
    category: 'Sales',
    type: 'TXT',
    chunks: 31,
    status: 'Ready',
    updated: '1 hr ago',
    description:
      'Proven objection-handling scripts for front desk and patient coordinators addressing price objections, downtime concerns, and treatment bundle value comparisons.',
  },
  {
    id: 'doc-5',
    title: 'Laser Genesis Staff SOP',
    category: 'Operations',
    type: 'PDF',
    chunks: 49,
    status: 'Ready',
    updated: 'Just now',
    description:
      'Operational guidelines for laser room setup, patient skin typing, safety protocols, and post-treatment hydration regimen recommendations.',
  },
];

export const KnowledgeView: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(INITIAL_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc>(INITIAL_DOCS[0]);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = (event.target?.result as string) || '';
      try {
        await ingestKnowledge({
          content: text || 'Clinical Treatment SOP Document',
          document_id: 'doc-' + Date.now(),
          file_name: file.name,
        });

        const newDoc: KnowledgeDoc = {
          id: 'doc-' + Date.now(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: 'Clinical Protocol',
          type: file.name.endsWith('.txt') ? 'TXT' : 'PDF',
          chunks: Math.max(1, Math.ceil((text.length || 500) / 450)),
          status: 'Ready',
          updated: 'Just now',
          description: text.slice(0, 300) || 'Uploaded clinical SOP indexed into Supabase pgvector.',
        };

        setDocs((prev) => [newDoc, ...prev]);
        setSelectedDoc(newDoc);
        setUploadStatus(`Successfully vectorized "${file.name}" with 1024-dim Jina v3 embeddings!`);
      } catch (err: any) {
        setUploadStatus(`Upload failed: ${err.message}`);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const filteredDocs = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

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

        <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition shadow-xs cursor-pointer self-start sm:self-auto">
          <Upload className="w-3.5 h-3.5 text-slate-600" />
          <span>Upload document</span>
          <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sans text-slate-900">6</h3>
            <p className="text-[11px] text-slate-500 font-medium">Documents</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sans text-slate-900">184</h3>
            <p className="text-[11px] text-slate-500 font-medium">Knowledge chunks</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 font-sans">Last indexed</p>
            <p className="text-[11px] text-slate-500 font-medium">4 min ago</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
              RAG ready
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">1024-dim pgvector</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Knowledge Library + Right Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Knowledge Library Table + Preview */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 font-sans">Knowledge library</h3>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents"
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center space-x-1 text-xs border border-slate-200 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 font-medium">
                  <span>All types</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Documents Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-2">Document</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Type</th>
                    <th className="py-3 px-2">Chunks</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2">Updated</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => {
                    const isSelected = selectedDoc.id === doc.id;
                    return (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`transition cursor-pointer ${
                          isSelected ? 'bg-[#EBF3EA]/60 font-semibold' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-rose-600 flex-shrink-0" />
                            <span className="text-slate-900 font-sans">{doc.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-600">{doc.category}</td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                            {doc.type}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-600 font-mono">{doc.chunks}</td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center space-x-1 text-emerald-700 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            <span>{doc.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-500">{doc.updated}</td>
                        <td className="py-3 px-2 text-right">
                          <button className="p-1 rounded text-slate-400 hover:text-slate-700">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

          {/* Document Preview Card */}
          {selectedDoc && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <h4 className="text-xs font-bold text-slate-900 font-sans">{selectedDoc.title}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF3EA] text-[#1E3A2B] border border-[#D5E6D3]">
                    {selectedDoc.chunks} chunks indexed
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {selectedDoc.description}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Upload Dropzone & Retrieval Settings */}
        <div className="space-y-4">
          
          {/* Add Clinic Knowledge Dropzone */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Add clinic knowledge</h3>

            <label className="border-2 border-dashed border-slate-200 hover:border-emerald-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer bg-slate-50/50 hover:bg-emerald-50/20 transition group">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-emerald-700 shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 font-sans">Drop a PDF or TXT file here</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Maximum 10 MB</p>
              </div>

              <button
                type="button"
                className="px-5 py-2 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs pointer-events-none"
              >
                {isUploading ? 'Vectorizing...' : 'Choose file'}
              </button>

              <input type="file" accept=".pdf,.txt,.md" onChange={handleFileUpload} className="hidden" />
            </label>

            {uploadStatus && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          {/* Retrieval Settings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-sans">Retrieval settings</h3>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Semantic search</p>
                  <p className="text-[11px] text-slate-400">Understand meaning, not just keywords</p>
                </div>
                <span className="font-bold text-emerald-700">On</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Top results</p>
                  <p className="text-[11px] text-slate-400">Number of relevant chunks to retrieve</p>
                </div>
                <span className="font-mono font-bold text-slate-900">5</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Similarity threshold</p>
                  <p className="text-[11px] text-slate-400">Minimum relevance required</p>
                </div>
                <span className="font-mono font-bold text-slate-900">0.72</span>
              </div>

            </div>

            <p className="text-[10px] text-slate-400 pt-1">
              These settings help your AI Coach retrieve the most relevant information from your knowledge base.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
