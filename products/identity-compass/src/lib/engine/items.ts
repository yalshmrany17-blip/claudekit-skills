import type { Section, Big5Key, ValueKey, NegativeKey } from "./types";
import { STRENGTHS, STRENGTH_KEYS, WORK_ITEMS } from "./types16";

/**
 * كل عبارات التقييم أصلية وكُتبت لهذا المنتج. المفاهيم المقاسة علمية معروفة
 * (الخمسة الكبرى، قيم شوارتز، حالات مارسيا، وضوح مفهوم الذات، نقاط القوة، الأنماط الأربعة) لكن الصياغات ملكنا.
 */

export const BIG5_NAMES: Record<Big5Key, string> = {
  O: "الانفتاح على التجربة",
  C: "الضميرية والانضباط",
  E: "الانبساط",
  A: "التوافق",
  N: "العصابية",
};

export const VALUE_NAMES: Record<ValueKey, string> = {
  power: "القوة",
  achieve: "الإنجاز",
  hedon: "المتعة",
  stim: "الإثارة",
  selfdir: "التوجيه الذاتي",
  univ: "العالمية",
  benev: "الإحسان",
  trad: "التقليد",
  conf: "الامتثال",
  secur: "الأمان",
};

export const VALUE_DESCRIPTIONS: Record<ValueKey, string> = {
  power: "المكانة والنفوذ والتحكم في الناس والموارد",
  achieve: "النجاح الشخصي بإظهار الكفاءة وفق معايير المجتمع",
  hedon: "الاستمتاع والراحة وإشباع الرغبات",
  stim: "التحدي والجدة والمغامرة",
  selfdir: "الاستقلال في التفكير والاختيار والإبداع",
  univ: "الفهم والتقدير والعدل لكل الناس وللطبيعة",
  benev: "رعاية المقربين والوفاء لهم",
  trad: "احترام العادات والدين والثقافة",
  conf: "ضبط النفس واحترام القواعد وتوقعات الآخرين",
  secur: "السلامة والاستقرار لك ولمن حولك",
};

export const ORIENTATION_NAMES = {
  open: "الانفتاح على التغيير",
  enh: "تعزيز الذات",
  cons: "المحافظة",
  trans: "تجاوز الذات",
} as const;

export const ORIENTATION_MEMBERS: Record<keyof typeof ORIENTATION_NAMES, ValueKey[]> = {
  open: ["selfdir", "stim", "hedon"],
  enh: ["power", "achieve"],
  cons: ["secur", "conf", "trad"],
  trans: ["univ", "benev"],
};

export const NEGATIVE_NAMES: Record<NegativeKey, string> = {
  show: "حب الظهور بلا رسالة",
  polish: "التجمل المفرط والمثالية غير الواقعية",
  drift: "الانسياق خلف آراء الناس",
  money: "المال أولاً وبأي طريقة",
  control: "السيطرة والتفوق على الآخرين",
  vague: "الغموض المتعمد",
  admit: "عدم الاعتراف بالخطأ",
};

export const NEGATIVE_CONSEQUENCES: Record<NegativeKey, string> = {
  show: "هوية سطحية متقلبة تفقد الاحترام مع الأيام",
  polish: "هوية مصطنعة لا يثق بها أحد",
  drift: "هوية هشة تتغير مع كل رأي",
  money: "تشوه في الرسالة وانهيار الثقة والشراكات",
  control: "صراعات داخلية ونرجسية",
  vague: "لا يعرف الناس كيف يصنفونك فلا يثقون بك",
  admit: "هوية مزيفة لا تلهم أحداً",
};

export const NEGATIVE_PRACTICES: Record<NegativeKey, string> = {
  show: "«الدليل قبل الظهور»: لا منشور بلا حالة أو نتيجة أو أداة يمكن التحقق منها.",
  polish: "«الصورة بحجمها»: اذكر رقماً واحداً حقيقياً عن نفسك كل أسبوع بدل عشرة انطباعات.",
  drift: "«رأيي أولاً»: اكتب رأيك في القرار قبل أن تسأل أي أحد، ثم قارن.",
  money: "«الرسالة قبل الرقم»: أي عرض لا يخدم رسالتك المكتوبة يُرفض مهما كان المبلغ.",
  control: "«اسمع أولاً»: في كل اجتماع تتكلم أخيراً وتسأل ثلاثة أسئلة قبل أي حل.",
  vague: "«الوضوح المعلن»: سطر واحد يعرف بك، تقوله في أول دقيقة من أي لقاء.",
  admit: "«خطأ الشهر»: اعتراف واحد شهرياً بخطأ ارتكبته والدرس منه، أمام شخص أو أمام الناس.",
};

export const ERIKSON_STAGES: { maxAge: number; name: string; question: string }[] = [
  { maxAge: 1.5, name: "الثقة مقابل عدم الثقة", question: "هل أشعر بالأمان؟" },
  { maxAge: 3, name: "الاستقلالية مقابل الخجل والشك", question: "هل أستطيع أن أجرب بنفسي؟" },
  { maxAge: 5, name: "المبادرة مقابل الشعور بالذنب", question: "هل أبادر أم أخاف العقاب؟" },
  { maxAge: 12, name: "الاجتهاد مقابل الدونية", question: "هل أُقدَّر على إنجازي أم أقارن وأنقص؟" },
  { maxAge: 18, name: "الهوية مقابل اضطراب الدور", question: "من أنا وما دوري؟" },
  { maxAge: 40, name: "الألفة مقابل العزلة", question: "هل لدي دور وعلاقات حقيقية تمثلني، أم أنعزل وأتخبط؟" },
  { maxAge: 65, name: "الإنتاجية مقابل الركود", question: "هل أترك أثراً وأفيد من حولي، أم أقول «راحت علينا»؟" },
  { maxAge: 200, name: "التكامل مقابل اليأس", question: "هل أنظر إلى عمري برضا أم بحسرة؟" },
];

const likert5 = (id: string, key: string, text: string, reverse = false) => ({
  id,
  key,
  text,
  type: "likert5" as const,
  reverse,
  required: true,
});

const portrait = (id: string, key: ValueKey, text: string) => ({
  id,
  key,
  text,
  type: "likert6" as const,
  required: true,
});

export const SECTIONS: Section[] = [
  {
    id: "profile",
    title: "الملف السريع",
    intro: "بيانات أساسية تُستخدم في قراءة النتائج. لا يُشارك أي منها مع أحد.",
    scored: false,
    items: [
      { id: "p_name", text: "اسمك أو لقبك المفضل", type: "text", required: true, placeholder: "مثال: أبو حميد" },
      { id: "p_age", text: "عمرك", type: "number", required: true, min: 14, max: 99, placeholder: "27" },
      { id: "p_city", text: "مدينتك", type: "text", placeholder: "الرياض" },
      { id: "p_field", text: "مجالك أو وظيفتك الحالية", type: "text", required: true, placeholder: "مهندس، معلمة، صاحب مشروع…" },
      { id: "p_years", text: "سنوات الخبرة", type: "number", min: 0, max: 60, placeholder: "5" },
      { id: "p_money", text: "وضعك المالي الآن", type: "select", options: ["مريح", "مستقر", "متذبذب", "ضاغط"], required: true },
      { id: "p_health", text: "طاقتك وصحتك عموماً", type: "select", options: ["ممتازة", "جيدة", "متعبة", "أحتاج علاجاً أو تغييراً"], required: true },
      { id: "p_sleep", text: "ساعات نومك في الليلة", type: "number", min: 0, max: 16, placeholder: "7" },
      { id: "p_screen", text: "ساعات الجوال والسوشال يومياً", type: "number", min: 0, max: 24, placeholder: "4" },
      { id: "p_sport", text: "الرياضة أسبوعياً", type: "select", options: ["لا أمارس", "مرة أو مرتان", "ثلاث مرات أو أكثر"] },
    ],
  },
  {
    id: "signs",
    title: "علامات الخلل في الهوية",
    intro: "علّم كل ما ينطبق عليك خلال الأشهر الثلاثة الماضية. لا توجد إجابة صحيحة.",
    scored: true,
    items: [
      "أشعر بصراع داخلي أو ملل من عملي الحالي",
      "أنا محتار: لا أعرف هل أستمر أم أغيّر",
      "أشعر بالتشتت والتخبط رغم أن لدي خطة",
      "لا أشعر بالرضا مهما أنجزت، وهذا المكان ليس مكاني",
      "أتعصب بسرعة ثم أجلد ذاتي",
      "لا أشعر بالأمان تجاه مستقبلي في مجالي",
      "تراودني أسئلة: ما دوري؟ لماذا أنا هنا؟",
      "أشعر أحياناً أن لا قيمة لي",
      "أقارن نفسي بالآخرين باستمرار حتى خارج مجالي",
    ].map((text, i) => ({ id: `sg_${i + 1}`, text, type: "yesno" as const, required: true })),
  },
  {
    id: "clarity",
    title: "وضوح مفهوم الذات",
    intro: "كم تنطبق عليك كل عبارة؟",
    scored: true,
    scaleLabels: ["لا تنطبق", "تنطبق تماماً"],
    items: [
      "أعرف بوضوح ما هي قيمي الأساسية",
      "أصف نفسي بالطريقة نفسها بغض النظر عمن أجلس معه",
      "رأيي في نفسي لا يتقلب من يوم لآخر",
      "أعرف ما أريده من السنوات الخمس القادمة",
      "لو سُئلت «من أنت؟» أجبت دون تردد",
      "قراراتي الكبيرة في السنوات الأخيرة متسقة مع بعضها",
    ].map((text, i) => likert5(`cl_${i + 1}`, "clarity", text)),
  },
  {
    id: "status",
    title: "الاستكشاف والالتزام",
    intro: "سؤالان يحددان حالة هويتك اليوم.",
    scored: true,
    items: [
      { id: "ms_explore", text: "هل استكشفت بجدية بدائل حقيقية لمسارك (مجالات، أدوار، طرق عيش) قبل أن تختار؟", type: "yesno", required: true },
      { id: "ms_commit", text: "هل أنت ملتزم اليوم باتجاه واضح تبني عليه قراراتك؟", type: "yesno", required: true },
    ],
  },
  {
    id: "big5",
    title: "سمات الشخصية",
    intro: "ثلاثون عبارة عن طريقتك في التفكير والتعامل. أجب كما أنت فعلاً لا كما تود أن تكون.",
    scored: true,
    scaleLabels: ["لا تشبهني", "تشبهني تماماً"],
    items: [
      likert5("b5_o1", "O", "أستمتع بالأفكار المجردة والنقاشات الفلسفية"),
      likert5("b5_c1", "C", "أنهي ما أبدأ حتى لو فقدت حماسي"),
      likert5("b5_e1", "E", "أشحن طاقتي حين أكون مع الناس"),
      likert5("b5_a1", "A", "أجد صعوبة في قول «لا» لمن يطلب مساعدتي"),
      likert5("b5_n1", "N", "أقلق كثيراً بشأن أمور لم تحدث بعد"),
      likert5("b5_o2", "O", "أفضّل الطرق المجربة على تجربة شيء جديد", true),
      likert5("b5_c2", "C", "أخطط ليومي وألتزم بالخطة غالباً"),
      likert5("b5_e2", "E", "أبادر بالحديث مع الغرباء بسهولة"),
      likert5("b5_a2", "A", "أثق بالناس بسرعة وأحسن الظن بهم"),
      likert5("b5_n2", "N", "أبقى هادئاً تحت الضغط", true),
      likert5("b5_o3", "O", "يلفتني الجمال في التفاصيل والفنون"),
      likert5("b5_c3", "C", "أؤجل المهام حتى اللحظة الأخيرة", true),
      likert5("b5_e3", "E", "أفضّل أمسية هادئة وحدي على تجمع كبير", true),
      likert5("b5_a3", "A", "أقول رأيي بصراحة حتى لو جرح أحداً", true),
      likert5("b5_n3", "N", "مزاجي يتقلب بسرعة خلال اليوم"),
      likert5("b5_o4", "O", "أتخيل سيناريوهات ومشاريع لم توجد بعد"),
      likert5("b5_c4", "C", "أغراضي ومهامي منظمة ويسهل عليّ إيجاد ما أحتاجه"),
      likert5("b5_e4", "E", "أتكلم كثيراً في الاجتماعات والجلسات"),
      likert5("b5_a4", "A", "أتجنب المواجهة حفاظاً على العلاقة"),
      likert5("b5_n4", "N", "أتجاوز الإحباط بسرعة وأعود لعملي", true),
      likert5("b5_o5", "O", "الأفكار النظرية لا تهمني وأجد صعوبة في متابعتها", true),
      likert5("b5_c5", "C", "أنسى المواعيد والالتزامات الصغيرة", true),
      likert5("b5_e5", "E", "أحتاج وقتاً طويلاً وحدي بعد أي تجمع لأستعيد طاقتي", true),
      likert5("b5_a5", "A", "أنافس الآخرين في العمل ولا أهتم كثيراً بمشاعرهم", true),
      likert5("b5_n5", "N", "أشعر بالتوتر أو الضيق دون سبب واضح"),
      likert5("b5_o6", "O", "الروتين الثابت يريحني أكثر من التغيير", true),
      likert5("b5_c6", "C", "أتشتت بسهولة عن العمل الذي بين يدي", true),
      likert5("b5_e6", "E", "أبقى في الخلفية وأترك غيري يقود الحديث", true),
      likert5("b5_a6", "A", "أشك في نوايا الناس حتى يثبتوا العكس", true),
      likert5("b5_n6", "N", "نادراً ما أفقد أعصابي", true),
    ],
  },
  {
    id: "ptypes",
    title: "نمط شخصيتك",
    intro: "عشرون عبارة عن طاقتك وانتباهك وطريقة قرارك وأسلوبك. النتيجة نسب على أربعة أبعاد ونمط من ستة عشر.",
    scored: true,
    scaleLabels: ["لا تشبهني", "تشبهني تماماً"],
    items: [
      likert5("ty_ei1", "EI", "أفكر بصوت عالٍ ويتضح لي الأمر وأنا أتكلم"),
      likert5("ty_sn1", "SN", "أنجذب للأنماط والمعاني وراء الأشياء أكثر من تفاصيلها"),
      likert5("ty_tf1", "TF", "أقرر بالمنطق حتى لو أزعج القرار أحداً"),
      likert5("ty_jp1", "JP", "أرتاح حين يكون القرار محسوماً والخطة واضحة"),
      likert5("ty_ei2", "EI", "أحتاج أن أرتب أفكاري وحدي قبل أن أشاركها", true),
      likert5("ty_sn2", "SN", "أثق بما أراه وأجربه أكثر من النظريات", true),
      likert5("ty_tf2", "TF", "أراعي مشاعر الناس في قراراتي حتى لو كلفني ذلك", true),
      likert5("ty_jp2", "JP", "أفضّل إبقاء الخيارات مفتوحة حتى آخر لحظة", true),
      likert5("ty_ei3", "EI", "في التجمعات أنتقل بين الناس بسهولة"),
      likert5("ty_sn3", "SN", "أفكر في الاحتمالات المستقبلية أكثر من الواقع الحالي"),
      likert5("ty_tf3", "TF", "النقد الصريح أفيد من المجاملة"),
      likert5("ty_jp3", "JP", "أنهي عملي قبل الموعد بوقت كافٍ"),
      likert5("ty_ei4", "EI", "دائرتي المقربة صغيرة وأفضّلها كذلك", true),
      likert5("ty_sn4", "SN", "أفضّل التعليمات الواضحة خطوة بخطوة", true),
      likert5("ty_tf4", "TF", "أتأثر بأجواء المكان ومشاعر من حولي", true),
      likert5("ty_jp4", "JP", "أعمل بأفضل صورة تحت ضغط اللحظة الأخيرة", true),
      likert5("ty_ei5", "EI", "أشعر بالحيوية بعد يوم مليء باللقاءات"),
      likert5("ty_sn5", "SN", "أحب الاستعارات والأفكار المجردة"),
      likert5("ty_tf5", "TF", "أفصل بين المشكلة والشخص بسهولة"),
      likert5("ty_jp5", "JP", "أحب القوائم والجداول وأستخدمها فعلاً"),
    ],
  },
  {
    id: "values",
    title: "القيم",
    intro: "اقرأ وصف كل شخص وحدد كم يشبهك. الترتيب النسبي هو المهم لا الأرقام.",
    scored: true,
    scaleLabels: ["لا يشبهني أبداً", "يشبهني تماماً"],
    items: [
      portrait("sv_power_1", "power", "يهمه أن يكون له نفوذ ومكانة يحترمها الناس"),
      portrait("sv_achieve_1", "achieve", "يهمه أن يُظهر قدراته ويُعجب الناس بما ينجزه"),
      portrait("sv_hedon_1", "hedon", "يبحث عن المتعة ويستمتع بكل فرصة"),
      portrait("sv_stim_1", "stim", "يحب المفاجآت ويبحث دائماً عن تجارب جديدة"),
      portrait("sv_selfdir_1", "selfdir", "يهمه أن يفكر ويقرر بنفسه دون توجيه من أحد"),
      portrait("sv_univ_1", "univ", "يؤمن أن كل الناس يستحقون العدل والفرص المتساوية"),
      portrait("sv_benev_1", "benev", "يهمه أن يساعد المقربين منه ويكون وفياً لهم"),
      portrait("sv_trad_1", "trad", "يهمه اتباع عادات عائلته ودينه وثقافته"),
      portrait("sv_conf_1", "conf", "يلتزم بالقواعد حتى حين لا يراقبه أحد"),
      portrait("sv_secur_1", "secur", "يهمه أن يعيش في بيئة آمنة ومستقرة"),
      portrait("sv_power_2", "power", "يريد أن يملك المال والأشياء التي تُظهر نجاحه"),
      portrait("sv_achieve_2", "achieve", "يسعى للتفوق في عمله ويقيس نفسه بمعايير عالية"),
      portrait("sv_hedon_2", "hedon", "يهمه أن يعيش حياة مريحة ويدلل نفسه"),
      portrait("sv_stim_2", "stim", "يريد حياة مليئة بالتحدي والمغامرة"),
      portrait("sv_selfdir_2", "selfdir", "يحب الإبداع وفعل الأشياء بطريقته الخاصة"),
      portrait("sv_univ_2", "univ", "يهمه حماية البيئة والطبيعة"),
      portrait("sv_benev_2", "benev", "يسامح بسهولة ويسعى لخير من حوله"),
      portrait("sv_trad_2", "trad", "يرى أن التواضع وعدم لفت الانتباه فضيلة"),
      portrait("sv_conf_2", "conf", "يتجنب فعل أي شيء قد يزعج الآخرين أو يخالف التوقعات"),
      portrait("sv_secur_2", "secur", "يريد نظاماً واستقراراً في حياته وعمله"),
    ],
  },
  {
    id: "strengths",
    title: "نقاط القوة",
    intro: "أربع وعشرون عبارة عن اثنتي عشرة قوة شخصية. النتيجة خمس قوى مميزة تبني عليها.",
    scored: true,
    scaleLabels: ["لا تشبهني", "تشبهني تماماً"],
    items: STRENGTH_KEYS.flatMap((k, i) => [
      likert5(`st_${k}_1`, k, STRENGTHS[k].items[0]),
      likert5(`st_${k}_2`, k, STRENGTHS[k].items[1]),
    ].map((it, j) => ({ ...it, id: `st_${k}_${j + 1}`, order: i }))),
  },
  {
    id: "negatives",
    title: "فحص الدوافع السلبية",
    intro: "دوافع تتسلل إلى الهوية دون أن نحس. كم يحركك كل واحد فعلاً؟ الصدق هنا أهم من الصورة.",
    scored: true,
    scaleLabels: ["لا يحركني", "يحركني كثيراً"],
    items: (Object.keys(NEGATIVE_NAMES) as NegativeKey[]).map((k) => ({
      id: `ng_${k}`,
      key: k,
      text: NEGATIVE_NAMES[k],
      hint: NEGATIVE_CONSEQUENCES[k],
      type: "scale03" as const,
      required: true,
    })),
  },
  {
    id: "work",
    title: "بيئة العمل",
    intro: "ست عبارات عن الظروف التي تعمل فيها أفضل. تُستخدم في قسم العمل والمسار.",
    scored: true,
    scaleLabels: ["لا تشبهني", "تشبهني تماماً"],
    items: WORK_ITEMS.map((w) => likert5(`wk_${w.key}`, w.key, w.text)),
  },
  {
    id: "open",
    title: "بكلماتك",
    intro: "عشر إجابات قصيرة. هذه هي المادة التي يُبنى عليها الجزء الشخصي من تقريرك، فكلما كانت أصدق كان التقرير أدق.",
    scored: false,
    items: [
      { id: "op_asked", text: "ما الذي يطلب منك الناس المساعدة فيه دائماً؟", type: "textarea", required: true, placeholder: "أوضح دليل على ما أنت معروف به فعلاً" },
      { id: "op_jobs", text: "أعمالك أو مشاريعك السابقة: ما أحببته وما أرهقك في كل واحد", type: "textarea", required: true, placeholder: "الجهة، المدة، ما أحببت، ما أرهقني" },
      { id: "op_decisions", text: "آخر ثلاثة قرارات كبيرة اتخذتها، وما الذي حكم كل واحد فعلاً", type: "textarea", required: true, placeholder: "القرار، القيمة التي أعلنتها، القيمة التي حكمت فعلاً" },
      { id: "op_feedback", text: "كيف يصفك أقرب الناس بصراحة؟ وما الذي ينصحونك بتغييره؟", type: "textarea", required: true, placeholder: "اسأل شخصين على الأقل إن لم تكن متأكداً" },
      { id: "op_people", text: "أقرب ثلاثة أشخاص تقضي معهم وقتك، ودور كل واحد في حياتك", type: "textarea" },
      { id: "op_hoped", text: "صف نفسك بعد خمس سنوات في أفضل حالة", type: "textarea", required: true, placeholder: "ماذا يفعل هذا الشخص في يومه؟ كيف يتكلم؟ من حوله؟" },
      { id: "op_feared", text: "ما الذي تخشى أن تصبحه؟", type: "textarea", required: true },
      { id: "op_drain", text: "ما الذي يستنزفك في عملك اليوم؟", type: "textarea", placeholder: "الاجتماعات الطويلة، الغموض، المقارنة…" },
      { id: "op_words", text: "ثلاث كلمات تصفك بها، وثلاث يصفك بها الناس", type: "text", required: true, placeholder: "أنا: صريح، عملي، متقلب / الناس: …" },
      { id: "op_belief", text: "قناعة آذتك أكثر من مرة", type: "text", placeholder: "مثال: «ما أقول لا»" },
    ],
  },
];

export const SCORED_ITEM_IDS: string[] = SECTIONS.filter((s) => s.scored).flatMap((s) => s.items.map((i) => i.id));

export function findItem(id: string) {
  for (const s of SECTIONS) {
    const it = s.items.find((i) => i.id === id);
    if (it) return it;
  }
  return undefined;
}
