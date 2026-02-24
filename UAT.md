# User Acceptance Testing (UAT) Plan

## 1. Introduction
This UAT plan ensures that the interactive mockup meets the design and functional requirements outlined in the PRD and Scope documents.

## 2. Test Scenarios

### Test Case 1: Application Initialization & Dashboard
- **Action**: Load the application and view the main dashboard.
- **Expected Result**: The dashboard loads correctly. The user's name, current level, and a welcoming interface are visible. The Vision Board displays initial progress metrics.
- **Status**: [ ] Pass / [ ] Fail

### Test Case 2: Navigating Course Categories
- **Action**: Click on different course tabs (e.g., "All", "Technical", "English", "Mock Tests").
- **Expected Result**: The list of courses filters correctly based on the selected category.
- **Status**: [ ] Pass / [ ] Fail

### Test Case 3: Lesson Interaction
- **Action**: Open the "Technical English Bridge" course, navigate to "Module 4: Australian Workplace Culture", and read the lessons.
- **Expected Result**: The lesson content loads correctly, displaying formatted text, slang terminology, and warning boxes.
- **Status**: [ ] Pass / [ ] Fail

### Test Case 4: Taking Quizzes (Module & Per-Lesson)
- **Action**: 
  - Complete a lesson and click "Mark as Complete" to trigger a per-lesson quiz. 
  - Start a module quiz at the end of a module.
  - Retake a per-lesson quiz to observe varied/randomized questions.
- **Expected Result**: The quiz accurately calculates the score. If the score is 80% or higher, a success message appears and progress is updated. Retaking the quiz pulls a different set of questions if a question bank is configured.
- **Status**: [ ] Pass / [ ] Fail

### Test Case 5: Vision Board Progress Update
- **Action**: Successfully complete a module quiz that was previously incomplete.
- **Expected Result**: Navigating back to the Dashboard shows an updated percentage on the Vision Board, reflecting the newly completed module.
- **Status**: [ ] Pass / [ ] Fail

### Test Case 6: AI Diagnostic Simulation
- **Action**: Open the "PTE Crash Course" and take a diagnostic speech quiz.
- **Expected Result**: The interface presents simulated transcript analysis, highlighting hesitations, silence, or content errors accurately as per the mock data.
- **Status**: [ ] Pass / [ ] Fail

## 3. Sign-off
- **Tester Name**: ___________________
- **Date**: ___________________
- **Signature**: ___________________
