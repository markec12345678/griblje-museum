"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Check, HelpCircle, RotateCcw, X } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type QuizQuestion = {
  questionSi: string;
  questionEn: string;
  answersSi: string[];
  answersEn: string[];
  correctIndex: number;
  explanationSi: string;
  explanationEn: string;
  exhibitSlug: string;
};

/**
 * Muzejska uganka — 10 vprašanj, vsako vezano na dejstvo iz sejane zbirke
 * (prva omemba 1526, Kolpa, cerkev sv. Vida, letališče Krasinec 1945,
 * malenca kot mlinarski jez, meja 1991, Niko Županič, letališče Otok,
 * SNOS v Črnomlju 1944, Uskoki). Preverjeno proti prisma/seed.ts.
 */
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    questionSi: "V katerem letu so Griblje prvič izpričane v pisnih virih?",
    questionEn: "In which year was Griblje first recorded in written sources?",
    answersSi: ["1426", "1526", "1626", "1726"],
    answersEn: ["1426", "1526", "1626", "1726"],
    correctIndex: 1,
    explanationSi:
      "Griblje so v pisnih virih prvič izpričane leta 1526 — v času, ko je bila Bela krajina stičišče habsburške dežele in osmanske vojne krajine.",
    explanationEn:
      "Griblje is first recorded in written sources in 1526 — a time when Bela krajina was a meeting point of the Habsburg lands and the Ottoman military frontier.",
    exhibitSlug: "griblje-vas",
  },
  {
    questionSi: "Ob kateri reki ležijo Griblje?",
    questionEn: "Which river does Griblje lie on?",
    answersSi: ["Sava", "Krka", "Kolpa", "Mura"],
    answersEn: ["Sava", "Krka", "Kolpa", "Mura"],
    correctIndex: 2,
    explanationSi:
      "Griblje ležijo na Kolpi, ki teče 297 kilometrov in je večji del toka slovensko-hrvaška meja; velja za eno najtoplejših kopalnih rek Slovenije.",
    explanationEn:
      "Griblje lies on the Kolpa, which runs for 297 kilometres, mostly as the Slovenian–Croatian border, and is held to be one of the warmest bathing rivers in Slovenia.",
    exhibitSlug: "kolpa-reka",
  },
  {
    questionSi: "Kdo je zavetnik vaške cerkve v Gribljah?",
    questionEn: "Who is the patron saint of the village church in Griblje?",
    answersSi: ["sv. Nikola", "sv. Ana", "sv. Martin", "sv. Vid"],
    answersEn: ["St. Nicholas", "St. Anne", "St. Martin", "St. Vitus"],
    correctIndex: 3,
    explanationSi:
      "V središču vasi stoji cerkev sv. Vida — versko središče krajevne skupnosti in najizrazitejša silhueta Gribelj.",
    explanationEn:
      "The church of St. Vitus stands in the centre of the village — the religious centre of the local community and the most striking silhouette of Griblje.",
    exhibitSlug: "sveti-vid",
  },
  {
    questionSi: "Z katerega letališča so zavezniška letala marca 1945 evakuirala ranjence in begunce?",
    questionEn: "From which airfield did Allied aircraft evacuate the wounded and refugees in March 1945?",
    answersSi: ["Bihać", "Krasinec", "Zagreb", "Trst"],
    answersEn: ["Bihać", "Krasinec", "Zagreb", "Trieste"],
    correctIndex: 1,
    explanationSi:
      "Konec marca 1945 so zavezniška letala z improviziranega partizanskega letališča Krasinec v dveh dneh evakuirala ranjence in težje bolne v zavezniško bazo v Bari.",
    explanationEn:
      "At the end of March 1945, Allied aircraft evacuated the wounded and gravely ill from the improvised Partisan airfield at Krasinec to the Allied base at Bari over two days.",
    exhibitSlug: "evakuacija-1945",
  },
  {
    questionSi: "Kaj je »malenca«?",
    questionEn: "What is a “malenca”?",
    answersSi: [
      "topel vetr, ki piha s pobočij navzdol",
      "mali jez z zaporo, ki so ga mlinarji zgradili čez reko",
      "ljudski ples Bele krajine",
      "stara mera za žito",
    ],
    answersEn: [
      "a warm downslope wind blowing off the hills",
      "a small weir with a drop that millers built across the river",
      "a folk dance of Bela krajina",
      "an old measure for grain",
    ],
    correctIndex: 1,
    explanationSi:
      "Malenca je mali jez oziroma zapora z brusom, ki so jo mlinarji zgradili čez reko, da so zajeli vodno silo — tak primer je na Kolpi pri Gribljah.",
    explanationEn:
      "A malenca is a small weir or dam with a drop that millers built across the river to capture the force of the water — one survives on the Kolpa at Griblje.",
    exhibitSlug: "malenca",
  },
  {
    questionSi: "V katerem letu je Slovenija razglasila samostojnost in je Kolpa postala državna meja?",
    questionEn: "In which year did Slovenia declare independence, making the Kolpa a national border?",
    answersSi: ["1980", "1991", "1995", "2004"],
    answersEn: ["1980", "1991", "1995", "2004"],
    correctIndex: 1,
    explanationSi:
      "Leta 1991 je Slovenija postala samostojna država in je Kolpa iz reke med dvema republikama postala zunanja meja Evropi.",
    explanationEn:
      "In 1991 Slovenia became an independent state, and the Kolpa turned from a river between two republics into an external border of Europe.",
    exhibitSlug: "meja-1991",
  },
  {
    questionSi: "Kateri etnolog, ustanovitelj Slovenskega etnografskega muzeja, se je rodil v Gribljah leta 1876?",
    questionEn: "Which ethnologist, founder of the Slovene Ethnographic Museum, was born in Griblje in 1876?",
    answersSi: ["Jože Plečnik", "Niko Županič", "France Prešeren", "Janez Vajkard Valvasor"],
    answersEn: ["Jože Plečnik", "Niko Županič", "France Prešeren", "Janez Vajkard Valvasor"],
    correctIndex: 1,
    explanationSi:
      "Niko Županič (1876–1961), rojen v Gribljah, je bil etnolog, antropolog, zgodovinar in politik — leta 1921 je v Ljubljani ustanovil Etnografski inštitut, današnji Slovenski etnografski muzej.",
    explanationEn:
      "Niko Županič (1876–1961), born in Griblje, was an ethnologist, anthropologist, historian and politician — in 1921 he founded the Ethnographic Institute in Ljubljana, today's Slovene Ethnographic Museum.",
    exhibitSlug: "niko-zupanic",
  },
  {
    questionSi: "Koliko ranjencev so zavezniki s partizanskega letališča Otok prepeljali v južno Italijo?",
    questionEn: "How many wounded did the Allies fly from the Otok partisan airfield to southern Italy?",
    answersSi: ["137", "473", "1.473", "14.730"],
    answersEn: ["137", "473", "1,473", "14,730"],
    correctIndex: 2,
    explanationSi:
      "Z letališča Otok pri Metliki, kjer so zavezniki prvič pristali 17. septembra 1944, je v zavezniške bolnišnice v južni Italiji odpotovalo 1473 ranjencev; med rešenimi je bilo tudi 87 britanskih letalcev.",
    explanationEn:
      "From the Otok airfield near Metlika, where the Allies first landed on 17 September 1944, 1,473 wounded flew to Allied hospitals in southern Italy; among the rescued were 87 British airmen.",
    exhibitSlug: "letalisce-otok-1944",
  },
  {
    questionSi: "Kje je februarja 1944 zasedal SNOS, imenovan tudi prvi slovenski parlament?",
    questionEn: "Where did the SNOS, also called the first Slovene parliament, meet in February 1944?",
    answersSi: ["v Ljubljani", "v Črnomlju", "v Metliki", "v Novem mestu"],
    answersEn: ["in Ljubljana", "in Črnomelj", "in Metlika", "in Novo mesto"],
    correctIndex: 1,
    explanationSi:
      "19. in 20. februarja 1944 je v Črnomlju zasedal Slovenski narodnoosvobodilni svet (SNOS) — zasedanje, ki ga štejejo za temelj slovenske državnosti.",
    explanationEn:
      "On 19 and 20 February 1944 the Slovene National Liberation Council (SNOS) met in Črnomelj — a session counted among the foundations of Slovene statehood.",
    exhibitSlug: "snos-crnomelj-1944",
  },
  {
    questionSi: "Kako so se imenovali begunci pred Osmani, ki so v 16. stoletju poselili Vojno krajino ob Kolpi?",
    questionEn: "What were the Ottoman-era refugees who settled the Military Frontier along the Kolpa in the 16th century called?",
    answersSi: ["Uskoki", "Kranjci", "Pamiri", "švedski najemniki"],
    answersEn: ["the Uskoks", "the Kranjci", "the Pamiri", "Swedish mercenaries"],
    correctIndex: 0,
    explanationSi:
      "Uskoki — begunci srbskega, hrvaškega in vlaškega porekla — so v 16. stoletju poselili Vojno krajino ob Kolpi; njihovi potomci danes živijo v Bojancih in Marindolu.",
    explanationEn:
      "The Uskoks — refugees of Serbian, Croatian and Vlach origin — settled the Military Frontier along the Kolpa in the 16th century; their descendants live today in Bojanci and Marindol.",
    exhibitSlug: "uskoki-in-vojna-krajina",
  },
];

const TOTAL = QUIZ_QUESTIONS.length;

export function MuseumQuiz({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit?: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();

  const [started, setStarted] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);

  const exhibitBySlug = React.useMemo(() => {
    const map = new Map<string, ExhibitDTO>();
    for (const ex of exhibits) map.set(ex.slug, ex);
    return map;
  }, [exhibits]);

  const restart = () => {
    setStarted(false);
    setFinished(false);
    setStep(0);
    setPicked(null);
    setScore(0);
  };

  const question = QUIZ_QUESTIONS[step];
  const answers = pick(lang, question.answersSi, question.answersEn);
  const linkedExhibit = started && !finished ? exhibitBySlug.get(question.exhibitSlug) : undefined;
  const isLast = step === TOTAL - 1;
  const verdict = score === TOTAL ? t.quiz.excellent : score >= 4 ? t.quiz.good : t.quiz.tryAgain;

  return (
    <Card className="border-border/70 shadow-sm">
      <CardContent className="flex flex-col gap-5 p-6">
        {!started ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start gap-4"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HelpCircle className="h-5.5 w-5.5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold">
                {t.quiz.sectionTitle}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t.quiz.sectionSub}
              </p>
            </div>
            <Button type="button" size="lg" className="min-h-12 px-6" onClick={() => setStarted(true)}>
              {t.quiz.start}
              <ArrowRight className="ml-2 h-4.5 w-4.5" aria-hidden="true" />
            </Button>
          </motion.div>
        ) : finished ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start gap-4"
            aria-live="polite"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t.quiz.yourScore}
            </p>
            <p className="font-display text-4xl font-semibold text-primary sm:text-5xl">
              {score} / {TOTAL}
            </p>
            <p className="text-sm font-medium leading-relaxed">{verdict}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t.quiz.groundedNote}
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Button type="button" size="lg" className="min-h-12 px-6" onClick={restart}>
                <RotateCcw className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
                {t.quiz.restart}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground" aria-live="polite">
                {t.quiz.questionOf(step + 1, TOTAL)}
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === step
                        ? "bg-primary"
                        : i < step
                          ? "bg-primary/50"
                          : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="font-display text-xl font-semibold leading-snug sm:text-2xl">
              {pick(lang, question.questionSi, question.questionEn)}
            </h3>

            <div className="grid gap-2.5">
              {answers.map((answer, index) => {
                const isCorrect = index === question.correctIndex;
                const isPicked = index === picked;
                const answered = picked !== null;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (picked !== null) return;
                      setPicked(index);
                      if (isCorrect) setScore((s) => s + 1);
                    }}
                    className={`flex min-h-11 w-full items-center gap-3 rounded-lg border p-4 text-left text-sm font-medium leading-relaxed transition-colors ${
                      answered && isCorrect
                        ? "border-primary bg-primary/10 text-foreground"
                        : answered && isPicked && !isCorrect
                          ? "border-destructive/50 bg-destructive/10 text-destructive"
                          : "border-border/70 bg-card text-foreground/90 hover:border-primary/40"
                    } ${answered ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span className="flex-1">{answer}</span>
                    {answered && isCorrect && (
                      <Check className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    )}
                    {answered && isPicked && !isCorrect && (
                      <X className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg border border-border/70 bg-background/60 p-4"
              >
                {picked === question.correctIndex ? (
                  <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Check className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                    {t.quiz.correct}
                  </p>
                ) : (
                  <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                    <X className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                    {t.quiz.incorrect}
                    <span className="font-normal text-foreground">
                      {t.quiz.correctAnswerWas}{" "}
                      {pick(lang, question.answersSi, question.answersEn)[question.correctIndex]}
                    </span>
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pick(lang, question.explanationSi, question.explanationEn)}
                </p>
                {onOpenExhibit && linkedExhibit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 min-h-11 border-primary/40"
                    onClick={() => onOpenExhibit(linkedExhibit)}
                  >
                    <BookOpen className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    {t.quiz.openRecord}
                  </Button>
                )}
              </div>
            )}

            {picked !== null && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="lg"
                  className="min-h-12 px-6"
                  onClick={() => {
                    if (isLast) {
                      setFinished(true);
                    } else {
                      setStep((s) => s + 1);
                      setPicked(null);
                    }
                  }}
                >
                  {isLast ? t.quiz.finish : t.quiz.next}
                  <ArrowRight className="ml-2 h-4.5 w-4.5" aria-hidden="true" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
