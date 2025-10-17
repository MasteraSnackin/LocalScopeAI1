# **App Name**: LocalScope AI

## Core Features:

- Landing Page: Generates a landing page with a postcode search input, features section, report types section, and call-to-action, styled with a blue to purple gradient background, fade-in animations on scroll, and mobile responsiveness.
- Main Application: Creates a three-column layout with a left sidebar for report type selection and advanced options, a top bar for logo, postcode, and actions, a progress indicator during report generation, and a main content area for displaying the executive summary, tab navigation, report content, and citations panel.
- Interactive Chat: Implements a floating chat bubble with a slide-in panel, chat header, messages area, suggested questions, welcome state, input area, and chat functionality, connecting to a Firebase Cloud Function for AI interaction and displaying citations as badges.
- Data Visualizations: Generates charts using Chart.js and react-chartjs-2, including a house price trend line chart, a crime breakdown donut chart, and a school rankings horizontal bar chart, with global chart styling for container, padding, title, caption, responsiveness, loading, and error states.
- Interactive Map: Creates an interactive map using Mapbox GL JS with react-map-gl, configured with initial center, default zoom, street style, and data layers for schools, transport, and crime heatmap, including main postcode marker, data layer toggles, zoom controls, and map style switcher.
- PDF Export: Exports the generated report to PDF using jsPDF and html2canvas, structuring the PDF with a cover page, executive summary, report sections, and citations, and styling the PDF with professional fonts, margins, page numbers, headers/footers, and high-quality chart images.
- Generate Report (Cloud Function): A Firebase Cloud Function that validates UK postcode format, checks Firestore cache, generates queries based on report types, calls Perplexity AI API in parallel, structures responses into report format, caches in Firestore, and returns formatted report data.
- Chat with AI (Cloud Function): A Firebase Cloud Function that builds conversation with system prompt, calls Perplexity AI API with history, extracts suggested questions from response, and returns a response containing the AI's message, citations, and suggested questions.

## Style Guidelines:

- Primary color: #3B82F6 (blue).
- Secondary color: #8B5CF6 (purple).
- Accent color: #10B981 (green).
- Error color: #EF4444 (red).
- Success color: #10B981 (green).
- Font: Inter or system fonts.
- Headings: Bold, 24-32px.
- Body: Regular, 14-16px.
- Small: 12px.
- Consistent 8px grid.
- Section padding: 24-32px.
- Card padding: 16-24px.
- Page transitions: 200ms fade.
- Button hover: 100ms scale.
- Modal open: 300ms slide.
- Loading: Pulse animation.