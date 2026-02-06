export interface UserProgress {
  completedLessonIds: string[];
  currentTrack: 'Academic' | 'Technical';
}

export const getDashboardStats = (course: any, progress: UserProgress) => {
  // Handle both Course (with modules) and Module (with lessons) structures
  let allLessons: any[] = [];
  
  if (course.modules) {
    // It's a Course, aggregate all lessons from modules
    course.modules.forEach((module: any) => {
      if (module.lessons) {
        allLessons = [...allLessons, ...module.lessons];
      }
    });
  } else if (course.lessons) {
    // It's a Module or flattened course
    allLessons = course.lessons;
  }

  const totalLessons = allLessons.length;

  if (totalLessons === 0) {
    return {
      completionPercentage: 0,
      badges: [],
      remaining: 0
    };
  }

  const completedCount = allLessons.filter((lesson: any) => 
    progress.completedLessonIds.includes(lesson.id)
  ).length;
  
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);

  // Logic for Skill Badges
  const badges = [];
  if (progress.completedLessonIds.includes('tech-m1-l1')) badges.push('Safety First');
  if (progress.completedLessonIds.includes('tech-m1-l2')) badges.push('Spec Master');
  if (completionPercentage === 100) badges.push('Course Pro');

  return {
    completionPercentage,
    badges,
    remaining: totalLessons - completedCount
  };
};
