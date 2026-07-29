export interface CourseSection {
  slug: string;
  title: string;
  titleEn?: string;
  titleMs?: string;
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
  titleEn?: string;
  titleMs?: string;
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
      question: "《大学》三纲领中，“明明德”的第一个“明”是什么意思？",
      options: ["光明", "彰明、发扬", "明天", "明亮"],
      answer: "彰明、发扬",
    },
    {
      id: "q2",
      type: "single",
      question: "朱熹将“在亲民”的“亲”解释为什么意思？",
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
      question: "“止于至善”是《大学》三纲领的最高目标。",
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
        titleEn: "Ch.1 The Origin of Gewu Zhizhi",
        titleMs: "Bab 1 Asal-usul Gewu Zhizhi",
        sections: [
          { slug: "s1-1", title: "1.1 《大学》原文精读", titleEn: "1.1 The Great Learning — Original Text", titleMs: "1.1 Teks Asal — Pembelajaran Agung", chapterSlug: "ch1-ge-wu" },
          { slug: "s1-2", title: "1.2 格物释义", titleEn: "1.2 Gewu Explained", titleMs: "1.2 Penjelasan Gewu", chapterSlug: "ch1-ge-wu" },
          { slug: "s1-3", title: "1.3 致知之道", titleEn: "1.3 The Path to Zhizhi", titleMs: "1.3 Jalan Menuju Zhizhi", chapterSlug: "ch1-ge-wu" },
        ],
        modules: {
          videos: [],
          pptFiles: [],
          content: mockContent("格物致知的本源"),
          exercises: mockExercises(),
          reviews: mockReviews(),
        },
      },
      {
        slug: "ch2-zhi-xing",
        title: "第二章 知行合一",
        titleEn: "Ch.2 Unity of Knowledge and Action",
        titleMs: "Bab 2 Kesatuan Ilmu dan Tindakan",
        sections: [
          { slug: "s2-1", title: "2.1 知先行后", titleEn: "2.1 Knowledge Before Action", titleMs: "2.1 Ilmu Sebelum Tindakan", chapterSlug: "ch2-zhi-xing" },
          { slug: "s2-2", title: "2.2 行而后知", titleEn: "2.2 Action Before Knowledge", titleMs: "2.2 Tindakan Sebelum Ilmu", chapterSlug: "ch2-zhi-xing" },
          { slug: "s2-3", title: "2.3 知行互动", titleEn: "2.3 Knowledge-Action Interplay", titleMs: "2.3 Interaksi Ilmu-Tindakan", chapterSlug: "ch2-zhi-xing" },
        ],
        modules: {
          videos: [],
          pptFiles: [],
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
        titleEn: "Ch.3 Sincerity and Rectifying the Mind",
        titleMs: "Bab 3 Keikhlasan dan Memperbetulkan Hati",
        sections: [
          { slug: "s3-1", title: "3.1 诚意之道", titleEn: "3.1 The Way of Sincerity", titleMs: "3.1 Jalan Keikhlasan", chapterSlug: "ch3-cheng-yi" },
          { slug: "s3-2", title: "3.2 正心工夫", titleEn: "3.2 Rectifying the Mind", titleMs: "3.2 Memperbetulkan Hati", chapterSlug: "ch3-cheng-yi" },
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
        titleEn: "Ch.4 Self-Cultivation and Family Regulation",
        titleMs: "Bab 4 Pembudayaan Diri dan Pengurusan Keluarga",
        sections: [
          { slug: "s4-1", title: "4.1 修身为本", titleEn: "4.1 Self-Cultivation as Foundation", titleMs: "4.1 Pembudayaan Diri sebagai Asas", chapterSlug: "ch4-xiu-shen" },
          { slug: "s4-2", title: "4.2 齐家之道", titleEn: "4.2 The Way of Family Regulation", titleMs: "4.2 Jalan Pengurusan Keluarga", chapterSlug: "ch4-xiu-shen" },
          { slug: "s4-3", title: "4.3 治国平天下", titleEn: "4.3 Governing the State and Pacifying the World", titleMs: "4.3 Memerintah Negara dan Mendamaikan Dunia", chapterSlug: "ch4-xiu-shen" },
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
        titleEn: "Ch.1 Xue Er (On Learning)",
        titleMs: "Bab 1 Xue Er (Tentang Pembelajaran)",
        sections: [
          { slug: "s1-1", title: "1.1 学而时习之", titleEn: "1.1 Learn and Practice", titleMs: "1.1 Belajar dan Amalkan", chapterSlug: "ch1-xue-er" },
          { slug: "s1-2", title: "1.2 其为人也孝弟", titleEn: "1.2 Filial Piety and Brotherhood", titleMs: "1.2 Ketaatan dan Persaudaraan", chapterSlug: "ch1-xue-er" },
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
        titleEn: "Ch.2 Wei Zheng (On Governance)",
        titleMs: "Bab 2 Wei Zheng (Tentang Pemerintahan)",
        sections: [
          { slug: "s2-1", title: "2.1 为政以德", titleEn: "2.1 Govern with Virtue", titleMs: "2.1 Memerintah dengan Kebajikan", chapterSlug: "ch2-wei-zheng" },
          { slug: "s2-2", title: "2.2 道之以政", titleEn: "2.2 Guide with Law", titleMs: "2.2 Memimpin dengan Undang-undang", chapterSlug: "ch2-wei-zheng" },
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
        titleEn: "Ch.1 Financial Market Basics",
        titleMs: "Bab 1 Asas Pasaran Kewangan",
        sections: [
          { slug: "s1-1", title: "1.1 金融衍生品概述", titleEn: "1.1 Derivatives Overview", titleMs: "1.1 Gambaran Derivatif", chapterSlug: "ch1-intro" },
          { slug: "s1-2", title: "1.2 无套利定价原理", titleEn: "1.2 No-Arbitrage Pricing", titleMs: "1.2 Prinsip Penentuan Harga Tanpa Arbitraj", chapterSlug: "ch1-intro" },
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
  // === 师者课程 (栖云先生) ===
  { id: "wealth-foundation", title: "财富管理的底层逻辑", category: "理财规划", difficulty: "beginner", instructor: "栖云先生", description: "建立系统的财富管理思维框架，从资产配置到风险管理，掌握财富保全与增长的核心逻辑。", duration: "24h", rating: 4.8, reviewCount: 320, likeCount: 1500, viewCount: 6200, coverImage: "https://picsum.photos/seed/wealth-foundation/400/250", progress: 45, status: "in_progress", chapters: [] },
  { id: "family-legacy", title: "家族财富传承", category: "理财规划", difficulty: "advanced", instructor: "栖云先生", description: "深入探索家族财富的代际传承规划，涵盖信托架构、税务优化与家族治理体系设计。", duration: "36h", rating: 4.9, reviewCount: 280, likeCount: 1200, viewCount: 5100, coverImage: "https://picsum.photos/seed/family-legacy/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "business-wealth-arch", title: "企业主财富架构设计", category: "企业理财", difficulty: "advanced", instructor: "栖云先生", description: "专为企业主打造的财富架构课程，整合企业财务、个人财富与家庭保障的完整规划体系。", duration: "40h", rating: 4.7, reviewCount: 210, likeCount: 980, viewCount: 4300, coverImage: "https://picsum.photos/seed/business-wealth/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "long-term-allocation", title: "长期资产配置", category: "投资管理", difficulty: "intermediate", instructor: "栖云先生", description: "以长期主义为指导的资产配置方法论，纪律驱动、周期平衡，实现财富的稳健增长。", duration: "28h", rating: 4.6, reviewCount: 190, likeCount: 850, viewCount: 3800, coverImage: "https://picsum.photos/seed/long-allocation/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "retirement-cashflow", title: "退休现金流规划", category: "理财规划", difficulty: "intermediate", instructor: "栖云先生", description: "设计可持续的退休现金流方案，综合运用年金、保险与投资工具，确保晚年的从容与安定。", duration: "20h", rating: 4.5, reviewCount: 160, likeCount: 720, viewCount: 3400, coverImage: "https://picsum.photos/seed/retire-cash/400/250", progress: 0, status: "not_started", chapters: [] },
  // === 师者课程 (知微先生) ===
  { id: "family-wealth-plan", title: "家庭财富规划", category: "理财规划", difficulty: "beginner", instructor: "知微先生", description: "从新婚家庭到子女教育，系统掌握不同人生阶段的财富规划方法，建立完整的家庭保障体系。", duration: "24h", rating: 4.7, reviewCount: 450, likeCount: 2100, viewCount: 8900, coverImage: "https://picsum.photos/seed/family-plan/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "education-fund", title: "教育金配置策略", category: "理财规划", difficulty: "beginner", instructor: "知微先生", description: "科学规划子女教育基金，从储蓄目标设定到投资工具选择，确保教育梦想不因财务而受限。", duration: "16h", rating: 4.6, reviewCount: 380, likeCount: 1700, viewCount: 7200, coverImage: "https://picsum.photos/seed/edu-fund/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "medical-protection", title: "医疗保障体系", category: "保险精算", difficulty: "beginner", instructor: "知微先生", description: "全面解析医疗保险体系，从基础医保到高端医疗险，构建适合家庭需求的健康保障网络。", duration: "18h", rating: 4.5, reviewCount: 340, likeCount: 1500, viewCount: 6500, coverImage: "https://picsum.photos/seed/medical-protect/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "women-wealth", title: "女性财富成长", category: "理财规划", difficulty: "beginner", instructor: "知微先生", description: "专为女性打造的财富成长课程，帮助女性建立财务自信，从独立理财到家庭财富管理。", duration: "20h", rating: 4.8, reviewCount: 520, likeCount: 2400, viewCount: 10500, coverImage: "https://picsum.photos/seed/women-wealth/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "life-stage-plan", title: "人生不同阶段的财富规划", category: "理财规划", difficulty: "intermediate", instructor: "知微先生", description: "以人生周期为线索，系统梳理青年、中年到退休各阶段的财富需求与对应策略。", duration: "30h", rating: 4.6, reviewCount: 290, likeCount: 1300, viewCount: 5600, coverImage: "https://picsum.photos/seed/life-plan/400/250", progress: 0, status: "not_started", chapters: [] },
  // === 师者课程 (观澜先生) ===
  { id: "global-allocation", title: "全球资产配置", category: "投资管理", difficulty: "advanced", instructor: "观澜先生", description: "以全球视野构建跨市场、跨币种的资产配置组合，掌握汇率风险管理和地域分散化的核心方法。", duration: "42h", rating: 4.9, reviewCount: 360, likeCount: 1800, viewCount: 7800, coverImage: "https://picsum.photos/seed/global-alloc/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "etf-practice", title: "ETF投资实践", category: "投资管理", difficulty: "intermediate", instructor: "观澜先生", description: "从ETF基础知识到高级交易策略，手把手构建投资组合，覆盖股票、债券、商品及主题ETF。", duration: "26h", rating: 4.7, reviewCount: 420, likeCount: 2100, viewCount: 9200, coverImage: "https://picsum.photos/seed/etf-prac/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "value-investing", title: "长期价值投资", category: "投资管理", difficulty: "intermediate", instructor: "观澜先生", description: "立足格雷厄姆与巴菲特的价值投资传统，学习安全边际、护城河分析与企业内在价值评估。", duration: "34h", rating: 4.8, reviewCount: 500, likeCount: 2600, viewCount: 11200, coverImage: "https://picsum.photos/seed/long-value/400/250", progress: 35, status: "in_progress", chapters: [] },
  { id: "risk-mgmt-advanced", title: "风险管理进阶", category: "投资管理", difficulty: "advanced", instructor: "观澜先生", description: "从传统风险度量到尾部风险管理，系统学习 VaR、压力测试与反脆弱策略。", duration: "30h", rating: 4.5, reviewCount: 230, likeCount: 1100, viewCount: 4800, coverImage: "https://picsum.photos/seed/risk-adv/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "usd-asset-plan", title: "美元资产规划", category: "投资管理", difficulty: "intermediate", instructor: "观澜先生", description: "系统了解美元资产的投资渠道与规划方法，从美股 ETF 到美元保险产品，构建跨境配置方案。", duration: "22h", rating: 4.4, reviewCount: 180, likeCount: 850, viewCount: 3600, coverImage: "https://picsum.photos/seed/usd-plan/400/250", progress: 0, status: "not_started", chapters: [] },
  // === 师者课程 (抱朴先生) ===
  { id: "corp-wealth-mgmt", title: "企业财富管理", category: "企业理财", difficulty: "advanced", instructor: "抱朴先生", description: "从企业现金流管理到股东财富规划，整合企业财务与个人财富的完整管理框架。", duration: "38h", rating: 4.7, reviewCount: 260, likeCount: 1200, viewCount: 5400, coverImage: "https://picsum.photos/seed/corp-wealth/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "corp-risk-mgmt", title: "企业风险管理", category: "企业理财", difficulty: "advanced", instructor: "抱朴先生", description: "构建企业风险管理体系，覆盖经营风险、财务风险与战略风险的全维度识别与应对策略。", duration: "36h", rating: 4.6, reviewCount: 200, likeCount: 950, viewCount: 4200, coverImage: "https://picsum.photos/seed/corp-risk/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "startup-wealth-protect", title: "创业者财富保护", category: "企业理财", difficulty: "intermediate", instructor: "抱朴先生", description: "帮助创业者在企业不同发展阶段，建立个人财富保护机制，避免经营风险波及家庭财务。", duration: "20h", rating: 4.5, reviewCount: 150, likeCount: 700, viewCount: 3100, coverImage: "https://picsum.photos/seed/startup-protect/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "succession-plan", title: "企业传承规划", category: "企业理财", difficulty: "advanced", instructor: "抱朴先生", description: "探索家族企业代际传承的最佳实践，涵盖股权架构、接班人培养与治理机制设计。", duration: "32h", rating: 4.8, reviewCount: 180, likeCount: 850, viewCount: 3900, coverImage: "https://picsum.photos/seed/succession/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "shareholder-protection", title: "股东保障体系", category: "企业理财", difficulty: "advanced", instructor: "抱朴先生", description: "设计股东保障方案，运用保险、信托与协议工具，确保股东权益在企业变动中的安全与稳定。", duration: "24h", rating: 4.4, reviewCount: 130, likeCount: 600, viewCount: 2800, coverImage: "https://picsum.photos/seed/shareholder/400/250", progress: 0, status: "not_started", chapters: [] },
  // === 师者课程 (清衡先生) ===
  { id: "ai-wealth-mgmt", title: "AI时代的财富管理", category: "科技金融", difficulty: "beginner", instructor: "清衡先生", description: "探索人工智能如何重塑财富管理行业，从智能投顾到个性化资产配置，拥抱科技驱动的财富新范式。", duration: "20h", rating: 4.7, reviewCount: 280, likeCount: 1400, viewCount: 6400, coverImage: "https://picsum.photos/seed/ai-wealth/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "digital-wealth", title: "数字财富规划", category: "科技金融", difficulty: "beginner", instructor: "清衡先生", description: "利用数字化工具进行高效财富规划，从预算管理 App 到自动化投资平台，打造智能化的财富管理体系。", duration: "16h", rating: 4.5, reviewCount: 220, likeCount: 1000, viewCount: 4800, coverImage: "https://picsum.photos/seed/digital-wealth/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "robo-advisor", title: "智能投顾实践", category: "科技金融", difficulty: "intermediate", instructor: "清衡先生", description: "深入了解智能投顾的原理与实践，比较主流平台的算法逻辑与资产配置模型。", duration: "18h", rating: 4.4, reviewCount: 160, likeCount: 750, viewCount: 3500, coverImage: "https://picsum.photos/seed/robo-advisor/400/250", progress: 0, status: "not_started", chapters: [] },
  { id: "first-wealth-plan", title: "年轻人的第一份财富规划", category: "理财规划", difficulty: "beginner", instructor: "清衡先生", description: "为零基础的年轻人设计的第一份财富规划，从储蓄到投资，建立适应新时代的财富思维。", duration: "12h", rating: 4.8, reviewCount: 620, likeCount: 3200, viewCount: 15800, coverImage: "https://picsum.photos/seed/first-plan/400/250", progress: 60, status: "in_progress", chapters: [] },
  { id: "digital-tools-advisor", title: "财富顾问数字化工具", category: "科技金融", difficulty: "intermediate", instructor: "清衡先生", description: "面向财富顾问的数字化工具课程，掌握客户画像、风险测评和组合优化等核心科技技能。", duration: "24h", rating: 4.3, reviewCount: 140, likeCount: 650, viewCount: 2900, coverImage: "https://picsum.photos/seed/digital-tools/400/250", progress: 0, status: "not_started", chapters: [] },
];
