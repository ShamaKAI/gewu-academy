export interface MentorProfile {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  motto: string;
  achievements: string[];
  specialties: string[];
  experience: string;
  courseIds: string[];
}

export const mentors: MentorProfile[] = [
  {
    id: "qiyun",
    name: "栖云先生",
    nameEn: "Jason Lim",
    avatar: "https://picsum.photos/seed/portrait-jason/400/400",
    motto: "财富不止于积累，更在于有序传承。",
    achievements: ["从业14年，长期深耕财富管理领域", "MDRT连续8届会员，TOT会员", "服务超过500组高净值家庭", "累计规划资产规模逾4亿新币"],
    specialties: ["家族财富传承", "高净值资产配置", "企业主财富规划", "信托与财富架构", "长期退休现金流设计"],
    experience: "十四年来，始终专注于财富管理这一件事。服务对象涵盖企业创始人、上市公司高管及高净值家庭，帮助客户建立兼顾保障、投资、税务与传承的长期财富体系。",
    courseIds: ["wealth-foundation", "family-legacy", "business-wealth-arch", "long-term-allocation", "retirement-cashflow"],
  },
  {
    id: "zhiwei",
    name: "知微先生",
    nameEn: "Michelle Tan",
    avatar: "https://picsum.photos/seed/portrait-michelle/400/400",
    motto: "真正的财富，是家庭面对未来时的从容与底气。",
    achievements: ["从业11年", "MDRT连续6届会员", "服务800余组家庭", "女性财富规划导师", "家庭保障体系设计顾问"],
    specialties: ["家庭财富规划", "教育金规划", "医疗保障体系", "女性财富成长", "家庭现金流管理"],
    experience: "长期关注家庭财富的稳健成长。多年服务年轻家庭、新婚夫妇及职业女性，帮助客户建立完整的保障体系、教育基金规划及家庭资产配置方案。",
    courseIds: ["family-wealth-plan", "education-fund", "medical-protection", "women-wealth", "life-stage-plan"],
  },
  {
    id: "guanlan",
    name: "观澜先生",
    nameEn: "Daniel Wong",
    avatar: "https://picsum.photos/seed/portrait-daniel/400/400",
    motto: "以纪律代替情绪，以配置平衡周期。",
    achievements: ["从业16年", "CFA Charterholder", "CFP®国际金融理财师", "企业财富顾问", "全球资产配置实践导师"],
    specialties: ["全球资产配置", "ETF投资体系", "长期价值投资", "风险管理", "企业现金流管理"],
    experience: "拥有十余年国际财富管理经验。曾长期参与跨境财富规划及全球资产配置咨询，擅长构建符合不同风险偏好的投资组合。坚持以长期主义为锚，以纪律为帆。",
    courseIds: ["global-allocation", "etf-practice", "value-investing", "risk-mgmt-advanced", "usd-asset-plan"],
  },
  {
    id: "baopu",
    name: "抱朴先生",
    nameEn: "Ethan Chua",
    avatar: "https://picsum.photos/seed/portrait-ethan/400/400",
    motto: "企业财富与个人财富，应共同构建完整的财富生态。",
    achievements: ["从业15年", "MDRT连续10届会员", "服务企业客户300余家", "企业财富规划顾问", "商业风险管理专家"],
    specialties: ["企业风险管理", "企业财富规划", "商业保险架构", "股权传承规划", "创业者财富保护"],
    experience: "长期服务创业者与企业管理者。专注于企业经营风险、股东保障及财富传承规划，帮助企业在成长过程中建立更加稳健的风险管理体系。",
    courseIds: ["corp-wealth-mgmt", "corp-risk-mgmt", "startup-wealth-protect", "succession-plan", "shareholder-protection"],
  },
  {
    id: "qingheng",
    name: "清衡先生",
    nameEn: "Sophia Lee",
    avatar: "https://picsum.photos/seed/portrait-sophia/400/400",
    motto: "用科技的温度，守护财富的厚度。",
    achievements: ["从业9年", "MDRT会员", "FinTech Wealth Planner", "数字财富管理导师", "AI财富规划实践者"],
    specialties: ["AI财富规划", "智能投顾", "数字化财富管理", "年轻家庭资产配置", "财富科技应用"],
    experience: "致力于推动财富管理与科技融合。将数字化工具与专业咨询相结合，为年轻专业人士提供更加高效、透明、可持续的财富管理体验。",
    courseIds: ["ai-wealth-mgmt", "digital-wealth", "robo-advisor", "first-wealth-plan", "digital-tools-advisor"],
  },
];
