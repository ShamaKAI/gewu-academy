export interface BookChapter {
  slug: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: "fund" | "insurance" | "finance" | "classic";
  cover: string;
  chapters: BookChapter[];
}

export const BOOK_CATEGORIES = {
  fund: "基金",
  insurance: "保险",
  finance: "理财",
  classic: "经典",
} as const;

function mockParagraphs(count: number): string {
  const base = [
    "在现代金融体系中，资产管理扮演着越来越重要的角色。无论是个人投资者还是机构客户，理解基本的金融原理和投资策略，是实现财富保值增值的前提条件。新加坡作为亚洲重要的金融中心，拥有成熟的监管框架和多元化的金融产品生态。",
    "从历史的角度看，金融市场的演变经历了从简单到复杂、从本地到全球的过程。每一次重大的金融创新，都伴随着监管制度的演进和投资者保护机制的完善。理解这些历史脉络，有助于我们更好地把握当前市场的运行逻辑。",
    "风险与收益是金融世界的永恒主题。没有风险就没有收益，但过度的风险可能导致灾难性的损失。因此，建立正确的风险管理意识，学习科学的资产配置方法，是每一位金融从业者和投资者的必修课。",
    "在实际操作层面，投资者需要关注多个维度：宏观经济环境、行业趋势、公司基本面、技术分析指标等。但更重要的是，要建立自己的投资哲学和纪律，不被短期市场波动所干扰。",
    "保险作为一种风险管理工具，其核心功能是为不确定性提供保障。无论是人寿保险、健康保险还是财产保险，都是通过聚合大量个体的风险，利用大数法则来实现风险的分摊和转移。",
    "经典的投资者教育读本往往强调长期投资、价值发现和复利的力量。这些看似简单的道理，在实践中却需要极大的耐心和纪律。",
  ];
  return Array.from({ length: count }, (_, i) => base[i % base.length]).join("\n\n");
}

function mkBook(id: string, title: string, author: string, category: Book["category"], chCount: number, seed: number): Book {
  return {
    id, title, author, category,
    cover: `https://picsum.photos/seed/book-${seed}/200/280`,
    chapters: Array.from({ length: chCount }, (_, i) => ({
      slug: `ch${i + 1}`,
      title: `第${["一二三四五六七八九十"][i]}章 ${["基础概念","核心原理","实践应用","进阶策略","案例分析","未来展望","风险管理","投资心法","市场洞察","深度解析"][i]}`,
      content: `# ${title}\n\n${mockParagraphs(3)}`,
    })),
  };
}

export const books: Book[] = [
  // FUND (基金) — 8 books
  mkBook("index-fund-guide", "指数基金投资指南", "约翰·博格", "fund", 4, 1),
  mkBook("risk-management-practice", "风险管理实战", "纳西姆·塔勒布", "fund", 3, 2),
  mkBook("etf-handbook", "ETF投资完全手册", "德博拉·富尔", "fund", 5, 20),
  mkBook("mutual-fund-mastery", "共同基金精要", "彼得·林奇", "fund", 4, 21),
  mkBook("smart-beta", "聪明贝塔策略", "安德鲁·罗", "fund", 4, 22),
  mkBook("hedge-fund-primer", "对冲基金入门", "塞巴斯蒂安·马拉比", "fund", 5, 23),
  mkBook("bond-investing", "债券投资基础", "安妮特·托马塞蒂", "fund", 3, 24),
  mkBook("reit-investing-sg", "新加坡REITs投资", "Kevin Tan", "fund", 4, 25),

  // INSURANCE (保险) — 7 books
  mkBook("insurance-principles", "保险原理与实务", "新加坡保险学院", "insurance", 3, 3),
  mkBook("life-insurance-guide", "人寿保险指南", "Robert Loo", "insurance", 4, 30),
  mkBook("health-insurance-sg", "新加坡健康保险解析", "MediShield Life", "insurance", 4, 31),
  mkBook("general-insurance", "财产与意外保险", "Goh Chok Tong", "insurance", 3, 32),
  mkBook("actuarial-science-intro", "精算科学导论", "Stuart Klugman", "insurance", 5, 33),
  mkBook("risk-pooling", "风险聚合论", "Karl Borch", "insurance", 4, 34),
  mkBook("insurance-regulation", "保险监管与合规", "MAS Academy", "insurance", 3, 35),

  // FINANCE (理财) — 8 books
  mkBook("poor-charlie-almanack", "穷查理宝典", "查理·芒格", "finance", 5, 4),
  mkBook("buffett-letters", "巴菲特致股东信", "沃伦·巴菲特", "finance", 4, 5),
  mkBook("singapore-finance", "新加坡理财入门", "CPF Board", "finance", 4, 6),
  mkBook("intelligent-investor", "聪明的投资者", "本杰明·格雷厄姆", "finance", 5, 40),
  mkBook("random-walk", "漫步华尔街", "伯顿·马尔基尔", "finance", 4, 41),
  mkBook("psychology-of-money", "金钱心理学", "摩根·豪塞尔", "finance", 5, 42),
  mkBook("one-up-wall-street", "华尔街股市投资经典", "彼得·林奇", "finance", 4, 43),
  mkBook("little-book-value", "价值投资小书", "克里斯托弗·布朗", "finance", 3, 44),

  // CLASSIC (经典) — 7 books
  mkBook("economics-principles", "经济学原理", "曼昆", "classic", 5, 7),
  mkBook("rich-dad-poor-dad", "富爸爸穷爸爸", "罗伯特·清崎", "classic", 4, 8),
  mkBook("think-and-grow-rich", "思考致富", "拿破仑·希尔", "classic", 5, 50),
  mkBook("richest-man-babylon", "巴比伦最富有的人", "乔治·克拉森", "classic", 4, 51),
  mkBook("black-swan", "黑天鹅", "纳西姆·塔勒布", "classic", 5, 52),
  mkBook("nudge", "助推", "理查德·塞勒", "classic", 4, 53),
  mkBook("thinking-fast-slow", "思考，快与慢", "丹尼尔·卡尼曼", "classic", 5, 54),
];
