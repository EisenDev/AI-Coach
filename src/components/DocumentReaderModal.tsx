'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { KnowledgeDoc } from '@/types/clinic';
import {
  X,
  Search,
  Download,
  Printer,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Sparkles,
  CheckCircle2,
  FileText,
  Bookmark,
  Edit3,
  Save,
  Trash2,
  Lock,
  RefreshCw,
} from 'lucide-react';

interface DocumentReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  doc: KnowledgeDoc | null;
  onUpdateDocContent?: (docId: string, updatedPages: { title: string; content: string }[]) => void;
  onDeleteDoc?: (docId: string) => void;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  isOpen,
  onClose,
  doc,
  onUpdateDocContent,
  onDeleteDoc,
}) => {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // In-App Protocol Editing State (For Built-in Clinical SOPs)
  const [isEditing, setIsEditing] = useState(false);
  const [editablePages, setEditablePages] = useState<{ title: string; content: string }[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultPagesMap: Record<string, { title: string; content: string }[]> = {
    'doc-1': [
      {
        title: 'SECTION 1: 90-DAY VIP RETENTION FRAMEWORK',
        content: `AURA CLINIC — STANDARD OPERATING PROCEDURE
Document ID: SOP-RET-001 | Version: 3.2 | Effective Date: January 15, 2026
Supervising Physician: Dr. Chloe Vance, MD (Medical Director)

1. PURPOSE & CLINICAL SCOPE
This clinical standard operating procedure defines the retention, rebooking, and VIP patient lifecycle management protocols for Aura Clinic. High-value patients (defined as cumulative lifetime spend ≥ $3,000 across neurotoxins, dermal fillers, biostimulators, and body contouring) require white-glove, proactive engagement to prevent clinical drop-off and ensure aesthetic continuity.

2. AT-RISK IDENTIFICATION CRITERIA
A patient is classified as "At-Risk Churn" when:
• 60–90 days have elapsed since their last aesthetic procedure without a forward-scheduled follow-up or touch-up appointment.
• Neurotoxin patients exceed 14 weeks post-treatment without rebooking.
• Filler patients exceed 9 months post-treatment without scheduled assessment.
• Morpheus8 patients complete 1 or 2 sessions but fail to schedule the remaining protocol within 6 weeks.

3. THREE-TOUCH RECOVERY PROTOCOL
Touch 1 (Day 60): Clinical Outcome Assessment Email
- Sender: Medical Director (Dr. Vance's Office).
- Subject: "[Patient Name], how is your skin feeling 3 months post-treatment?"
- Content: Warm, non-sales check-in asking about comfort, symmetry, and longevity of results. Attach treatment maintenance guide.

Touch 2 (Day 74): Concierge Phone Follow-up
- Front desk coordinator offers a complimentary 10-minute in-person or virtual skin review with Dr. Vance.

Touch 3 (Day 90): Priority VIP Package Rebooking Incentive
- Curated bundle offer with private invitation to seasonal clinical upgrades.`,
      },
      {
        title: 'SECTION 2: TREATMENT-SPECIFIC REBOOKING CADENCES',
        content: `AURA CLINIC — SOP-RET-001 (PAGE 2)

4. TREATMENT-SPECIFIC REBOOKING CADENCES
• Full Face Liquid Facelift:
  - 14-day post-procedure symmetry & swelling review.
  - 90-day maintenance touch-up and skin booster assessment.
  - 12-month structural refresh.

• Morpheus8 RF Microneedling:
  - Series of 3 sessions spaced 4–6 weeks apart.
  - Followed by 6-month collagen booster and annual maintenance.

• CoolSculpting Elite:
  - 30-day post-treatment contour check.
  - 90-day final photography and cross-consultation for skin tightening.

• Sculptra Aesthetic:
  - 2 to 3 sessions spaced 6 weeks apart.
  - Annual single-vial collagen maintenance booster.`,
      },
      {
        title: 'SECTION 3: CONCIERGE PATIENT CARE SCRIPTS',
        content: `AURA CLINIC — SOP-RET-001 (PAGE 3)

5. CONCIERGE SCRIPTS FOR CLINICAL COORDINATORS
Email Script for Liquid Facelift Follow-up (Day 60):
"Dear [Patient Name], Dr. Vance and our clinical team wanted to check in on your results. At the 2-month mark, your dermal integration and subtle contours should look beautifully refreshed. We invite you to schedule a complimentary 10-minute symmetry check with Dr. Vance next week."

Phone Script for 90-Day Lapsed Patients:
"Hi [Patient Name], this is [Coordinator Name] from Dr. Vance's office at Aura Clinic. Dr. Vance was reviewing patient charts this morning and noted you are approaching the optimal window for your preventative maintenance. We have two priority openings reserved for Dr. Vance's existing patients next Thursday. May I hold one for you?"`,
      },
      {
        title: 'SECTION 4: KPI COMPLIANCE & ESCALATION',
        content: `AURA CLINIC — SOP-RET-001 (PAGE 4)

6. PRACTICE TARGETS & AUDIT METRICS
• Minimum 90-Day Rebooking Target: 65% across all injectable patients.
• VIP Diamond Retention Rate: 85% for patients spending > $5,000 annually.
• Weekly Practice Review: Every Monday at 8:30 AM, practice director reviews at-risk patient pipeline.`,
      },
    ],
    'doc-2': [
      {
        title: 'SECTION 1: 2026 INJECTABLES PRICING & BUNDLES',
        content: `AURA CLINIC — OFFICIAL 2026 PRICING SCHEDULE
Effective Date: January 1, 2026 | Approved by: Dr. Chloe Vance, MD

1. NEUROTOXINS
• Botox Cosmetic (Allergan): $15 per unit
  - Average Treatment: 30–64 units ($450–$960)
  - Glabella (11s): 20–25 units ($300–$375)
  - Forehead: 10–20 units ($150–$300)
  - Crow's Feet: 12–24 units ($180–$360)
  - Masseter Slimming: 40–60 units ($600–$900)
• Dysport (Galderma): $5.50 per unit (2.8:1 conversion)

2. DERMAL FILLERS & BIOSTIMULATORS
• Juvederm Ultra Plus XC (1.0 mL): $850 / syringe
• Juvederm Voluma XC (Cheeks/Chin): $950 / syringe (2 Syringes: $1,750)
• Restylane Kysse (Lip Definition): $850 / syringe
• Sculptra Aesthetic (Poly-L-Lactic Acid): $1,100 / vial (2-Vial Protocol: $2,000)

3. SIGNATURE CLINICAL PACKAGES
• Full Face Liquid Facelift: $4,800–$6,800
• Executive Bro-tox Annual Pass: $1,400 / quarter`,
      },
    ],
    'doc-3': [
      {
        title: 'SECTION 1: NEUROTOXIN & FILLER REBOOKING PROTOCOL',
        content: `AURA CLINIC — INJECTABLE REBOOKING SOP
Document ID: SOP-INJ-002 | Effective: Feb 2026

1. OPTIMAL CLINICAL REBOOKING WINDOWS
• Neurotoxins (Botox / Dysport): Rebook at 10–14 weeks post-treatment.
• Dermal Fillers (Hyaluronic Acid): Rebook at 6–9 months for assessment.
• Biostimulators (Sculptra): Rebook at 6 weeks for session 2, 12 months for annual booster.

2. PRE-BOOKING AT CHECKOUT (MANDATORY)
Patient Care Coordinators must schedule the next maintenance appointment during checkout before the patient leaves the clinic.`,
      },
    ],
    'doc-4': [
      {
        title: 'SECTION 1: CONSULTATION OBJECTION HANDLING SCRIPT',
        content: `AURA CLINIC — CONSULTATION CONVERSION & OBJECTION SCRIPT
For Aesthetic Coordinators & Clinicians

1. HANDLING THE PRICE OBJECTION ("It's more expensive than I thought")
Coordinator Response:
"I completely understand. When you invest in your face, the results depend entirely on physician anatomical precision and product longevity. Dr. Vance crafts a 12-month facial roadmap so you receive optimal natural lifting without ever looking overfilled. We also offer 0% APR 12-month financing with CareCredit so you can get started today for just $180/month."

2. HANDLING THE HESITATION OBJECTION ("I need to think about it")
Coordinator Response:
"Of course! Dr. Vance's priority is that you feel 100% confident. Let's reserve your procedural slot for next Thursday so you maintain your preferred time, and we will email you your personalized 3D facial plan to review at home."`,
      },
    ],
    'doc-5': [
      {
        title: 'SECTION 1: LASER GENESIS & RF MICRONEEDLING SOP',
        content: `AURA CLINIC — ENERGY DEVICE CLINICAL PROTOCOL
Supervising Physician: Dr. Chloe Vance, MD

1. PRE-PROCEDURAL SCREENING
• Contraindications: Active cold sores, pregnancy, recent Accutane use within 6 months.
• Patch test required on Fitzpatrick skin types IV-VI prior to high-frequency RF.

2. POST-CARE PROTOCOL
• Apply cold compress and clinical peptide soothing balm.
• Advise strict SPF 50+ broad-spectrum protection for 14 days post-procedure.`,
      },
    ],
  };

  useEffect(() => {
    if (doc) {
      const initial = doc.contentPages || defaultPagesMap[doc.id] || [
        {
          title: 'PAGE 1: CLINICAL DOCUMENT',
          content: `${doc.title}\nCategory: ${doc.category}\n\n${doc.description}\n\nIndexed in Supabase pgvector (Jina v3 1024-dim embeddings).`,
        },
      ];
      setEditablePages(initial);
      setIsEditing(false);
    }
  }, [doc]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isEditing) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEditing, onClose]);

  if (!isOpen || !doc || !mounted) return null;

  const isBuiltInDoc = doc.isBuiltIn !== false; // doc-1 through doc-5 are built-in

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerTop = scrollContainerRef.current.scrollTop;
    const containerHeight = scrollContainerRef.current.clientHeight;

    pageRefs.current.forEach((el, idx) => {
      if (el) {
        const offsetTop = el.offsetTop - scrollContainerRef.current!.offsetTop;
        if (containerTop + containerHeight / 3 >= offsetTop) {
          setCurrentPage(idx + 1);
        }
      }
    });
  };

  const scrollToPage = (pageIndex: number) => {
    const target = pageRefs.current[pageIndex - 1];
    if (target && scrollContainerRef.current) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageIndex);
    }
  };

  const handlePageContentChange = (pageIndex: number, newContent: string) => {
    const updated = [...editablePages];
    updated[pageIndex] = { ...updated[pageIndex], content: newContent };
    setEditablePages(updated);
  };

  const handleSaveProtocol = () => {
    if (onUpdateDocContent && doc) {
      onUpdateDocContent(doc.id, editablePages);
    }
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDownload = () => {
    const fullText = editablePages.map((p, i) => `--- PAGE ${i + 1}: ${p.title} ---\n${p.content}`).join('\n\n');
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.toLowerCase().replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-[#121212] text-white flex flex-col w-screen h-screen overflow-hidden select-none animate-fadeIn">
      
      {/* Top Luxury Toolbar */}
      <div className="h-16 px-4 sm:px-6 bg-[#1F1F1F] border-b border-neutral-800 flex items-center justify-between z-20 flex-shrink-0 shadow-md">
        
        {/* Left: Document Info & Status Badge */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition flex-shrink-0"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 truncate">
                <h3 className="text-sm font-semibold text-white tracking-wide truncate">
                  {doc.title}.pdf
                </h3>
                {isBuiltInDoc ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-700 text-amber-300 font-mono flex items-center space-x-1 flex-shrink-0">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Core Practice SOP</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono flex-shrink-0">
                    User Uploaded
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5 truncate">
                {doc.category} · Vectorized in pgvector · {doc.chunks} Chunks
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Box & Notification */}
        <div className="flex items-center space-x-3">
          {saveSuccess && (
            <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-mono animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Protocol saved & pgvector re-indexed!</span>
            </div>
          )}

          <div className="relative w-72 hidden lg:block">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinical terms, dosages..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Right Tools: Edit, Save, Delete (if uploaded), Print, Download */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          
          {/* Edit Protocol Button (Available for Built-in Core SOPs) */}
          {isBuiltInDoc && (
            <button
              onClick={() => {
                if (isEditing) {
                  handleSaveProtocol();
                } else {
                  setIsEditing(true);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 transition ${
                isEditing
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
            >
              {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isEditing ? 'Save Protocol' : 'Edit Protocol'}</span>
            </button>
          )}

          {/* Delete Button for User Uploaded Documents */}
          {!isBuiltInDoc && onDeleteDoc && (
            <button
              onClick={() => {
                if (confirm(`Delete "${doc.title}" from knowledge base?`)) {
                  onDeleteDoc(doc.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Delete uploaded document"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full transition ${
              isBookmarked ? 'text-amber-400 bg-amber-950/50' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Bookmark Protocol"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition hidden sm:inline-flex"
            title="Print SOP"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
            title="Download Document"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium border border-neutral-700 transition"
          >
            Done
          </button>
        </div>

      </div>

      {/* Main Continuous PDF Scroll Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Scrollable Center Pages Canvas */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden bg-[#262626] flex flex-col items-center py-10 px-4 space-y-8 scroll-smooth"
        >
          {editablePages.map((page, idx) => (
            <div
              key={idx}
              ref={(el) => {
                pageRefs.current[idx] = el;
              }}
              style={{
                width: `${Math.min(840 * (zoomLevel / 100), 960)}px`,
                minHeight: '1050px',
              }}
              className="bg-white text-slate-900 shadow-2xl rounded-sm p-12 sm:p-16 flex flex-col justify-between relative transition-all duration-150 border border-neutral-300"
            >
              {/* Header inside Paper */}
              <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  {page.title}
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Supabase pgvector Verified</span>
                </span>
              </div>

              {/* Page Content Body (Editable when Dr. Vance clicks 'Edit Protocol') */}
              <div className="flex-1 py-6">
                {isEditing ? (
                  <div className="space-y-3 h-full flex flex-col">
                    <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <Edit3 className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>Live Clinical Editor: Edits will automatically re-index semantic chunks in pgvector.</span>
                    </div>
                    <textarea
                      value={page.content}
                      onChange={(e) => handlePageContentChange(idx, e.target.value)}
                      rows={26}
                      className="w-full flex-1 p-4 rounded-xl border border-slate-300 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20 leading-relaxed resize-none"
                    />
                  </div>
                ) : (
                  <pre className="font-sans text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                    {page.content}
                  </pre>
                )}
              </div>

              {/* Footer inside Paper */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>AURA CLINIC CONFIDENTIAL · MEDICAL PRACTICE INTELLIGENCE</span>
                <span>Page {idx + 1} of {editablePages.length}</span>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp-Style Floating Scrollbar Navigation Bar */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center bg-[#1A1A1A]/90 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-2.5 shadow-2xl space-y-3 z-30">
          
          {/* Current Page Pill */}
          <div className="px-2.5 py-1 rounded-xl bg-neutral-800 border border-neutral-700 text-center">
            <span className="text-xs font-bold text-white font-mono block leading-tight">
              {currentPage}
            </span>
            <span className="text-[9px] text-neutral-400 font-mono block leading-tight">
              / {editablePages.length}
            </span>
          </div>

          <div className="w-full h-px bg-neutral-700" />

          {/* Up / Down Controls */}
          <button
            onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 transition"
            title="Previous Page"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToPage(Math.min(editablePages.length, currentPage + 1))}
            disabled={currentPage === editablePages.length}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 transition"
            title="Next Page"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="w-full h-px bg-neutral-700" />

          {/* Zoom Controls */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>,
    document.body
  );
};
