# Gewu Academy — Courses System Design (典籍系统)

**Date:** 2026-07-28 | **Status:** Approved | **Sub-project:** A+B (列表页 + 详情页 + 章节页)

---

## 1. Overview

Replace the placeholder `/scholar/courses` page with a complete three-tier course system:

```
课程列表页 → 课程详情页(知识树 + 目录) → 章节页(6 模块)
```

All pages follow the existing ink-wash (水墨) new-Chinese aesthetic: B&W grayscale palette, serif/display fonts, Framer Motion transitions.

---

## 2. Tier 1 — Course List Page

**Route:** `/scholar/courses`

### 2.1 Filters (Collapsible Panel)
- Default collapsed, showing only sort dropdown
- Click "筛选" to expand: Category | Difficulty | Status
- **Category:** 全部 / 伦理文化 / 心学经典 / 金融工程 / 战略思维 / 保险精算 / 数据科学 / 道家哲学 / 编程应用 / 文学艺术
- **Difficulty:** 全部 / 初级 / 中级 / 高级
- **Status:** 全部 / 未开始 / 进行中 / 已完成

### 2.2 Sort
- 评分最高 (default)
- 评价最多
- 点赞最多
- 观看次数最多
- 最新上线

### 2.3 Course Card (Horizontal, Single Column)
```
┌──────┬─────────────────────────────┐
│ 封面  │ 《大学》精读                  │
│160x100│ 王阳明 · 伦理文化            │
│      │ 32.5h · ★4.9                │
│      │ 课程简介一行文案...           │
└──────┴─────────────────────────────┘
```
- Cover image on left (160×100px), info on right
- Instructor name, category, duration, rating
- One-line description
- Click navigates to Tier 2

### 2.4 Data
- Mock data: 8-12 courses with varied categories/difficulties/progress
- Filter and sort operate client-side in demo

---

## 3. Tier 2 — Course Detail Page (3D Knowledge Tree + Table of Contents)

**Route:** `/scholar/courses/[id]`

### 3.1 3D Knowledge Tree (Left Panel, Collapsible)
- **Tech:** Three.js via `@react-three/fiber` + `@react-three/drei`
- **Nodes:** Course title (root) → Chapter nodes → Section nodes (2 levels max)
- **Behavior:**
  - Auto-rotates slowly by default
  - User can drag to rotate, scroll to zoom
  - Click a node → scrolls to corresponding TOC item (and highlights it)
- **Collapse:** Toggle button to hide/show tree, freeing space for TOC
- **Visual style:** Monochrome nodes with ink-like edge lines, minimal new-Chinese feel

### 3.2 Table of Contents (Right Panel)
- Accordion/collapse panels: one per chapter
- All collapsed by default — no section count badges
- Click chapter → expands to show 2-4 sections
- Click section → navigates to Tier 3 (chapter page)
- Each section is a clickable link

### 3.3 Layout
```
┌─ [收起知识树] ──┬──────────────────────────┐
│  3D Tree        │  ▶ 第一章 格物致知的本源    │
│  (auto-rotate)  │  ▶ 第二章 知行合一          │
│                 │  ▶ 第三章 诚意正心          │
│                 │  ▶ 第四章 修身齐家          │
└─────────────────┴──────────────────────────┘
```

---

## 4. Tier 3 — Chapter Page (6 Modules)

**Route:** `/scholar/courses/[id]/[chapter]`

### 4.1 Layout
```
┌─ Tab Nav ──┬─────────────────────────────────┐
│ 课程视频    │                                  │
│ 课程PPT     │     Module content area          │
│ 课程内容    │                                  │
│ 课堂笔记    │                                  │
│ 课后习题    │                                  │
│ 课程评价    │                                  │
└────────────┴─────────────────────────────────┘
```
- Left vertical tab navigation (200px)
- Right content area fills remaining space
- Each tab is independent — each chapter has its own set of 6 modules

### 4.2 Module 1 — Course Videos (课程讲解视频)
- **Upload:** Accept MP4, MOV, WebM, AVI, MKV
- **Player:** HTML5 `<video>` with custom controls styled to match
- **Playback speed:** 0.5× / 0.75× / 1× / 1.25× / 1.5× / 2×
- **Demo phase:** Upload button (non-functional placeholder) + one embedded demo video

### 4.3 Module 2 — Course PPT (课程PPT)
- **Upload:** Accept HTML, PDF, PPT, PPTX
- **Preview:** Render the uploaded document in-page
  - PDF: `react-pdf` with page navigation
  - PPT/PPTX: Convert and render slides
  - HTML: iframe sandbox
- **Freehand annotation (随笔画):**
  - Tech: Canvas overlay (`fabric.js` or `konva`) on top of preview
  - Tools: Pen (free draw), Rectangle, Circle, Arrow, Eraser
  - Colors: #000 (black), #C04040 (vermillion red), #C5A46D (bronze gold), #666 (gray)
  - Stroke width: 2px / 3px / 5px
  - **Annotations follow content movement:** When preview page scrolls/zooms, annotations maintain their position relative to the underlying content element. Implementation: store annotations as (page_number, relative_x%, relative_y%) coordinates tied to document elements, re-render on viewport change.
- **Demo phase:** One mock PDF file + working canvas annotation

### 4.4 Module 3 — Course Content (课程内容)
- Full lecture script/article, paragraph-by-paragraph
- Written in continuous prose style (not bullet points)
- Mock article content for demo (~800-2000 words per chapter)

### 4.5 Module 4 — Class Notes (课堂笔记)
- **AI-powered summary:** Send course content text to DeepSeek API
- **Prompt:** "请根据以下课程内容，总结本章节的核心要点、重点概念和关键结论。以结构化的方式呈现。"
- **Display:** Structured markdown rendered in-page
- **UX:** "生成笔记" button → loading → rendered summary
- **API key:** Provided by user, stored in `.env.local` (not committed)

### 4.6 Module 5 — Exercises (课后习题)
- **Types:** Single-choice, multi-choice, true/false, fill-in-the-blank
- **Count:** 5-15 questions per chapter
- **Interaction:** Select/enter answers → "提交批改" button → show score + correct answers
- **Data:** Mock questions hardcoded per chapter
- **Visual:** Clean card per question, green ✓ for correct, red ✗ with correct answer for wrong

### 4.7 Module 6 — Course Review (课程评价)
- **Rating:** Star selector (1-5), can only submit ONCE (stored in state/localStorage)
- **Comments:** Text input + submit, can submit MULTIPLE times
- **Display:** List of existing reviews with timestamp
- **Demo:** Mock 3-5 existing reviews

---

## 5. Route Structure

```
/scholar/courses                              → Tier 1: Course list
/scholar/courses/[courseId]                   → Tier 2: Knowledge tree + TOC
/scholar/courses/[courseId]/[chapterSlug]     → Tier 3: Chapter modules
```

### Dynamic route directories:
```
src/app/[locale]/scholar/courses/
  page.tsx                         (list)
  [courseId]/
    page.tsx                       (detail: tree + toc)
    [chapterSlug]/
      page.tsx                     (chapter: 6 modules)
```

---

## 6. Component Tree

```
CourseListPage
├── FilterPanel (collapsible)
│   ├── CategoryFilter (tag chips)
│   ├── DifficultyFilter (dropdown)
│   └── StatusFilter (dropdown)
├── SortDropdown
└── CourseCard[] (horizontal list)

CourseDetailPage
├── KnowledgeTree (Three.js, collapsible)
│   └── TreeNode[] → edges → labels
└── TocAccordion
    └── ChapterPanel[]
        └── SectionLink[]

ChapterPage
├── ChapterTabs (left nav)
└── TabContent
    ├── VideoModule
    ├── PptModule (canvas overlay)
    ├── ContentModule
    ├── NotesModule (DeepSeek API)
    ├── ExercisesModule
    └── ReviewModule
```

---

## 7. New Dependencies

```json
{
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "three": "^0.160.x",
  "fabric": "^6.x",       // or "konva" + "react-konva"
  "react-pdf": "^9.x",
  "prismjs": "^1.x"       // for code highlighting
}
```

---

## 8. Data Models

```typescript
interface Course {
  id: string;
  title: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructor: string;
  description: string;
  duration: string;       // "32.5h"
  rating: number;         // 1-5
  reviewCount: number;
  likeCount: number;
  viewCount: number;
  coverImage: string;
  chapters: Chapter[];
}

interface Chapter {
  slug: string;           // "chapter-1"
  title: string;          // "格物致知的本源"
  sections: Section[];
  // Each chapter has independent modules (stored per-chapter)
  modules: {
    videos: VideoItem[];
    pptFiles: PptFile[];
    content: string;       // Full lecture script
    exercises: Exercise[];
    reviews: Review[];
  };
}

interface Section {
  slug: string;
  title: string;          // "《大学》原文精读"
  chapterSlug: string;
}
```

---

## 9. i18n Keys to Add

```json
{
  "courses_filter": "筛选",
  "courses_sort": "排序",
  "courses_sort_rating": "评分最高",
  "courses_sort_reviews": "评价最多",
  "courses_sort_likes": "点赞最多",
  "courses_sort_views": "观看次数最多",
  "courses_sort_newest": "最新上线",
  "courses_category": "课程分类",
  "courses_difficulty": "难度",
  "courses_status": "学习状态",
  "courses_difficulty_beginner": "初级",
  "courses_difficulty_intermediate": "中级",
  "courses_difficulty_advanced": "高级",
  "courses_status_all": "全部",
  "courses_status_not_started": "未开始",
  "courses_status_in_progress": "进行中",
  "courses_status_completed": "已完成",
  "courses_category_all": "全部分类",
  "knowledge_tree": "知识图谱",
  "collapse_tree": "收起图谱",
  "expand_tree": "展开图谱",
  "tab_video": "课程视频",
  "tab_ppt": "课程PPT",
  "tab_content": "课程内容",
  "tab_notes": "课堂笔记",
  "tab_exercises": "课后习题",
  "tab_review": "课程评价",
  "upload_video": "上传视频",
  "upload_ppt": "上传课件",
  "playback_speed": "播放速度",
  "generate_notes": "AI 生成笔记",
  "generating_notes": "正在生成笔记...",
  "submit_exercises": "提交批改",
  "exercise_score": "得分",
  "submit_review": "提交评价",
  "write_review": "写下你的评价...",
  "reviews_existing": "已有评价"
}
```

---

## 10. Scope & Boundaries

### In scope for this spec (A+B):
- Course list page with filtering and sorting
- Course detail page with 3D knowledge tree + TOC
- Chapter page scaffold with 6 tab modules
- All 6 modules with demo/mock content + upload placeholders

### Explicitly out of scope:
- Actual file upload backend (placeholder buttons only)
- User authentication integration
- Persistent database (all data is client-side mock)
- Real PPT/PPTX rendering (use react-pdf for PDF, iframe for HTML, image mock for PPT/PPTX)
- Real video hosting (embed demo video from public URL)

### Follow-up specs:
- Sub-project C: Production-grade video module
- Sub-project D: Production-grade PPT module with full annotation
- Sub-project E: AI-powered notes, exercises, review modules
