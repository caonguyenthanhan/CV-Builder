import { CVForm } from "@/components/cv-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          CV Builder Chuẩn ATS
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          A modern, ATS-friendly CV builder with real-time preview, AI review, and multi-language support.
        </p>
      </div>
      <CVForm />
    </main>
  );
}
