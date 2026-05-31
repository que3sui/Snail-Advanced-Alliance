export const SITE = {
  name: "蜗壳进阶联盟",
  nameEn: "Woko Advanced Alliance",
  description:
    "中国科学技术大学学生自发创办的青年志愿者组织，致力于打破信息壁垒，构建从入学到毕业的全周期成长支持体系。",
  descriptionEn:
    "A student-led volunteer organization at USTC dedicated to breaking information barriers and building a full-journey growth support system.",
  domain: "advancedguide.cn",
  url: "https://advancedguide.cn",
  email: "contact@advancedguide.cn",
  qqGroup: "779243397",
  qqRecruit: "589254574",
  wechat: "蜗壳进阶GO",
  affiliation: "中国科学技术大学人工智能与数据科学学院团委",
  affiliationEn: "Youth League Committee, School of AI and Data Science, USTC",
  foundedYear: 2024,
  founder: "冯文俊",
  founderEn: "Feng Wenjun",
};

export const METRICS = [
  { value: 30, suffix: "+", label: "场活动", labelEn: "Events" },
  { value: 40, suffix: "+", label: "位嘉宾", labelEn: "Guests" },
  {
    value: 200,
    suffix: "k+",
    label: "字原创内容",
    labelEn: "Words of Content",
  },
  { value: 100, suffix: "k+", label: "人次触达", labelEn: "People Reached" },
];

export const NAV_ITEMS = [
  { href: "/about", zh: "关于我们", en: "About" },
  { href: "/events", zh: "活动", en: "Events" },
  { href: "/dialogues", zh: "对话", en: "Dialogues" },
  { href: "/guide", zh: "进阶指南", en: "Guide" },
  { href: "/join", zh: "加入我们", en: "Join Us" },
  { href: "/search", zh: "搜索", en: "Search", icon: "search" },
];

export const PARTNERS = [
  { name: "ByteDance", logo: "/partners/bytedance.png" },
  { name: "Alibaba ModelScope", logo: "/partners/modelscope.png" },
  { name: "MiraclePlus", logo: "/partners/miracleplus.png" },
  { name: "Datawhale", logo: "/partners/datawhale.png" },
  { name: "ZhenFund", logo: "/partners/zhenfund.png" },
  { name: "Momenta", logo: "/partners/momenta.png" },
  { name: "Tencent", logo: "/partners/tencent.png" },
];

export const FOOTER_LINKS = [
  {
    group: "组织",
    groupEn: "Organization",
    items: [
      { href: "/about", zh: "关于我们", en: "About" },
      { href: "/join", zh: "加入我们", en: "Join Us" },
      { href: "/guide", zh: "进阶指南", en: "Guide" },
    ],
  },
  {
    group: "活动",
    groupEn: "Activities",
    items: [
      { href: "/events/talks", zh: "蜗壳有约", en: "Alumni Talks" },
      { href: "/events/camp", zh: "蜗壳进阶营", en: "Advancement Camp" },
      { href: "/events", zh: "全部活动", en: "All Events" },
    ],
  },
  {
    group: "内容",
    groupEn: "Content",
    items: [
      { href: "/dialogues", zh: "对话专栏", en: "Dialogues" },
      {
        href: "https://advancedguideforsds.gitbook.io/advancedguide/",
        zh: "GitBook 指南",
        en: "GitBook Guide",
      },
    ],
  },
];
