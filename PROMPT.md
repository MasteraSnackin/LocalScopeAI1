# LocalScope AI Application Prompt

## 1. High-Level Goal

Build an AI-powered local area intelligence platform. The application allows users to enter any UK postcode, select a specific user persona, and generate a comprehensive, interactive report tailored to their needs. The report should be presented as a modern, single-page dashboard and include an AI chatbot that can answer questions about the generated data.

## 2. Core Technology Stack

*   **Framework:** Next.js (App Router) with React and TypeScript.
*   **UI Components:** shadcn/ui.
*   **Styling:** Tailwind CSS.
*   **Generative AI:** Genkit with Google's Gemini models (`gemini-2.5-flash` for text, `gemini-2.5-flash-preview-tts` for voice).
*   **Mapping:** Google Maps JavaScript API.
*   **Charts:** Recharts.
*   **PDF Export:** jsPDF and html2canvas.

## 3. Key Features

### 3.1. Homepage (`/`)

*   A visually appealing hero section with the title "Unlock Local Insights with AI".
*   An input field for the user to enter a UK postcode.
*   A dropdown menu allowing the user to select a persona. Personas include:
    *   Default User
    *   First-Time Buyer
    *   Family with Children
    *   Renter / Student
    *   Real Estate Developer
    *   Small Business Owner
    *   Climate Researcher
    *   Urban Planner
*   A "Generate Report" button that navigates the user to the report page (`/report/<postcode>?persona=<persona>`).
*   Sections highlighting key features of the reports (e.g., Property Insights, Crime & Safety, Transport Links).

### 3.2. Report Page (`/report/[postcode]`)

This page should be designed as an interactive, single-page dashboard.

*   **Layout:**
    *   A fixed sidebar for navigation between report sections.
    *   A main content area that displays the report as a series of cards.
*   **Core Components:**
    *   **Executive Summary:** A prominent card at the top displaying an AI-generated summary of the report.
    *   **Interactive Map:** A card showing the postcode location on a Google Map.
    *   **Report Section Cards:** Individual cards for each section of the report (e.g., "Housing", "Crime & Safety", "Local Schools"). Each card should display its title, an icon, the AI-generated text content, and any relevant charts.
    *   **Interactive Charts:**
        *   **Housing Section:** Include a line chart for house price trends and a bar chart for prices by property type.
        *   **Crime Section:** Include a pie chart breaking down crime types.
        *   **Schools Section:** Include a bar chart showing Ofsted ratings for nearby schools.
    *   **Citations:** An expandable accordion section at the bottom to list all data sources, including the date of the data (e.g., "Source Name - Data from Oct 2023").
    *   **PDF Export:** A button in the header to export the entire report view as a PDF document.

### 3.3. AI Chat Functionality

*   **Chat Trigger:** A floating chat bubble on the report page.
*   **Chat Panel:**
    *   Clicking the bubble opens a slide-out chat panel.
    *   The panel displays the conversation history with the AI.
    *   It includes a text input for users to ask questions.
    *   **Suggested Questions:** The chat should start with a list of dynamically generated questions based on the content of the report's executive summary.
    *   **Voice Input:** A microphone button to allow users to speak their questions, which are then transcribed and sent to the AI.
    *   **Voice Output:** A toggle switch to enable/disable text-to-speech for the AI's answers. When enabled, the AI's response is read aloud automatically. An icon on the message bubble allows replaying the audio.

## 4. AI & Server-Side Logic (Genkit Flows & Actions)

*   **`generateReportFromPostcode` Flow:**
    *   Accepts a `postcode` and a `persona` as input.
    *   Contains a detailed prompt instructing the AI to generate a report with specific sections and data points tailored to each of the defined personas.
    *   The prompt must enforce that citations include the source name and data date.
    *   The output should be a structured object containing the `executiveSummary`, an array of `reportSections`, and an array of `citations`.
*   **`chatWithAiAboutLocation` Flow:**
    *   Accepts the `postcode`, the full `reportData`, the `chatHistory`, and the user's `question`.
    *   Uses the report data and conversation history as context to provide an accurate answer.
*   **`generateSuggestedQuestions` Flow:**
    *   Accepts the `reportSummary` and optionally the `userHistory`.
    *   Generates a list of 3-5 relevant follow-up questions.
*   **`geocodePostcode` Flow:**
    *   Accepts a `postcode` and returns its latitude and longitude.
*   **`transcribeAudio` Flow:**
    *   Accepts audio as a data URI and returns the transcribed text.
*   **`textToSpeech` Flow:**
    *   Accepts text and returns the synthesized speech as a `wav` audio data URI.
*   **Server Actions (`actions.ts`):**
    *   Create wrapper functions to securely call these Genkit flows from the client-side React components. Implement error handling for all actions.
