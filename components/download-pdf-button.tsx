"use client";

import React, { useState } from 'react';
import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface DownloadPDFButtonProps {
  data: CVData;
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
        setIsGenerating(false);
        return;
      }

      // Temporarily force A4 width for the capture
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      element.style.width = '210mm';
      element.style.maxWidth = '210mm';

      const fileName = getFileName();
      
      const opt = {
        margin:       0,
        filename:     fileName,
        image:        { type: 'jpeg' as const, quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false, windowWidth: 794 }, // 794px is approx 210mm at 96dpi
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();

      // Restore original styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;

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
