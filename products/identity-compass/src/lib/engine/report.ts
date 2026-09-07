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
import type { Answers, Band, Big5Key, MarciaStatus, Result } from "./types";

export interface ReportBlock {
  id: string;
  title: string;
  /** true = part of the paid report */
  locked: boolean;
  paragraphs: string[];
  bullets?: string[];
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
  diffusion:
    "لا استكشاف ولا التزام. الخطوة الأولى ليست القرار بل التجربة: تجارب صغيرة محددة المدة، وموعد مكتوب لمراجعتها.",
  foreclosure:
    "التزام بلا استكشاف، وغالباً ما يكون موروثاً من توقعات الأهل أو الظروف. اختبر التزامك: هل هو لك أم لهم؟ جرّب بديلاً واحداً بجدية قبل أن تغلق الباب.",
  moratorium:
    "تستكشف ولم تلتزم بعد. حالة صحية إن كانت مؤقتة، ومرهقة إن طالت. ضع موعداً للقرار ولا تجعل الاستكشاف هوية.",
  achievement:
    "استكشفت والتزمت. عملك الآن التعميق والحماية من الدوافع السلبية والمراجعة كل ستة أشهر.",
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

function fmtDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

export function identityThesis(r: Result): { line: string; why: string } {
  const f = r.negatives.flags;
  if (f.includes("show") || f.includes("polish") || f.includes("admit")) {
    return {
      line: "يُثبت قبل أن يقول.",
      why: "دوافع الظهور أو التجمل أو عدم الاعتراف بالخطأ مرتفعة عندك، وهي كلها صور لشيء واحد: الصورة تسبق الدليل. كل بند في هذا التقرير يخدم عكس ذلك.",
    };
  }
  if (r.values.dominant === "open" && r.big5.C < 50) {
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

export function buildReport(r: Result, answers: Answers, now: Date = new Date()): ReportBlock[] {
  const blocks: ReportBlock[] = [];
  const name = String(answers.p_name || "").trim();

  blocks.push({
    id: "overview",
    title: "الخلاصة",
    locked: false,
    paragraphs: [
      `مؤشر وضوح الهوية عندك ${r.index.score} من 100: ${INDEX_LABEL[r.index.band]}.`,
      r.index.band === "high"
        ? "تعرف من أنت وإلى أين تتجه، والعمل الآن على التعميق والحماية والظهور بدليل."
        : r.index.band === "mid"
          ? "أجزاء من هويتك واضحة وأجزاء تتشكل. القيم والرسالة هما ما يحسم الصورة."
          : "الهوية اليوم غير واضحة، والخبر الجيد أن أغلب ما ينقصك قابل للبناء خلال ستة أشهر إلى سنة بخطوات محددة.",
    ],
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

  const b5keys: Big5Key[] = ["O", "C", "E", "A", "N"];
  blocks.push({
    id: "big5",
    title: "سمات الشخصية",
    locked: false,
    paragraphs: ["النسب تعبّر عن موقعك بين الحد الأدنى والأقصى للمقياس، لا عن مقارنة بعينة سكانية."],
    bullets: b5keys.map((k) => `${BIG5_NAMES[k]} ${r.big5[k]}: ${BAND_LABEL[big5Band(r.big5[k])]}`),
  });

  blocks.push({
    id: "big5_detail",
    title: "ماذا تعني سماتك لهويتك",
    locked: true,
    paragraphs: b5keys.map((k) => `${BIG5_NAMES[k]} (${r.big5[k]}): ${BIG5_TEXT[k][big5Band(r.big5[k])]}`),
  });

  const v = r.values;
  const valuesParas = [
    `الأعلى عندك: ${v.top3.map((k) => VALUE_NAMES[k]).join("، ")}. الأدنى: ${v.bottom2.map((k) => VALUE_NAMES[k]).join("، ")}.`,
    ORIENTATION_TEXT[v.dominant],
  ];
  if (v.spread < 0.8) {
    valuesParas.push(
      "قيمك متقاربة جداً في التقييم، أي أنك لم تفرّق بعد بين ما تريده فعلاً وما تريد أن تريده. هذا شائع عند من لم يكتب قيمه من قبل. عِش أسبوعين وأنت تراقب القرارات الصغيرة، ثم أعد هذا الجزء.",
    );
  } else {
    valuesParas.push(
      `القيمتان الأدنى (${v.bottom2.map((k) => VALUE_NAMES[k]).join(" و")}) ليستا عيباً، لكن أي دور أو بيئة تطلب منك أن تعيشهما يومياً ستشعر به كعبء.`,
    );
  }
  blocks.push({
    id: "values",
    title: "قيمك",
    locked: true,
    paragraphs: valuesParas,
    bullets: v.ranked.map((k, i) => `${i + 1}. ${VALUE_NAMES[k]} (${v.raw[k].toFixed(1)} من 6)`),
  });

  const negParas = [`${r.negatives.total} من 21.`];
  if (r.negatives.flags.length) {
    negParas.push("دوافع أعطيتها بنفسك درجة مرتفعة، ولكل واحدة ممارسة صغيرة تعكسها، لأن الحراسة بالنية لا تصمد والحراسة بالعادة تصمد.");
  } else {
    negParas.push("لا دوافع سلبية غالبة اليوم. أعد الفحص بعد ستة أشهر؛ هذه الدوافع تتسلل مع النجاح تحديداً.");
  }
  blocks.push({
    id: "negatives",
    title: "ما تحرسه",
    locked: true,
    paragraphs: negParas,
    bullets: r.negatives.flags.map((k) => `${NEGATIVE_NAMES[k]} (${r.negatives.scores[k]} من 3). النتيجة إن تُركت: ${NEGATIVE_CONSEQUENCES[k]}. الممارسة: ${NEGATIVE_PRACTICES[k]}`),
  });

  const th = identityThesis(r);
  blocks.push({
    id: "thesis",
    title: "مبدأ هويتك",
    locked: true,
    paragraphs: [`${name ? name + "، " : ""}مبدأ واحد تُبنى عليه هويتك: «${th.line}»`, th.why],
  });

  // plan
  const habits: string[] = [];
  if (r.big5.C < 50) habits.push("أنا شخص منضبط، لذلك عندما يرن المنبه، سأقوم فوراً وأنجز أول مهمة قبل أن أفتح الجوال.");
  if (r.big5.A >= 65) habits.push("أنا شخص متأنٍ، لذلك عندما يُطلب مني التزام أو شراكة، سأقول: «أعطيك ردي بعد 48 ساعة».");
  if (r.negatives.flags.includes("show") || r.negatives.flags.includes("polish")) habits.push("أنا شخص موثوق، لذلك عندما أنجز شيئاً، سأوثّقه بدليل قبل أن أتكلم عنه.");
  if (r.negatives.flags.includes("control")) habits.push("أنا شخص يسمع، لذلك عندما أدخل اجتماعاً، سأتكلم أخيراً وأسأل ثلاثة أسئلة قبل أي حل.");
  if (r.negatives.flags.includes("admit")) habits.push("أنا شخص صادق، لذلك عندما أخطئ، سأقولها في الأسبوع نفسه.");
  if (r.big5.E >= 65) habits.push("أنا شخص حاضر، لذلك عندما أتعلم شيئاً مفيداً، سأشاركه مع شخص أو مجموعة في الأسبوع نفسه.");
  if (r.big5.N >= 65) habits.push("أنا شخص مستقر، لذلك عندما أشعر بالتوتر، سأؤجل أي قرار كبير 24 ساعة.");
  habits.push("أنا شخص واضح، لذلك عندما يسألني أحد ماذا أعمل، سأجيب بسطر واحد ثابت.");
  habits.push("أنا شخص يتعلم، لذلك عندما أنهي أسبوعي، سأكتب ثلاثة أسطر عما تعلمته.");

  const experiments: string[] = [];
  if (r.big5.A >= 65) experiments.push("ثلاثون يوماً من «لا» الواضحة: كل طلب لا يخدم رسالتك يُرفض بجملة مهذبة واحدة، وتسجل كيف تغير تعامل الناس معك.");
  if (r.negatives.flags.includes("control")) experiments.push("ثلاثون يوماً من «الصمت أولاً»: في كل اجتماع تتكلم آخر واحد، وتسجل بعد كل مرة كيف تغيّر رد فعل الناس.");
  if (r.big5.E >= 65) experiments.push("ثلاثون يوماً من الظهور بدليل: منشور أسبوعي واحد فيه نتيجة أو حالة أو أداة، لا رأي مجرد.");
  experiments.push("ثلاثون يوماً كمستشار في مجالك: ثلاث جلسات مجانية لساعة لحل مشكلة واحدة محددة، مقابل شهادة مكتوبة وحق توثيق الحالة.");
  experiments.push("ثلاثون يوماً من رسالة العشرة أشخاص: تسأل عشرة تثق برأيهم عن صفة تعززها وصفة تغيرها وقصة كنت فيها في أفضل حالتك.");

  const d30 = fmtDate(addDays(now, 30));
  const d60 = fmtDate(addDays(now, 60));
  const d90 = fmtDate(addDays(now, 90));
  const commitMilestone =
    r.marcia.status === "foreclosure"
      ? "اختبار الالتزام: تجربة بديل واحد بجدية، وقرار مكتوب بالاستمرار أو التغيير."
      : r.marcia.status === "achievement"
        ? "التعميق: خطوة توسّع واحدة داخل دائرتك، لا خارجها."
        : "الالتزام: قرار مكتوب بمسار واحد ينهي حالة الاستكشاف المفتوح.";

  blocks.push({
    id: "plan",
    title: "خطة التسعين يوماً",
    locked: true,
    paragraphs: ["ثلاث عادات مبنية على الهوية بصيغة «أنا شخص، لذلك عندما، سأفعل»، وتجربتان مؤقتتان، وثلاثة معالم بتواريخ."],
    bullets: [
      ...habits.slice(0, 3).map((h) => `عادة: ${h}`),
      ...experiments.slice(0, 2).map((e) => `تجربة: ${e}`),
      `اليوم 30 (${d30}): الوضوح. سطر التعريف والقيم الخمس مكتوبة، ورسالة التغذية الراجعة أُرسلت لعشرة أشخاص.`,
      `اليوم 60 (${d60}): الدليل. ثلاث حالات أو نتائج موثقة، وحدّ واحد طُبّق ورُفض بسببه عرض.`,
      `اليوم 90 (${d90}): ${commitMilestone}`,
    ],
  });

  const review = addDays(now, 182);
  blocks.push({
    id: "review",
    title: "المراجعة",
    locked: true,
    paragraphs: [
      `الموعد: ${fmtDate(review)}. أعد التقييم وقارن بأرقام اليوم: المؤشر ${r.index.score}، العلامات ${r.signs.score} من 9، الوضوح ${r.clarity.score} من 30، الدوافع السلبية ${r.negatives.total} من 21.`,
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
