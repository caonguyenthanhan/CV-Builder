"use client";

import React, { useState } from 'react';
import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadPDFButtonProps {
  data: CVData;
}

interface BlockRange {
  top: number;
  bottom: number;
  isHeading: boolean;
}

/**
 * Collects atomic element vertical ranges (in canvas pixels) so page breaks
 * avoid slicing through text lines, list items, cards, or leaving orphan headings.
 */
function collectAtomicBlocks(root: HTMLElement, scale: number): BlockRange[] {
  const rootTop = root.getBoundingClientRect().top;
  const nodes = root.querySelectorAll<HTMLElement>(
    'h1, h2, h3, h4, p, li, .break-inside-avoid'
  );
  const blocks: BlockRange[] = [];

  nodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.height <= 0) return;
    blocks.push({
      top: Math.floor((rect.top - rootTop) * scale),
      bottom: Math.ceil((rect.bottom - rootTop) * scale),
      isHeading: /^H[1-4]$/.test(node.tagName) || node.classList.contains('break-after-avoid'),
    });
  });

  return blocks;
}

/**
 * Finds a safe vertical cut position (in canvas pixels) <= targetY that does not
 * split any atomic block or leave an orphan heading at the bottom of a page.
 */
function findSafeCutY(
  currentY: number,
  targetY: number,
  maxSliceHeight: number,
  blocks: BlockRange[]
): number {
  let cutY = targetY;

  // Pull cutY above any atomic block that straddles targetY
  for (const block of blocks) {
    const blockHeight = block.bottom - block.top;
    if (blockHeight <= 0 || blockHeight >= maxSliceHeight * 0.85) continue;

    if (block.top < cutY && block.bottom > cutY) {
      cutY = Math.min(cutY, block.top - 4);
    }
  }

  // Avoid orphan headings right above the page break
  for (const block of blocks) {
    if (!block.isHeading) continue;
    if (block.bottom <= cutY && cutY - block.top < maxSliceHeight * 0.15) {
      cutY = Math.min(cutY, block.top - 4);
    }
  }

  // Guard against degenerate cuts (e.g., giant unbreakable element)
  if (cutY <= currentY + maxSliceHeight * 0.25) {
    return targetY;
  }

  return cutY;
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
      const element = document.getElementById('cv-content-to-download');
      if (!element) {
        console.error('CV content element not found');
        toast.error('Không tìm thấy nội dung CV để xuất PDF.');
        return;
      }

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ]);

      // Temporarily force A4 width for capture
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '210mm';
      element.style.maxWidth = '210mm';

      try {
        const fileName = getFileName();
        const captureScale = 2;
        const elementRect = element.getBoundingClientRect();
        const atomicBlocks = collectAtomicBlocks(element, captureScale);

        const canvas = await html2canvas(element, {
          scale: captureScale,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          scrollX: 0,
          scrollY: 0,
          windowWidth: 794,
          onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
            clonedDoc.documentElement.scrollTop = 0;
            clonedDoc.documentElement.scrollLeft = 0;

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

              target.style.width = `${elementRect.width || 794}px`;
              target.style.maxWidth = `${elementRect.width || 794}px`;
              target.style.margin = '0';
              target.style.backgroundColor = '#ffffff';
            }
          },
        });

        // Re-scale block coordinates if actual canvas width differs slightly from elementRect * captureScale
        const actualScaleRatio =
          elementRect.width > 0 ? canvas.width / (elementRect.width * captureScale) : 1;
        const scaledBlocks =
          actualScaleRatio === 1
            ? atomicBlocks
            : atomicBlocks.map((b) => ({
                top: Math.floor(b.top * actualScaleRatio),
                bottom: Math.ceil(b.bottom * actualScaleRatio),
                isHeading: b.isHeading,
              }));

        const pdf = new jsPDF({
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        });

        const pageWidthMm = 210;
        const pageHeightMm = 297;
        const pxPerMm = canvas.width / pageWidthMm;
        const bottomMarginMm = 10;
        const subsequentTopMarginMm = 10;

        let currentY = 0;
        let pageIndex = 0;

        while (currentY < canvas.height - 2) {
          const topMarginMm = pageIndex === 0 ? 0 : subsequentTopMarginMm;
          const usableHeightMm = pageHeightMm - topMarginMm - bottomMarginMm;
          const maxSlicePx = Math.floor(usableHeightMm * pxPerMm);
          const targetY = currentY + maxSlicePx;

          const cutY =
            targetY >= canvas.height
              ? canvas.height
              : findSafeCutY(currentY, targetY, maxSlicePx, scaledBlocks);

          const sliceHeightPx = Math.max(1, cutY - currentY);

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceHeightPx;

          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
            ctx.drawImage(
              canvas,
              0,
              currentY,
              canvas.width,
              sliceHeightPx,
              0,
              0,
              canvas.width,
              sliceHeightPx
            );
          }

          if (pageIndex > 0) {
            pdf.addPage();
          }

          const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.98);
          const sliceHeightMm = sliceHeightPx / pxPerMm;
          pdf.addImage(sliceImgData, 'JPEG', 0, topMarginMm, pageWidthMm, sliceHeightMm);

          currentY = cutY;
          pageIndex++;
        }

        pdf.save(fileName);

        // Save to history
        const newRecord = {
          id: crypto.randomUUID(),
          fileName,
          timestamp: new Date().toISOString(),
          fullName: data.personalInfo.fullName || 'Unknown',
          position: data.personalInfo.title || 'Unknown',
        };

        const storedHistory = localStorage.getItem('cv_download_history');
        let history = [];
        if (storedHistory) {
          try {
            history = JSON.parse(storedHistory);
          } catch (e) {
            console.error('Failed to parse download history', e);
          }
        }
        history.push(newRecord);
        localStorage.setItem('cv_download_history', JSON.stringify(history));
      } finally {
        element.style.width = originalWidth;
        element.style.maxWidth = originalMaxWidth;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Lỗi khi tạo PDF. Vui lòng thử lại.');
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
