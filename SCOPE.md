# Scope Document

## 1. Project Scope Description
This document outlines the boundaries of the Tradie LMS rapid prototype. The goal of this phase is to deliver a high-fidelity, interactive frontend mockup that demonstrates the user journey, core features, and design language without requiring a functional backend.

## 2. In Scope (Frontend Prototype)
- **User Interface Design**: Responsive, accessible layouts using Tailwind CSS and Shadcn UI.
- **Navigation & Routing**: Client-side routing between Dashboard, Course Lists, and Lesson Views.
- **Mock Data Integration**: Hardcoded JSON data simulating a backend database for users, courses, modules, and quizzes.
- **Interactive Quizzes**: Functional quiz components that calculate scores and update local (in-memory) state.
- **Vision Board Logic**: Progress calculation algorithm focusing on a single technical track plus core courses.
- **Gamification Elements**: UI for badges and completion statuses.
- **Simulated AI Feedback**: Pre-defined diagnostic feedback screens demonstrating how the AI speech analysis will look.

## 3. Out of Scope (For Future Phases)
- **Backend Infrastructure**: No Node.js/Express server logic or REST API implementation.
- **Database**: No PostgreSQL/database schemas or persistent data storage.
- **Real Authentication**: Login is simulated; no JWT or secure password hashing.
- **Actual AI Processing**: No integration with OpenAI or other speech-to-text APIs.
- **Video Hosting**: Videos are embedded or mocked, not hosted on a dedicated streaming server.
- **Payment Processing**: No Stripe or subscription management.

## 4. Assumptions & Constraints
- All progress is lost upon page refresh (expected behavior for this mockup phase).
- The prototype is designed primarily for desktop and tablet viewing, with basic mobile responsiveness.
