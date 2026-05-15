"use client";

type MiraSuggestedQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
};

export default function MiraSuggestedQuestions({
  questions,
  onSelect,
  disabled = false,
}: MiraSuggestedQuestionsProps) {
  if (!questions?.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {questions.map((question) => (
        <button
          key={question}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(question)}
          className="
            group inline-flex items-center rounded-full
            border border-slate-200 bg-white px-4 py-2
            text-sm font-medium text-slate-700
            shadow-sm transition-all duration-200
            hover:-translate-y-0.5 hover:border-slate-300
            hover:bg-slate-50 hover:shadow-md
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-white/10 dark:bg-white/[0.045]
            dark:text-slate-200 dark:hover:border-white/20
            dark:hover:bg-white/[0.08]
          "
        >
          <span className="mr-2 text-slate-400 transition-colors group-hover:text-slate-600 dark:group-hover:text-slate-300">
            →
          </span>

          {question}
        </button>
      ))}
    </div>
  );
}