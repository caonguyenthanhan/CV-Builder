"use client";

import React from "react";
import { CVForm } from "@/components/cv-form";
import { CVPreview } from "@/components/cv-preview";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      <div className="w-1/2 p-8 overflow-y-auto h-screen border-r border-gray-200 bg-white">
        <CVForm />
      </div>
      <div className="w-1/2 p-0 overflow-y-auto h-screen bg-gray-100">
        <CVPreview />
      </div>
      <Toaster position="top-center" />
    </main>
  );
}
