'use client';

import React, { useState } from 'react';
import { Copy, Check, MessageCircle } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content) return null;

  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];

  let inBlockquote = false;
  let blockquoteLines: string[] = [];
  let blockquoteIndex = 0;

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      const idx = blockquoteIndex++;
      const quoteText = blockquoteLines.join('\n').trim();
      const isCopied = copiedIndex === idx;

      renderedElements.push(
        <div
          key={`quote-${idx}-${renderedElements.length}`}
          className="my-3 p-4 rounded-2xl bg-[#EBF3EA]/70 border border-[#C5DEC1] relative group text-slate-800 font-sans shadow-xs"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#D5E6D3] mb-2 text-[11px] font-bold text-[#1E3A2B]">
            <span className="flex items-center space-x-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#2D5A3C]" />
              <span>Recommended Outreach Script (Email / SMS)</span>
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(quoteText);
                setCopiedIndex(idx);
                setTimeout(() => setCopiedIndex(null), 2000);
              }}
              className="px-2 py-0.5 rounded-md bg-white hover:bg-white/90 text-[10px] font-mono font-bold text-[#1E3A2B] border border-[#C5DEC1] shadow-2xs flex items-center space-x-1 transition"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{isCopied ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>
          <div className="text-xs sm:text-[13px] leading-relaxed italic text-slate-800 whitespace-pre-line select-text">
            {quoteText}
          </div>
        </div>
      );
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  const parseInlineFormatting = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        if (inner.includes('$') || inner.includes('%') || inner.includes('SOP-') || inner.includes('days')) {
          return (
            <span
              key={i}
              className="font-bold text-[#1E3A2B] bg-[#EBF3EA] px-1.5 py-0.5 rounded-md mx-0.5 border border-[#D5E6D3] font-mono text-[11px]"
            >
              {inner}
            </span>
          );
        }
        return <strong key={i} className="font-bold text-slate-900">{inner}</strong>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for blockquotes
    if (line.startsWith('>') || line.startsWith('&gt;')) {
      inBlockquote = true;
      blockquoteLines.push(line.replace(/^(>|&gt;)\s*/, '').replace(/^["']|["']$/g, ''));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Check for Headers
    if (line.startsWith('### ')) {
      const headerText = line.replace('### ', '');
      renderedElements.push(
        <div key={`h3-${i}`} className="pt-3 pb-1 flex items-center space-x-2">
          <div className="w-1.5 h-4 bg-[#1E3A2B] rounded-full"></div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide font-sans">
            {parseInlineFormatting(headerText)}
          </h4>
        </div>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      const headerText = line.replace('## ', '');
      renderedElements.push(
        <div key={`h2-${i}`} className="pt-3 pb-1">
          <h3 className="text-sm font-serif font-bold text-slate-900 tracking-wide">
            {parseInlineFormatting(headerText)}
          </h3>
        </div>
      );
      continue;
    }

    // Check for numbered list items: 1. 2. 3.
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      const num = numberedMatch[1];
      const itemContent = numberedMatch[2];
      
      // If item content starts with blockquote: 3. > "..."
      if (itemContent.startsWith('>') || itemContent.startsWith('&gt;')) {
        inBlockquote = true;
        blockquoteLines.push(itemContent.replace(/^(>|&gt;)\s*/, '').replace(/^["']|["']$/g, ''));
        continue;
      }

      renderedElements.push(
        <div key={`num-${i}`} className="flex items-start space-x-2.5 my-1.5 pl-1 text-xs sm:text-[13px] leading-relaxed">
          <span className="w-5 h-5 rounded-full bg-[#1E3A2B] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
            {num}
          </span>
          <div className="flex-1 text-slate-800 select-text">
            {parseInlineFormatting(itemContent)}
          </div>
        </div>
      );
      continue;
    }

    // Check for bullet items: - or *
    const bulletMatch = line.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      const itemContent = bulletMatch[1];
      renderedElements.push(
        <div key={`bullet-${i}`} className="flex items-start space-x-2 my-1 pl-2 text-xs sm:text-[13px] leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 flex-shrink-0 mt-2"></span>
          <div className="flex-1 text-slate-800 select-text">
            {parseInlineFormatting(itemContent)}
          </div>
        </div>
      );
      continue;
    }

    // Empty line / paragraph break
    if (!line.trim()) {
      renderedElements.push(<div key={`blank-${i}`} className="h-2" />);
      continue;
    }

    // Standard text line
    renderedElements.push(
      <p key={`p-${i}`} className="text-xs sm:text-[13px] leading-relaxed text-slate-800 font-sans my-1 select-text">
        {parseInlineFormatting(line)}
      </p>
    );
  }

  if (inBlockquote) {
    flushBlockquote();
  }

  return <div className="space-y-1">{renderedElements}</div>;
};
