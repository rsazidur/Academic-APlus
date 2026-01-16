export function PageHeader() {
  return (
    <div className="text-center animate-in">
      <div className="inline-block relative">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight relative z-10">
          <span className="text-gradient">Academic A+ Plus</span>
        </h1>
        <div className="absolute -inset-1 blur-2xl bg-primary/30 rounded-full dark:bg-primary/20 -z-10"></div>
      </div>

      <p className="mt-6 text-xl md:text-2xl text-slate-300 font-medium tracking-wide">
        🚀 AI-Powered Exam Preparation
      </p>

      <p className="mt-2 text-base text-slate-400">
        For CSE Students in Bangladesh
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-400">
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
          <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Detailed Solutions
        </span>
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Common Mistakes
        </span>
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">
          <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          AI-Powered
        </span>
      </div>
    </div>
  );
}
