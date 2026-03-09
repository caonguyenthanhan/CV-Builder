"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import CVPDF from "./CVPDF";
import { CVData } from "@/types";

export default function DownloadPDF({ data, fileName }: { data: CVData; fileName: string }) {
  return (
    <PDFDownloadLink
      document={<CVPDF data={data} />}
      fileName={fileName}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
    >
      {/* @ts-ignore */}
      {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
    </PDFDownloadLink>
  );
}
