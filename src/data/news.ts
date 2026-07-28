export interface NewsItem {
  id: string;
  category: "activity" | "new-course" | "announcement";
  title: string;
  summary: string;
  date: string;
  cover: string;
  content: string;
  isNew: boolean;
}

export const NEWS_CATEGORIES = {
  all: "全部",
  activity: "活动",
  "new-course": "新课",
  announcement: "公告",
} as const;

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    category: "activity",
    title: "《论语》夏季研讨会报名开启",
    summary: "王阳明师者主持，深入研读《论语》二十篇，名额有限，欢迎各院学子踊跃报名。",
    date: "2026-07-28",
    cover: "https://picsum.photos/seed/news-lunyu/400/250",
    isNew: true,
    content: "格物书院将于2026年8月15日至20日举办《论语》夏季研讨会。本次研讨会由心学宗师王阳明师者亲自主持，将围绕《论语》二十篇展开深入的文本研读和思想讨论。\n\n研讨会形式包括：原文精读、分组讨论、师者点评和自由问答四个环节。每位参与者需提前阅读指定篇章，准备好自己的思考和疑问。\n\n活动地点：格物书院·明理堂（线下）及线上同步直播。名额有限，请各位学子尽快报名。报名截止日期：2026年8月10日。",
  },
  {
    id: "n2",
    category: "new-course",
    title: "《孙子兵法》与决策正式上线",
    summary: "兵道谋主孙武师者新课上线，将东方兵学智慧与现代商业决策深度结合，欢迎选修。",
    date: "2026-07-25",
    cover: "https://picsum.photos/seed/news-sunzi/400/250",
    isNew: true,
    content: "经过数月的精心筹备，《孙子兵法》与决策课程现已正式上线！\n\n本课程由兵道谋主孙武师者讲授，共计24学时，分为12个章节。课程将深入解读《孙子兵法》十三篇的核心思想，并结合现代管理学和商业决策案例，帮助学子们掌握东方战略思维的精华。\n\n课程特色：每章配有案例分析和决策模拟练习，考核方式包括课程论文和团队项目。欢迎各院学子在典籍页面选修。",
  },
  {
    id: "n3",
    category: "activity",
    title: "陈省身教授：金融建模实战工作坊",
    summary: "数理推手陈省身师者亲授，从理论到实战，掌握金融建模核心技能。",
    date: "2026-07-20",
    cover: "https://picsum.photos/seed/news-workshop/400/250",
    isNew: false,
    content: "金融建模实战工作坊将于8月1日至3日举办。陈省身师者将带领学子们从零构建一个完整的金融模型，涵盖数据获取、参数估计、模型校准和结果分析等全流程。\n\n参加者需具备基本的Excel和Python基础。工作坊结束后将颁发结业证书。名额有限，请关注后续报名通知。",
  },
  {
    id: "n4",
    category: "announcement",
    title: "书院夏季作息调整通知",
    summary: "即日起至8月31日，图书馆开放时间延长至晚上10点，学习区24小时开放。",
    date: "2026-07-15",
    cover: "https://picsum.photos/seed/news-schedule/400/250",
    isNew: false,
    content: "为方便学子暑期学习，书院决定从即日起调整夏季作息安排：\n\n1. 藏经阁（图书馆）开放时间延长至晚上22:00；\n2. 格物堂（自习区）24小时开放；\n3. 师者答疑时间调整为每周二、四下午14:00-17:00；\n4. 咖啡角营业时间延长至21:00。\n\n以上调整持续至2026年8月31日，开学后将恢复常规作息。祝大家暑期学有所获。",
  },
  {
    id: "n5",
    category: "new-course",
    title: "Python 与量化投资开放选修",
    summary: "赵算法师者倾力打造，零基础入门量化投资，8周掌握策略开发全流程。",
    date: "2026-07-10",
    cover: "https://picsum.photos/seed/news-python/400/250",
    isNew: false,
    content: "面向所有对量化投资感兴趣的学子，无论是否有编程基础均可选修。课程将覆盖Python基础、数据获取与清洗、因子构建与回测、策略优化与风险管理等内容。\n\n课程采用项目制教学，最终的课程项目是一套完整的量化交易策略。优秀项目将获得书院推荐实习的机会。",
  },
  {
    id: "n6",
    category: "activity",
    title: "风险管理案例分享会录像上线",
    summary: "错过现场分享的学子可在典籍页面观看回放，涵盖近年来真实金融风险案例。",
    date: "2026-07-05",
    cover: "https://picsum.photos/seed/news-case/400/250",
    isNew: false,
    content: "6月30日举办的风险管理案例分享会录像现已上传。本次分享会邀请到了三位资深风控专家，分别从市场风险、信用风险和操作风险三个角度，分享了近年来的真实案例和应对经验。\n\n回放视频可在典籍页面中李归师者的风险管理基础课程下观看。建议在学习完课程前三章后再观看，效果更佳。",
  },
];
