"use client";

import React, { useState } from 'react';
import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface DownloadPDFButtonProps {
  data: CVData;
}

const UNSUPPORTED_COLOR_FN_RE = /\b(?:oklab|oklch|lab|lch|color|color-mix)\(/i;

const COLOR_CSS_PROPERTIES = [
  'color',
  'background-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'column-rule-color',
  'caret-color',
  'fill',
  'stroke',
  'box-shadow',
  'text-shadow',
  'background-image',
] as const;

/**
 * Converts modern CSS color functions (oklab, oklch, lab, lch, color, color-mix)
 * to sRGB rgb()/rgba() values on the cloned document so html2canvas can parse them.
 */
function normalizeUnsupportedColors(clonedDoc: Document) {
  const view = clonedDoc.defaultView || window;
  const canvas = clonedDoc.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const toRgba = (colorExpr: string): string => {
    ctx.fillStyle = '#010203';
    ctx.fillStyle = colorExpr;
    // If browser couldn't parse it, fillStyle stays '#010203'
    if (ctx.fillStyle === '#010203' && colorExpr.trim().toLowerCase() !== '#010203') {
      return colorExpr;
    }
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillRect(0, 0, 1, 1);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    const r = pixel[0];
    const g = pixel[1];
    const b = pixel[2];
    const a = pixel[3];
    if (a === 255) {
      return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${Number((a / 255).toFixed(3))})`;
  };

  const replaceColorFunctions = (value: string): string => {
    if (!UNSUPPORTED_COLOR_FN_RE.test(value)) return value;

    let result = '';
    let i = 0;
    while (i < value.length) {
      const slice = value.slice(i);
      const match = slice.match(/^(oklab|oklch|lab|lch|color-mix|color)\(/i);
      if (match && (i === 0 || !/[a-z0-9_-]/i.test(value[i - 1]))) {
        let depth = 0;
        let end = i;
        for (; end < value.length; end++) {
          if (value[end] === '(') depth++;
          else if (value[end] === ')') {
            depth--;
            if (depth === 0) {
              end++;
              break;
            }
          }
        }
        const expr = value.slice(i, end);
        result += toRgba(expr);
        i = end;
      } else {
        result += value[i];
        i++;
      }
    }
    return result;
  };

  const elements = clonedDoc.querySelectorAll<HTMLElement | SVGElement>('*');
  elements.forEach((el) => {
    const computed = view.getComputedStyle(el);
    for (const prop of COLOR_CSS_PROPERTIES) {
      const val = computed.getPropertyValue(prop);
      if (val && UNSUPPORTED_COLOR_FN_RE.test(val)) {
        const normalized = replaceColorFunctions(val);
        if (normalized !== val) {
          el.style.setProperty(prop, normalized, 'important');
        }
      }
    }
  });
}

export function DownloadPDFButton({ data }: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const getFileName = () => {
    const name = data.personalInfo.fullName.replace(/\s+/g, '_') || 'CV';
    const position = data.personalInfo.title.replace(/\s+/g, '_') || 'Position';
    const date = new Date();
    const timestamp = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
    return `CV_${name}_${position}_${timestamp}.pdf`;
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      // Load html2pdf dynamically from CDN to avoid Next.js build issues
      if (!(window as any).html2pdf) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
          document.body.appendChild(script);
        });
      }
      
      const html2pdf = (window as any).html2pdf;
      
      const element = document.getElementById('cv-content-to-download');
      if (!element) {
        console.error('CV content element not found');
        return;
      }

      // Temporarily force A4 width for the capture
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '210mm';
      element.style.maxWidth = '210mm';

      try {
        const fileName = getFileName();

        const opt = {
          margin:       0,
          filename:     fileName,
          image:        { type: 'jpeg' as const, quality: 0.98 },
          html2canvas:  {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794, // 794px is approx 210mm at 96dpi
            onclone: (clonedDoc: Document, clonedEl?: HTMLElement) => {
              clonedDoc.documentElement.scrollTop = 0;
              clonedDoc.documentElement.scrollLeft = 0;
              if (clonedDoc.body) {
                clonedDoc.body.scrollTop = 0;
                clonedDoc.body.scrollLeft = 0;
              }

              const target = clonedEl || clonedDoc.getElementById('cv-content-to-download');
              if (target) {
                // Unclip scrollable/narrow ancestors (e.g. w-1/2 overflow-y-auto h-screen)
                let parent = target.parentElement;
                while (parent && parent !== clonedDoc.body && parent !== clonedDoc.documentElement) {
                  parent.style.overflow = 'visible';
                  parent.style.height = 'auto';
                  parent.style.maxHeight = 'none';
                  parent.style.width = 'auto';
                  parent.style.maxWidth = 'none';
                  parent.style.transform = 'none';
                  parent.scrollTop = 0;
                  parent.scrollLeft = 0;
                  parent = parent.parentElement;
                }

                target.style.width = '794px';
                target.style.maxWidth = '794px';
                target.style.margin = '0';
                target.style.backgroundColor = '#ffffff';
                target.style.opacity = '1';
                target.style.visibility = 'visible';
              }

              normalizeUnsupportedColors(clonedDoc);
            },
          },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        await html2pdf().set(opt).from(element).save();

        // Save to history
        const newRecord = {
          id: crypto.randomUUID(),
          fileName,
          timestamp: new Date().toISOString(),
          fullName: data.personalInfo.fullName || 'Unknown',
          position: data.personalInfo.title || 'Unknown',
        };

        const storedHistory = localStorage.getItem("cv_download_history");
        let history = [];
        if (storedHistory) {
          try {
            history = JSON.parse(storedHistory);
          } catch (e) {
            console.error("Failed to parse download history", e);
          }
        }
        history.push(newRecord);
        localStorage.setItem("cv_download_history", JSON.stringify(history));
      } finally {
        // Always restore original styles even if PDF generation fails
        element.style.width = originalWidth;
        element.style.maxWidth = originalMaxWidth;
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      disabled={isGenerating} 
      variant="outline" 
      size="sm" 
      onClick={handleDownload}
    >
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? 'Đang tạo PDF...' : 'Tải PDF'}
    </Button>
  );
}
