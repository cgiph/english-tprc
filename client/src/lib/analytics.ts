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

  // Pre-defined events based on requirements
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
