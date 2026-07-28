export interface BookChapter {
  slug: string;
  title: string;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  shelf: string;
  cover: string;
  chapters: BookChapter[];
}

export const SHELVES = [
  "指数基金", "ETF投资", "债券固收",
  "人身保险", "财产保险",
  "价值投资", "行为金融", "理财心理",
  "经济原理", "财富思维",
] as const;

// Unique chapter content per book (not all the same)
const CHAPTER_CONTENTS: Record<string, string[]> = {
  "index-fund-guide": [
    "指数基金是一种被动投资工具，通过追踪特定市场指数的表现来获取收益。与主动管理型基金不同，指数基金不试图超越市场，而是通过复制指数的成分股来实现与市场同步的回报。约翰·博格于 1976 年创立了第一只面向公众的指数基金，开创了一个全新的投资时代。\n\n指数基金的核心理念源于有效市场假说 —— 市场价格已经反映了所有可用信息，因此任何试图超越市场的主动操作都难以持续成功。与其支付高昂的管理费去追求不确定的超额收益，不如以最低的成本获取市场平均回报。\n\n对普通投资者而言，指数基金有着不可替代的优势：极低的管理费用、透明的持仓结构、分散化的风险配置，以及长期稳定的复利效应。",
    "跟踪误差是衡量指数基金表现最重要的指标。它反映了基金实际收益率与基准指数收益率之间的偏差。跟踪误差越小，基金运作越精准。\n\n影响跟踪误差的因素包括：管理费率、交易成本、现金拖累、抽样复制策略等。优秀的指数基金管理人能够通过优化交易执行和风险管理，将跟踪误差控制在极低的水平。\n\n在选择指数基金时，投资者应优先关注跟踪误差和费率，而非短期业绩排名。一个费率低、跟踪误差小的指数基金，长期来看几乎一定会跑赢同类高费率的主动基金。",
    "定投策略（Dollar Cost Averaging）是普通投资者最实用的投资方法。通过在固定的时间间隔投入固定的金额，投资者可以平滑买入成本，减少市场短期波动的影响。\n\n当市场下跌时，同样的金额可以买入更多的份额；当市场上涨时，虽然买入的份额减少，但已有持仓的价值在增长。这种\"反人性\"的机械操作，帮助投资者克服了贪婪和恐惧的情绪干扰。\n\n从长期来看，坚持定投宽基指数基金的投资者，获得正收益的概率远高于频繁择时的投资者。时间的复利是最强大的财富积累工具。",
    "构建一个完整的指数基金投资组合，需要考虑不同资产类别的配置比例。经典的配置包括：国内股票指数基金、国际股票指数基金、债券指数基金和REITs指数基金。\n\n资产配置的核心原则是分散化——不要把所有的鸡蛋放在一个篮子里。不同资产类别之间的相关性越低，组合整体的风险就越低。定期再平衡（Rebalancing）可以确保组合始终保持预设的风险水平。\n\n对年轻投资者而言，可以适当提高股票类资产的配置比例，以追求更高的长期回报；而接近退休年龄的投资者，则应增加债券类资产的配置，以降低组合的波动性。",
  ],
  "etf-handbook": [
    "ETF（Exchange Traded Fund）结合了传统共同基金和股票的优势。投资者可以像买卖股票一样在交易所实时交易 ETF，同时享受基金分散化投资的便利。\n\n与传统的开放式基金不同，ETF 采用实物申赎机制，由授权参与人（AP）通过一篮子证券与 ETF 份额进行交换。这种机制使得 ETF 具有更高的税收效率和更低的跟踪误差。\n\n自 1993 年第一只 ETF 诞生以来，全球 ETF 市场已经发展成为一个数万亿美元的庞大产业，产品类型覆盖了股票、债券、商品、货币等几乎所有资产类别。",
    "选择 ETF 时需要关注流动性、规模、跟踪误差和费率。流动性不仅仅取决于成交量，更取决于底层资产的流动性——因为做市商和授权参与人可以随时创建或赎回 ETF 份额。\n\n不同交易所上市的 ETF 可能有不同的交易规则和税务处理。新加坡投资者可以在 SGX 上交易本地上市的 ETF，也可以通过国际券商交易美股、港股等海外 ETF。\n\n对于长期投资者而言，选择规模较大、流动性好、费率低廉的 ETF 是最稳妥的策略。",
    "ETF 投资的核心策略包括买入持有、定投、行业轮动、因子投资等。其中买入持有是最简单也是最有效的策略——选择一只追踪宽基指数的 ETF，长期持有，享受经济增长和企业盈利带来的复利收益。\n\n对于有一定投资经验的投资者，可以尝试通过行业 ETF 或因子 ETF（如价值、质量、动量等因子）来构建更为精细化的投资组合。但需要注意，过度交易和频繁调仓往往会侵蚀投资收益。",
    "新加坡拥有亚洲最活跃的 REITs ETF 市场。通过 REITs ETF，投资者可以便捷地获取新加坡、亚太乃至全球的房地产收益，享受稳定的分红现金流。\n\nREITs 投资的核心关注指标包括：股息收益率、资产负债率、物业类型分散度和管理团队质量。选择一只费率低廉、流动性好的 REITs ETF，可以大幅降低挑选个股的风险。",
    "ETF 投资的风险管理同样重要。虽然 ETF 本身已经提供了分散化，但整体市场下跌的风险无法通过分散化来消除。投资者需要根据自身的风险承受能力和投资期限，设定合理的资产配置比例。\n\n在市场出现大幅波动时，保持冷静、坚持既定的投资计划，是 ETF 投资者最重要的素质。历史反复证明，试图择时的投资者往往跑输那些坚持定投的投资者。",
  ],
  default: [
    "在当今复杂多变的金融环境中，建立扎实的投资知识体系比以往任何时候都更加重要。本章将从最基础的概念出发，帮助读者构建清晰的投资思维框架。\n\n投资的核心目标是在风险可控的前提下实现资产的保值增值。这听起来简单，但实践起来却需要系统的知识储备、严格的纪律和长期的耐心。本章将介绍投资分析的基本方法，为后续深入学习打下基础。",
    "掌握了基础知识之后，我们需要进一步理解市场的运作机制和定价原理。金融市场的价格是由供给和需求共同决定的，而这些供给和需求背后是无数投资者的判断、情绪和预期。\n\n理解市场波动的原因，不等于能够预测市场的走向。恰恰相反，越是深入研究市场，越会意识到市场短期的不可预测性。这反而促使优秀的投资者更加关注长期趋势和基本面分析。",
    "理论学习的最终目的是指导实践。本章将重点讨论如何将前面学到的知识应用到实际的投资决策中去。从资产配置到标的选择，从交易执行到风险管理，每一个环节都有需要特别注意的细节。\n\n实践中最常见的错误是知行不合一。很多投资者掌握了正确的理念，却在市场波动面前失去了定力。建立系统化的投资流程和纪律，是避免情绪化决策的有效方法。",
    "投资不是一蹴而就的事情，而是一生的修行。随着市场环境和个人情况的变化，投资者需要不断学习和调整自己的策略。保持开放的心态，持续吸收新的知识，才能在这个不断变化的世界中立于不败之地。\n\n本章将带领读者探讨更高级的投资策略和工具，同时也提醒大家警惕过度复杂化的陷阱。有时候，最简单的策略反而是最有效的。",
    "本章作为全书的收官，将回顾全书的核心要点，并展望未来的投资趋势。我们相信，掌握了这些基础知识和思维方法之后，你已经具备了独立思考和判断的能力。\n\n投资的最终目的不是为了战胜市场或者战胜他人，而是为了实现自己的人生目标。无论是退休养老、子女教育还是财务自由，理性的投资都能帮助你走得更远。",
  ],
};

function getChapterContent(bookId: string, chIdx: number, title: string): string {
  const contents = CHAPTER_CONTENTS[bookId] || CHAPTER_CONTENTS["default"];
  const content = contents[chIdx % contents.length] || contents[0];
  return `# ${title}\n\n${content}`;
}

export const books: Book[] = [
  // 指数基金
  { id: "index-fund-guide", title: "指数基金投资指南", author: "约翰·博格", shelf: "指数基金", cover: "https://picsum.photos/seed/book-1/200/280", chapters: makeChapters("index-fund-guide", ["什么是指数基金", "指数基金的优势", "如何选择指数基金", "定投策略与实践"]) },
  { id: "smart-beta", title: "聪明贝塔策略", author: "安德鲁·罗", shelf: "指数基金", cover: "https://picsum.photos/seed/book-22/200/280", chapters: makeChapters("smart-beta", ["因子投资概论", "价值与动量因子", "质量与低波动因子", "构建多因子组合"]) },
  { id: "mutual-fund-mastery", title: "共同基金精要", author: "彼得·林奇", shelf: "指数基金", cover: "https://picsum.photos/seed/book-21/200/280", chapters: makeChapters("mutual-fund-mastery", ["共同基金入门", "选股的艺术", "行业分析与择时", "基金组合管理"]) },
  { id: "sp-index-history", title: "指数投资简史", author: "Jeremy Siegel", shelf: "指数基金", cover: "https://picsum.photos/seed/book-60/200/280", chapters: makeChapters("sp-index-history", ["指数的诞生", "被动投资革命", "全球指数化浪潮"]) },

  // ETF投资
  { id: "etf-handbook", title: "ETF投资完全手册", author: "德博拉·富尔", shelf: "ETF投资", cover: "https://picsum.photos/seed/book-20/200/280", chapters: makeChapters("etf-handbook", ["ETF基础知识", "如何选择ETF", "核心投资策略", "新加坡REITs ETF", "风险管理"]) },
  { id: "reit-investing-sg", title: "新加坡REITs投资", author: "Kevin Tan", shelf: "ETF投资", cover: "https://picsum.photos/seed/book-25/200/280", chapters: makeChapters("reit-investing-sg", ["REITs概览", "新加坡REITs市场", "估值分析方法", "分红策略"]) },
  { id: "bond-investing", title: "债券投资基础", author: "安妮特·托马塞蒂", shelf: "ETF投资", cover: "https://picsum.photos/seed/book-24/200/280", chapters: makeChapters("bond-investing", ["债券市场概述", "利率与久期", "信用分析框架"]) },
  { id: "commodity-etf", title: "商品ETF指南", author: "John Stephenson", shelf: "ETF投资", cover: "https://picsum.photos/seed/book-61/200/280", chapters: makeChapters("commodity-etf", ["商品市场入门", "黄金与能源ETF", "多元化配置"]) },

  // 债券固收
  { id: "hedge-fund-primer", title: "对冲基金入门", author: "塞巴斯蒂安·马拉比", shelf: "债券固收", cover: "https://picsum.photos/seed/book-23/200/280", chapters: makeChapters("hedge-fund-primer", ["对冲基金简史", "主要策略类型", "风险管理框架", "尽职调查实务", "对冲基金配置"]) },
  { id: "risk-management-practice", title: "风险管理实战", author: "纳西姆·塔勒布", shelf: "债券固收", cover: "https://picsum.photos/seed/book-2/200/280", chapters: makeChapters("risk-management-practice", ["黑天鹅事件", "反脆弱性", "杠铃策略"]) },
  { id: "one-up-wall-street", title: "华尔街股市投资经典", author: "彼得·林奇", shelf: "债券固收", cover: "https://picsum.photos/seed/book-43/200/280", chapters: makeChapters("one-up-wall-street", ["业余投资者的优势", "选股六种类型", "长期投资的艺术", "何时买入与卖出"]) },

  // 人身保险
  { id: "life-insurance-guide", title: "人寿保险指南", author: "Robert Loo", shelf: "人身保险", cover: "https://picsum.photos/seed/book-30/200/280", chapters: makeChapters("life-insurance-guide", ["人寿保险基本概念", "定期与终身寿险", "保额计算与规划", "受益人设计"]) },
  { id: "health-insurance-sg", title: "新加坡健康保险解析", author: "MediShield Life", shelf: "人身保险", cover: "https://picsum.photos/seed/book-31/200/280", chapters: makeChapters("health-insurance-sg", ["新加坡医疗体系", "MediShield详解", "综合健保计划", "理赔流程"]) },
  { id: "actuarial-science-intro", title: "精算科学导论", author: "Stuart Klugman", shelf: "人身保险", cover: "https://picsum.photos/seed/book-33/200/280", chapters: makeChapters("actuarial-science-intro", ["精算基础", "生命表与死亡率", "保费定价模型", "准备金评估", "随机模拟"]) },

  // 财产保险
  { id: "insurance-principles", title: "保险原理与实务", author: "新加坡保险学院", shelf: "财产保险", cover: "https://picsum.photos/seed/book-3/200/280", chapters: makeChapters("insurance-principles", ["保险的基本原理", "人身保险产品解析", "新加坡保险监管框架"]) },
  { id: "general-insurance", title: "财产与意外保险", author: "Goh Chok Tong", shelf: "财产保险", cover: "https://picsum.photos/seed/book-32/200/280", chapters: makeChapters("general-insurance", ["财产保险概述", "火灾与工程保险", "责任保险详解"]) },
  { id: "insurance-regulation", title: "保险监管与合规", author: "MAS Academy", shelf: "财产保险", cover: "https://picsum.photos/seed/book-35/200/280", chapters: makeChapters("insurance-regulation", ["监管体系概述", "风险资本要求", "市场行为监管"]) },

  // 价值投资
  { id: "intelligent-investor", title: "聪明的投资者", author: "本杰明·格雷厄姆", shelf: "价值投资", cover: "https://picsum.photos/seed/book-40/200/280", chapters: makeChapters("intelligent-investor", ["投资与投机", "安全边际原则", "市场先生寓言", "防御型投资者策略", "积极型投资者策略"]) },
  { id: "buffett-letters", title: "巴菲特致股东信", author: "沃伦·巴菲特", shelf: "价值投资", cover: "https://picsum.photos/seed/book-5/200/280", chapters: makeChapters("buffett-letters", ["价值投资的哲学", "复利的魔力", "市场先生与情绪控制", "企业分析框架"]) },
  { id: "little-book-value", title: "价值投资小书", author: "克里斯托弗·布朗", shelf: "价值投资", cover: "https://picsum.photos/seed/book-44/200/280", chapters: makeChapters("little-book-value", ["价值投资的核心", "如何发现低估股票", "卖出的时机"]) },

  // 行为金融
  { id: "thinking-fast-slow", title: "思考，快与慢", author: "丹尼尔·卡尼曼", shelf: "行为金融", cover: "https://picsum.photos/seed/book-54/200/280", chapters: makeChapters("thinking-fast-slow", ["系统一与系统二", "启发式与偏见", "前景理论", "过度自信", "选择的悖论"]) },
  { id: "nudge", title: "助推", author: "理查德·塞勒", shelf: "行为金融", cover: "https://picsum.photos/seed/book-53/200/280", chapters: makeChapters("nudge", ["选择架构", "默认选项的力量", "社会影响", "助推与监管"]) },
  { id: "black-swan", title: "黑天鹅", author: "纳西姆·塔勒布", shelf: "行为金融", cover: "https://picsum.photos/seed/book-52/200/280", chapters: makeChapters("black-swan", ["极端事件的力量", "叙事谬误", "平均斯坦与极端斯坦", "如何应对不确定性", "杠铃策略"]) },

  // 理财心理
  { id: "psychology-of-money", title: "金钱心理学", author: "摩根·豪塞尔", shelf: "理财心理", cover: "https://picsum.photos/seed/book-42/200/280", chapters: makeChapters("psychology-of-money", ["运气与风险", "贪婪与恐惧", "复利的耐心", "知足常乐", "财富的真正含义"]) },
  { id: "poor-charlie-almanack", title: "穷查理宝典", author: "查理·芒格", shelf: "理财心理", cover: "https://picsum.photos/seed/book-4/200/280", chapters: makeChapters("poor-charlie-almanack", ["多元思维模型", "人类误判心理学", "投资原则", "能力圈与安全边际", "终身学习的意义"]) },
  { id: "risk-pooling", title: "风险聚合论", author: "Karl Borch", shelf: "理财心理", cover: "https://picsum.photos/seed/book-34/200/280", chapters: makeChapters("risk-pooling", ["风险分散基础", "大数法则应用", "尾部风险管理", "再保险机制"]) },

  // 经济原理
  { id: "economics-principles", title: "经济学原理", author: "曼昆", shelf: "经济原理", cover: "https://picsum.photos/seed/book-7/200/280", chapters: makeChapters("economics-principles", ["十大经济学原理", "供给与需求", "市场效率与政府干预", "宏观经济指标", "货币政策与财政政策"]) },
  { id: "random-walk", title: "漫步华尔街", author: "伯顿·马尔基尔", shelf: "经济原理", cover: "https://picsum.photos/seed/book-41/200/280", chapters: makeChapters("random-walk", ["随机漫步理论", "技术分析批判", "现代投资组合理论", "行为金融学"]) },
  { id: "singapore-finance", title: "新加坡理财入门", author: "CPF Board", shelf: "经济原理", cover: "https://picsum.photos/seed/book-6/200/280", chapters: makeChapters("singapore-finance", ["CPF制度解析", "SRS与税务规划", "REITs投资入门", "退休规划全攻略"]) },

  // 财富思维
  { id: "rich-dad-poor-dad", title: "富爸爸穷爸爸", author: "罗伯特·清崎", shelf: "财富思维", cover: "https://picsum.photos/seed/book-8/200/280", chapters: makeChapters("rich-dad-poor-dad", ["富人不为钱工作", "为什么教授财务知识", "关注自己的事业", "税收与公司的力量"]) },
  { id: "think-and-grow-rich", title: "思考致富", author: "拿破仑·希尔", shelf: "财富思维", cover: "https://picsum.photos/seed/book-50/200/280", chapters: makeChapters("think-and-grow-rich", ["欲望的力量", "信念与坚持", "专业知识", "想象力与创意", "决策与毅力"]) },
  { id: "richest-man-babylon", title: "巴比伦最富有的人", author: "乔治·克拉森", shelf: "财富思维", cover: "https://picsum.photos/seed/book-51/200/280", chapters: makeChapters("richest-man-babylon", ["七个治愈钱包的方法", "为未来储蓄", "让钱为你工作", "保护财富"]) },
];

function makeChapters(bookId: string, titles: string[]): BookChapter[] {
  return titles.map((title, i) => ({
    slug: `ch${i + 1}`,
    title: `第${["一二三四五六七八九十"][i]}章 ${title}`,
    content: getChapterContent(bookId, i, title),
  }));
}
