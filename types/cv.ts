export interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  skills: {
    category: string;
    items: string; // Comma separated string for simplicity in input, array in display
  }[];
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string; // Bullet points
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link?: string;
    details: string; // Bullet points
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  themeColor: string;
}

export const emptyCVData: CVData = {
  themeColor: "#2563eb",
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  languages: [],
};

export const initialCVData: CVData = {
  themeColor: "#2563eb", // Default blue-600
  personalInfo: {
    fullName: "NGUYỄN VĂN A",
    title: "SOFTWARE ENGINEER",
    email: "nguyen.van.a@example.com",
    phone: "0909 123 456",
    location: "TP. Hồ Chí Minh",
    linkedin: "linkedin.com/in/nguyenvana",
    github: "github.com/nguyenvana",
  },
  summary: "Lập trình viên Full-stack với 3 năm kinh nghiệm phát triển ứng dụng web sử dụng React, Node.js và TypeScript. Có khả năng làm việc độc lập và teamwork tốt, luôn cập nhật công nghệ mới.",
  skills: [
    { category: "Languages", items: "JavaScript, TypeScript, Python, Java" },
    { category: "Frontend", items: "React, Next.js, Tailwind CSS, Redux" },
    { category: "Backend", items: "Node.js, Express, NestJS, PostgreSQL, MongoDB" },
    { category: "Tools", items: "Git, Docker, AWS, Jenkins" },
  ],
  experience: [
    {
      id: "1",
      company: "CÔNG TY CÔNG NGHỆ ABC",
      position: "Senior Frontend Developer",
      startDate: "01/2023",
      endDate: "Present",
      current: true,
      description: "- Phát triển và duy trì các tính năng mới cho nền tảng E-commerce phục vụ 100k người dùng hàng tháng.\n- Tối ưu hóa hiệu suất ứng dụng, giảm thời gian tải trang xuống 40%.\n- Hướng dẫn và review code cho 3 junior developers.",
    },
    {
      id: "2",
      company: "STARTUP XYZ",
      position: "Full Stack Developer",
      startDate: "06/2021",
      endDate: "12/2022",
      current: false,
      description: "- Xây dựng hệ thống quản lý nội bộ từ con số 0 sử dụng MERN stack.\n- Tích hợp cổng thanh toán Stripe và PayPal.\n- Triển khai CI/CD pipeline giúp giảm thời gian deploy xuống 50%.",
    },
  ],
  projects: [
    {
      id: "1",
      name: "E-learning Platform",
      description: "Nền tảng học trực tuyến với các khóa học video và bài tập tương tác.",
      technologies: "Next.js, Supabase, Stripe",
      details: "- Xây dựng hệ thống authentication và authorization.\n- Tích hợp video streaming service.\n- Thiết kế database schema tối ưu cho việc truy vấn dữ liệu lớn.",
    },
  ],
  education: [
    {
      id: "1",
      institution: "ĐẠI HỌC BÁCH KHOA TP.HCM",
      degree: "Kỹ sư Khoa học Máy tính",
      startDate: "2017",
      endDate: "2021",
      gpa: "3.5/4.0",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  languages: [
    {
      language: "Tiếng Anh",
      proficiency: "IELTS 7.0",
    },
  ],
};
