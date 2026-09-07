import {
  BIG5_NAMES,
  ERIKSON_STAGES,
  NEGATIVE_CONSEQUENCES,
  NEGATIVE_NAMES,
  NEGATIVE_PRACTICES,
  ORIENTATION_NAMES,
  SECTIONS,
  VALUE_NAMES,
} from "./items";
import { DICHOTOMY_META, STRENGTHS, TYPE_PROFILES, WORK_ITEMS, type Dichotomy } from "./types16";
import type { Answers, Band, Big5Key, MarciaStatus, Result } from "./types";

export interface ReportBlock {
  id: string;
  title: string;
  /** true = part of the paid report */
  locked: boolean;
  paragraphs: string[];
  bullets?: string[];
}

export interface Plan {
  habits: { identity: string; when: string; action: string }[];
  experiments: { what: string; days: number; learn: string }[];
  milestones: { day: number; date: string; title: string; measure: string }[];
  weekly: string[];
  start: string;
  end: string;
  review: string;
}

export const BAND_LABEL: Record<Band, string> = { low: "منخفض", mid: "متوسط", high: "مرتفع" };

export const INDEX_LABEL: Record<Band, string> = {
  low: "هوية غير واضحة",
  mid: "هوية قيد التشكل",
  high: "هوية واضحة",
};

export const MARCIA_LABEL: Record<MarciaStatus, string> = {
  diffusion: "تشتت الهوية",
  foreclosure: "هوية مغلقة مبكراً",
  moratorium: "تأجيل",
  achievement: "هوية محققة",
};

const MARCIA_TEXT: Record<MarciaStatus, string> = {
  diffusion: "لا استكشاف ولا التزام. الخطوة الأولى ليست القرار بل التجربة: تجارب صغيرة محددة المدة، وموعد مكتوب لمراجعتها.",
  foreclosure: "التزام بلا استكشاف، وغالباً ما يكون موروثاً من توقعات الأهل أو الظروف. اختبر التزامك: هل هو لك أم لهم؟ جرّب بديلاً واحداً بجدية قبل أن تغلق الباب.",
  moratorium: "تستكشف ولم تلتزم بعد. حالة صحية إن كانت مؤقتة، ومرهقة إن طالت. ضع موعداً للقرار ولا تجعل الاستكشاف هوية.",
  achievement: "استكشفت والتزمت. عملك الآن التعميق والحماية من الدوافع السلبية والمراجعة كل ستة أشهر.",
};

const SIGNS_TEXT: Record<Band, string> = {
  low: "مؤشرات خفيفة: هويتك مستقرة نسبياً، وهذا التقرير سيعمّقها لا يبنيها من الصفر.",
  mid: "هناك خلل واضح في جزء من الهوية، غالباً في القيم أو في الرسالة. ركّز على المرحلتين قبل أي ظهور.",
  high: "الهوية غير واضحة اليوم، وهذا التقرير كُتب لهذه الحالة تحديداً. أعطِ نفسك سنة، وابدأ بالقيم لا بالمظهر.",
};

const CLARITY_TEXT: Record<Band, string> = {
  high: "تعرف نفسك بثبات وتصف نفسك بالطريقة نفسها في كل مكان. ركّز في البناء على التموضع والهوية الظاهرة.",
  mid: "تعرف أجزاء من نفسك وتتقلب في أجزاء. القيم والرسالة هما ما يثبتان الصورة، وهما أول ما يجب أن يُكتب.",
  low: "وضوح منخفض. الأبحاث تربط انخفاض وضوح الذات بالقلق وتذبذب تقدير الذات. لا تستعجل البناء؛ مرحلة التحليل كلها لك.",
};

const BIG5_TEXT: Record<Big5Key, Record<Band, string>> = {
  O: {
    high: "تعيش على الأفكار والجديد. قوتك في التصور والربط بين المجالات، وخطرك أن تبدأ أكثر مما تنهي.",
    mid: "تجمع بين الفضول والعملية: تجرب الجديد حين يستحق، وتحتفظ بالمجرب حين يكفي.",
    low: "تفضّل المجرب والملموس. قوتك في الثبات والعمق في مجال واحد، وخطرك أن تفوتك فرص لمجرد أنها غير مألوفة.",
  },
  C: {
    high: "تنهي ما تبدأ وتخطط وتلتزم. هذا أقوى رصيد لبناء الهوية، لأن الهوية تُبنى بالاستمرارية لا بالإلهام.",
    mid: "انضباطك متوسط: القدرة موجودة والعادات متقلبة. النظام المكتوب يرفعك أكثر من الحماس.",
    low: "الانضباط أضعف نقاطك اليوم، وهذا خبر جيد لأنه أسهل ما يمكن إصلاحه: عادات صغيرة بصيغة «إذا حدث كذا فسأفعل كذا»، لا قرارات كبيرة.",
  },
  E: {
    high: "تشحن طاقتك من الناس وتبادر. العزلة تكلفك أكثر مما توفره؛ هويتك تُبنى في العلن.",
    mid: "تتنقل بين الجماعة والخلوة بحسب الحاجة. اختر بيئة عمل تعطيك الاثنين.",
    low: "تعمل أفضل في الهدوء والعمق. لا تقلد الصاخبين؛ هويتك تُبنى بالكتابة والعمل المتقن أكثر من الظهور.",
  },
  A: {
    high: "تميل بقوة إلى إرضاء الناس وتجنب الخلاف والثقة بهم. سمة محبوبة، لكنها بلا حدود تتحول إلى «ما أقول لا» و«العطاء بلا مقابل». الحدود المكتوبة هي ثقلك الموازن.",
    mid: "توازن بين مراعاة الناس والصراحة. راقب المواقف التي تتراجع فيها عن رأيك حفاظاً على العلاقة.",
    low: "صريح وتنافسي وتشك قبل أن تثق. هذا يحميك من الاستغلال لكنه قد يكلفك حلفاء؛ اختر معركتين لا كل المعارك.",
  },
  N: {
    high: "مشاعرك السلبية قريبة من السطح: قلق وتقلب وتوتر. ليست عيباً في الهوية لكنها تشوش على القرار؛ لا تقرر شيئاً كبيراً في يوم سيئ، وقاعدة النوم والدخل قبل أي خطة طموحة.",
    mid: "استقرارك الانفعالي في المدى الطبيعي: تتأثر لكنك تعود. انتبه للفترات التي يتذبذب فيها دخلك أو نومك.",
    low: "هادئ تحت الضغط وتتجاوز الإحباط بسرعة. رصيد قيادي حقيقي؛ انتبه فقط ألا يُقرأ هدوؤك برودة.",
  },
};

const ORIENTATION_TEXT = {
  enh: "توجهك الغالب تعزيز الذات: القوة والإنجاز. تريد الوصول والمكانة. الأبحاث تربط الأهداف الخارجية بالرضا المنخفض إن لم تُربط برسالة تخدم غيرك؛ اجعل الوصول نتيجة لا هدفاً.",
  trans: "توجهك الغالب تجاوز الذات: الإحسان والعالمية. قوتك في الرسالة؛ خطرك أن تذوب في احتياجات الناس وتفقد الحدود.",
  open: "توجهك الغالب الانفتاح على التغيير: التوجيه الذاتي والإثارة. قوتك في التجريب والإبداع؛ خطرك التشتت وترك الأشياء قبل اكتمالها.",
  cons: "توجهك الغالب المحافظة: الأمان والامتثال والتقليد. قوتك في الثبات والثقة؛ خطرك الإغلاق المبكر على هوية لم تختبرها.",
} as const;

export function big5Band(v: number): Band {
  return v >= 65 ? "high" : v >= 35 ? "mid" : "low";
}

export function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

/** نص بُعد واحد من الأنماط: «خارجي 70%» أو «داخلي 60%» */
export function dichotomyLabel(k: Dichotomy, pct: number) {
  const m = DICHOTOMY_META[k];
  return pct >= 50 ? `${m.pos} ${pct}%` : `${m.neg} ${100 - pct}%`;
}

export function identityThesis(r: Result): { line: string; why: string } {
  const f = r.negatives.flags;
  if (f.includes("show") || f.includes("polish") || f.includes("admit")) {
    return {
      line: "يُثبت قبل أن يقول.",
      why: "دوافع الظهور أو التجمل أو عدم الاعتراف بالخطأ مرتفعة عندك، وهي كلها صور لشيء واحد: الصورة تسبق الدليل. كل بند في هذا التقرير يخدم عكس ذلك.",
    };
  }
  if ((r.values.dominant === "open" || r.ptype.code.includes("P")) && r.big5.C < 50) {
    return {
      line: "يُكمل قبل أن يبدأ.",
      why: "توجهك نحو التغيير والأفكار مع انضباط متوسط أو أقل يعني أن مشكلتك ليست قلة الأفكار بل قلة الإكمال. الهوية تُعرف بما اكتمل.",
    };
  }
  if (r.big5.A >= 65) {
    return {
      line: "يعطي بإطار.",
      why: "توافقك مرتفع: تعطي وتثق وتتجنب الخلاف. بلا حدود تتحول هذه السمة إلى استنزاف. الإطار المكتوب يحفظ الطيبة ويمنع الاستغلال.",
    };
  }
  if (r.marcia.status === "foreclosure") {
    return {
      line: "يختبر قبل أن يلتزم.",
      why: "التزامك جاء قبل الاستكشاف. الهوية التي لم تُختبر تنهار عند أول أزمة؛ جرّب بديلاً واحداً بجدية قبل أن تغلق الباب.",
    };
  }
  if (r.marcia.status === "diffusion" || r.marcia.status === "moratorium") {
    return {
      line: "يجرب صغيراً ويقرر بموعد.",
      why: "لم تلتزم بعد باتجاه. الطريق ليس قراراً كبيراً بل تجارب قصيرة محددة المدة، ثم قرار مكتوب في تاريخ محدد.",
    };
  }
  return {
    line: "يعمّق قبل أن يوسّع.",
    why: "هويتك مستقرة نسبياً. الخطر الآن هو التوسع خارج دائرتك قبل أن يثبت الداخل. اعمق في ما تُعرف به ثم توسّع من هناك.",
  };
}

/** خطة التسعين يوماً القاعدية: عادات وتجارب ومعالم مشتقة من النتائج والنمط */
export function buildPlan(r: Result, now: Date = new Date()): Plan {
  const habits: Plan["habits"] = [];
  if (r.big5.C < 50) habits.push({ identity: "منضبط", when: "يرن المنبه في الصباح", action: "أقوم فوراً وأنجز أول مهمة قبل أن أفتح الجوال" });
  if (r.big5.A >= 65) habits.push({ identity: "متأنٍ", when: "يُطلب مني التزام أو شراكة", action: "أقول: أعطيك ردي بعد 48 ساعة" });
  if (r.negatives.flags.includes("show") || r.negatives.flags.includes("polish")) habits.push({ identity: "موثوق", when: "أنجز شيئاً", action: "أوثّقه بدليل قبل أن أتكلم عنه" });
  if (r.negatives.flags.includes("control")) habits.push({ identity: "يسمع", when: "أدخل اجتماعاً", action: "أتكلم أخيراً وأسأل ثلاثة أسئلة قبل أي حل" });
  if (r.negatives.flags.includes("admit")) habits.push({ identity: "صادق", when: "أخطئ", action: "أقولها في الأسبوع نفسه" });
  if (r.ptype.code.includes("P") && r.big5.O >= 50) habits.push({ identity: "مُكمل", when: "تخطر لي فكرة جديدة", action: "أكتبها في قائمة الانتظار ولا أبدأها قبل إغلاق الحالية" });
  if (r.big5.E >= 65) habits.push({ identity: "حاضر", when: "أتعلم شيئاً مفيداً", action: "أشاركه مع شخص أو مجموعة في الأسبوع نفسه" });
  if (r.big5.N >= 65) habits.push({ identity: "مستقر", when: "أشعر بالتوتر", action: "أؤجل أي قرار كبير 24 ساعة" });
  if (r.ptype.code.includes("J") && r.big5.O < 50) habits.push({ identity: "يجرب", when: "يبدأ الأسبوع", action: "أخصص ساعة لتجربة شيء غير مجرب داخل مجالي" });
  habits.push({ identity: "واضح", when: "يسألني أحد ماذا أعمل", action: "أجيب بسطر واحد ثابت" });
  habits.push({ identity: "يتعلم", when: "أنهي أسبوعي", action: "أكتب ثلاثة أسطر عما تعلمته" });

  const experiments: Plan["experiments"] = [];
  if (r.big5.A >= 65) experiments.push({ what: "«لا» الواضحة: كل طلب لا يخدم رسالتك يُرفض بجملة مهذبة واحدة", days: 30, learn: "كيف يتغير تعامل الناس معك حين تصير حدودك معلنة" });
  if (r.negatives.flags.includes("control")) experiments.push({ what: "«الصمت أولاً»: في كل اجتماع تتكلم آخر واحد", days: 30, learn: "ما الذي كان يخفيه الناس عنك حين كنت تتكلم أولاً" });
  if (r.big5.E >= 65) experiments.push({ what: "الظهور بدليل: منشور أسبوعي فيه نتيجة أو حالة أو أداة، لا رأي مجرد", days: 30, learn: "هل جمهورك يستجيب للدليل أكثر من الرأي" });
  if (r.ptype.code.includes("I")) experiments.push({ what: "لقاء واحد أسبوعياً مع شخص من خارج دائرتك في مجالك", days: 30, learn: "كم فرصة كانت تنتظرك خارج الخلوة" });
  experiments.push({ what: "مستشار في مجالك: ثلاث جلسات مجانية لساعة لحل مشكلة واحدة محددة، مقابل شهادة مكتوبة وحق توثيق الحالة", days: 30, learn: "هل حل المشكلات في مجالك هو مكانك فعلاً، وأول ثلاث حالات موثقة" });
  experiments.push({ what: "رسالة العشرة أشخاص: تسأل عشرة تثق برأيهم عن صفة تعززها وصفة تغيرها وقصة كنت فيها في أفضل حالتك", days: 30, learn: "منطقتك العمياء كما يراها الناس" });

  const commitMilestone =
    r.marcia.status === "foreclosure"
      ? { title: "اختبار الالتزام", measure: "تجربة بديل واحد بجدية، وقرار مكتوب بالاستمرار أو التغيير" }
      : r.marcia.status === "achievement"
        ? { title: "التعميق", measure: "خطوة توسّع واحدة داخل دائرتك، لا خارجها، منفذة وموثقة" }
        : { title: "الالتزام", measure: "قرار مكتوب ومؤرخ بمسار واحد ينهي حالة الاستكشاف المفتوح" };

  const milestones: Plan["milestones"] = [
    { day: 30, date: fmtDate(addDays(now, 30)), title: "الوضوح", measure: "سطر التعريف والقيم الخمس مكتوبة، ورسالة التغذية الراجعة أُرسلت لعشرة أشخاص" },
    { day: 60, date: fmtDate(addDays(now, 60)), title: "الدليل", measure: "ثلاث حالات أو نتائج موثقة، وحدّ واحد طُبّق ورُفض بسببه عرض" },
    { day: 90, date: fmtDate(addDays(now, 90)), ...commitMilestone },
  ];

  const weekly = [
    "الأحد: خمس عشرة دقيقة لمراجعة العادات الثلاث وتسجيل ما تم",
    "منتصف الأسبوع: خطوة واحدة في التجربة الجارية",
    "الخميس: ثلاثة أسطر عما تعلمته هذا الأسبوع",
    r.ptype.code.includes("J") ? "السبت: ساعة استكشاف مجدولة لشيء غير مجرب" : "السبت: إغلاق مهمة مفتوحة واحدة قبل أي فكرة جديدة",
  ];

  return {
    habits: habits.slice(0, 3),
    experiments: experiments.slice(0, 2),
    milestones,
    weekly,
    start: fmtDate(addDays(now, 1)),
    end: fmtDate(addDays(now, 90)),
    review: fmtDate(addDays(now, 182)),
  };
}

export function buildReport(r: Result, answers: Answers, now: Date = new Date()): ReportBlock[] {
  const blocks: ReportBlock[] = [];
  const name = String(answers.p_name || "").trim();
  const tp = TYPE_PROFILES[r.ptype.code];
  const b5keys: Big5Key[] = ["O", "C", "E", "A", "N"];
  const th = identityThesis(r);

  blocks.push({
    id: "overview",
    title: "الخلاصة",
    locked: false,
    paragraphs: [
      `مؤشر وضوح الهوية عندك ${r.index.score} من 100: ${INDEX_LABEL[r.index.band]}.`,
      `نمطك ${r.ptype.code} «${r.ptype.name}»، وقواك المميزة: ${r.strengths.top5.slice(0, 3).map((k) => STRENGTHS[k].name).join("، ")}.`,
      r.index.band === "high"
        ? "تعرف من أنت وإلى أين تتجه، والعمل الآن على التعميق والحماية والظهور بدليل."
        : r.index.band === "mid"
          ? "أجزاء من هويتك واضحة وأجزاء تتشكل. القيم والرسالة هما ما يحسم الصورة."
          : "الهوية اليوم غير واضحة، والخبر الجيد أن أغلب ما ينقصك قابل للبناء خلال ستة أشهر إلى سنة بخطوات محددة.",
    ],
  });

  blocks.push({
    id: "foundations",
    title: "الأسس النفسية",
    locked: false,
    paragraphs: [
      "سماتك الخمس ونمطك الرباعي يقيسان شيئين مختلفين: السمات تصف مقدار كل ميل عندك على مقياس متصل، والنمط يصف تفضيلك بين قطبين. النسب تعبّر عن موقعك على المقياس لا عن مقارنة بعينة سكانية.",
      `نمطك: ${(["EI", "SN", "TF", "JP"] as Dichotomy[]).map((k) => dichotomyLabel(k, r.ptype.pct[k])).join(" · ")}.` +
        (r.ptype.balanced.length ? ` تفضيلك متوازن في ${r.ptype.balanced.map((k) => DICHOTOMY_META[k].title).join(" و")}، أي أنك تتنقل بين القطبين بحسب الموقف.` : ""),
      ...r.ptype.consistency,
    ],
    bullets: b5keys.map((k) => `${BIG5_NAMES[k]} ${r.big5[k]}: ${BAND_LABEL[big5Band(r.big5[k])]}`),
  });

  const signSection = SECTIONS.find((s) => s.id === "signs")!;
  blocks.push({
    id: "signs",
    title: "علامات الخلل",
    locked: false,
    paragraphs: [`${r.signs.score} من 9 علامات. ${SIGNS_TEXT[r.signs.band]}`],
    bullets: r.signs.flagged.map((i) => signSection.items[i - 1].text),
  });

  blocks.push({
    id: "clarity",
    title: "وضوح مفهوم الذات",
    locked: false,
    paragraphs: [`${r.clarity.score} من 30: ${BAND_LABEL[r.clarity.band]}. ${CLARITY_TEXT[r.clarity.band]}`],
  });

  blocks.push({
    id: "marcia",
    title: "حالة الهوية",
    locked: false,
    paragraphs: [`${MARCIA_LABEL[r.marcia.status]}. ${MARCIA_TEXT[r.marcia.status]}`],
  });

  if (r.erikson) {
    const extra =
      r.erikson.stage === 6
        ? "هذه أطول مرحلة وأكثرها عزلة عند من لم يحدد دوره. العلاقات التي تمثلك والعمل الذي يشبهك هما الجواب."
        : r.erikson.stage === 7
          ? "السؤال الآن عن الأثر لا عن البداية. الرضا عمّا أنجزت يولّد إنتاجاً، والعتاب يولّد ركوداً."
          : r.erikson.stage === 5
            ? "أخطر المراحل: تحتاج إجابات واضحة عن «من أنا» وشخصاً يساعدك على بنائها."
            : "";
    blocks.push({
      id: "erikson",
      title: "مرحلتك عند إريكسون",
      locked: false,
      paragraphs: [`المرحلة ${r.erikson.stage} من 8: ${r.erikson.name}. سؤال المرحلة: ${r.erikson.question}`, extra].filter(Boolean),
    });
  }

  blocks.push({
    id: "type",
    title: `نمطك: ${r.ptype.name}`,
    locked: true,
    paragraphs: [
      tp.essence,
      `قوى هذا النمط: ${tp.strengths.join("؛ ")}.`,
      `تحدياته: ${tp.challenges.join("؛ ")}.`,
      "الأنماط الأربعة لغة مفيدة للوصف وأقل ثباتاً علمياً من السمات الخمس، لذلك نعرضها بنسب لا بصندوق مغلق، ونقرأها مع بقية نتائجك.",
    ],
  });

  const behavior: string[] = [];
  behavior.push(BIG5_TEXT.C[big5Band(r.big5.C)]);
  behavior.push(r.ptype.pct.JP >= 50 ? "تميل إلى إغلاق الأمور وتفضّل الخطة المحسومة؛ انتبه ألا تغلق قبل أن تستكشف بما يكفي." : "تفضّل إبقاء الخيارات مفتوحة وتعمل جيداً قرب الموعد؛ انتبه أن المرونة بلا موعد مكتوب تتحول إلى تأجيل.");
  behavior.push(BIG5_TEXT.E[big5Band(r.big5.E)]);
  behavior.push(BIG5_TEXT.N[big5Band(r.big5.N)]);
  if (answers.p_sleep !== undefined && Number(answers.p_sleep) < 6) behavior.push(`تنام ${answers.p_sleep} ساعات. أي خطة طموحة تُبنى على نوم أقل من ست ساعات ستنهار في أسبوعها الثالث؛ النوم هنا بند في الخطة لا نصيحة عامة.`);
  if (answers.p_screen !== undefined && Number(answers.p_screen) >= 6) behavior.push(`${answers.p_screen} ساعات على الجوال يومياً هي أكبر مخزون وقت متاح لك؛ ساعة واحدة منها تكفي لثلاث عادات الخطة.`);
  blocks.push({ id: "behavior", title: "سلوكك اليومي", locked: true, paragraphs: behavior });

  blocks.push({
    id: "strengths",
    title: "قواك المميزة",
    locked: true,
    paragraphs: [
      "خمس قوى أعلى من غيرها عندك. الأبحاث عن نقاط القوة الشخصية تُظهر أن استخدام القوى المميزة بطريقة جديدة كل أسبوع يرفع الرضا أكثر من محاولة إصلاح الضعف.",
      `الأدنى عندك: ${r.strengths.bottom3.map((k) => STRENGTHS[k].name).join("، ")}. ليست عيوباً؛ فقط لا تبنِ هويتك عليها.`,
    ],
    bullets: r.strengths.top5.map((k) => `${STRENGTHS[k].name} (${r.strengths.scores[k]}): ${STRENGTHS[k].desc}. كيف تستخدمها: ${STRENGTHS[k].use}`),
  });

  const challenges: string[] = [];
  for (const k of r.negatives.flags) challenges.push(`${NEGATIVE_NAMES[k]}: ${NEGATIVE_CONSEQUENCES[k]}.`);
  for (const k of b5keys) {
    if (k === "N" && r.big5.N >= 65) challenges.push("العصابية مرتفعة: القرارات في الأيام السيئة تكلفك أكثر من غيرك.");
    if (k === "C" && r.big5.C < 35) challenges.push("الانضباط منخفض: الفجوة بين ما تريده وما تفعله يومياً هي التحدي الأول.");
    if (k === "A" && r.big5.A >= 65) challenges.push("التوافق مرتفع: تقول نعم أكثر مما تحتمل، وتثق أسرع مما يجب.");
    if (k === "A" && r.big5.A < 35) challenges.push("التوافق منخفض: صراحتك تحميك وتكلفك حلفاء في الوقت نفسه.");
  }
  challenges.push(...tp.challenges.map((c) => `من نمطك: ${c}.`));
  blocks.push({ id: "challenges", title: "تحدياتك", locked: true, paragraphs: ["ما يعرقلك ليس نقصاً في القدرة، بل سمات قوية تعمل بلا حدود، ودوافع تتسلل دون أن تحس."], bullets: challenges });

  blocks.push({
    id: "relationships",
    title: "علاقاتك",
    locked: true,
    paragraphs: [
      BIG5_TEXT.A[big5Band(r.big5.A)],
      tp.relationships,
      r.ptype.pct.TF >= 50 ? "تقرر بالمنطق وتقول رأيك؛ من حولك يحتاج أن يسمع التقدير قبل التصحيح." : "تراعي مشاعر الناس في قراراتك؛ خطرك أن تسكت عن الحق حفاظاً على الجو. الصراحة المبكرة أرحم من الصبر ثم الانفجار.",
      r.erikson?.stage === 6 ? "في مرحلة الألفة مقابل العزلة، دائرتك ليست رفاهية: هي المكان الذي تُختبر فيه هويتك. عدد العلاقات التي تمثلك فعلاً أهم من عدد المعارف." : "",
    ].filter(Boolean),
  });

  const workLines = WORK_ITEMS.map((w) => `${w.name} ${r.work[w.key]}: ${r.work[w.key] >= 60 ? w.high : r.work[w.key] <= 40 ? w.low : "متوسط"}`);
  blocks.push({
    id: "career",
    title: "عملك ومسارك",
    locked: true,
    paragraphs: [
      `بيئتك المناسبة: ${workLines.join(" · ")}.`,
      `أدوار تناسب نمطك: ${tp.career.fit.join("؛ ")}. أدوار تستنزفك: ${tp.career.avoid.join("؛ ")}.`,
      `قيمك العليا (${r.values.top3.map((k) => VALUE_NAMES[k]).join("، ")}) هي ما يجب أن يوفره أي دور تقبله؛ الدور الذي يطلب منك قيمك الدنيا (${r.values.bottom2.map((k) => VALUE_NAMES[k]).join("، ")}) يومياً سيشعر به كعبء مهما كان الراتب.`,
      r.work.risk >= 60 && r.big5.C < 50 ? "تتحمل المخاطرة المالية مع انضباط متوسط: هذا المزيج يحتاج قاعدة دخل ثابت قبل أي مغامرة، وقاعدة 48 ساعة قبل أي التزام." : "",
    ].filter(Boolean),
  });

  const v = r.values;
  const valuesParas = [
    `الأعلى عندك: ${v.top3.map((k) => VALUE_NAMES[k]).join("، ")}. الأدنى: ${v.bottom2.map((k) => VALUE_NAMES[k]).join("، ")}.`,
    ORIENTATION_TEXT[v.dominant],
  ];
  if (v.spread < 0.8) {
    valuesParas.push("قيمك متقاربة جداً في التقييم، أي أنك لم تفرّق بعد بين ما تريده فعلاً وما تريد أن تريده. هذا شائع عند من لم يكتب قيمه من قبل. عِش أسبوعين وأنت تراقب القرارات الصغيرة، ثم أعد هذا الجزء.");
  }
  blocks.push({
    id: "values",
    title: "قيمك",
    locked: true,
    paragraphs: valuesParas,
    bullets: v.ranked.map((k, i) => `${i + 1}. ${VALUE_NAMES[k]} (${v.raw[k].toFixed(1)} من 6)`),
  });

  const negParas = [`${r.negatives.total} من 21.`];
  negParas.push(r.negatives.flags.length ? "دوافع أعطيتها بنفسك درجة مرتفعة، ولكل واحدة ممارسة صغيرة تعكسها، لأن الحراسة بالنية لا تصمد والحراسة بالعادة تصمد." : "لا دوافع سلبية غالبة اليوم. أعد الفحص بعد ستة أشهر؛ هذه الدوافع تتسلل مع النجاح تحديداً.");
  blocks.push({
    id: "guards",
    title: "ما تحرسه",
    locked: true,
    paragraphs: negParas,
    bullets: r.negatives.flags.map((k) => `${NEGATIVE_NAMES[k]} (${r.negatives.scores[k]} من 3). الممارسة: ${NEGATIVE_PRACTICES[k]}`),
  });

  blocks.push({
    id: "thesis",
    title: "مبدأ هويتك",
    locked: true,
    paragraphs: [`${name ? name + "، " : ""}مبدأ واحد تُبنى عليه هويتك: «${th.line}»`, th.why, `نصيحة نمطك للخطة: ${tp.planTweak}`, `للنمو: ${tp.growth}`],
  });

  const plan = buildPlan(r, now);
  blocks.push({
    id: "plan",
    title: "خطة التسعين يوماً",
    locked: true,
    paragraphs: [`تبدأ ${plan.start} وتنتهي ${plan.end}. ثلاث عادات بصيغة «أنا شخص، لذلك عندما، سأفعل»، وتجربتان مؤقتتان، وثلاثة معالم بتواريخ، وإيقاع أسبوعي ثابت.`],
    bullets: [
      ...plan.habits.map((h) => `عادة: أنا شخص ${h.identity}، لذلك عندما ${h.when}، ${h.action}.`),
      ...plan.experiments.map((e) => `تجربة ${e.days} يوماً: ${e.what}. ما تتعلمه: ${e.learn}.`),
      ...plan.milestones.map((m) => `اليوم ${m.day} (${m.date}): ${m.title}. ${m.measure}.`),
      ...plan.weekly.map((w) => `إيقاع: ${w}`),
    ],
  });

  const prompts = [
    ...tp.reflection,
    `ما القرار الذي حكمته قيمة «${VALUE_NAMES[v.ranked[0]]}» وندمت عليه؟`,
    r.negatives.flags.length ? `أين ظهر «${NEGATIVE_NAMES[r.negatives.flags[0]]}» في تصرفاتي هذا الشهر دون أن أسميه؟` : "ما الدافع الذي أخفيه عن نفسي حين أنجح؟",
    `متى استخدمت «${STRENGTHS[r.strengths.top5[0]].name}» بطريقة جديدة آخر مرة؟`,
    "من الشخص الذي يراني بوضوح أكثر مني، وماذا سيقول لو سألته اليوم؟",
    "ما الذي سأتوقف عن فعله هذا الأسبوع لأنه يشبه ذاتي التي أخشاها؟",
  ];
  blocks.push({ id: "reflection", title: "أسئلة للتأمل", locked: true, paragraphs: ["سؤال واحد كل أسبوع، تكتب جوابه في ثلاثة أسطر. الأبحاث عن التأمل في التجربة تُظهر أنه يرفع التعلم أكثر من تراكم الخبرة وحده."], bullets: prompts });

  blocks.push({
    id: "review",
    title: "المراجعة",
    locked: true,
    paragraphs: [
      `الموعد: ${plan.review}. أعد التقييم وقارن بأرقام اليوم: المؤشر ${r.index.score}، العلامات ${r.signs.score} من 9، الوضوح ${r.clarity.score} من 30، الدوافع السلبية ${r.negatives.total} من 21.`,
    ],
    bullets: [
      "هل ما زالت هذه الهوية تمثلني، أم تحتاج تعديلاً؟",
      "هل تسللت دوافع سلبية بين السطور دون أن أحس؟ أعد إرسال رسالة التغذية الراجعة للأشخاص أنفسهم.",
      "هل تطورت؟ هل أنا مرتاح ومستمتع؟ وما الذي يفرق عن اليوم؟",
    ],
  });

  return blocks;
}

export function reportToText(blocks: ReportBlock[]): string {
  return blocks
    .map((b) => {
      const lines = [`## ${b.title}`, ...b.paragraphs];
      if (b.bullets?.length) lines.push(...b.bullets.map((x) => `- ${x}`));
      return lines.join("\n");
    })
    .join("\n\n");
}

export { ERIKSON_STAGES, ORIENTATION_NAMES };
