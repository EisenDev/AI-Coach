'use client';

import React, { useState, useEffect, useRef } from 'react';
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

• Sculptra Aesthetic (Poly-L-Lactic Acid):
  - 2–3 vials spaced over 8-week intervals.
  - 18-month collagen stimulation review.

5. PROVIDER DOCUMENTATION & METRICS
• All patient outreach must be logged in the clinic CRM within 2 hours of completion.
• Practice 90-Day Retention Target: ≥ 65% across all licensed aesthetic injectors.
• Monthly churn reviews conducted by Dr. Vance on the 1st Tuesday of every month.`,
      },
      {
        title: 'SECTION 3: CONCIERGE OUTREACH TEMPLATES',
        content: `AURA CLINIC — SOP-RET-001 (PAGE 3)

6. VERIFIED EMAIL OUTREACH SCRIPT (HIGH-VALUE PATIENTS)

Subject: A quick personal note from Dr. Vance regarding your treatment

Dear [Patient Name],

It has been roughly 3 months since your [Treatment Name] at Aura Clinic, and I wanted to personally check in to see how your results are settling.

Around the 90-day mark, our patients love to review their skin longevity, and we often recommend subtle touch-ups or gentle booster treatments to keep your results radiant and fully supported.

I would love to invite you for a complimentary 10-minute skin review at our private suite. We have reserved two priority slots for you:
- Option A: Thursday at 2:00 PM
- Option B: Friday at 11:00 AM

Please let our front desk know what works best, or reply directly to this note.

Warm regards,
Dr. Chloe Vance, MD
Medical Director · Aura Clinic`,
      },
      {
        title: 'SECTION 4: STAFF COMPLIANCE & ESCALATION',
        content: `AURA CLINIC — SOP-RET-001 (PAGE 4)

7. PATIENT SATISFACTION ESCALATION WORKFLOW
• If a patient reports a satisfaction score < 4.5 or expresses concern regarding symmetry/bruising:
  1. Flag patient in CRM as "Priority Review".
  2. Clinical coordinator initiates direct telephone call within 4 hours.
  3. Schedule in-person clinical review with Dr. Vance within 48 hours at no charge.

8. VECTOR RAG RETRIEVAL METADATA
• Embedding Model: Jina v3 (1024 dimensions)
• Chunk Size: 450 characters (50 character overlap)
• Supabase pgvector table: public.knowledge_chunks
• Storage Bucket: clinic-sops`,
      },
    ],
    'doc-2': [
      {
        title: 'SECTION 1: 2026 INJECTABLES PRICE SCHEDULE',
        content: `AURA CLINIC — 2026 COMPREHENSIVE PRICING & SYRINGE SCHEDULE
Confidential Practice Document | Effective: February 1, 2026
Supervising Physician: Dr. Chloe Vance, MD

1. NEUROTOXINS & WRINKLE RELAXERS
• Botox Cosmetic (Allergan): $15 per unit (Typical treatment: 30–64 units = $450 – $960)
• Dysport (Galderma): $5.50 per unit (Conversion factor 2.8:1)
• Xeomin (Merz): $14 per unit
• Full Face Refresh Package (Upper face + DAO + Platysma bands): $1,400 flat rate

2. DERMAL FILLERS & BIOSTIMULATORS
• Juvederm Voluma XC / Volux: $950 per 1.0 mL syringe (2-syringe bundle: $1,750)
• Restylane Kysse / Contour / Defyne: $850 per syringe
• Sculptra Aesthetic (Poly-L-Lactic Acid): $1,100 per vial (2-vial starter protocol: $2,000)
• Full Face Liquid Facelift Protocol: $4,800 – $6,800 (includes midface structural support, tear troughs, jawline contouring, and 50 units neurotoxin).`,
      },
      {
        title: 'SECTION 2: ENERGY DEVICES & BODY CONTOURING',
        content: `AURA CLINIC — 2026 PRICING SCHEDULE (PAGE 2)

3. ENERGY-BASED DEVICES & BODY CONTOURING
• Morpheus8 RF Microneedling (Full Face & Neck): $1,200 per session | 3-Pack: $3,100
• CoolSculpting Elite: $750 per cycle | 4-Cycle Abdomen Package: $2,600 | 8-Cycle Full Body: $4,800
• Laser Genesis Skin Therapy: $350 per session | 6-Session Package: $1,800

4. CLINICAL FINANCING & VIP MEMBERSHIP
• Aura Platinum Tier: $199/month accrual with 15% discount on all injectables and complimentary monthly HydraFacial.
• 0% APR 12-month patient financing available via CareCredit and PatientFi.`,
      },
    ],
    'doc-3': [
      {
        title: 'SECTION 1: NEUROTOXIN & FILLER REBOOKING PROTOCOL',
        content: `AURA CLINIC — CLINICAL REBOOKING PROTOCOL: INJECTABLES
Supervising Physician: Dr. Chloe Vance, MD

1. NEUROTOXIN REBOOKING INTERVALS
• Glabella, Forehead, and Crow's Feet: 12–14 weeks optimal duration.
• Masseter Slimming / Bruxism: 16–20 weeks maintenance interval.
• Trapezius ("Barbie Tox"): 16–24 weeks duration.

2. COMBINATION THERAPIES
• Always recommend dermal filler assessment alongside neurotoxin at the 90-day mark.
• Dermal filler hydration maintenance with skin boosters improves patient satisfaction by 38%.`,
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

  if (!isOpen || !doc) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] text-white flex flex-col w-screen h-screen overflow-hidden select-none animate-fadeIn">
      
      {/* Top Luxury Toolbar */}
      <div className="h-16 px-6 bg-[#1F1F1F] border-b border-neutral-800 flex items-center justify-between z-20 flex-shrink-0 shadow-md">
        
        {/* Left: Document Info & Status Badge */}
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-300 hover:text-white transition"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-300 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  {doc.title}.pdf
                </h3>
                {isBuiltInDoc ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 border border-amber-700 text-amber-300 font-mono flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Core Practice SOP</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono">
                    User Uploaded
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                {doc.category} · Vectorized in pgvector · {doc.chunks} Semantic Chunks
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
        <div className="flex items-center space-x-2">
          
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
              {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Save Protocol' : 'Edit Protocol'}</span>
            </button>
          )}

          {/* Delete Button (Only for User-Uploaded Docs) */}
          {!isBuiltInDoc && onDeleteDoc && (
            <button
              onClick={() => {
                if (confirm(`Delete uploaded document "${doc.title}"?`)) {
                  onDeleteDoc(doc.id);
                  onClose();
                }
              }}
              className="p-2 rounded-full hover:bg-rose-950/80 text-neutral-400 hover:text-rose-400 transition"
              title="Delete uploaded document"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full hover:bg-neutral-800 transition ${
              isBookmarked ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
            }`}
            title="Bookmark"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            title="Print PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
            title="Download text"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#1E3A2B] hover:bg-[#284D39] text-white text-xs font-semibold transition ml-2 border border-emerald-700 shadow-sm"
          >
            Done
          </button>
        </div>

      </div>

      {/* Main Continuous Document Workspace */}
      <div className="flex-1 relative flex overflow-hidden bg-[#242424]">
        
        {/* Continuous Scrollable PDF Pages Stream */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center gap-8 scroll-smooth"
        >
          {editablePages.map((page, idx) => (
            <div
              key={idx}
              ref={(el) => { pageRefs.current[idx] = el; }}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
              }}
              className="bg-white text-slate-900 rounded-lg shadow-2xl border border-neutral-300 w-full max-w-4xl min-h-[950px] p-12 sm:p-16 flex flex-col justify-between transition-transform duration-150 relative"
            >
              {/* Page Header */}
              <div>
                <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
                  {isEditing ? (
                    <input
                      type="text"
                      value={page.title}
                      onChange={(e) => {
                        const updated = [...editablePages];
                        updated[idx].title = e.target.value;
                        setEditablePages(updated);
                      }}
                      className="text-xs font-mono uppercase tracking-widest text-slate-700 border-b border-amber-500 bg-amber-50/50 px-2 py-1 w-2/3 focus:outline-none"
                    />
                  ) : (
                    <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
                      {page.title}
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-emerald-800 font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Supabase pgvector Verified</span>
                  </span>
                </div>

                {/* Body Content / Inline Editable Area */}
                {isEditing ? (
                  <textarea
                    value={page.content}
                    onChange={(e) => {
                      const updated = [...editablePages];
                      updated[idx].content = e.target.value;
                      setEditablePages(updated);
                    }}
                    rows={22}
                    className="w-full text-xs sm:text-sm text-slate-900 leading-relaxed font-mono bg-amber-50/30 border border-amber-300 rounded-xl p-4 focus:outline-none focus:border-amber-600 resize-y"
                  />
                ) : (
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line select-text">
                    {page.content}
                  </div>
                )}
              </div>

              {/* Page Footer */}
              <div className="border-t border-slate-100 pt-6 mt-12 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Aura Clinic Clinical Standard Operating Procedures</span>
                <span>Page {idx + 1} of {editablePages.length}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating WhatsApp-Style Page Number Pill on Scrollbar Side */}
        <div className="absolute right-6 bottom-8 z-30 flex flex-col items-center gap-1.5 bg-[#1F1F1F]/95 backdrop-blur border border-neutral-700 shadow-2xl rounded-2xl p-2 text-white select-none">
          
          {/* Page Counter */}
          <div className="px-2.5 py-1 text-center">
            <span className="text-xs font-mono font-bold block">{currentPage}</span>
            <span className="text-[10px] text-neutral-400 font-mono block">/ {editablePages.length}</span>
          </div>

          <div className="w-full h-px bg-neutral-700" />

          {/* Up/Down Page Jump */}
          <button
            disabled={currentPage <= 1}
            onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous Page"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          <button
            disabled={currentPage >= editablePages.length}
            onClick={() => scrollToPage(Math.min(editablePages.length, currentPage + 1))}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next Page"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="w-full h-px bg-neutral-700" />

          {/* Zoom In/Out */}
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
