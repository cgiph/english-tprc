// Mock Analytics Service for GA4 / Meta Pixel
// In a real app, this would initialize window.dataLayer and fbq

type EventProps = Record<string, any>;

interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: EventProps;
}

class AnalyticsService {
  private initialized = false;

  init() {
    if (this.initialized) return;
    
    console.log('[Analytics] Initialized');
    
    // Mock GA4 Initialization
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXXXXX');

    this.initialized = true;
  }

  trackEvent({ name, category, label, value, properties }: AnalyticsEvent) {
    // Log to console for development visibility
    console.groupCollapsed(`[Analytics] Event: ${name}`);
    if (category) console.log('Category:', category);
    if (label) console.log('Label:', label);
    if (value) console.log('Value:', value);
    if (properties) console.log('Properties:', properties);
    console.groupEnd();

    // Mock GA4 Event
    // if (window.gtag) {
    //   window.gtag('event', name, {
    //     event_category: category,
    //     event_label: label,
    //     value: value,
    //     ...properties
    //   });
    // }

    // Mock Meta Pixel Event
    // if (window.fbq) {
    //   window.fbq('trackCustom', name, properties);
    // }
  }

  // 1. Engagement Metrics
  trackCourseEnrollment(courseId: string, courseTitle: string) {
    this.trackEvent({
      name: 'course_enrollment',
      category: 'Engagement',
      label: courseTitle,
      properties: { course_id: courseId }
    });
  }

  trackLessonStart(lessonId: string, lessonTitle: string, moduleId: string) {
    this.trackEvent({
      name: 'lesson_start',
      category: 'Engagement',
      label: lessonTitle,
      properties: { lesson_id: lessonId, module_id: moduleId }
    });
    this.startTimer(lessonId);
  }

  trackLessonComplete(lessonId: string, lessonTitle: string) {
    const timeSpent = this.stopTimer(lessonId);
    this.trackEvent({
      name: 'lesson_complete',
      category: 'Engagement',
      label: lessonTitle,
      properties: { lesson_id: lessonId, time_spent_seconds: timeSpent }
    });
  }

  trackSessionEnd() {
    this.trackEvent({
      name: 'session_end',
      category: 'Engagement',
      label: 'User Session'
    });
  }

  // 2. Skill Performance Metrics
  trackGrammarAssessment(score: number, totalItems: number, level: string = 'General') {
    this.trackEvent({
      name: 'grammar_assessment_completed',
      category: 'Skill Performance',
      value: score,
      properties: { score, total_items: totalItems, level }
    });
  }

  trackSpeakingSubmission(fluency: number, score: number, pronunciation: number, attempt: number) {
    this.trackEvent({
      name: 'speaking_record_submitted',
      category: 'Skill Performance',
      value: score,
      properties: { fluency_score: fluency, overall_score: score, pronunciation_score: pronunciation, attempt_number: attempt }
    });
  }

  trackTypingTest(wpm: number, accuracy: number) {
    this.trackEvent({
      name: 'typing_test_completed',
      category: 'Skill Performance',
      value: wpm,
      properties: { wpm, accuracy_rate: accuracy }
    });
  }

  trackListeningQuiz(score: number, totalItems: number) {
    this.trackEvent({
      name: 'listening_quiz_completed',
      category: 'Skill Performance',
      value: score,
      properties: { score, total_items: totalItems }
    });
  }

  // 3. Funnel Events
  trackMockTestUnlocked(testId: string) {
    this.trackEvent({
      name: 'mock_test_unlocked',
      category: 'Funnel',
      label: testId
    });
  }

  trackMockTestCompleted(testId: string, score: number) {
    this.trackEvent({
      name: 'mock_test_completed',
      category: 'Funnel',
      label: testId,
      value: score,
      properties: { overall_score: score }
    });
  }

  // 4. Drop-Off Tracking
  private timers: Record<string, number> = {};

  private startTimer(id: string) {
    this.timers[id] = Date.now();
  }

  private stopTimer(id: string): number {
    if (!this.timers[id]) return 0;
    const duration = (Date.now() - this.timers[id]) / 1000;
    delete this.timers[id];
    return Math.round(duration);
  }

  trackAbandonedLesson(lessonId: string) {
    if (this.timers[lessonId]) {
      const timeSpent = this.stopTimer(lessonId);
      this.trackEvent({
        name: 'abandoned_lesson',
        category: 'Drop-Off',
        label: lessonId,
        properties: { time_spent_seconds: timeSpent }
      });
    }
  }

  // Legacy/Helper events
  trackExploreCourses() {
    this.trackEvent({
      name: 'explore_courses_click',
      category: 'Navigation',
      label: 'Main Header'
    });
  }

  trackQuizCompletion(quizTitle: string, score: number, totalQuestions: number) {
    this.trackEvent({
      name: 'quiz_completed',
      category: 'Assessment',
      label: quizTitle,
      value: score,
      properties: {
        total_questions: totalQuestions,
        percentage: (score / totalQuestions) * 100
      }
    });
  }

  trackSpeakingRecord(exerciseId: string) {
    this.trackEvent({
      name: 'speaking_record_start',
      category: 'Engagement',
      label: exerciseId
    });
  }

  trackBackToDashboard(fromPage: string) {
    this.trackEvent({
      name: 'back_to_dashboard',
      category: 'Navigation',
      label: fromPage
    });
  }
}

export const analytics = new AnalyticsService();
