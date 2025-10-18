# LocalScope AI — Local Area Intelligence Platform

LocalScope AI is an AI-powered local area insights platform for the UK. Users can enter any UK postcode, select a persona, and instantly generate a personalized, interactive report. Each report includes maps, charts, AI-driven insights, and a voice-enabled chatbot for questions and exploration.

---

**High-Level Architecture**
<img width="1145" height="581" alt="1" src="https://github.com/user-attachments/assets/d3c202bb-abb4-4522-8e4a-711154727a98" />

**Sequence Diagram""
<img width="1010" height="742" alt="2" src="https://github.com/user-attachments/assets/12ad05d4-2252-4bdc-a356-2d7a4cd6ebb3" />


## 🚀 Features

### 🌍 Core Functionality
- Enter any UK postcode and select from multiple user personas (Default User, First-Time Buyer, Family with Children, Renter/Student, Real Estate Developer, Small Business Owner, Climate Researcher, Urban Planner).
- Generate a comprehensive AI report tailored to the selected persona.
- Explore neighborhood information such as:
  - Property prices and housing trends
  - Crime and safety statistics
  - Local schools and Ofsted ratings
  - Transport links and infrastructure
  - Climate and sustainability data

**Data Flow for Compare Mode**
<img width="807" height="272" alt="3" src="https://github.com/user-attachments/assets/560397a5-44a0-4c20-8848-752210fae13a" />

### 🧭 Interactive Report Dashboard
- **Executive Summary:** Persona-tailored overview of the area (robust extraction, always plain text).
- **Key Insights:** 5–6 actionable insights color-coded by sentiment (positive/green, negative/red, neutral/gray), clickable to scroll to relevant sections.
- **What's New in This Area?**: Live data section showing recent property, crime, transport, and news updates for the postcode.
- **Compare Two Postcodes:** Side-by-side comparison mode for any two postcodes and personas.
- **Interactive Map:** Google Maps view of the entered postcode, with markers and info popups for schools, amenities, and more.
- **Charts & Visuals:**
  - House price trends (line chart, interactive)
  - Crime type distribution (pie chart, interactive)
  - School ratings (bar chart, interactive)
- **Source Citations:** All data includes source names and dates, shown in an expandable accordion.
- **Export to PDF:** Save the full report view using jsPDF + html2canvas.

**Entity-Relationship Diagram**
<img width="1002" height="795" alt="4" src="https://github.com/user-attachments/assets/6cb4e623-35df-42c5-b6d1-6ed22003ae00" />


### 🤖 AI Chat Assistant
- Floating chat bubble opens a slide-out chat panel (expanded by default for discoverability).
- Conversation memory and context-aware answers.
- Dynamic suggested questions from the AI-generated summary.
- **Voice Input:** Microphone button for speech-to-text.
- **Voice Output:** Toggle for text-to-speech (powered by ElevenLabs).
- Powered by Genkit flows and Perplexity "sonar-pro" LLM.

### 🧩 New Tools & Functions
- **Compare Mode:** `/compare` page for side-by-side postcode and persona comparison.
- **Live Data Integration:** "What's New in This Area?" section for real-time news, property, crime, and transport updates (API-ready).
- **Robust Executive Summary Extraction:** Always displays summary as plain text, never raw JSON.
- **Accessibility & Theming:** Screen reader support, high-contrast/dark mode toggle, responsive design, and keyboard navigation.
- **Map Enhancements:** Multiple markers, info popups, and error handling for geocoding.

---

## 🧠 Tech Stack

| Category         | Technology/Service                                 |
|------------------|----------------------------------------------------|
| Framework        | Next.js (App Router) with React & TypeScript       |
| UI Components    | shadcn/ui, Lucide Icons                            |
| Styling          | Tailwind CSS                                       |
| Generative AI    | Genkit with Perplexity "sonar-pro" LLM             |
| Mapping          | Google Maps JavaScript API                         |
| Charts           | Recharts                                           |
| PDF Export       | jsPDF and html2canvas                              |
| TTS              | ElevenLabs API                                     |
| Theming          | next-themes (light/dark mode)                      |

---

## 🧩 App Structure

```
src/
 ├─ app/
 │   ├─ page.tsx              // Homepage
 │   ├─ compare/page.tsx      // Compare two postcodes
 │   ├─ report/[postcode]/    // Dynamic report page
 │   │   ├─ page.tsx
 │   │   ├─ components/
 │   │   └─ hooks/
 ├─ components/               // Reusable components (Cards, Charts, etc.)
 ├─ lib/                      // Utilities and data helpers
 ├─ actions.ts                // Server Actions calling Genkit flows
 └─ ai/flows/                 // Genkit flow definitions
```

---

## ⚙️ Genkit Flows

- **generateReportFromPostcode:**  
  Inputs: `postcode`, `persona`  
  Generates a structured report with:
  - `executiveSummary` (robust extraction)
  - `keyInsights[]` (with type and sectionId)
  - `reportSections[]`
  - `citations[]` (with source name and data date)

- **chatWithAiAboutLocation:**  
  Inputs: `postcode`, `reportData`, `chatHistory`, `question`  
  Provides contextual answers derived from the report.

- **generateSuggestedQuestions:**  
  Inputs: `reportSummary`, optional `userHistory`  
  Outputs dynamic follow-up questions.

- **geocodePostcode:**  
  Converts a UK postcode into latitude and longitude (with Google Maps fallback).

- **transcribeAudio:**  
  Converts voice input into text.

- **textToSpeech:**  
  Generates spoken responses for AI replies using ElevenLabs.

---

## 🔒 Server Actions

All Genkit flows are securely wrapped in `actions.ts` to handle:
- Authentication and authorization
- Input validation and structured responses
- Error catching with fallback messaging

---

## 🧰 Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/localscope-ai.git
   cd localscope-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the project root:
   ```
   PERPLEXITY_API_KEY=your_perplexity_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Then open [http://localhost:9002](http://localhost:9002) in your browser.

---

## 🧪 Available Scripts

| Command         | Description                |
|-----------------|---------------------------|
| npm run dev     | Run development server     |
| npm run build   | Build for production       |
| npm run start   | Start production server    |
| npm run lint    | Lint and format code       |

---

## 🗺️ Personas

| Persona              | Description                                      |
|----------------------|--------------------------------------------------|
| Default User         | General-purpose overview of the area.            |
| First-Time Buyer     | Property prices, affordability, growth trends.   |
| Family with Children | Schools, crime, green spaces, amenities.         |
| Renter / Student     | Transport, rental costs, nightlife, access.      |
| Real Estate Developer| Land use, development activity, zoning insight.  |
| Small Business Owner | Local economy, footfall, business ecosystem.     |
| Climate Researcher   | Sustainability, energy use, flood/air quality.   |
| Urban Planner        | Demographics, land use, transport networks.      |

---

## 📜 Data Sources

Example:
- "UK House Price Index – Data from Oct 2023"
- "ONS Crime Statistics – Data from Jan 2024"
- "Ofsted Reports – Updated May 2024"

---

## 🪄 Future Enhancements

- User accounts for saved reports and chat history
- Integration with local open datasets via data.gov.uk
- Mobile-optimized dashboard layout
- Support for international postcodes (Phase 2)
- More advanced voice and language support
- **Image-to-Postcode:** Upload an image and the AI will guess the postcode for the area (planned)
- **AI Recommendations:** Suggest similar postcodes and best-fit personas (planned)
- **Multi-language Support:** Offer the dashboard in multiple languages (planned)

---

## 🧑‍💻 Contributing

Pull requests and issues are welcome! Please open an issue to discuss your proposed changes.

---

## 📄 License

MIT License

---

## 📝 Notes for Developers

- All flows and server actions are TypeScript-typed and error-handled.
- The AI prompt is carefully crafted to ensure all required sections (including "Crime & Safety" and "Local Schools & Childcare") are always present.
- The executive summary extraction logic is robust against double-encoded or stringified JSON.
- Voice features use ElevenLabs for TTS; you can swap in another provider if needed.
- For production, ensure all API keys are kept secure and not exposed to the client.
- Compare mode and live data integration are now available and extensible.
