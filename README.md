# CV Builder - ATS-Friendly Resume Maker

A powerful, modern, and open-source CV builder built with Next.js and Tailwind CSS. Designed to help users create professional, ATS-optimized resumes with real-time preview and AI-powered assistance.

## 🚀 Key Features

- **Real-time Preview:** See changes instantly as you type.
- **ATS Optimization:** Built-in checklist to ensure your CV passes Applicant Tracking Systems.
- **AI-Powered Review:** Get constructive feedback on your CV using Google Gemini AI.
- **AI Translation:** Automatically translate your CV into multiple languages (English, Vietnamese, Japanese, etc.).
- **Data Persistence:** Your data is automatically saved to your browser's LocalStorage, so you never lose your work.
- **Import/Export:** Backup your data to JSON or import existing data to restore your progress.
- **Mobile Friendly:** Dedicated mobile preview mode (Drawer) for on-the-go editing and viewing.
- **Customization:** Choose from different color themes (Blue, Emerald, Neutral), fonts (Sans, Serif, Mono), and density settings.
- **PDF Export:** Print-ready layout optimized for high-quality PDF export via browser print.

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with persistence middleware)
- **AI Integration:** [Google Generative AI SDK](https://www.npmjs.com/package/@google/genai)
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Components:** Built with [Radix UI](https://www.radix-ui.com/) primitives (Dialog, Drawer, Select, Switch).

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/cv-builder.git
   cd cv-builder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy `.env.example` to `.env.local` and add your API keys (optional but recommended for development).
   ```bash
   cp .env.example .env.local
   ```
   
   - `NEXT_PUBLIC_GEMINI_API_KEY`: Your Google Gemini API Key. If not provided, users will be prompted to enter their own key in the UI.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser to start building your CV.

## 📖 Usage Guide

1. **Fill in your details:** Start by entering your personal information, summary, experience, education, and skills.
2. **Customize:** Use the settings panel to change the accent color, font, and spacing density to match your style.
3. **Check ATS Score:** Open the ATS Checklist to see if your CV meets common standards.
4. **AI Review:** Click "AI Review" to get personalized feedback on how to improve your content.
5. **Translate:** Use the "Translate" feature to generate versions of your CV in other languages.
6. **Export:** Click "Preview & Print" (or the eye icon on mobile) to view the final result, then use your browser's print function (Ctrl+P / Cmd+P) to save as PDF.
   - *Tip: In print settings, enable "Background graphics" and set margins to "None" or "Minimum" for best results.*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
