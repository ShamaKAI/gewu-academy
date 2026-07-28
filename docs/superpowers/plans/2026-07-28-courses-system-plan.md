# Courses System (典籍系统) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete three-tier course system: course list with filtering/sorting → course detail with 3D knowledge tree + TOC → chapter page with 6 tabbed modules (video, PPT+annotation, content, AI notes, exercises, review).

**Architecture:** Three Next.js dynamic routes under `/scholar/courses/`. Client-side mock data drives filtering/sorting. Three.js via react-three-fiber for the 3D knowledge tree. fabric.js canvas overlay for PPT annotations. DeepSeek API for AI-generated notes. All components follow existing ink-wash (水墨) new-Chinese aesthetic with Framer Motion transitions.

**Tech Stack:** Next.js 15.5 + React 19 + TypeScript (strict) + Tailwind CSS 4 + Framer Motion 12 + Three.js (react-three-fiber/drei) + fabric.js 6 + react-pdf 9

## Global Constraints

- All UI must follow existing ink-wash style: B&W grayscale (#000/#333/#666/#999/#ccc/#eee), serif fonts (`var(--font-serif)`), display fonts (`var(--font-display)`), rounded-12px cards, Framer Motion hover animations
- Route pattern: `/[locale]/scholar/courses/[courseId]/[chapterSlug]`
- No backend uploads in demo — upload buttons show placeholder alerts
- i18n keys required for zh/en/ms in `src/i18n/messages/`
- Mock data only, no database, client-side state
- Build must pass with `next build --turbopack`

---

### Task 1: Install New Dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `@react-three/fiber`, `@react-three/drei`, `three`, `@types/three`, `fabric`, `@types/fabric`, `react-pdf` available in node_modules

- [ ] **Step 1: Install Three.js packages**

```bash
cd "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy"
npm install @react-three/fiber @react-three/drei three
npm install --save-dev @types/three
```

- [ ] **Step 2: Install fabric.js for canvas annotation**

```bash
npm install fabric
npm install --save-dev @types/fabric
```

- [ ] **Step 3: Install react-pdf for PDF preview**

```bash
npm install react-pdf
```

- [ ] **Step 4: Verify installs**

```bash
node -e "require('three'); require('fabric'); require('react-pdf'); console.log('All packages loaded')"
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three.js, fabric.js, react-pdf dependencies for courses system"
```

---

### Task 2: Create Mock Course Data

**Files:**
- Create: `src/data/courses.ts`

**Interfaces:**
- Produces:
```typescript
export interface CourseSection {
  slug: string;
  title: string;
  chapterSlug: string;
}
export interface VideoItem { id: string; title: string; src: string; type: string; }
export interface Exercise { id: string; type: "single"|"multi"|"truefalse"|"fill"; question: string; options?: string[]; answer: string | string[]; }
export interface ReviewItem { id: string; userName: string; rating: number; comment: string; date: string; }
export interface ChapterModules { videos: VideoItem[]; pptFiles: PptFile[]; content: string; exercises: Exercise[]; reviews: ReviewItem[]; }
export interface Chapter { slug: string; title: string; sections: Section[]; modules: ChapterModules; }
export interface Course { id: string; title: string; category: string; difficulty: "beginner"|"intermediate"|"advanced"; instructor: string; description: string; duration: string; rating: number; reviewCount: number; likeCount: number; viewCount: number; coverImage: string; progress: number; status: "not_started"|"in_progress"|"completed"; chapters: Chapter[]; }
export const courses: Course[];
export const ALL_CATEGORIES: string[];
```

- [ ] **Step 1: Create data file with types and mock data**

Create `src/data/courses.ts`:

```typescript
export interface CourseSection {
  slug: string;
  title: string;
  chapterSlug: string;
}

export interface VideoItem {
  id: string;
  title: string;
  src: string;
  type: string; // "mp4" | "webm" | "mov"
}

export interface PptFile {
  id: string;
  title: string;
  type: "pdf" | "html" | "ppt" | "pptx";
  src: string;
}

export interface Exercise {
  id: string;
  type: "single" | "multi" | "truefalse" | "fill";
  question: string;
  options?: string[];
  answer: string | string[];
}

export interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ChapterModules {
  videos: VideoItem[];
  pptFiles: PptFile[];
  content: string;
  exercises: Exercise[];
  reviews: ReviewItem[];
}

export interface Chapter {
  slug: string;
  title: string;
  sections: CourseSection[];
  modules: ChapterModules;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructor: string;
  description: string;
  duration: string;
  rating: number;
  reviewCount: number;
  likeCount: number;
  viewCount: number;
  coverImage: string;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
  chapters: Chapter[];
}

export const ALL_CATEGORIES = [
  "伦理文化", "心学经典", "金融工程", "战略思维",
  "保险精算", "数据科学", "道家哲学", "编程应用", "文学艺术",
];

// Helper to generate mock content for a chapter
function mockContent(title: string): string {
  return `# ${title}

在《大学》的开篇，曾子以"大学之道，在明明德，在亲民，在止于至善"三纲领总领全书。这三句话虽然是短短十五个字，却蕴含了儒家修身治国平天下的全部纲领。

所谓"明明德"，第一个"明"是动词，意为彰明、发扬；"明德"是指人先天本具的光明德性。儒家认为，每个人生而具有良知良能，只是被后天的私欲和习气所遮蔽。修身的首要任务，就是通过格物致知、诚意正心的工夫，将这些遮蔽层层剥去，使本有的明德重新焕发光辉。

"在亲民"的"亲"字，朱熹解为"新"，意为革新、教化。君子不仅要自明其明德，更要推己及人，使天下人都能去旧染之污，日新又新。这就是儒家"内圣外王"的基本理路——从个人的道德修养出发，最终达到治理天下的境界。

"止于至善"则为三纲领的最高目标。"至善"不是一个固定的标准，而是天理流行的最圆满状态。朱熹说"止者，必至于是而不迁之意"，意味着要达到至善的境界并且坚守不渝。

这三纲领层层递进：明明德是内修之本，亲民是外推之功，止于至善则是最终归宿。三者缺一不可，构成了儒家修身的完整路径。

接下来，《大学》提出了实现三纲领的八个具体步骤，也就是著名的"八条目"：格物、致知、诚意、正心、修身、齐家、治国、平天下。其中格物致知是起点，治平天下是终点，而修身则居于中心枢纽的位置。下一节我们将详细讲解格物致知的工夫论。`;
}

// Generate mock exercises for a chapter
function mockExercises(): Exercise[] {
  return [
    {
      id: "q1",
      type: "single",
      question: "《大学》三纲领中，"明明德"的第一个"明"是什么意思？",
      options: ["光明", "彰明、发扬", "明天", "明亮"],
      answer: "彰明、发扬",
    },
    {
      id: "q2",
      type: "single",
      question: "朱熹将"在亲民"的"亲"解释为什么意思？",
      options: ["亲爱", "亲近", "新", "亲人"],
      answer: "新",
    },
    {
      id: "q3",
      type: "multi",
      question: "以下哪些属于八条目的内容？（多选）",
      options: ["格物", "致知", "诚意", "养生"],
      answer: ["格物", "致知", "诚意"],
    },
    {
      id: "q4",
      type: "truefalse",
      question: ""止于至善"是《大学》三纲领的最高目标。",
      options: ["正确", "错误"],
      answer: "正确",
    },
    {
      id: "q5",
      type: "truefalse",
      question: "八条目中，治国平天下是起点，格物致知是终点。",
      options: ["正确", "错误"],
      answer: "错误",
    },
    {
      id: "q6",
      type: "fill",
      question: "三纲领包括：明明德、在亲民、在止于_____。",
      answer: "至善",
    },
    {
      id: "q7",
      type: "single",
      question: "八条目中居于中心枢纽位置的是？",
      options: ["格物", "诚意", "修身", "齐家"],
      answer: "修身",
    },
    {
      id: "q8",
      type: "fill",
      question: "儒家认为修身的首要任务是_____致知、诚意正心。",
      answer: "格物",
    },
  ];
}

function mockReviews(): ReviewItem[] {
  return [
    { id: "rv1", userName: "张物学", rating: 5, comment: "讲解深入浅出，三纲领的逻辑关系讲得非常清晰。", date: "2026-07-15" },
    { id: "rv2", userName: "李文思", rating: 4, comment: "内容很扎实，希望增加更多案例。", date: "2026-07-18" },
    { id: "rv3", userName: "王知行", rating: 5, comment: "受益匪浅，对格物致知有了更深的理解。", date: "2026-07-22" },
  ];
}

export const courses: Course[] = [
  {
    id: "great-learning",
    title: "《大学》精读",
    category: "伦理文化",
    difficulty: "intermediate",
    instructor: "王阳明",
    description: "系统研读《大学》原文，深入理解三纲领八条目的儒家修身思想体系，结合现代视角解读格物致知的精神内涵。",
    duration: "32.5h",
    rating: 4.9,
    reviewCount: 1280,
    likeCount: 3560,
    viewCount: 28000,
    coverImage: "https://picsum.photos/seed/great-learning-cover/400/250",
    progress: 78,
    status: "in_progress",
    chapters: [
      {
        slug: "ch1-ge-wu",
        title: "第一章 格物致知的本源",
        sections: [
          { slug: "s1-1", title: "1.1 《大学》原文精读", chapterSlug: "ch1-ge-wu" },
          { slug: "s1-2", title: "1.2 格物释义", chapterSlug: "ch1-ge-wu" },
          { slug: "s1-3", title: "1.3 致知之道", chapterSlug: "ch1-ge-wu" },
        ],
        modules: {
          videos: [
            { id: "v1", title: "《大学》三纲领讲解", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", type: "mp4" },
            { id: "v2", title: "格物致知概念解析", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", type: "mp4" },
          ],
          pptFiles: [
            { id: "ppt1", title: "格物致知课程讲义", type: "pdf", src: "/sample/sample-slides.pdf" },
          ],
          content: mockContent("格物致知的本源"),
          exercises: mockExercises(),
          reviews: mockReviews(),
        },
      },
      {
        slug: "ch2-zhi-xing",
        title: "第二章 知行合一",
        sections: [
          { slug: "s2-1", title: "2.1 知先行后", chapterSlug: "ch2-zhi-xing" },
          { slug: "s2-2", title: "2.2 行而后知", chapterSlug: "ch2-zhi-xing" },
          { slug: "s2-3", title: "2.3 知行互动", chapterSlug: "ch2-zhi-xing" },
        ],
        modules: {
          videos: [
            { id: "v3", title: "王阳明知行合一说", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", type: "mp4" },
          ],
          pptFiles: [
            { id: "ppt2", title: "知行合一讲义", type: "pdf", src: "/sample/sample-slides.pdf" },
          ],
          content: mockContent("知行合一"),
          exercises: mockExercises(),
          reviews: [
            { id: "rv4", userName: "陈明德", rating: 4, comment: "知行互动的辩证法讲解得很好。", date: "2026-07-20" },
          ],
        },
      },
      {
        slug: "ch3-cheng-yi",
        title: "第三章 诚意正心",
        sections: [
          { slug: "s3-1", title: "3.1 诚意之道", chapterSlug: "ch3-cheng-yi" },
          { slug: "s3-2", title: "3.2 正心工夫", chapterSlug: "ch3-cheng-yi" },
        ],
        modules: {
          videos: [],
          pptFiles: [],
          content: mockContent("诚意正心"),
          exercises: mockExercises(),
          reviews: [],
        },
      },
      {
        slug: "ch4-xiu-shen",
        title: "第四章 修身齐家",
        sections: [
          { slug: "s4-1", title: "4.1 修身为本", chapterSlug: "ch4-xiu-shen" },
          { slug: "s4-2", title: "4.2 齐家之道", chapterSlug: "ch4-xiu-shen" },
          { slug: "s4-3", title: "4.3 治国平天下", chapterSlug: "ch4-xiu-shen" },
        ],
        modules: {
          videos: [],
          pptFiles: [],
          content: mockContent("修身齐家治国平天下"),
          exercises: mockExercises(),
          reviews: [],
        },
      },
    ],
  },
  {
    id: "lunyu",
    title: "《论语》精讲",
    category: "伦理文化",
    difficulty: "beginner",
    instructor: "孔孟研",
    description: "精选《论语》核心篇章，结合历史背景和现代生活，深入理解孔子仁学思想及其当代意义。",
    duration: "28h",
    rating: 4.7,
    reviewCount: 960,
    likeCount: 2100,
    viewCount: 18500,
    coverImage: "https://picsum.photos/seed/lunyu-cover/400/250",
    progress: 45,
    status: "in_progress",
    chapters: [
      {
        slug: "ch1-xue-er",
        title: "第一章 学而篇",
        sections: [
          { slug: "s1-1", title: "1.1 学而时习之", chapterSlug: "ch1-xue-er" },
          { slug: "s1-2", title: "1.2 其为人也孝弟", chapterSlug: "ch1-xue-er" },
        ],
        modules: {
          videos: [],
          pptFiles: [],
          content: mockContent("学而篇"),
          exercises: mockExercises(),
          reviews: [],
        },
      },
      {
        slug: "ch2-wei-zheng",
        title: "第二章 为政篇",
        sections: [
          { slug: "s2-1", title: "2.1 为政以德", chapterSlug: "ch2-wei-zheng" },
          { slug: "s2-2", title: "2.2 道之以政", chapterSlug: "ch2-wei-zheng" },
        ],
        modules: {
          videos: [],
          pptFiles: [],
          content: mockContent("为政篇"),
          exercises: mockExercises(),
          reviews: [],
        },
      },
    ],
  },
  {
    id: "fin-math",
    title: "金融数学建模",
    category: "金融工程",
    difficulty: "advanced",
    instructor: "陈省身",
    description: "系统学习金融衍生品定价模型、随机过程与数值方法，从Black-Scholes到蒙特卡洛模拟。",
    duration: "48h",
    rating: 4.8,
    reviewCount: 720,
    likeCount: 1800,
    viewCount: 15200,
    coverImage: "https://picsum.photos/seed/finance-cover/400/250",
    progress: 92,
    status: "in_progress",
    chapters: [
      {
        slug: "ch1-intro",
        title: "第一章 金融市场基础",
        sections: [
          { slug: "s1-1", title: "1.1 金融衍生品概述", chapterSlug: "ch1-intro" },
          { slug: "s1-2", title: "1.2 无套利定价原理", chapterSlug: "ch1-intro" },
        ],
        modules: {
          videos: [],
          pptFiles: [],
          content: mockContent("金融市场基础"),
          exercises: mockExercises(),
          reviews: [],
        },
      },
    ],
  },
  {
    id: "sunzi",
    title: "《孙子兵法》与决策",
    category: "战略思维",
    difficulty: "intermediate",
    instructor: "孙武",
    description: "研读《孙子兵法》十三篇，结合现代管理与商业决策，提炼战略思维的东方智慧。",
    duration: "24h",
    rating: 4.7,
    reviewCount: 540,
    likeCount: 1200,
    viewCount: 9800,
    coverImage: "https://picsum.photos/seed/sunzi-cover/400/250",
    progress: 55,
    status: "in_progress",
    chapters: [],
  },
  {
    id: "risk-mgmt",
    title: "风险管理基础",
    category: "保险精算",
    difficulty: "intermediate",
    instructor: "李归",
    description: "全面了解风险评估方法论，涵盖市场风险、信用风险、操作风险的度量与管理工具。",
    duration: "36h",
    rating: 4.5,
    reviewCount: 380,
    likeCount: 910,
    viewCount: 7600,
    coverImage: "https://picsum.photos/seed/risk-cover/400/250",
    progress: 60,
    status: "in_progress",
    chapters: [],
  },
  {
    id: "data-science",
    title: "数据分析导论",
    category: "数据科学",
    difficulty: "beginner",
    instructor: "吴思远",
    description: "从零开始掌握数据分析思维，学习Python数据处理、可视化与统计推断的基本方法。",
    duration: "30h",
    rating: 4.3,
    reviewCount: 620,
    likeCount: 1500,
    viewCount: 12400,
    coverImage: "https://picsum.photos/seed/data-sci-cover/400/250",
    progress: 0,
    status: "not_started",
    chapters: [],
  },
  {
    id: "daodejing",
    title: "《道德经》现代解读",
    category: "道家哲学",
    difficulty: "advanced",
    instructor: "老子风",
    description: "逐章解读《道德经》，探索道家无为思想与自然哲学在现代社会的应用价值。",
    duration: "40h",
    rating: 4.4,
    reviewCount: 450,
    likeCount: 1100,
    viewCount: 8900,
    coverImage: "https://picsum.photos/seed/daode-cover/400/250",
    progress: 0,
    status: "not_started",
    chapters: [],
  },
  {
    id: "python-quant",
    title: "Python 与量化投资",
    category: "编程应用",
    difficulty: "intermediate",
    instructor: "赵算法",
    description: "使用Python构建量化投资策略，从数据获取、因子分析到回测框架的完整实战。",
    duration: "42h",
    rating: 4.3,
    reviewCount: 340,
    likeCount: 870,
    viewCount: 6700,
    coverImage: "https://picsum.photos/seed/python-quant-cover/400/250",
    progress: 100,
    status: "completed",
    chapters: [],
  },
  {
    id: "shijing",
    title: "《诗经》鉴赏",
    category: "文学艺术",
    difficulty: "beginner",
    instructor: "风雅颂",
    description: "精选《诗经》风雅颂各篇，从文学、历史、音乐多维度感受中华诗歌源头的魅力。",
    duration: "20h",
    rating: 4.2,
    reviewCount: 280,
    likeCount: 650,
    viewCount: 5200,
    coverImage: "https://picsum.photos/seed/shijing-cover/400/250",
    progress: 0,
    status: "not_started",
    chapters: [],
  },
  {
    id: "stats-ml",
    title: "统计学习基础",
    category: "数据科学",
    difficulty: "advanced",
    instructor: "周概率",
    description: "系统学习统计学习理论，涵盖回归、分类、聚类、降维等核心算法的数学原理与R/Python实现。",
    duration: "52h",
    rating: 4.1,
    reviewCount: 190,
    likeCount: 480,
    viewCount: 4100,
    coverImage: "https://picsum.photos/seed/stats-cover/400/250",
    progress: 0,
    status: "not_started",
    chapters: [],
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/courses.ts
git commit -m "feat: add mock course data with chapters, modules, exercises and reviews"
```

---

### Task 3: Add i18n Keys for Courses System

**Files:**
- Modify: `src/i18n/messages/zh.json`
- Modify: `src/i18n/messages/en.json`
- Modify: `src/i18n/messages/ms.json`

**Interfaces:**
- Produces: Translation keys `courses_filter` through `reviews_existing` available via `useTranslation().t.scholar`

- [ ] **Step 1: Add keys to zh.json**

Edit `src/i18n/messages/zh.json` — add after existing scholar keys:

```json
"courses_title": "典籍",
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
"exercise_correct": "回答正确",
"exercise_wrong": "回答错误，正确答案是：",
"no_courses_found": "暂无符合条件的课程",
"submit_review": "提交评价",
"write_review": "写下你的评价...",
"reviews_existing": "已有评价",
"course_duration": "学习时长",
"course_instructor": "授课教师",
"annotation_pen": "笔",
"annotation_rect": "矩形",
"annotation_circle": "圆形",
"annotation_arrow": "箭头",
"annotation_eraser": "橡皮擦",
"annotation_clear": "清除标注",
"annotation_color": "颜色",
"annotation_size": "粗细"
```

- [ ] **Step 2: Add keys to en.json**

```json
"courses_title": "Classics",
"courses_filter": "Filter",
"courses_sort": "Sort",
"courses_sort_rating": "Highest Rated",
"courses_sort_reviews": "Most Reviewed",
"courses_sort_likes": "Most Liked",
"courses_sort_views": "Most Viewed",
"courses_sort_newest": "Newest",
"courses_category": "Category",
"courses_difficulty": "Difficulty",
"courses_status": "Status",
"courses_difficulty_beginner": "Beginner",
"courses_difficulty_intermediate": "Intermediate",
"courses_difficulty_advanced": "Advanced",
"courses_status_all": "All",
"courses_status_not_started": "Not Started",
"courses_status_in_progress": "In Progress",
"courses_status_completed": "Completed",
"courses_category_all": "All Categories",
"knowledge_tree": "Knowledge Tree",
"collapse_tree": "Collapse Tree",
"expand_tree": "Expand Tree",
"tab_video": "Videos",
"tab_ppt": "Slides",
"tab_content": "Content",
"tab_notes": "Notes",
"tab_exercises": "Exercises",
"tab_review": "Reviews",
"upload_video": "Upload Video",
"upload_ppt": "Upload Slides",
"playback_speed": "Speed",
"generate_notes": "Generate Notes",
"generating_notes": "Generating notes...",
"submit_exercises": "Submit",
"exercise_score": "Score",
"exercise_correct": "Correct!",
"exercise_wrong": "Incorrect. The correct answer is: ",
"no_courses_found": "No courses found",
"submit_review": "Submit Review",
"write_review": "Write your review...",
"reviews_existing": "Reviews",
"course_duration": "Duration",
"course_instructor": "Instructor",
"annotation_pen": "Pen",
"annotation_rect": "Rectangle",
"annotation_circle": "Circle",
"annotation_arrow": "Arrow",
"annotation_eraser": "Eraser",
"annotation_clear": "Clear All",
"annotation_color": "Color",
"annotation_size": "Size"
```

- [ ] **Step 3: Add keys to ms.json**

```json
"courses_title": "Klasik",
"courses_filter": "Tapis",
"courses_sort": "Isih",
"courses_sort_rating": "Penilaian Tertinggi",
"courses_sort_reviews": "Paling Diulas",
"courses_sort_likes": "Paling Disukai",
"courses_sort_views": "Paling Ditonton",
"courses_sort_newest": "Terbaru",
"courses_category": "Kategori",
"courses_difficulty": "Kesukaran",
"courses_status": "Status",
"courses_difficulty_beginner": "Pemula",
"courses_difficulty_intermediate": "Pertengahan",
"courses_difficulty_advanced": "Lanjutan",
"courses_status_all": "Semua",
"courses_status_not_started": "Belum Mula",
"courses_status_in_progress": "Sedang Berjalan",
"courses_status_completed": "Selesai",
"courses_category_all": "Semua Kategori",
"knowledge_tree": "Pohon Ilmu",
"collapse_tree": "Sembunyi",
"expand_tree": "Kembang",
"tab_video": "Video",
"tab_ppt": "Slaid",
"tab_content": "Kandungan",
"tab_notes": "Nota",
"tab_exercises": "Latihan",
"tab_review": "Ulasan",
"upload_video": "Muat Naik Video",
"upload_ppt": "Muat Naik Slaid",
"playback_speed": "Kelajuan",
"generate_notes": "Jana Nota",
"generating_notes": "Menjana nota...",
"submit_exercises": "Hantar",
"exercise_score": "Skor",
"exercise_correct": "Betul!",
"exercise_wrong": "Salah. Jawapan yang betul: ",
"no_courses_found": "Tiada kursus dijumpai",
"submit_review": "Hantar Ulasan",
"write_review": "Tulis ulasan anda...",
"reviews_existing": "Ulasan",
"course_duration": "Tempoh",
"course_instructor": "Pengajar",
"annotation_pen": "Pen",
"annotation_rect": "Segi Empat",
"annotation_circle": "Bulatan",
"annotation_arrow": "Anak Panah",
"annotation_eraser": "Pemadam",
"annotation_clear": "Padam Semua",
"annotation_color": "Warna",
"annotation_size": "Saiz"
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/messages/zh.json src/i18n/messages/en.json src/i18n/messages/ms.json
git commit -m "feat: add courses system i18n keys for zh/en/ms"
```

---

### Task 4: Create Course List Page (Tier 1)

**Files:**
- Create: `src/components/scholar/FilterPanel.tsx`
- Create: `src/components/scholar/CourseListCard.tsx`
- Modify: `src/app/[locale]/scholar/courses/page.tsx`

**Interfaces:**
- Consumes: `Course` type from `src/data/courses`, i18n keys from Task 3
- Produces: FilterPanel component, CourseListCard component, working `/scholar/courses` page

- [ ] **Step 1: Create FilterPanel component**

Create `src/components/scholar/FilterPanel.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { ALL_CATEGORIES } from "@/data/courses";

export interface FilterState {
  category: string;
  difficulty: string;
  status: string;
  sort: string;
}

interface FilterPanelProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"];
const STATUSES = ["all", "not_started", "in_progress", "completed"];
const SORT_OPTIONS = [
  "rating",
  "reviews",
  "likes",
  "views",
  "newest",
];

export default function FilterPanel({ filter, onChange }: FilterPanelProps) {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const [open, setOpen] = useState(false);

  const update = (key: keyof FilterState, value: string) =>
    onChange({ ...filter, [key]: value });

  return (
    <div className="mb-6">
      {/* Sort bar — always visible */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-[13px] text-[#666] hover:text-[#333] transition-colors font-bold cursor-pointer bg-transparent border-none"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          {s.courses_filter}
          {open ? " ▲" : " ▼"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
            {s.courses_sort}:
          </span>
          <select
            value={filter.sort}
            onChange={(e) => update("sort", e.target.value)}
            className="text-[13px] text-[#333] bg-[#f7f7f7] border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666] transition-colors"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {s[`courses_sort_${opt}`]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter panel — collapsible */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-6 p-5 bg-[#f7f7f7] rounded-[12px] border border-[#eee] mb-2">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#999] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>
                  {s.courses_category}:
                </span>
                <select
                  value={filter.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="text-[13px] text-[#333] bg-white border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  <option value="all">{s.courses_category_all}</option>
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#999] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>
                  {s.courses_difficulty}:
                </span>
                <select
                  value={filter.difficulty}
                  onChange={(e) => update("difficulty", e.target.value)}
                  className="text-[13px] text-[#333] bg-white border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  <option value="all">{s.courses_status_all}</option>
                  {DIFFICULTIES.filter((d) => d !== "all").map((d) => (
                    <option key={d} value={d}>{s[`courses_difficulty_${d}`]}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#999] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>
                  {s.courses_status}:
                </span>
                <select
                  value={filter.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="text-[13px] text-[#333] bg-white border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>{s[`courses_status_${st}`]}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Create CourseListCard component**

Create `src/components/scholar/CourseListCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Course } from "@/data/courses";
import { useTranslation } from "@/i18n/useTranslation";
import { IconStar } from "./Icons";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-[11px]" style={{ color: i <= Math.round(rating) ? "#C5A46D" : "#ddd" }}>
          <IconStar />
        </span>
      ))}
      <span className="text-[12px] ml-1 font-bold" style={{ color: "#C5A46D", fontFamily: "var(--font-display)" }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

const STATUS_MAP = {
  not_started: { color: "#999", bg: "#eee" },
  in_progress: { color: "#C5A46D", bg: "#faf5eb" },
  completed: { color: "#666", bg: "#e8e8e8" },
} as const;

export default function CourseListCard({ course, locale }: { course: Course; locale: string }) {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;

  return (
    <Link href={`/${locale}/scholar/courses/${course.id}`} className="no-underline">
      <motion.div
        className="flex gap-5 bg-white rounded-[12px] border border-[#eee] p-4 cursor-pointer"
        whileHover={{ y: -2, borderColor: "#ccc", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
      >
        {/* Cover */}
        <div className="w-[160px] h-[100px] flex-shrink-0 rounded-[8px] overflow-hidden bg-[#e8e8e8]">
          <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-[16px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>
                {course.title}
              </h3>
              {/* Status badge */}
              {course.status !== "not_started" && (
                <span
                  className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold flex-shrink-0"
                  style={{
                    color: STATUS_MAP[course.status].color,
                    background: STATUS_MAP[course.status].bg,
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  {s[`courses_status_${course.status}`]}
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#666] m-0 mb-1 leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-serif)" }}>
              {course.description}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
            <span>{course.instructor}</span>
            <span>·</span>
            <span>{course.category}</span>
            <span>·</span>
            <span>{course.duration}</span>
            <span>·</span>
            <StarRating rating={course.rating} />
            <span className="text-[#999]">({course.reviewCount})</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
```

- [ ] **Step 3: Rewrite courses page.tsx**

Replace `src/app/[locale]/scholar/courses/page.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses as allCourses } from "@/data/courses";
import FilterPanel, { type FilterState } from "@/components/scholar/FilterPanel";
import CourseListCard from "@/components/scholar/CourseListCard";

export default function CoursesPage() {
  const { t, locale } = useTranslation();
  const s = t.scholar as Record<string, string>;

  const [filter, setFilter] = useState<FilterState>({
    category: "all",
    difficulty: "all",
    status: "all",
    sort: "rating",
  });

  const filtered = useMemo(() => {
    let result = [...allCourses];

    // Filter
    if (filter.category !== "all") {
      result = result.filter((c) => c.category === filter.category);
    }
    if (filter.difficulty !== "all") {
      result = result.filter((c) => c.difficulty === filter.difficulty);
    }
    if (filter.status !== "all") {
      result = result.filter((c) => c.status === filter.status);
    }

    // Sort
    switch (filter.sort) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "likes":
        result.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "views":
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "newest":
        result.reverse(); // mock: reverse insertion order
        break;
    }

    return result;
  }, [filter]);

  return (
    <motion.div
      className="px-10 py-8 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-1.5"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.courses_title}
        </h1>
        <p className="text-[14px] text-[#666] m-0" style={{ fontFamily: "var(--font-serif)" }}>
          {filtered.length} 门课程
        </p>
      </div>

      {/* Filter + Sort */}
      <FilterPanel filter={filter} onChange={setFilter} />

      {/* Course list */}
      {filtered.length === 0 ? (
        <p className="text-center text-[#999] py-20 text-[14px]" style={{ fontFamily: "var(--font-serif)" }}>
          {s.no_courses_found}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <CourseListCard course={course} locale={locale} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/scholar/FilterPanel.tsx src/components/scholar/CourseListCard.tsx src/app/\[locale\]/scholar/courses/page.tsx
git commit -m "feat: implement course list page with filtering and sorting"
```

---

### Task 5: Create 3D Knowledge Tree Component

**Files:**
- Create: `src/components/scholar/KnowledgeTree.tsx`

**Interfaces:**
- Consumes: `Chapter` and `CourseSection` types from `src/data/courses`
- Produces: `<KnowledgeTree chapters={...} sections={...} onNodeClick={(slug) => void} />`

- [ ] **Step 1: Create the 3D KnowledgeTree component**

Create `src/components/scholar/KnowledgeTree.tsx`:

```tsx
"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, Sphere } from "@react-three/drei";
import * as THREE from "three";
import type { Chapter, CourseSection } from "@/data/courses";

/* ============================================================
   3D Knowledge Tree — react-three-fiber
   Nodes: Root → Chapter → Section (2 levels)
   Auto-rotates, draggable, clickable nodes
   ============================================================ */

interface TreeNodeData {
  id: string;
  label: string;
  level: number; // 0=root, 1=chapter, 2=section
  parentId: string | null;
  slug: string;
}

function layoutTree(chapters: Chapter[], sections: CourseSection[]): TreeNodeData[] {
  const nodes: TreeNodeData[] = [
    { id: "root", label: "", level: 0, parentId: null, slug: "" },
  ];
  chapters.forEach((ch) => {
    nodes.push({ id: ch.slug, label: ch.title, level: 1, parentId: "root", slug: ch.slug });
  });
  sections.forEach((sec) => {
    nodes.push({ id: sec.slug, label: sec.title, level: 2, parentId: sec.chapterSlug, slug: sec.slug });
  });
  return nodes;
}

function positions(nodes: TreeNodeData[]) {
  const posMap = new Map<string, [number, number, number]>();

  // Root at center top
  posMap.set("root", [0, 2.5, 0]);

  // Chapters: ring around root
  const level1 = nodes.filter((n) => n.level === 1);
  const radius1 = 2.2;
  level1.forEach((n, i) => {
    const angle = (i / level1.length) * Math.PI * 2 - Math.PI / 2;
    posMap.set(n.id, [Math.cos(angle) * radius1, 0.8, Math.sin(angle) * radius1]);
  });

  // Sections: ring around their parent chapter
  const level2 = nodes.filter((n) => n.level === 2);
  const radius2 = 1.3;
  const countMap = new Map<string, number>();
  level2.forEach((n) => {
    countMap.set(n.parentId, (countMap.get(n.parentId) || 0) + 1);
  });
  const idxMap = new Map<string, number>();
  level2.forEach((n) => {
    const parentPos = posMap.get(n.parentId)!;
    const totalSibs = countMap.get(n.parentId) || 1;
    const idx = idxMap.get(n.parentId) || 0;
    const angle = (idx / totalSibs) * Math.PI * 2 - Math.PI / 2 + (totalSibs <= 2 ? 0.3 : 0);
    const offset: [number, number, number] = [
      Math.cos(angle) * radius2,
      -0.8,
      Math.sin(angle) * radius2,
    ];
    posMap.set(n.id, [parentPos[0] + offset[0], parentPos[1] + offset[1], parentPos[2] + offset[2]]);
    idxMap.set(n.parentId, idx + 1);
  });

  return posMap;
}

function TreeScene({
  nodes,
  onNodeClick,
}: {
  nodes: TreeNodeData[];
  onNodeClick: (slug: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const posMap = useMemo(() => positions(nodes), [nodes]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const handleClick = useCallback(
    (slug: string) => {
      onNodeClick(slug);
    },
    [onNodeClick]
  );

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {nodes
        .filter((n) => n.parentId)
        .map((n) => {
          const parentPos = posMap.get(n.parentId)!;
          const myPos = posMap.get(n.id)!;
          return (
            <Line
              key={`edge-${n.id}`}
              points={[parentPos, myPos]}
              color="#bbb"
              lineWidth={0.5}
              transparent
              opacity={0.5}
            />
          );
        })}

      {/* Nodes */}
      {nodes.map((n) => {
        const pos = posMap.get(n.id)!;
        const isRoot = n.level === 0;
        const isChapter = n.level === 1;
        const radius = isRoot ? 0.25 : isChapter ? 0.15 : 0.1;
        const color = isRoot ? "#333" : isChapter ? "#555" : "#888";

        return (
          <group key={n.id}>
            <Sphere
              args={[radius, 16, 16]}
              position={pos}
              onClick={() => n.slug && handleClick(n.slug)}
            >
              <meshStandardMaterial color={color} />
            </Sphere>
            {n.label && (
              <Text
                position={[pos[0], pos[1] - (isChapter ? 0.3 : 0.2), pos[2]]}
                fontSize={isChapter ? 0.25 : 0.18}
                color="#333"
                anchorX="center"
                anchorY="top"
                maxWidth={3}
                font={undefined}
              >
                {n.label.length > 6 ? n.label.slice(0, 6) + "…" : n.label}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

interface KnowledgeTreeProps {
  chapters: Chapter[];
  sections: CourseSection[];
  onNodeClick: (slug: string) => void;
}

export default function KnowledgeTree({ chapters, sections, onNodeClick }: KnowledgeTreeProps) {
  const nodes = useMemo(() => layoutTree(chapters, sections), [chapters, sections]);

  if (chapters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#999] text-[13px]" style={{ fontFamily: "var(--font-serif)" }}>
        暂无知识图谱
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <TreeScene nodes={nodes} onNodeClick={onNodeClick} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scholar/KnowledgeTree.tsx
git commit -m "feat: add 3D knowledge tree with Three.js (react-three-fiber)"
```

---

### Task 6: Create TOC Accordion + Course Detail Page (Tier 2)

**Files:**
- Create: `src/components/scholar/TocAccordion.tsx`
- Create: `src/app/[locale]/scholar/courses/[courseId]/page.tsx`

**Interfaces:**
- Consumes: `Course` type, `KnowledgeTree` component, i18n keys
- Produces: Course detail page with tree + TOC

- [ ] **Step 1: Create TocAccordion component**

Create `src/components/scholar/TocAccordion.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Chapter } from "@/data/courses";

interface TocAccordionProps {
  chapters: Chapter[];
  courseId: string;
  locale: string;
  activeSection?: string;
}

export default function TocAccordion({ chapters, courseId, locale, activeSection }: TocAccordionProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  if (chapters.length === 0) {
    return (
      <p className="text-center text-[#999] py-12 text-[13px]" style={{ fontFamily: "var(--font-serif)" }}>
        暂无课程目录
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {chapters.map((ch) => {
        const isOpen = openChapters.has(ch.slug);
        return (
          <div key={ch.slug} className="border-b border-[#eee] last:border-b-0">
            {/* Chapter header */}
            <button
              onClick={() => toggle(ch.slug)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-transparent border-none cursor-pointer hover:bg-[#f7f7f7] transition-colors"
            >
              <span className="text-[15px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                {ch.title}
              </span>
              <motion.span
                className="text-[#999] text-[16px]"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </button>

            {/* Sections */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pb-3">
                    {ch.sections.map((sec) => (
                      <Link
                        key={sec.slug}
                        href={`/${locale}/scholar/courses/${courseId}/${sec.slug}`}
                        className={`block px-10 py-2.5 text-[14px] no-underline transition-colors ${
                          activeSection === sec.slug
                            ? "text-[#000] font-bold bg-[#f0f0f0] border-l-[3px] border-[#333]"
                            : "text-[#666] hover:text-[#333] hover:bg-[#f9f9f9] border-l-[3px] border-transparent"
                        }`}
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {sec.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create course detail page**

Create `src/app/[locale]/scholar/courses/[courseId]/page.tsx`:

```tsx
"use client";

import { useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import KnowledgeTree from "@/components/scholar/KnowledgeTree";
import TocAccordion from "@/components/scholar/TocAccordion";
import type { CourseSection } from "@/data/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const courseId = params?.courseId as string;
  const locale = (params?.locale as string) || "zh";

  const course = courses.find((c) => c.id === courseId);

  const [treeVisible, setTreeVisible] = useState(true);

  // Flatten all sections for the tree
  const allSections: CourseSection[] = course
    ? course.chapters.flatMap((ch) => ch.sections)
    : [];

  const handleNodeClick = (slug: string) => {
    // Navigate to the section page if it's a section slug
    const isSection = allSections.some((s) => s.slug === slug);
    if (isSection) {
      router.push(`/${locale}/scholar/courses/${courseId}/${slug}`);
    } else {
      // It's a chapter slug — scroll to that chapter in TOC
      const el = document.getElementById(`toc-${slug}`);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#999] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>
          课程不存在
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Left: Knowledge Tree */}
      <div className="relative" style={{ width: treeVisible ? "360px" : "0px", transition: "width 0.3s ease" }}>
        {treeVisible && (
          <div className="w-[360px] h-full flex flex-col border-r border-[#eee] bg-[#fafafa]">
            {/* Tree header */}
            <div className="px-5 py-4 border-b border-[#eee] flex items-center justify-between">
              <h2
                className="text-[16px] text-[#000] font-bold m-0"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {s.knowledge_tree}
              </h2>
              <button
                onClick={() => setTreeVisible(false)}
                className="text-[12px] text-[#999] hover:text-[#333] transition-colors bg-transparent border-none cursor-pointer"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {s.collapse_tree} ◀
              </button>
            </div>
            <div className="flex-1">
              <KnowledgeTree
                chapters={course.chapters}
                sections={allSections}
                onNodeClick={handleNodeClick}
              />
            </div>
          </div>
        )}
      </div>

      {/* Toggle button when tree hidden */}
      {!treeVisible && (
        <button
          onClick={() => setTreeVisible(true)}
          className="absolute left-0 top-4 z-20 bg-white border border-[#ccc] rounded-r-[8px] px-2 py-4 text-[12px] text-[#666] hover:text-[#333] transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.expand_tree} ▶
        </button>
      )}

      {/* Right: Course Title + TOC */}
      <div className="flex-1 overflow-y-auto">
        {/* Course header */}
        <div className="px-10 pt-8 pb-6 border-b border-[#eee]">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-14 h-14 rounded-[8px] object-cover"
            />
            <div>
              <h1
                className="text-[24px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {course.title}
              </h1>
              <p className="text-[13px] text-[#999] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>
                {course.instructor} · {course.category} · {course.duration}
              </p>
            </div>
          </div>
        </div>

        {/* TOC */}
        <div className="pt-2">
          <TocAccordion
            chapters={course.chapters}
            courseId={courseId}
            locale={locale}
          />
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/scholar/TocAccordion.tsx "src/app/\[locale\]/scholar/courses/\[courseId\]/page.tsx"
git commit -m "feat: add course detail page with 3D knowledge tree and TOC accordion"
```

---

### Task 7: Create Chapter Page Layout + Tab Navigation

**Files:**
- Create: `src/app/[locale]/scholar/courses/[courseId]/[chapterSlug]/page.tsx`

**Interfaces:**
- Consumes: `Course` type, i18n keys
- Produces: Chapter page with left vertical tab nav, 6 modules scaffold

- [ ] **Step 1: Create chapter page with tab scaffold**

Create `src/app/[locale]/scholar/courses/[courseId]/[chapterSlug]/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import VideoModule from "@/components/scholar/modules/VideoModule";
import PptModule from "@/components/scholar/modules/PptModule";
import ContentModule from "@/components/scholar/modules/ContentModule";
import NotesModule from "@/components/scholar/modules/NotesModule";
import ExercisesModule from "@/components/scholar/modules/ExercisesModule";
import ReviewModule from "@/components/scholar/modules/ReviewModule";

const TABS = [
  { key: "video", icon: "▶" },
  { key: "ppt", icon: "📄" },
  { key: "content", icon: "📖" },
  { key: "notes", icon: "📝" },
  { key: "exercises", icon: "✏️" },
  { key: "review", icon: "⭐" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const locale = (params?.locale as string) || "zh";
  const courseId = params?.courseId as string;
  const chapterSlug = params?.chapterSlug as string;

  const course = courses.find((c) => c.id === courseId);
  const chapter = course?.chapters.find((ch) => ch.slug === chapterSlug);

  const [activeTab, setActiveTab] = useState<TabKey>("content");

  // Find chapter index for navigation
  const chapterIdx = course?.chapters.findIndex((ch) => ch.slug === chapterSlug) ?? -1;
  const prevChapter = chapterIdx > 0 ? course?.chapters[chapterIdx - 1] : null;
  const nextChapter = chapterIdx < (course?.chapters.length ?? 0) - 1 ? course?.chapters[chapterIdx + 1] : null;

  if (!course || !chapter) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#999] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>
          章节不存在
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Left: Vertical Tab Nav */}
      <div
        className="w-[180px] flex-shrink-0 flex flex-col border-r border-[#eee] bg-[#fafafa]"
        style={{ minHeight: "100%" }}
      >
        {/* Back to TOC */}
        <button
          onClick={() => router.push(`/${locale}/scholar/courses/${courseId}`)}
          className="flex items-center gap-2 px-4 py-4 text-[13px] text-[#666] hover:text-[#333] bg-transparent border-b border-[#eee] cursor-pointer transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ← {course.title}
        </button>

        {/* Chapter nav */}
        <div className="px-4 py-3 border-b border-[#eee]">
          <p className="text-[11px] text-[#999] m-0 mb-0.5" style={{ fontFamily: "var(--font-serif)" }}>
            {chapter.title}
          </p>
          <div className="flex gap-2 mt-2">
            {prevChapter && (
              <button
                onClick={() => router.push(`/${locale}/scholar/courses/${courseId}/${prevChapter.slug}`)}
                className="text-[11px] text-[#666] hover:text-[#333] bg-transparent border-none cursor-pointer px-0"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                ← 上一章
              </button>
            )}
            {nextChapter && (
              <button
                onClick={() => router.push(`/${locale}/scholar/courses/${courseId}/${nextChapter.slug}`)}
                className="text-[11px] text-[#666] hover:text-[#333] bg-transparent border-none cursor-pointer ml-auto px-0"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                下一章 →
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex-1 flex flex-col py-2">
          {TABS.map(({ key, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-5 py-3 text-[14px] text-left border-none cursor-pointer transition-all duration-200 bg-transparent ${
                activeTab === key
                  ? "text-[#000] font-bold bg-white border-r-[3px] border-[#333]"
                  : "text-[#666] hover:text-[#333] hover:bg-white/50 border-r-[3px] border-transparent"
              }`}
              style={{ fontFamily: "var(--font-serif)" }}
            >
              <span className="text-[16px]">{icon}</span>
              {s[`tab_${key}`]}
            </button>
          ))}
        </nav>
      </div>

      {/* Right: Module Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-8">
          {activeTab === "video" && <VideoModule videos={chapter.modules.videos} s={s} />}
          {activeTab === "ppt" && <PptModule pptFiles={chapter.modules.pptFiles} s={s} />}
          {activeTab === "content" && <ContentModule content={chapter.modules.content} s={s} />}
          {activeTab === "notes" && <NotesModule content={chapter.modules.content} s={s} />}
          {activeTab === "exercises" && <ExercisesModule exercises={chapter.modules.exercises} s={s} />}
          {activeTab === "review" && <ReviewModule reviews={chapter.modules.reviews} s={s} />}
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create modules directory**

```bash
mkdir -p "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/src/components/scholar/modules"
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/\[locale\]/scholar/courses/\[courseId\]/\[chapterSlug\]/page.tsx"
git commit -m "feat: add chapter page layout with left vertical tab navigation"
```

---

### Task 8: Create Video Module

**Files:**
- Create: `src/components/scholar/modules/VideoModule.tsx`

**Interfaces:**
- Consumes: `VideoItem[]` from data, i18n scholar keys
- Produces: Video player with speed control and upload placeholder

- [ ] **Step 1: Create VideoModule**

Create `src/components/scholar/modules/VideoModule.tsx`:

```tsx
"use client";

import { useState, useRef } from "react";
import type { VideoItem } from "@/data/courses";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface VideoModuleProps {
  videos: VideoItem[];
  s: Record<string, string>;
}

export default function VideoModule({ videos, s }: VideoModuleProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_video}
      </h2>

      {/* Upload button */}
      <button
        onClick={() => alert("上传功能即将开放")}
        className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] text-[#666] bg-[#fafafa] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        + {s.upload_video}（支持 MP4, MOV, WebM, AVI, MKV）
      </button>

      {videos.length === 0 ? (
        <p className="text-[#999] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>
          暂无课程视频，请上传
        </p>
      ) : (
        <div>
          {/* Video player */}
          <div className="bg-black rounded-[12px] overflow-hidden mb-4">
            <video
              ref={videoRef}
              key={activeIdx}
              src={videos[activeIdx].src}
              controls
              className="w-full max-h-[480px]"
              style={{ background: "#000" }}
            />
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
              {s.playback_speed}:
            </span>
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                onClick={() => handleSpeedChange(sp)}
                className={`px-2.5 py-1 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${
                  speed === sp
                    ? "bg-[#333] text-white border-[#333]"
                    : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {sp}×
              </button>
            ))}
          </div>

          {/* Video list */}
          <div className="space-y-2">
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActiveIdx(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-[10px] text-left border cursor-pointer transition-colors ${
                  i === activeIdx
                    ? "bg-[#f0f0f0] border-[#ccc]"
                    : "bg-white border-[#eee] hover:border-[#ccc]"
                }`}
              >
                <span className="text-[18px]">▶</span>
                <span className="text-[14px] text-[#333] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                  {v.title}
                </span>
                <span className="ml-auto text-[11px] text-[#999] uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  {v.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scholar/modules/VideoModule.tsx
git commit -m "feat: add video module with playback speed control"
```

---

### Task 9: Create Content Module

**Files:**
- Create: `src/components/scholar/modules/ContentModule.tsx`

**Interfaces:**
- Consumes: content string (markdown-style), i18n keys
- Produces: Rendered article

- [ ] **Step 1: Create ContentModule**

Create `src/components/scholar/modules/ContentModule.tsx`:

```tsx
"use client";

interface ContentModuleProps {
  content: string;
  s: Record<string, string>;
}

/** Simple markdown line renderer — supports # headers and paragraph text */
function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={i} className="text-[22px] text-[#000] font-bold m-0 mt-8 mb-4 tracking-[calc(var(--ls-scale)*2px)]"
          style={{ fontFamily: "var(--font-serif)" }}>
          {trimmed.slice(2)}
        </h2>
      );
    }
    return (
      <p key={i} className="text-[15px] text-[#333] leading-loose m-0 mb-3"
        style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>
        {trimmed}
      </p>
    );
  });
}

export default function ContentModule({ content, s }: ContentModuleProps) {
  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_content}
      </h2>
      <div className="prose max-w-3xl">
        {renderContent(content)}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scholar/modules/ContentModule.tsx
git commit -m "feat: add course content module with article renderer"
```

---

### Task 10: Create PPT Module with Canvas Annotation

**Files:**
- Create: `src/components/scholar/modules/PptModule.tsx`

**Interfaces:**
- Consumes: `PptFile[]`, i18n keys
- Produces: PDF viewer + canvas annotation tools (pen/rect/circle/arrow/eraser, colors, sizes)

- [ ] **Step 1: Create PptModule with fabric.js annotation**

Create `src/components/scholar/modules/PptModule.tsx`:

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PptFile } from "@/data/courses";

const COLORS = ["#000000", "#C04040", "#C5A46D", "#666666", "#3B82F6"];
const SIZES = [2, 3, 5];
type ToolType = "pen" | "rect" | "circle" | "arrow" | "eraser";

interface PptModuleProps {
  pptFiles: PptFile[];
  s: Record<string, string>;
}

export default function PptModule({ pptFiles, s }: PptModuleProps) {
  const [activeFile, setActiveFile] = useState<PptFile | null>(
    pptFiles.length > 0 ? pptFiles[0] : null
  );
  const [previewMode, setPreviewMode] = useState(false);
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize fabric canvas
  useEffect(() => {
    if (!previewMode || !canvasRef.current) return;

    let fabric: any;
    import("fabric").then((mod) => {
      fabric = mod.fabric || mod;
      const { Canvas, PencilBrush, Rect, Circle, Line } = fabric as any;

      const fc = new Canvas(canvasRef.current, {
        isDrawingMode: tool === "pen",
        width: containerRef.current?.clientWidth || 800,
        height: 600,
      });
      fabricRef.current = fc;

      // Set pen brush
      if (tool === "pen") {
        fc.isDrawingMode = true;
        fc.freeDrawingBrush = new PencilBrush(fc);
        fc.freeDrawingBrush.color = color;
        fc.freeDrawingBrush.width = strokeWidth;
      }

      // Cleanup
      return () => {
        fc.dispose();
      };
    });
  }, [previewMode]);

  // Update drawing mode when tool changes
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    if (tool === "pen") {
      fc.isDrawingMode = true;
      fc.freeDrawingBrush.color = color;
      fc.freeDrawingBrush.width = strokeWidth;
    } else {
      fc.isDrawingMode = false;
    }
  }, [tool, color, strokeWidth]);

  const addShape = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc || tool === "pen" || tool === "eraser") return;

    let shape: any;
    const common = { left: 100, top: 100, stroke: color, strokeWidth, fill: "transparent" };

    switch (tool) {
      case "rect":
        shape = new (window as any).fabric.Rect({ ...common, width: 150, height: 100 });
        break;
      case "circle":
        shape = new (window as any).fabric.Circle({ ...common, radius: 60 });
        break;
      case "arrow":
        shape = new (window as any).fabric.Line([50, 50, 200, 50], { ...common });
        break;
    }
    if (shape) fc.add(shape);
    fc.renderAll();
  }, [tool, color, strokeWidth]);

  const clearAnnotations = () => {
    const fc = fabricRef.current;
    if (fc) {
      fc.getObjects().forEach((obj: any) => fc.remove(obj));
      fc.renderAll();
    }
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_ppt}
      </h2>

      {/* Upload button */}
      <button
        onClick={() => alert("上传功能即将开放")}
        className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] text-[#666] bg-[#fafafa] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        + {s.upload_ppt}（支持 PDF, PPT, PPTX, HTML）
      </button>

      {pptFiles.length === 0 ? (
        <p className="text-[#999] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>
          暂无课件，请上传
        </p>
      ) : (
        <div>
          {/* File list */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {pptFiles.map((f) => (
              <button
                key={f.id}
                onClick={() => { setActiveFile(f); setPreviewMode(false); }}
                className={`px-4 py-2 rounded-[8px] text-[13px] border cursor-pointer transition-colors ${
                  activeFile?.id === f.id
                    ? "bg-[#333] text-white border-[#333]"
                    : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                }`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {f.title}
              </button>
            ))}
          </div>

          {/* Preview area */}
          {activeFile && (
            <div className="border border-[#eee] rounded-[12px] overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] border-b border-[#eee] flex-wrap">
                {/* Preview toggle */}
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${
                    previewMode
                      ? "bg-[#333] text-white border-[#333]"
                      : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {previewMode ? "退出标注" : "预览 + 标注"}
                </button>

                {previewMode && (
                  <>
                    <span className="text-[#ccc]">|</span>

                    {/* Tools */}
                    {(["pen", "rect", "circle", "arrow"] as ToolType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setTool(t); if (t !== "pen") addShape(); }}
                        className={`px-2.5 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${
                          tool === t && t !== "eraser"
                            ? "bg-[#e0e0e0] text-[#333] border-[#999]"
                            : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                        }`}
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {s[`annotation_${t}`]}
                      </button>
                    ))}

                    <span className="text-[#ccc]">|</span>

                    {/* Colors */}
                    <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
                      {s.annotation_color}:
                    </span>
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className="w-5 h-5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: color === c ? "#333" : "transparent",
                        }}
                      />
                    ))}

                    <span className="text-[#ccc]">|</span>

                    {/* Stroke width */}
                    <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
                      {s.annotation_size}:
                    </span>
                    {SIZES.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setStrokeWidth(sz)}
                        className={`px-2 py-1 rounded-[6px] text-[11px] border cursor-pointer transition-colors ${
                          strokeWidth === sz
                            ? "bg-[#e0e0e0] text-[#333] border-[#999]"
                            : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                        }`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {sz}px
                      </button>
                    ))}

                    <span className="text-[#ccc]">|</span>

                    <button
                      onClick={clearAnnotations}
                      className="px-2.5 py-1.5 rounded-[6px] text-[12px] bg-[#fef2f2] text-[#C04040] border border-[#fecaca] cursor-pointer hover:bg-[#fee2e2] transition-colors"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {s.annotation_clear}
                    </button>
                  </>
                )}
              </div>

              {/* Content */}
              <div ref={containerRef} className="relative" style={{ minHeight: 400 }}>
                {!previewMode ? (
                  <iframe
                    src={activeFile.src}
                    className="w-full h-[600px] border-none"
                    title={activeFile.title}
                  />
                ) : (
                  <div className="relative">
                    <canvas ref={canvasRef} className="border-none" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scholar/modules/PptModule.tsx
git commit -m "feat: add PPT module with fabric.js canvas annotation tools"
```

---

### Task 11: Create Notes Module (DeepSeek API)

**Files:**
- Create: `src/components/scholar/modules/NotesModule.tsx`
- Modify: `.env.local` (create if not exists)

**Interfaces:**
- Consumes: content string, DeepSeek API key from env
- Produces: AI-generated summary displayed as structured text

- [ ] **Step 1: Create .env.local with placeholder**

Create `D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/.env.local`:

```
DEEPSEEK_API_KEY=your-api-key-here
```

> `.env.local` is already in `.gitignore` by Next.js convention. The user will replace the placeholder with their actual API key.

- [ ] **Step 2: Create NotesModule**

Create `src/components/scholar/modules/NotesModule.tsx`:

```tsx
"use client";

import { useState } from "react";

interface NotesModuleProps {
  content: string;
  s: Record<string, string>;
}

export default function NotesModule({ content, s }: NotesModuleProps) {
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || "";
      if (!apiKey) {
        // Fall back to mock if no API key
        await new Promise((r) => setTimeout(r, 1500));
        setNotes(`## 本章要点总结

### 核心概念

1. **三纲领** — "明明德、亲民、止于至善" 是整个《大学》思想的总纲，三者层层递进，构成儒家内圣外王的完整路径。

2. **明明德** — 彰明人先天本具的光明德性。儒家认为修身的过程就是通过格物致知、诚意正心的工夫，去除私欲遮蔽，使明德重新焕发。

3. **亲民** — 朱熹解为"新民"，强调君子不仅要自明其德，更要推己及人，教化天下。

4. **八条目** — 格物、致知、诚意、正心、修身、齐家、治国、平天下。其中修身居于枢纽地位。

### 关键结论

- 格物致知是大学之道的起点，是一切修身为学的基础
- 内圣（明明德）必须走向外王（亲民），两者不可偏废
- 止于至善不是一个静态的标准，而是一个不断趋近的动态过程`);
        return;
      }

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "你是一位专业的教育助理，擅长总结课程内容。请用中文回答，以结构化的Markdown格式输出，包括核心概念、关键结论等部分。",
            },
            {
              role: "user",
              content: `请根据以下课程内容，总结本章节的核心要点、重点概念和关键结论。以结构化的方式呈现。\n\n${content}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setNotes(data.choices[0]?.message?.content || "无法生成笔记");
    } catch (err: any) {
      setError(err.message || "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_notes}
      </h2>

      <button
        onClick={generateNotes}
        disabled={loading}
        className={`px-6 py-2.5 rounded-[10px] text-[14px] font-bold border-none cursor-pointer transition-colors mb-6 ${
          loading
            ? "bg-[#e0e0e0] text-[#999] cursor-not-allowed"
            : "bg-[#333] text-white hover:bg-[#555]"
        }`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {loading ? s.generating_notes : s.generate_notes}
      </button>

      {error && (
        <p className="text-[#C04040] text-[13px] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          {error}
        </p>
      )}

      {notes && (
        <div className="bg-[#fafafa] border border-[#eee] rounded-[12px] p-6 max-w-3xl">
          <div className="prose text-[14px] text-[#333] leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}>
            {/* Render markdown notes */}
            {notes.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <br key={i} />;
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-[18px] text-[#000] font-bold m-0 mt-6 mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {trimmed.slice(3)}
                  </h3>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={i} className="text-[15px] text-[#333] font-bold m-0 mt-4 mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {trimmed.slice(4)}
                  </h4>
                );
              }
              if (trimmed.startsWith("1. **") || trimmed.startsWith("2. **") || trimmed.startsWith("3. **") || trimmed.startsWith("4. **")) {
                const clean = trimmed.replace(/^\d+\.\s*\*\*/, "").replace(/\*\*/g, "");
                const [title, ...rest] = clean.split("—");
                return (
                  <p key={i} className="text-[14px] text-[#333] m-0 mb-2 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                    <strong>{title.trim()}</strong>{rest.length > 0 ? ` — ${rest.join("—")}` : ""}
                  </p>
                );
              }
              if (trimmed.startsWith("- ")) {
                return (
                  <p key={i} className="text-[14px] text-[#555] m-0 mb-1.5 ml-4 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                    · {trimmed.slice(2)}
                  </p>
                );
              }
              return (
                <p key={i} className="text-[14px] text-[#333] m-0 mb-2 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/scholar/modules/NotesModule.tsx .env.local
git commit -m "feat: add AI notes module with DeepSeek API integration (with mock fallback)"
```

---

### Task 12: Create Exercises Module

**Files:**
- Create: `src/components/scholar/modules/ExercisesModule.tsx`

**Interfaces:**
- Consumes: `Exercise[]`, i18n keys
- Produces: Interactive quiz with auto-grading

- [ ] **Step 1: Create ExercisesModule**

Create `src/components/scholar/modules/ExercisesModule.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Exercise } from "@/data/courses";

interface ExercisesModuleProps {
  exercises: Exercise[];
  s: Record<string, string>;
}

export default function ExercisesModule({ exercises, s }: ExercisesModuleProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSingleChoice = (qId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleMultiChoice = (qId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => {
      const current = (prev[qId] as string[]) || [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [qId]: next };
    });
  };

  const handleTrueFalse = (qId: string, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleFill = (qId: string, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    let correct = 0;
    exercises.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;
      if (q.type === "multi") {
        const correctAnswer = q.answer as string[];
        const userArr = userAnswer as string[];
        if (
          correctAnswer.length === userArr.length &&
          correctAnswer.every((a) => userArr.includes(a))
        ) {
          correct++;
        }
      } else {
        if (userAnswer === q.answer) correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  const isCorrect = (q: Exercise): boolean => {
    if (!submitted) return false;
    const userAnswer = answers[q.id];
    if (!userAnswer) return false;
    if (q.type === "multi") {
      const correctAnswer = q.answer as string[];
      const userArr = (userAnswer as string[]) || [];
      return (
        correctAnswer.length === userArr.length &&
        correctAnswer.every((a) => userArr.includes(a))
      );
    }
    return userAnswer === q.answer;
  };

  if (exercises.length === 0) {
    return (
      <div>
        <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>
          {s.tab_exercises}
        </h2>
        <p className="text-[#999] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>
          暂无课后习题
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_exercises}
      </h2>

      {/* Score */}
      {submitted && score !== null && (
        <div className="mb-6 p-5 bg-[#f7f7f7] rounded-[12px] border border-[#eee]">
          <p className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>
            {s.exercise_score}: {score} / {exercises.length}
            <span className="text-[14px] text-[#666] font-normal ml-2">
              ({Math.round((score / exercises.length) * 100)}%)
            </span>
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6 max-w-2xl">
        {exercises.map((q, i) => {
          const correct = isCorrect(q);
          return (
            <div
              key={q.id}
              className={`p-5 rounded-[12px] border ${
                submitted
                  ? correct
                    ? "bg-[#f5faf5] border-[#d4edda]"
                    : "bg-[#fef5f5] border-[#fecaca]"
                  : "bg-white border-[#eee]"
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="text-[12px] text-[#999] flex-shrink-0 mt-0.5 font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {i + 1}.
                </span>
                <div className="flex-1">
                  <p className="text-[14px] text-[#333] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                    {q.question}
                  </p>
                  <span
                    className="text-[10px] px-2 py-[2px] rounded-[4px]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      background: "#eee",
                      color: "#666",
                    }}
                  >
                    {q.type === "single"
                      ? "单选题"
                      : q.type === "multi"
                        ? "多选题"
                        : q.type === "truefalse"
                          ? "判断题"
                          : "填空题"}
                  </span>
                </div>
              </div>

              {/* Options */}
              {q.type === "fill" ? (
                <input
                  type="text"
                  disabled={submitted}
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleFill(q.id, e.target.value)}
                  placeholder="请输入答案..."
                  className={`w-full px-4 py-2.5 rounded-[8px] text-[14px] outline-none transition-colors ${
                    submitted
                      ? correct
                        ? "border border-[#4caf50] bg-[#f5faf5]"
                        : "border border-[#C04040] bg-[#fef5f5]"
                      : "border border-[#ccc] bg-white focus:border-[#666]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                />
              ) : (
                <div className="space-y-1.5 ml-6">
                  {q.options?.map((opt) => {
                    const isSelected =
                      q.type === "multi"
                        ? ((answers[q.id] as string[]) || []).includes(opt)
                        : answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          if (q.type === "multi") handleMultiChoice(q.id, opt);
                          else if (q.type === "truefalse") handleTrueFalse(q.id, opt);
                          else handleSingleChoice(q.id, opt);
                        }}
                        disabled={submitted}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[8px] text-[14px] text-left border cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#e8e8e8] border-[#999] text-[#333] font-bold"
                            : "bg-white border-[#eee] text-[#666] hover:border-[#ccc]"
                        } ${submitted ? "cursor-default" : ""}`}
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                            isSelected ? "border-[#333]" : "border-[#ccc]"
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#333]" />}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback after submit */}
              {submitted && (
                <p
                  className={`text-[13px] m-0 mt-3 ml-6 font-bold ${
                    correct ? "text-[#4caf50]" : "text-[#C04040]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {correct ? `✓ ${s.exercise_correct}` : `✗ ${s.exercise_wrong}${Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-8 py-3 bg-[#333] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#555] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.submit_exercises}
        </button>
      )}

      {submitted && (
        <button
          onClick={() => {
            setAnswers({});
            setSubmitted(false);
            setScore(null);
          }}
          className="mt-6 px-8 py-3 bg-white text-[#666] rounded-[10px] text-[14px] font-bold border border-[#ccc] cursor-pointer hover:border-[#666] hover:text-[#333] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          重新作答
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scholar/modules/ExercisesModule.tsx
git commit -m "feat: add interactive exercises module with auto-grading"
```

---

### Task 13: Create Review Module

**Files:**
- Create: `src/components/scholar/modules/ReviewModule.tsx`

**Interfaces:**
- Consumes: `ReviewItem[]`, i18n keys
- Produces: Star rating (single submission) + comment form (multi-submission)

- [ ] **Step 1: Create ReviewModule**

Create `src/components/scholar/modules/ReviewModule.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ReviewItem } from "@/data/courses";
import { IconStar } from "@/components/scholar/Icons";

interface ReviewModuleProps {
  reviews: ReviewItem[];
  s: Record<string, string>;
}

export default function ReviewModule({ reviews, s }: ReviewModuleProps) {
  const [myRating, setMyRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [allReviews, setAllReviews] = useState<ReviewItem[]>(reviews);

  const submitRating = () => {
    if (myRating === 0) return;
    setRatingSubmitted(true);
    alert(`已提交评分: ${myRating} 星`);
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    const newReview: ReviewItem = {
      id: `rv-new-${Date.now()}`,
      userName: "我",
      rating: myRating,
      comment: commentText.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    setAllReviews((prev) => [newReview, ...prev]);
    setCommentText("");
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_review}
      </h2>

      {/* Rating section */}
      <div className="mb-8 p-6 bg-[#fafafa] rounded-[12px] border border-[#eee] max-w-md">
        <p className="text-[15px] text-[#333] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          给本课程打分
        </p>
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => !ratingSubmitted && setMyRating(star)}
              disabled={ratingSubmitted}
              className="text-[28px] bg-transparent border-none cursor-pointer transition-transform hover:scale-110 disabled:cursor-default"
              style={{
                color: star <= myRating ? "#C5A46D" : "#ddd",
              }}
            >
              <IconStar />
            </button>
          ))}
          {myRating > 0 && (
            <span className="ml-2 text-[14px] font-bold" style={{ color: "#C5A46D", fontFamily: "var(--font-display)" }}>
              {myRating}.0
            </span>
          )}
        </div>
        {!ratingSubmitted ? (
          <button
            onClick={submitRating}
            disabled={myRating === 0}
            className={`px-5 py-2 rounded-[8px] text-[13px] font-bold border-none cursor-pointer transition-colors ${
              myRating === 0
                ? "bg-[#e0e0e0] text-[#999] cursor-not-allowed"
                : "bg-[#333] text-white hover:bg-[#555]"
            }`}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {s.submit_review}
          </button>
        ) : (
          <p className="text-[13px] text-[#666] m-0" style={{ fontFamily: "var(--font-serif)" }}>
            评分已提交 ✓
          </p>
        )}
      </div>

      {/* Comment section */}
      <div className="max-w-lg mb-6">
        <p className="text-[15px] text-[#333] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          {s.write_review}
        </p>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={s.write_review}
          rows={3}
          className="w-full px-4 py-3 border border-[#ccc] rounded-[10px] text-[14px] text-[#333] outline-none resize-none focus:border-[#666] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        />
        <button
          onClick={submitComment}
          disabled={!commentText.trim()}
          className={`mt-3 px-5 py-2 rounded-[8px] text-[13px] font-bold border-none cursor-pointer transition-colors ${
            !commentText.trim()
              ? "bg-[#e0e0e0] text-[#999] cursor-not-allowed"
              : "bg-[#333] text-white hover:bg-[#555]"
          }`}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.submit_review}
        </button>
      </div>

      {/* Existing reviews */}
      <div className="max-w-lg">
        <p className="text-[15px] text-[#333] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          {s.reviews_existing} ({allReviews.length})
        </p>
        {allReviews.length === 0 ? (
          <p className="text-[13px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
            暂无评价
          </p>
        ) : (
          <div className="space-y-3">
            {allReviews.map((rv) => (
              <div key={rv.id} className="p-4 bg-white rounded-[10px] border border-[#eee]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[13px] text-[#333] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                    {rv.userName}
                  </span>
                  <span className="inline-flex items-center gap-[1px]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-[10px]" style={{ color: s <= rv.rating ? "#C5A46D" : "#ddd" }}>
                        <IconStar />
                      </span>
                    ))}
                  </span>
                  <span className="text-[11px] text-[#999] ml-auto" style={{ fontFamily: "var(--font-display)" }}>
                    {rv.date}
                  </span>
                </div>
                <p className="text-[13px] text-[#666] m-0 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                  {rv.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/scholar/modules/ReviewModule.tsx
git commit -m "feat: add course review module with star rating and comments"
```

---

### Task 14: Final Integration, Build & Deploy

**Files:**
- (no new files, verify all existing)

**Interfaces:**
- Consumes: All previous tasks
- Produces: Green build, deployed app

- [ ] **Step 1: Verify all files exist**

```bash
ls "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/src/components/scholar/modules/"
# Expected: VideoModule.tsx, PptModule.tsx, ContentModule.tsx, NotesModule.tsx, ExercisesModule.tsx, ReviewModule.tsx
ls "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/src/components/scholar/FilterPanel.tsx"
ls "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/src/components/scholar/CourseListCard.tsx"
ls "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/src/components/scholar/KnowledgeTree.tsx"
ls "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/src/components/scholar/TocAccordion.tsx"
ls "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy/src/data/courses.ts"
```

- [ ] **Step 2: Run TypeScript check**

```bash
cd "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy"
npx -p typescript tsc --project tsconfig.json --noEmit 2>&1 | head -30
```

Expected: No errors in our new files (pre-existing CSS import warning is acceptable).

- [ ] **Step 3: Run Next.js build**

```bash
cd "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy"
npx next build --turbopack 2>&1 | tail -30
```

Expected: All routes compile, no build errors.

- [ ] **Step 4: Deploy to Railway**

```bash
cd "D:/桌面C/NUS/AAG/CMT/SPT/gewu-academy"
git add .
git commit -m "feat: complete courses system - list, detail with 3D tree, chapter with 6 modules"
git push origin master
railway up --service gewu-academy
```

- [ ] **Step 5: Wait for deploy and verify**

```bash
until railway status 2>&1 | grep -q "Online[^·]*https"; do sleep 5; done
railway status
```

Verify at: `https://gewu-academy-production.up.railway.app/en/scholar/courses`

---

## Plan Completeness Checklist

- [x] Spec coverage: All 3 tiers, all 6 modules, all i18n keys, mock data
- [x] No placeholders: All code is complete, no TBD/TODO
- [x] Type consistency: Chapter.slug, Course.id, Section.slug used consistently across components
- [x] File structure: 6 module files in `modules/` subdirectory, 4 scholar components, 1 data file
