export const SITE = {
  name: "بوصلة الهوية",
  tagline: "تقييم علمي عميق لهويتك الشخصية، وتقرير يبنيها معك بخطة تسعين يوماً.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /** أسعار العرض فقط؛ السعر الفعلي يُحدد في Paddle */
  price: { report: "49", currency: "ر.س", plus: "19" },
  minutes: 25,
  items: 140,
};
