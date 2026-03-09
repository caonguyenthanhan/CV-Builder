import { CVData, Experience, Education } from "@/types";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  data: CVData;
  onChange: (data: CVData) => void;
};

export default function CVForm({ data, onChange }: Props) {
  const handleChange = (field: keyof CVData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
    const newExp = data.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    handleChange("experience", newExp);
  };

  const addExperience = () => {
    handleChange("experience", [
      ...data.experience,
      { id: Date.now().toString(), company: "", position: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeExperience = (id: string) => {
    handleChange("experience", data.experience.filter((exp) => exp.id !== id));
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    const newEdu = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    handleChange("education", newEdu);
  };

  const addEducation = () => {
    handleChange("education", [
      ...data.education,
      { id: Date.now().toString(), school: "", degree: "", startDate: "", endDate: "" },
    ]);
  };

  const removeEducation = (id: string) => {
    handleChange("education", data.education.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-8 pb-10">
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              value={data.position}
              onChange={(e) => handleChange("position", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Professional Summary</h3>
        <textarea
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief overview of your professional background..."
        />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
          <button
            onClick={addExperience}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} className="mr-1" /> Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 border border-gray-200 rounded-md bg-gray-50 relative">
              <button
                onClick={() => removeExperience(exp.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(exp.id, "position", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(exp.id, "startDate", e.target.value)}
                    placeholder="MM/YYYY"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(exp.id, "endDate", e.target.value)}
                    placeholder="MM/YYYY or Present"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="- Achieved X by doing Y..."
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Education</h3>
          <button
            onClick={addEducation}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} className="mr-1" /> Add Education
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 border border-gray-200 rounded-md bg-gray-50 relative">
              <button
                onClick={() => removeEducation(edu.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
              <div className="grid grid-cols-2 gap-4 pr-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(edu.id, "school", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(edu.id, "startDate", e.target.value)}
                    placeholder="MM/YYYY"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(edu.id, "endDate", e.target.value)}
                    placeholder="MM/YYYY"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Skills</h3>
        <textarea
          value={data.skills}
          onChange={(e) => handleChange("skills", e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="List your skills separated by commas..."
        />
      </section>
    </div>
  );
}
