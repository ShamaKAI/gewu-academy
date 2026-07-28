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

const BOOK_CATEGORIES = {
  fund: "基金",
  insurance: "保险",
  finance: "理财",
  classic: "经典",
} as const;
export { BOOK_CATEGORIES };

function mockParagraphs(count: number): string {
  const base = [
    "在现代金融体系中，资产管理扮演着越来越重要的角色。无论是个人投资者还是机构客户，理解基本的金融原理和投资策略，是实现财富保值增值的前提条件。新加坡作为亚洲重要的金融中心，拥有成熟的监管框架和多元化的金融产品生态。",
    "从历史的角度看，金融市场的演变经历了从简单到复杂、从本地到全球的过程。每一次重大的金融创新，都伴随着监管制度的演进和投资者保护机制的完善。理解这些历史脉络，有助于我们更好地把握当前市场的运行逻辑。",
    "风险与收益是金融世界的永恒主题。没有风险就没有收益，但过度的风险可能导致灾难性的损失。因此，建立正确的风险管理意识，学习科学的资产配置方法，是每一位金融从业者和投资者的必修课。",
    "在实际操作层面，投资者需要关注多个维度：宏观经济环境、行业趋势、公司基本面、技术分析指标等。但更重要的是，要建立自己的投资哲学和纪律，不被短期市场波动所干扰。",
    "保险作为一种风险管理工具，其核心功能是为不确定性提供保障。无论是人寿保险、健康保险还是财产保险，都是通过聚合大量个体的风险，利用大数法则来实现风险的分摊和转移。",
    "经典的投资者教育读本往往强调长期投资、价值发现和复利的力量。这些看似简单的道理，在实践中却需要极大的耐心和纪律。正如巴菲特所说，投资最重要的品质不是智商，而是耐心。",
  ];
  return Array.from({ length: count }, (_, i) => base[i % base.length]).join("\n\n");
}

export const books: Book[] = [
  {
    id: "index-fund-guide",
    title: "指数基金投资指南",
    author: "约翰·博格",
    category: "fund",
    cover: "https://picsum.photos/seed/book-index-fund/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 什么是指数基金", content: "# 什么是指数基金\n\n指数基金是一种追踪特定市场指数表现的投资工具。与传统主动管理型基金不同，指数基金不试图超越市场，而是通过复制指数的成分股来获得与市场大致相同的回报。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 指数基金的优势", content: "# 指数基金的优势\n\n指数基金最大的优势在于成本低廉。由于不需要高薪聘请基金经理进行主动选股，指数基金的管理费用通常只有主动型基金的十分之一甚至更低。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 如何选择指数基金", content: "# 如何选择指数基金\n\n选择指数基金时，需要关注几个关键指标：跟踪误差、费率、规模和流动性。跟踪误差越小，基金的表现就越接近指数的实际回报。\n\n" + mockParagraphs(3) },
      { slug: "ch4", title: "第四章 定投策略与实践", content: "# 定投策略与实践\n\n定期定额投资（Dollar Cost Averaging）是普通投资者最实用的策略之一。通过在固定时间投入固定金额，可以平摊买入成本，减少市场波动的影响。\n\n" + mockParagraphs(3) },
    ],
  },
  {
    id: "insurance-principles",
    title: "保险原理与实务",
    author: "新加坡保险学院",
    category: "insurance",
    cover: "https://picsum.photos/seed/book-insurance/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 保险的基本原理", content: "# 保险的基本原理\n\n保险的核心原理是风险聚合与分散。通过收取大量投保人的保费，保险公司建立起资金池，用于赔付少数发生保险事故的被保险人。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 人身保险产品解析", content: "# 人身保险产品解析\n\n人身保险主要包括人寿保险、健康保险和意外伤害保险。每种产品都有其特定的保障范围和适用场景。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 新加坡保险监管框架", content: "# 新加坡保险监管框架\n\n新加坡金融管理局（MAS）对保险行业实行严格的监管。包括风险资本要求（RBC）、市场行为监管和信息披露制度等方面。\n\n" + mockParagraphs(3) },
    ],
  },
  {
    id: "poor-charlie-almanack",
    title: "穷查理宝典",
    author: "查理·芒格",
    category: "finance",
    cover: "https://picsum.photos/seed/book-charlie/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 多元思维模型", content: "# 多元思维模型\n\n查理·芒格提倡运用多学科的知识来分析和解决问题。他认为，手里只有锤子的人，看什么都像钉子。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 人类误判心理学", content: "# 人类误判心理学\n\n芒格总结了25种人类常见的心理倾向，这些倾向会导致我们做出错误的判断和决策。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 投资原则", content: "# 投资原则\n\n在合理的价格买入优秀的企业，远胜于在便宜的价格买入平庸的企业。\n\n" + mockParagraphs(3) },
      { slug: "ch4", title: "第四章 能力圈与安全边际", content: "# 能力圈与安全边际\n\n每个人都有自己的能力圈。知道自己不知道什么，比什么都懂更重要。\n\n" + mockParagraphs(3) },
      { slug: "ch5", title: "第五章 终身学习的意义", content: "# 终身学习的意义\n\n芒格强调，获取智慧是一种道德责任。持续学习不仅能让我们做出更好的决策，也能让我们成为更好的人。\n\n" + mockParagraphs(3) },
    ],
  },
  {
    id: "buffett-letters",
    title: "巴菲特致股东信",
    author: "沃伦·巴菲特",
    category: "finance",
    cover: "https://picsum.photos/seed/book-buffett/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 价值投资的哲学", content: "# 价值投资的哲学\n\n巴菲特在信中反复强调价值投资的核心原则：以合理的价格买入优秀的企业，并长期持有。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 复利的魔力", content: "# 复利的魔力\n\n复利是世界第八大奇迹。理解复利的力量，是投资成功的基石。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 市场先生与情绪控制", content: "# 市场先生与情绪控制\n\n市场时常会出现非理性的波动。聪明的投资者应该利用市场先生的情绪，而不是被他所左右。\n\n" + mockParagraphs(3) },
      { slug: "ch4", title: "第四章 企业分析框架", content: "# 企业分析框架\n\n巴菲特关注企业的护城河、管理团队质量和自由现金流。\n\n" + mockParagraphs(3) },
    ],
  },
  {
    id: "singapore-finance",
    title: "新加坡理财入门",
    author: "CPF Board",
    category: "finance",
    cover: "https://picsum.photos/seed/book-sg-finance/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 CPF 制度解析", content: "# CPF 制度解析\n\n新加坡的中央公积金制度是全球最独特的退休保障体系之一。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 SRS 与税务规划", content: "# SRS 与税务规划\n\n补充退休储蓄计划（SRS）是优化个人所得税的有效工具。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 REITs 投资入门", content: "# REITs 投资入门\n\n新加坡是全球领先的REITs市场，为投资者提供了便捷的房地产投资渠道。\n\n" + mockParagraphs(3) },
      { slug: "ch4", title: "第四章 退休规划全攻略", content: "# 退休规划全攻略\n\n系统的退休规划需要综合考虑收入、支出、通胀和预期寿命等因素。\n\n" + mockParagraphs(3) },
    ],
  },
  {
    id: "risk-management-practice",
    title: "风险管理实战",
    author: "纳西姆·塔勒布",
    category: "fund",
    cover: "https://picsum.photos/seed/book-risk/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 黑天鹅事件", content: "# 黑天鹅事件\n\n极其罕见但影响巨大的事件，称为黑天鹅。金融市场中的黑天鹅比我们想象的更常见。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 反脆弱性", content: "# 反脆弱性\n\n有些系统不仅能承受冲击，还能从冲击中获益。这就是反脆弱性。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 杠铃策略", content: "# 杠铃策略\n\n将大部分资产配置在极度安全的投资中，小部分配置在高度投机但潜在回报巨大的标的上。\n\n" + mockParagraphs(3) },
    ],
  },
  {
    id: "economics-principles",
    title: "经济学原理",
    author: "曼昆",
    category: "classic",
    cover: "https://picsum.photos/seed/book-economics/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 十大经济学原理", content: "# 十大经济学原理\n\n人们面临权衡取舍。某种东西的成本是为了得到它而放弃的东西。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 供给与需求", content: "# 供给与需求\n\n市场是由供给和需求这两股力量共同决定的。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 市场效率与政府干预", content: "# 市场效率与政府干预\n\n在某些情况下，市场可能无法有效地配置资源，这时政府干预就有了正当性。\n\n" + mockParagraphs(3) },
      { slug: "ch4", title: "第四章 宏观经济指标", content: "# 宏观经济指标\n\nGDP、CPI和失业率是最重要的宏观经济指标。\n\n" + mockParagraphs(3) },
      { slug: "ch5", title: "第五章 货币政策与财政政策", content: "# 货币政策与财政政策\n\n货币政策和财政政策是政府调控经济的两大工具。\n\n" + mockParagraphs(3) },
    ],
  },
  {
    id: "rich-dad-poor-dad",
    title: "富爸爸穷爸爸",
    author: "罗伯特·清崎",
    category: "classic",
    cover: "https://picsum.photos/seed/book-rich-dad/200/280",
    chapters: [
      { slug: "ch1", title: "第一章 富人不为钱工作", content: "# 富人不为钱工作\n\n穷人和中产阶级为钱工作，富人让钱为自己工作。\n\n" + mockParagraphs(3) },
      { slug: "ch2", title: "第二章 为什么要教授财务知识", content: "# 为什么要教授财务知识\n\n重要的不是你挣了多少钱，而是你能留下多少钱。\n\n" + mockParagraphs(3) },
      { slug: "ch3", title: "第三章 关注自己的事业", content: "# 关注自己的事业\n\n真正的资产是不需要你到场就能正常运作的业务。\n\n" + mockParagraphs(3) },
      { slug: "ch4", title: "第四章 税收的历史和公司的力量", content: "# 税收的历史和公司的力量\n\n了解税法的运作方式，可以帮助你合法地减少税务负担。\n\n" + mockParagraphs(3) },
    ],
  },
];
