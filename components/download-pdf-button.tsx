"use client";

import dynamic from 'next/dynamic';
import { CVData } from '@/types/cv';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const PDFDownloadButtonContent = dynamic(
  () => import('./cv-pdf').then((mod) => mod.PDFDownloadButtonContent),
  {
    ssr: false,
    loading: () => (
      <Button disabled variant="outline" size="sm">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading PDF...
      </Button>
    ),
  }
);

interface DownloadPDFButtonProps {
  data: CVData;
}

export function DownloadPDFButton({ data }: DownloadPDFButtonProps) {
  return <PDFDownloadButtonContent data={data} />;
}
