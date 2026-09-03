'use client';

import React, { useState } from 'react';
import { KnowledgeDoc } from '@/types/clinic';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  BookOpen,
  FileText,
  Layers,
  Sparkles,
  CheckCircle2,
  Printer,
} from 'lucide-react';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: KnowledgeDoc | null;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  isOpen,
  onClose,
  doc,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChunk, setSelectedChunk] = useState<number | null>(null);

  if (!isOpen || !doc) return null;

  const totalPages = Math.max(2, Math.ceil(doc.chunks / 10));

  const docFullTexts: Record<string, string[]> = {
    'doc-1': [
      `AURA CLINIC — STANDARD OPERATING PROCEDURE
Document ID: SOP-RET-001 | Version: 3.2 | Effective Date: January 15, 2026
Approved by: Dr. Chloe Vance, MD (Medical Director)

TITLE: 90-DAY VIP RETENTION & CHURN PREVENTION FRAMEWORK

1. PURPOSE & CLINICAL SCOPE
This clinical standard operating procedure defines the retention, rebooking, and VIP patient lifecycle management protocols for Aura Clinic. High-value patients (defined as cumulative lifetime spend ≥ $3,000 across neurotoxins, dermal fillers, biostimulators, and body contouring) require white-glove, proactive engagement to prevent clinical drop-off and ensure aesthetic continuity.

2. AT-RISK IDENTIFICATION CRITERIA
A patient is classified as "At-Risk Churn" when:
- 60–90 days have elapsed since their last aesthetic procedure without a forward-scheduled follow-up or touch-up appointment.
- Neurotoxin patients exceed 14 weeks post-treatment without rebooking.
- Filler patients exceed 9 months post-treatment without scheduled assessment.

3. THREE-TOUCH RECOVERY PROTOCOL
Touch 1 (Day 60): Clinical Outcome Assessment Email
- Sender: Medical Director (Dr. Vance's Office).
- Subject: "[Patient Name], how is your skin feeling 3 months post-treatment?"
- Content: Warm, non-sales check-in asking about comfort, symmetry, and longevity of results. Attach treatment maintenance guide.

Touch 2 (Day 74): Concierge Phone Follow-up
- Front desk coordinator offers a complimentary 10-minute in-person or virtual skin review with Dr. Vance.

Touch 3 (Day 90): Priority VIP Package Rebooking Incentive
- Curated bundle offer with private invitation to seasonal clinical upgrades.`,

      `AURA CLINIC — SOP-RET-001 (PAGE 2)

4. TREATMENT-SPECIFIC REBOOKING CADENCES
- Full Face Liquid Facelift: 90-day review; 6-month skin booster touch-up; 12-month structural refresh.
- Morpheus8 RF Microneedling: 3 sessions spaced 4–6 weeks apart, followed by annual maintenance session.
- CoolSculpting: 30-day contour check; 90-day final photography; cross-consultation for skin tightening.
- Sculptra Aesthetic: 2–3 vials spaced over 8-week intervals; 18-month collagen stimulation review.

5. PROVIDER DOCUMENTATION & METRICS
- All outreach must be logged in the clinic CRM within 2 hours of completion.
- Practice 90-Day Retention Target: ≥ 65% across all licensed aesthetic injectors.
- Monthly churn reviews conducted by Dr. Vance on the 1st Tuesday of every month.`,
    ],
    'doc-2': [
      `AURA CLINIC — 2026 COMPREHENSIVE PRICING & SYRINGE SCHEDULE
Confidential Practice Document | Effective: February 1, 2026
Supervising Physician: Dr. Chloe Vance, MD

1. NEUROTOXINS & WRINKLE RELAXERS
- Botox Cosmetic (Allergan): $15 per unit (Typical treatment: 30–64 units = $450 – $960)
- Dysport (Galderma): $5.50 per unit (Conversion factor 2.8:1)
- Xeomin (Merz): $14 per unit
- Full Face Refresh Package (Upper face + DAO + Platysma bands): $1,400 flat rate

2. DERMAL FILLERS & BIOSTIMULATORS
- Juvederm Voluma XC / Volux: $950 per 1.0 mL syringe (2-syringe bundle: $1,750)
- Restylane Kysse / Contour / Defyne: $850 per syringe
- Sculptra Aesthetic (Poly-L-Lactic Acid): $1,100 per vial (2-vial starter protocol: $2,000)
- Full Face Liquid Facelift Protocol: $4,800 – $6,800 (includes midface structural support, tear troughs, jawline contouring, and 50 units neurotoxin).`,

      `AURA CLINIC — 2026 PRICING SCHEDULE (PAGE 2)

3. ENERGY-BASED DEVICES & BODY CONTOURING
- Morpheus8 RF Microneedling (Full Face & Neck): $1,200 per session | 3-Pack: $3,100
- CoolSculpting Elite: $750 per cycle | 4-Cycle Abdomen Package: $2,600 | 8-Cycle Full Body: $4,800
- Laser Genesis Skin Therapy: $350 per session | 6-Session Package: $1,800

4. CLINICAL FINANCING & VIP MEMBERSHIP
- Aura Platinum Tier: $199/month accrual with 15% discount on all injectables and complimentary monthly HydraFacial.
- 0% APR 12-month patient financing available via CareCredit and PatientFi.`,
    ],
  };

  const pages = docFullTexts[doc.id] || [
    `AURA CLINIC — PROTOCOL DOCUMENT\nTitle: ${doc.title}\nCategory: ${doc.category}\n\n${doc.description}\n\nIndexed Chunks: ${doc.chunks} vectors embedded into Supabase pgvector.\nSemantic dimensions: 1024 (Jina v3 embedding model).\n\nClinical guidelines and operational workflows are fully connected to the AI Coach engine for real-time practice retrieval.`,
    `AURA CLINIC — PROTOCOL DOCUMENT (PAGE 2)\n\nStaff Compliance & Quality Assurance:\n- All clinicians and front-desk coordinators must review and certify adherence annually.\n- Audit logs maintained in clinic management system.`,
  ];

  const currentPageText = pages[currentPage - 1] || pages[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#FAF9F6] border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-serif font-bold text-slate-900">{doc.title}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 font-mono">
                  {doc.type}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF3EA] text-[#1E3A2B] border border-[#D5E6D3]">
                  {doc.chunks} Chunks Indexed
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                {doc.category} · Updated {doc.updated} · Vectorized in pgvector
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Toolbar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          
          {/* Page Switcher */}
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-semibold text-slate-800">
              Page {currentPage} of {pages.length}
            </span>
            <button
              disabled={currentPage >= pages.length}
              onClick={() => setCurrentPage((p) => Math.min(pages.length, p + 1))}
              className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar within Document */}
          <div className="relative w-64 hidden sm:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in document..."
              className="w-full pl-8 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-slate-700">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Reader Document Canvas (Alabaster Paper) */}
        <div className="flex-1 bg-slate-100/70 p-6 overflow-y-auto flex justify-center items-start">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200/90 p-10 max-w-3xl w-full min-h-[600px] transition-transform duration-150 space-y-4"
          >
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                AURA PRACTICE REPOSITORY
              </span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified RAG Vector</span>
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
              {currentPageText}
            </div>

            <div className="border-t border-slate-100 pt-6 mt-8 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Aura Clinic Clinical Advisory Board</span>
              <span>Page {currentPage} of {pages.length}</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="px-6 py-3 bg-[#FAF9F6] border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>This document is indexed into pgvector and queried by your AI Coach during live sessions.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1E3A2B] hover:bg-[#162D21] text-white text-xs font-bold transition shadow-xs"
          >
            Done reading
          </button>
        </div>

      </div>
    </div>
  );
};
