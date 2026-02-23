import { CVForm } from "@/components/cv-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">CV Builder</h1>
        <p className="mt-2 text-gray-600">
          Điền thông tin của bạn để tạo CV chuẩn ATS, hiện đại và chuyên nghiệp.
        </p>
      </div>
      <CVForm />
    </main>
  );
}
