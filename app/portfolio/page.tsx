'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PortfolioData {
  fullName: string;
  title: string;
  bio: string;
  skills: string[];
  education: {
    school: string;
    degree: string;
    year: string;
  }[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
}

const defaultPortfolioData: PortfolioData = {
  fullName: '',
  title: '',
  bio: '',
  skills: [''],
  education: [{ school: '', degree: '', year: '' }],
  experience: [{ company: '', position: '', duration: '', description: '' }],
  projects: [{ name: '', description: '', technologies: [''], link: '' }],
  contact: {
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
  },
};

export default function PortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (!res.ok) {
          router.push('/login');
          return;
        }

        // Load existing portfolio data if available
        const portfolioRes = await fetch('/api/portfolio');
        if (portfolioRes.ok) {
          const data = await portfolioRes.json();
          if (data && Object.keys(data).length > 0) {
            // Merge the loaded data with default values
            setPortfolioData({
              ...defaultPortfolioData,
              ...data,
              skills: data.skills || defaultPortfolioData.skills,
              education: data.education || defaultPortfolioData.education,
              experience: data.experience || defaultPortfolioData.experience,
              projects: data.projects || defaultPortfolioData.projects,
              contact: {
                ...defaultPortfolioData.contact,
                ...(data.contact || {}),
              },
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const validateForm = () => {
    if (!portfolioData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!portfolioData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (portfolioData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portfolioData.contact.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (portfolioData.contact.linkedin && !portfolioData.contact.linkedin.startsWith('https://')) {
      setError('LinkedIn URL must start with https://');
      return false;
    }
    if (portfolioData.contact.github && !portfolioData.contact.github.startsWith('https://')) {
      setError('GitHub URL must start with https://');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save portfolio data');
      }

      setSuccess('Portfolio updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addItem = (section: 'skills' | 'education' | 'experience' | 'projects') => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === 'skills' ? '' :
        section === 'education' ? { school: '', degree: '', year: '' } :
        section === 'experience' ? { company: '', position: '', duration: '', description: '' } :
        { name: '', description: '', technologies: [''], link: '' }
      ],
    }));
  };

  const removeItem = (section: 'skills' | 'education' | 'experience' | 'projects', index: number) => {
    setPortfolioData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Loading your portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Portfolio</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={portfolioData.fullName}
                  onChange={(e) => setPortfolioData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={portfolioData.title}
                  onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={portfolioData.bio}
                  onChange={(e) => setPortfolioData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
                <button
                  type="button"
                  onClick={() => addItem('skills')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  + Add Skill
                </button>
              </div>
              {portfolioData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...portfolioData.skills];
                      newSkills[index] = e.target.value;
                      setPortfolioData(prev => ({ ...prev, skills: newSkills }));
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem('skills', index)}
                    className="text-red-600 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                <button
                  type="button"
                  onClick={() => addItem('education')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  + Add Education
                </button>
              </div>
              {portfolioData.education.map((edu, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Education #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeItem('education', index)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">School</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const newEducation = [...portfolioData.education];
                          newEducation[index] = { ...edu, school: e.target.value };
                          setPortfolioData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...portfolioData.education];
                          newEducation[index] = { ...edu, degree: e.target.value };
                          setPortfolioData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Year</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => {
                          const newEducation = [...portfolioData.education];
                          newEducation[index] = { ...edu, year: e.target.value };
                          setPortfolioData(prev => ({ ...prev, education: newEducation }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Experience</h2>
                <button
                  type="button"
                  onClick={() => addItem('experience')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  + Add Experience
                </button>
              </div>
              {portfolioData.experience.map((exp, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Experience #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeItem('experience', index)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExperience = [...portfolioData.experience];
                          newExperience[index] = { ...exp, company: e.target.value };
                          setPortfolioData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const newExperience = [...portfolioData.experience];
                          newExperience[index] = { ...exp, position: e.target.value };
                          setPortfolioData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => {
                          const newExperience = [...portfolioData.experience];
                          newExperience[index] = { ...exp, duration: e.target.value };
                          setPortfolioData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExperience = [...portfolioData.experience];
                          newExperience[index] = { ...exp, description: e.target.value };
                          setPortfolioData(prev => ({ ...prev, experience: newExperience }));
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                <button
                  type="button"
                  onClick={() => addItem('projects')}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  + Add Project
                </button>
              </div>
              {portfolioData.projects.map((project, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Project #{index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeItem('projects', index)}
                      className="text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Name</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => {
                          const newProjects = [...portfolioData.projects];
                          newProjects[index] = { ...project, name: e.target.value };
                          setPortfolioData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const newProjects = [...portfolioData.projects];
                          newProjects[index] = { ...project, description: e.target.value };
                          setPortfolioData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technologies</label>
                      <div className="space-y-2">
                        {project.technologies.map((tech, techIndex) => (
                          <div key={techIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={tech}
                              onChange={(e) => {
                                const newProjects = [...portfolioData.projects];
                                const newTech = [...project.technologies];
                                newTech[techIndex] = e.target.value;
                                newProjects[index] = { ...project, technologies: newTech };
                                setPortfolioData(prev => ({ ...prev, projects: newProjects }));
                              }}
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newProjects = [...portfolioData.projects];
                                const newTech = project.technologies.filter((_, i) => i !== techIndex);
                                newProjects[index] = { ...project, technologies: newTech };
                                setPortfolioData(prev => ({ ...prev, projects: newProjects }));
                              }}
                              className="text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newProjects = [...portfolioData.projects];
                            const newTech = [...project.technologies, ''];
                            newProjects[index] = { ...project, technologies: newTech };
                            setPortfolioData(prev => ({ ...prev, projects: newProjects }));
                          }}
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          + Add Technology
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Project Link</label>
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => {
                          const newProjects = [...portfolioData.projects];
                          newProjects[index] = { ...project, link: e.target.value };
                          setPortfolioData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={portfolioData.contact.email}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={portfolioData.contact.phone}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    value={portfolioData.contact.location}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, location: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                  <input
                    type="url"
                    value={portfolioData.contact.linkedin}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, linkedin: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GitHub</label>
                  <input
                    type="url"
                    value={portfolioData.contact.github}
                    onChange={(e) => setPortfolioData(prev => ({
                      ...prev,
                      contact: { ...prev.contact, github: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Portfolio'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 