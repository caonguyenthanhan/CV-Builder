"use server";

import mammoth from "mammoth";

export async function extractTextFromDocxAction(base64Data: string) {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value };
  } catch (error) {
    console.error("Error extracting text from docx:", error);
    return { error: "Failed to extract text from DOCX file." };
  }
}
