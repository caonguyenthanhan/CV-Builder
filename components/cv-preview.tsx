"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useCVStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { StandardTemplate } from "@/components/templates/standard";
import { ModernTemplate } from "@/components/templates/modern";
import { MinimalistTemplate } from "@/components/templates/minimalist";
import { DownloadHistory } from "@/components/download-history";

const DownloadPDFButton = dynamic(
  () => import("@/components/download-pdf-button").then((mod) => mod.DownloadPDFButton),
  { ssr: false }
);

interface CVPreviewProps {
  hideToolbar?: boolean;
}

export function CVPreview({ hideToolbar = false }: CVPreviewProps) {
  const { cvData } = useCVStore();
  const themeColor = cvData.themeColor || "#2563eb";
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!isMounted) {
    return null;
  }

  const renderTemplate = () => {
    const template = cvData.settings?.template || 'standard';
    switch (template) {
      case 'modern':
        return <ModernTemplate />;
      case 'minimalist':
        return <MinimalistTemplate />;
      case 'standard':
      default:
        return <StandardTemplate />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-100 ${hideToolbar ? 'p-0' : 'p-8'} print:p-0 print:bg-white`}>
      <div className={`max-w-[210mm] mx-auto ${hideToolbar ? 'shadow-none' : ''}`}>
        {/* Toolbar - Hidden when printing or if hideToolbar is true */}
        {!hideToolbar && (
          <div className="flex justify-between items-center p-4 border-b bg-white shadow-sm mb-8 rounded-lg print:hidden">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Quay lại chỉnh sửa
            </Button>
            <div className="flex gap-2">
              <DownloadHistory />
              <DownloadPDFButton data={cvData} />
              <Button onClick={handlePrint} style={{ backgroundColor: themeColor, color: 'white' }}>
                In (Print)
              </Button>
            </div>
          </div>
        )}

        {/* CV Content */}
        <div id="cv-content-to-download">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
