import { Type } from "@google/genai";
import { CVData } from "@/types/cv";

export type ATSPassLikelihood = "low" | "medium" | "high";
export type FeedbackSeverity = "critical" | "moderate" | "minor";
export type FeedbackIssue =
  | "missing_metrics"
  | "weak_verb_or_task_only"
  | "missing_company_context"
  | "missing_tech_method"
  | "ats_or_clarity_issue";

export type ReadinessArea =
  | "end_to_end_deployment"
  | "measurable_benchmarks"
  | "practical_tooling"
  | "interview_readiness";

export interface RubricCategoryScore {
  score: number;
  max: number;
  note: string;
}

export interface LineByLineFeedback {
  section: string;
  original_text: string;
  severity: FeedbackSeverity;
  issues: FeedbackIssue[];
  reason: string;
  rewritten_xyz: string;
  needs_user_metric: boolean;
}

export interface CareerReadinessRecommendation {
  area: ReadinessArea;
  action: string;
  expected_impact: string;
}

export interface ATSReviewResult {
  overall_score: number;
  ats_pass_likelihood: ATSPassLikelihood;
  summary: string;
  scores: {
    ats_and_format: RubricCategoryScore;
    xyz_and_metrics: RubricCategoryScore;
    action_verbs_and_tech_context: RubricCategoryScore;
    jd_fit_and_readiness: RubricCategoryScore;
  };
  line_by_line_feedback: LineByLineFeedback[];
  missing_keywords_or_skills: string[];
  career_readiness_recommendations: CareerReadinessRecommendation[];
}

export const ATS_REVIEW_SYSTEM_INSTRUCTION = `Bạn là chuyên gia tuyển dụng kỹ thuật (Tech Recruiter) và AI Engineer có kinh nghiệm sàng lọc CV qua hệ thống ATS cho các vị trí Fresher/Junior/Mid.

Nhiệm vụ của bạn:
1. Đánh giá khả năng vượt qua ATS và mức độ thuyết phục của CV đối với vị trí mục tiêu (hoặc định hướng chung nếu thiếu JD).
2. Chấm điểm theo đúng 4 nhóm Rubric (tổng 100 điểm):
   - ats_and_format (max: 20): Bố cục 1 cột, chữ đen nền trắng, tối đa 1-2 font, không lạm dụng bảng/icon/đồ họa làm hỏng parser; tiêu đề mục chuẩn; link hoạt động đúng và làm rõ vai trò/quyền sở hữu repo; ưu tiên gọn 1 trang cho sinh viên/mới ra trường.
   - xyz_and_metrics (max: 30): Có kết quả đo lường (%, FPS, latency, số lượng mẫu/user, thời gian xử lý) thay vì mô tả đầu việc chung chung hoặc liệt kê công nghệ suông.
   - action_verbs_and_tech_context (max: 25): Mở đầu bullet bằng động từ hành động mạnh (Built, Engineered, Optimized, Reduced, Automated...); nêu rõ phương pháp/công nghệ áp dụng và thêm 1 dòng mô tả ngắn cho tổ chức/sản phẩm ít người biết.
   - jd_fit_and_readiness (max: 25): Từ khóa khớp yêu cầu vị trí (kể cả mảng triển khai/tối ưu/vận hành thực tế ngoài huấn luyện mô hình cơ bản), thông tin thời gian/tình trạng ứng tuyển nhất quán, loại bỏ mục lan man kém liên quan.
   - overall_score phải bằng tổng 4 điểm thành phần.
3. Chỉ ra lỗi cụ thể theo từng mục/bullet point, phân loại mức độ (critical / moderate / minor) và đưa ra bản viết lại áp dụng công thức X-Y-Z: [Động từ mạnh] + [Kết quả/Tác động có số liệu X, Y] + [Phương pháp/Công nghệ/Ngữ cảnh Z].
4. Làm rõ ngữ cảnh tổ chức/dự án nếu tên đơn vị chưa phổ biến, kiểm tra tính minh bạch của link (GitHub/Portfolio/Demo), đồng thời chỉ ra khoảng trống kỹ năng hoặc dự án thực tế (deploy, đo lường, tối ưu) cần bổ sung để tăng tỷ lệ có việc.
5. Không bịa số liệu hoặc kinh nghiệm không có trong CV; nếu thiếu số liệu định lượng, hãy đặt placeholder như [X%], [Y ms] trong rewritten_xyz và đặt needs_user_metric = true.
6. Nếu người dùng cung cấp JD, ưu tiên so khớp từ khóa bắt buộc/ưu tiên trong JD và sắp xếp line_by_line_feedback theo mức độ ưu tiên chỉnh sửa giảm dần.

Luôn trả về đúng cấu trúc JSON được yêu cầu bằng tiếng Việt (giữ nguyên thuật ngữ kỹ thuật/động từ tiếng Anh khi phù hợp với ngôn ngữ CV).`;

const rubricScoreSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    max: { type: Type.NUMBER },
    note: { type: Type.STRING },
  },
  required: ["score", "max", "note"],
};

export const ATS_REVIEW_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overall_score: { type: Type.NUMBER },
    ats_pass_likelihood: { type: Type.STRING, enum: ["low", "medium", "high"] },
    summary: { type: Type.STRING },
    scores: {
      type: Type.OBJECT,
      properties: {
        ats_and_format: rubricScoreSchema,
        xyz_and_metrics: rubricScoreSchema,
        action_verbs_and_tech_context: rubricScoreSchema,
        jd_fit_and_readiness: rubricScoreSchema,
      },
      required: [
        "ats_and_format",
        "xyz_and_metrics",
        "action_verbs_and_tech_context",
        "jd_fit_and_readiness",
      ],
    },
    line_by_line_feedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING },
          original_text: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["critical", "moderate", "minor"] },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
              enum: [
                "missing_metrics",
                "weak_verb_or_task_only",
                "missing_company_context",
                "missing_tech_method",
                "ats_or_clarity_issue",
              ],
            },
          },
          reason: { type: Type.STRING },
          rewritten_xyz: { type: Type.STRING },
          needs_user_metric: { type: Type.BOOLEAN },
        },
        required: [
          "section",
          "original_text",
          "severity",
          "issues",
          "reason",
          "rewritten_xyz",
          "needs_user_metric",
        ],
      },
    },
    missing_keywords_or_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    career_readiness_recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          area: {
            type: Type.STRING,
            enum: [
              "end_to_end_deployment",
              "measurable_benchmarks",
              "practical_tooling",
              "interview_readiness",
            ],
          },
          action: { type: Type.STRING },
          expected_impact: { type: Type.STRING },
        },
        required: ["area", "action", "expected_impact"],
      },
    },
  },
  required: [
    "overall_score",
    "ats_pass_likelihood",
    "summary",
    "scores",
    "line_by_line_feedback",
    "missing_keywords_or_skills",
    "career_readiness_recommendations",
  ],
};

export function buildATSReviewPrompt(cvData: CVData, jdInput?: string): string {
  const trimmedJD = jdInput?.trim();
  const jdSection = trimmedJD
    ? `Job Description (JD) / Vị trí mục tiêu:\n${trimmedJD}`
    : "Không có JD cụ thể — hãy chấm điểm theo định hướng chung cho vị trí kỹ thuật/công nghệ phù hợp nhất với CV.";

  return `${jdSection}

Dữ liệu CV hiện tại (JSON):
${JSON.stringify(cvData, null, 2)}

Hãy phân tích kỹ từng mục (WORK EXPERIENCE, PROJECTS, SKILLS, EDUCATION, LINKS...) và trả về kết quả JSON theo đúng schema.`;
}
