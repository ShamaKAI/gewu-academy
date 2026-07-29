import type { Course } from "./courses";

/** Load mentor-published courses from localStorage (client-side only) */
export function loadPublishedCourses(): Course[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("gewu-published-courses");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

/** Merge published courses with static ones (dedup by id) */
export function mergePublished(staticCourses: Course[]): Course[] {
  const published = loadPublishedCourses();
  const seen = new Set(staticCourses.map((c) => c.id));
  const extra = published.filter((c) => !seen.has(c.id));
  return [...staticCourses, ...extra];
}
