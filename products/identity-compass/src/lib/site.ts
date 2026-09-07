export const SITE = {
  name: "بوصلة الهوية",
  tagline: "اعرف من أنت بتقييم علمي عميق، ثم اصنع هويتك بنفسك ونفّذها في تسعين يوماً.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  /** فترة التجربة المفتوحة: كل شيء مجاني ولا تُعرض أسعار */
  beta: process.env.NEXT_PUBLIC_BETA === "true",
  /** أسعار العرض فقط؛ السعر الفعلي يُحدد في Paddle */
  price: { report: "49", currency: "ر.س", plus: "19" },
  minutes: 25,
  items: 140,
};
