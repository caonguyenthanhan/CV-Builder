"use client";

import React from "react";
import {
  ATSReviewResult,
  FeedbackIssue,
  FeedbackSeverity,
  ReadinessArea,
} from "@/lib/ai-review-rubric";
import { AlertTriangle, CheckCircle2, Info, Sparkles, Tag, Target } from "lucide-react";

const LIKELIHOOD_CONFIG = {
  low: {
    label: "Khả năng qua ATS: Thấp",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  medium: {
    label: "Khả năng qua ATS: Trung bình",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  high: {
    label: "Khả năng qua ATS: Cao",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
} as const;

const SEVERITY_CONFIG: Record<FeedbackSeverity, { label: string; badgeClass: string; borderClass: string }> = {
  critical: {
    label: "Nghiêm trọng",
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    borderClass: "border-l-4 border-l-red-500",
  },
  moderate: {
    label: "Trung bình",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    borderClass: "border-l-4 border-l-amber-500",
  },
  minor: {
    label: "Nhẹ",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    borderClass: "border-l-4 border-l-slate-400",
  },
};

const ISSUE_LABELS: Record<FeedbackIssue, string> = {
  missing_metrics: "Thiếu số liệu",
  weak_verb_or_task_only: "Động từ yếu / Kể đầu việc",
  missing_company_context: "Thiếu ngữ cảnh đơn vị/dự án",
  missing_tech_method: "Thiếu phương pháp/công nghệ",
  ats_or_clarity_issue: "Lỗi ATS / Diễn đạt chưa rõ",
};

const AREA_LABELS: Record<ReadinessArea, string> = {
  end_to_end_deployment: "Triển khai End-to-End",
  measurable_benchmarks: "Đo lường & Benchmark",
  practical_tooling: "Công cụ & Quy trình thực tế",
  interview_readiness: "Sẵn sàng phỏng vấn",
};

const SEVERITY_ORDER: Record<FeedbackSeverity, number> = {
  critical: 0,
  moderate: 1,
  minor: 2,
};

interface ATSReviewResultViewProps {
  result: ATSReviewResult;
}

export function ATSReviewResultView({ result }: ATSReviewResultViewProps) {
  const likelihood = LIKELIHOOD_CONFIG[result.ats_pass_likelihood] ?? LIKELIHOOD_CONFIG.medium;

  const rubricItems = [
    { key: "ats_and_format", title: "ATS & Format", data: result.scores.ats_and_format },
    { key: "xyz_and_metrics", title: "X-Y-Z & Số liệu", data: result.scores.xyz_and_metrics },
    { key: "action_verbs_and_tech_context", title: "Động từ & Bối cảnh", data: result.scores.action_verbs_and_tech_context },
    { key: "jd_fit_and_readiness", title: "Độ khớp JD & Sẵn sàng", data: result.scores.jd_fit_and_readiness },
  ];

  const sortedFeedback = [...result.line_by_line_feedback].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9)
  );

  return (
    <div className="space-y-5 text-sm">
      {/* Overall Score & Summary */}
      <div className="p-4 rounded-lg border bg-slate-50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-700">{result.overall_score}</span>
            <span className="text-slate-500 font-medium">/ 100 điểm</span>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${likelihood.className}`}>
            {likelihood.label}
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* 4 Rubric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {rubricItems.map(({ key, title, data }) => {
          const pct = data.max > 0 ? Math.min(100, Math.round((data.score / data.max) * 100)) : 0;
          return (
            <div key={key} className="p-3 rounded-lg border bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{title}</span>
                <span className="font-bold text-indigo-600">
                  {data.score}/{data.max}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{data.note}</p>
            </div>
          );
        })}
      </div>

      {/* Missing Keywords / Skills */}
      {result.missing_keywords_or_skills.length > 0 && (
        <div className="p-4 rounded-lg border bg-white space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Tag className="w-4 h-4 text-indigo-600" />
            <span>Từ khóa / Kỹ năng còn thiếu</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.missing_keywords_or_skills.map((kw, idx) => (
              <span
                key={`${kw}-${idx}`}
                className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Line-by-line Feedback */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Nhận xét chi tiết từng dòng ({sortedFeedback.length})</span>
        </div>

        {sortedFeedback.map((item, idx) => {
          const sev = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.moderate;
          return (
            <div key={idx} className={`p-4 rounded-lg border bg-white space-y-2.5 ${sev.borderClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {item.section}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${sev.badgeClass}`}>
                  {sev.label}
                </span>
              </div>

              {item.issues.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.issues.map((issue) => (
                    <span
                      key={issue}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {ISSUE_LABELS[issue] ?? issue}
                    </span>
                  ))}
                </div>
              )}

              {item.original_text && (
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Bản gốc: </span>
                  {item.original_text}
                </div>
              )}

              <p className="text-slate-700 text-xs leading-relaxed">
                <span className="font-semibold text-slate-800">Vấn đề: </span>
                {item.reason}
              </p>

              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gợi ý viết lại (X-Y-Z):</span>
                </div>
                <p className="leading-relaxed">{item.rewritten_xyz}</p>
              </div>

              {item.needs_user_metric && (
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Cần điền số liệu thật trước khi gửi CV</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Career Readiness Recommendations */}
      {result.career_readiness_recommendations.length > 0 && (
        <div className="p-4 rounded-lg border bg-white space-y-3">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Checklist cải thiện trước khi ứng tuyển</span>
          </div>
          <div className="space-y-2.5">
            {result.career_readiness_recommendations.map((rec, idx) => (
              <div key={idx} className="p-3 rounded-md bg-slate-50 border space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{AREA_LABELS[rec.area] ?? rec.area}</span>
                </div>
                <p className="text-xs text-slate-800 font-medium">{rec.action}</p>
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Tác động: </span>
                  {rec.expected_impact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
