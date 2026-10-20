/**
 * YR RESUME BUILDER - Core Application Logic
 * 100% Free Resume Creator & Customizer
 */

(function () {
  'use strict';

  // =========================================================================
  // Default Sample Profile Data
  // =========================================================================
  const sampleData = {
    personal: {
      fullName: "YuvRaj",
      jobTitle: "Senior Full Stack Engineer & Cloud Architect",
      email: "yuvraj@example.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA (Open to Remote)",
      website: "https://yuvraj.dev",
      linkedin: "linkedin.com/in/yuvraj",
      github: "github.com/yuvraj",
      photoUrl: ""
    },
    summary: "Innovative and results-driven Senior Full Stack Engineer with 6+ years of experience designing scalable web architectures, microservices, and AI integrations. Proven track record of improving system performance by 40%, managing cloud infrastructures handling 2M+ monthly active users, and mentoring cross-functional engineering teams.",
    experience: [
      {
        id: "exp-1",
        role: "Lead Full Stack Engineer",
        company: "Aether Technologies",
        location: "San Francisco, CA",
        startDate: "2022",
        endDate: "Present",
        bullets: "• Architected high-throughput microservices using Node.js, TypeScript, and Go, reducing API latency by 45%.\n• Spearheaded the redesign of user dashboard using React & Tailwind CSS, improving engagement metrics by 32%.\n• Orchestrated CI/CD pipelines and automated deployments across AWS (ECS, Lambda, CloudFront) with 99.99% uptime.\n• Mentored 8 junior and mid-level developers through code reviews and bi-weekly architecture sessions."
      },
      {
        id: "exp-2",
        role: "Senior Software Engineer",
        company: "Nova Cloud Systems",
        location: "Austin, TX (Remote)",
        startDate: "2020",
        endDate: "2022",
        bullets: "• Built real-time analytics streaming pipelines processing over 50M events daily using Kafka, Redis, and PostgreSQL.\n• Designed and maintained RESTful and GraphQL APIs consumed by web and mobile client applications.\n• Implemented robust OAuth2/JWT authentication and RBAC security systems compliant with SOC2 standards."
      },
      {
        id: "exp-3",
        role: "Software Developer",
        company: "PixelCraft Interactive",
        location: "New York, NY",
        startDate: "2018",
        endDate: "2020",
        bullets: "• Developed responsive, pixel-perfect web interfaces utilizing React, Redux, and modern CSS frameworks.\n• Optimized database query performance and indexing in MySQL, eliminating slow queries by 60%."
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science",
        school: "California Institute of Technology",
        location: "Pasadena, CA",
        startDate: "2014",
        endDate: "2018",
        details: "Magna Cum Laude • Dean's Honors List • Focus on Distributed Systems & Algorithms"
      }
    ],
    skills: [
      {
        id: "skill-1",
        category: "Programming & Frameworks",
        items: "JavaScript, TypeScript, Python, React, Next.js, Node.js, Express, Go, HTML5, CSS3, Tailwind CSS"
      },
      {
        id: "skill-2",
        category: "Cloud & DevOps",
        items: "AWS (S3, ECS, Lambda), Docker, Kubernetes, Terraform, GitHub Actions, CI/CD, Nginx"
      },
      {
        id: "skill-3",
        category: "Databases & Tools",
        items: "PostgreSQL, MongoDB, Redis, GraphQL, REST APIs, Git, Jest, Cypress, Linux"
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "HyperScale Cloud Monitor",
        tech: "React, Node.js, WebSockets, Redis, Docker",
        link: "github.com/yuvraj/hyperscale",
        bullets: "• Created real-time server telemetry monitoring dashboard visualizing system metrics across 500+ servers.\n• Integrated WebSocket pub/sub alerting engine that reduced critical incident response time by 50%."
      },
      {
        id: "proj-2",
        title: "AI Semantic Search Engine",
        tech: "Python, FastAPI, OpenAI Embeddings, Qdrant, React",
        link: "github.com/yuvraj/vector-search",
        bullets: "• Built semantic search engine indexing 250,000+ technical articles with sub-100ms vector query retrieval."
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        date: "2023",
        url: "https://aws.amazon.com/verification"
      },
      {
        id: "cert-2",
        name: "Google Cloud Certified Professional Cloud Architect",
        issuer: "Google Cloud",
        date: "2022",
        url: ""
      }
    ],
    custom: {
      enabled: true,
      title: "Achievements & Open Source",
      content: "• 1st Place Winner at Global Cloud Hackathon 2023 among 1,200+ global participants\n• Active contributor to open-source developer tooling and developer communities\n• Speaker on 'Building Scalable Web Services' at DevCon 2022"
    }
  };

  // Blank template for Reset
  const blankData = {
    personal: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      photoUrl: ""
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    custom: {
      enabled: false,
      title: "Custom Section",
      content: ""
    }
  };

  // =========================================================================
  // Application State
  // =========================================================================
  let resumeData = JSON.parse(JSON.stringify(sampleData));

  let customization = {
    template: 'neon-modern',
    accentColor: '#00FF66',
    fontFamily: "'Inter', sans-serif",
    fontSize: '10pt',
    spacing: 'normal',
    paperTone: '#FFFFFF'
  };

  let zoomLevel = 1.0;

  // LocalStorage keys
  const STORAGE_KEY_DATA = 'yr_resume_builder_data';
  const STORAGE_KEY_CUSTOM = 'yr_resume_builder_customization';

  // =========================================================================
  // Helper Utilities
  // =========================================================================
  function generateId(prefix = 'item') {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) {
      c = c.split('').map(x => x + x).join('');
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getContrastingTextColor(paperHex) {
    if (paperHex === '#0F172A' || paperHex === '#12131A') {
      return { text: '#F1F5F9', muted: '#94A3B8' };
    }
    return { text: '#1E293B', muted: '#64748B' };
  }

  // =========================================================================
  // Persistence (LocalStorage)
  // =========================================================================
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(resumeData));
      localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(customization));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }

  function loadFromLocalStorage() {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY_DATA);
      const savedCustom = localStorage.getItem(STORAGE_KEY_CUSTOM);
      if (savedData) {
        resumeData = JSON.parse(savedData);
        if (resumeData.personal && (resumeData.personal.fullName === 'Harshit Sharma' || !resumeData.personal.fullName)) {
          resumeData.personal.fullName = 'YuvRaj';
          if (resumeData.personal.email === 'harshit@example.com') resumeData.personal.email = 'yuvraj@example.com';
          if (resumeData.personal.website === 'https://harshitsharma.dev' || resumeData.personal.website === 'https://harshit.dev') resumeData.personal.website = 'https://yuvraj.dev';
          if (resumeData.personal.linkedin === 'linkedin.com/in/harshitsharma' || resumeData.personal.linkedin === 'linkedin.com/in/harshit') resumeData.personal.linkedin = 'linkedin.com/in/yuvraj';
          if (resumeData.personal.github === 'github.com/harshitsharma' || resumeData.personal.github === 'github.com/harshit') resumeData.personal.github = 'github.com/yuvraj';
        }
      }
      if (savedCustom) {
        customization = Object.assign(customization, JSON.parse(savedCustom));
      }
    } catch (e) {
      console.warn("LocalStorage load error:", e);
    }
  }

  // =========================================================================
  // Form Population & Binding
  // =========================================================================
  function populatePersonalForm() {
    const p = resumeData.personal || {};
    document.getElementById('p-fullName').value = p.fullName || '';
    document.getElementById('p-jobTitle').value = p.jobTitle || '';
    document.getElementById('p-email').value = p.email || '';
    document.getElementById('p-phone').value = p.phone || '';
    document.getElementById('p-location').value = p.location || '';
    document.getElementById('p-website').value = p.website || '';
    document.getElementById('p-linkedin').value = p.linkedin || '';
    document.getElementById('p-github').value = p.github || '';
    document.getElementById('p-photoUrl').value = p.photoUrl || '';
  }

  function populateSummaryForm() {
    document.getElementById('p-summary').value = resumeData.summary || '';
  }

  function populateCustomForm() {
    const c = resumeData.custom || { enabled: false, title: '', content: '' };
    document.getElementById('custom-section-enabled').checked = !!c.enabled;
    document.getElementById('custom-section-title').value = c.title || '';
    document.getElementById('custom-section-content').value = c.content || '';
  }

  // Repeater: Work Experience
  function renderExperienceForm() {
    const container = document.getElementById('experience-items-container');
    container.innerHTML = '';

    if (!resumeData.experience || resumeData.experience.length === 0) {
      container.innerHTML = `<div class="form-hint" style="text-align:center; padding: 1.5rem 0;">No work experience entries yet. Click "Add Position" above!</div>`;
      return;
    }

    resumeData.experience.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'repeater-item-card';
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="repeater-item-header">
          <span class="repeater-item-title">
            <i class="fa-solid fa-briefcase neon-text"></i>
            <span>${escapeHtml(item.role || 'Position')} ${item.company ? '@ ' + escapeHtml(item.company) : ''}</span>
          </span>
          <button type="button" class="btn-delete-item" title="Delete entry" data-action="delete-exp" data-id="${item.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Job Title / Role</label>
            <input type="text" class="form-input exp-field" data-prop="role" value="${escapeHtml(item.role)}" placeholder="e.g. Lead Software Engineer">
          </div>
          <div class="form-group">
            <label>Company / Organization</label>
            <input type="text" class="form-input exp-field" data-prop="company" value="${escapeHtml(item.company)}" placeholder="e.g. Google / Microsoft">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" class="form-input exp-field" data-prop="location" value="${escapeHtml(item.location)}" placeholder="e.g. New York, NY / Remote">
          </div>
          <div class="form-group">
            <label>Duration / Dates</label>
            <div style="display:flex; gap: 0.4rem;">
              <input type="text" class="form-input exp-field" data-prop="startDate" value="${escapeHtml(item.startDate)}" placeholder="Start (2022)" style="width: 50%;">
              <input type="text" class="form-input exp-field" data-prop="endDate" value="${escapeHtml(item.endDate)}" placeholder="End (Present)" style="width: 50%;">
            </div>
          </div>
          <div class="form-group col-span-2">
            <label>Key Responsibilities & Achievements (Bullet points)</label>
            <textarea rows="4" class="form-textarea exp-field" data-prop="bullets" placeholder="• Led development of...&#10;• Increased performance by...">${escapeHtml(item.bullets)}</textarea>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Repeater: Education
  function renderEducationForm() {
    const container = document.getElementById('education-items-container');
    container.innerHTML = '';

    if (!resumeData.education || resumeData.education.length === 0) {
      container.innerHTML = `<div class="form-hint" style="text-align:center; padding: 1.5rem 0;">No education entries added yet. Click "Add Degree" above!</div>`;
      return;
    }

    resumeData.education.forEach(item => {
      const card = document.createElement('div');
      card.className = 'repeater-item-card';
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="repeater-item-header">
          <span class="repeater-item-title">
            <i class="fa-solid fa-graduation-cap neon-text"></i>
            <span>${escapeHtml(item.degree || 'Degree')}</span>
          </span>
          <button type="button" class="btn-delete-item" title="Delete degree" data-action="delete-edu" data-id="${item.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label>Degree & Major</label>
            <input type="text" class="form-input edu-field" data-prop="degree" value="${escapeHtml(item.degree)}" placeholder="e.g. B.S. in Computer Science">
          </div>
          <div class="form-group">
            <label>School / University</label>
            <input type="text" class="form-input edu-field" data-prop="school" value="${escapeHtml(item.school)}" placeholder="e.g. Stanford University">
          </div>
          <div class="form-group">
            <label>Graduation Year / Dates</label>
            <div style="display:flex; gap: 0.4rem;">
              <input type="text" class="form-input edu-field" data-prop="startDate" value="${escapeHtml(item.startDate)}" placeholder="2016" style="width: 50%;">
              <input type="text" class="form-input edu-field" data-prop="endDate" value="${escapeHtml(item.endDate)}" placeholder="2020" style="width: 50%;">
            </div>
          </div>
          <div class="form-group col-span-2">
            <label>Honors, GPA, or Key Courses (Optional)</label>
            <input type="text" class="form-input edu-field" data-prop="details" value="${escapeHtml(item.details)}" placeholder="e.g. GPA 3.9/4.0 • Dean's List">
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Repeater: Skills Categories
  function renderSkillsForm() {
    const container = document.getElementById('skills-items-container');
    container.innerHTML = '';

    if (!resumeData.skills || resumeData.skills.length === 0) {
      container.innerHTML = `<div class="form-hint" style="text-align:center; padding: 1.5rem 0;">No skill categories added yet. Click "Add Category" above!</div>`;
      return;
    }

    resumeData.skills.forEach(item => {
      const card = document.createElement('div');
      card.className = 'repeater-item-card';
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="repeater-item-header">
          <span class="repeater-item-title">
            <i class="fa-solid fa-code neon-text"></i>
            <span>${escapeHtml(item.category || 'Skill Category')}</span>
          </span>
          <button type="button" class="btn-delete-item" title="Delete category" data-action="delete-skill" data-id="${item.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label>Category Name</label>
            <input type="text" class="form-input skill-field" data-prop="category" value="${escapeHtml(item.category)}" placeholder="e.g. Programming Languages, Cloud, Frameworks">
          </div>
          <div class="form-group col-span-2">
            <label>Skills List (Comma separated)</label>
            <input type="text" class="form-input skill-field" data-prop="items" value="${escapeHtml(item.items)}" placeholder="e.g. JavaScript, Python, React, Docker, Git">
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Repeater: Projects
  function renderProjectsForm() {
    const container = document.getElementById('projects-items-container');
    container.innerHTML = '';

    if (!resumeData.projects || resumeData.projects.length === 0) {
      container.innerHTML = `<div class="form-hint" style="text-align:center; padding: 1.5rem 0;">No projects added yet. Click "Add Project" above!</div>`;
      return;
    }

    resumeData.projects.forEach(item => {
      const card = document.createElement('div');
      card.className = 'repeater-item-card';
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="repeater-item-header">
          <span class="repeater-item-title">
            <i class="fa-solid fa-laptop-code neon-text"></i>
            <span>${escapeHtml(item.title || 'Project Title')}</span>
          </span>
          <button type="button" class="btn-delete-item" title="Delete project" data-action="delete-proj" data-id="${item.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" class="form-input proj-field" data-prop="title" value="${escapeHtml(item.title)}" placeholder="e.g. Cloud Monitor">
          </div>
          <div class="form-group">
            <label>Project URL or GitHub</label>
            <input type="text" class="form-input proj-field" data-prop="link" value="${escapeHtml(item.link)}" placeholder="e.g. github.com/user/project">
          </div>
          <div class="form-group col-span-2">
            <label>Tech Stack Badges / Technologies</label>
            <input type="text" class="form-input proj-field" data-prop="tech" value="${escapeHtml(item.tech)}" placeholder="e.g. React, Node.js, Redis, Docker">
          </div>
          <div class="form-group col-span-2">
            <label>Description / Impact (Bullet points)</label>
            <textarea rows="3" class="form-textarea proj-field" data-prop="bullets" placeholder="• Built full-stack system...&#10;• Increased speed by 40%">${escapeHtml(item.bullets)}</textarea>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Repeater: Certifications
  function renderCertificationsForm() {
    const container = document.getElementById('certifications-items-container');
    container.innerHTML = '';

    if (!resumeData.certifications || resumeData.certifications.length === 0) {
      container.innerHTML = `<div class="form-hint" style="text-align:center; padding: 1.5rem 0;">No certifications added yet. Click "Add Certification" above!</div>`;
      return;
    }

    resumeData.certifications.forEach(item => {
      const card = document.createElement('div');
      card.className = 'repeater-item-card';
      card.dataset.id = item.id;
      card.innerHTML = `
        <div class="repeater-item-header">
          <span class="repeater-item-title">
            <i class="fa-solid fa-award neon-text"></i>
            <span>${escapeHtml(item.name || 'Certification Name')}</span>
          </span>
          <button type="button" class="btn-delete-item" title="Delete certification" data-action="delete-cert" data-id="${item.id}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label>Certification or Honor Title</label>
            <input type="text" class="form-input cert-field" data-prop="name" value="${escapeHtml(item.name)}" placeholder="e.g. AWS Certified Solutions Architect">
          </div>
          <div class="form-group">
            <label>Issuer / Organization</label>
            <input type="text" class="form-input cert-field" data-prop="issuer" value="${escapeHtml(item.issuer)}" placeholder="e.g. Amazon Web Services">
          </div>
          <div class="form-group">
            <label>Year / Date</label>
            <input type="text" class="form-input cert-field" data-prop="date" value="${escapeHtml(item.date)}" placeholder="e.g. 2023">
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Update whole form view
  function renderAllForms() {
    populatePersonalForm();
    populateSummaryForm();
    renderExperienceForm();
    renderEducationForm();
    renderSkillsForm();
    renderProjectsForm();
    renderCertificationsForm();
    populateCustomForm();
  }

  // =========================================================================
  // Resume Rendering Templates Engine
  // =========================================================================
  function renderBullets(text) {
    if (!text) return '';
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return `
      <ul class="item-bullets">
        ${lines.map(line => {
          let clean = line.trim();
          if (clean.startsWith('•') || clean.startsWith('-') || clean.startsWith('*')) {
            clean = clean.substring(1).trim();
          }
          return `<li>${escapeHtml(clean)}</li>`;
        }).join('')}
      </ul>
    `;
  }

  function applyCustomizationVariables() {
    const sheet = document.getElementById('resume-sheet');
    if (!sheet) return;

    const accent = customization.accentColor || '#00FF66';
    const paper = customization.paperTone || '#FFFFFF';
    const textTheme = getContrastingTextColor(paper);

    sheet.style.setProperty('--resume-accent', accent);
    sheet.style.setProperty('--resume-accent-light', hexToRgba(accent, 0.12));
    sheet.style.setProperty('--resume-accent-border', hexToRgba(accent, 0.35));
    sheet.style.setProperty('--resume-paper', paper);
    sheet.style.setProperty('--resume-text', textTheme.text);
    sheet.style.setProperty('--resume-text-muted', textTheme.muted);
    sheet.style.setProperty('--resume-font', customization.fontFamily || "'Inter', sans-serif");
    sheet.style.setProperty('--resume-font-size', customization.fontSize || '10pt');

    let spacingVal = '1.1rem';
    if (customization.spacing === 'compact') spacingVal = '0.75rem';
    else if (customization.spacing === 'relaxed') spacingVal = '1.45rem';
    sheet.style.setProperty('--resume-spacing', spacingVal);
  }

  // Template 1: Neon Modern
  function buildNeonModernHTML(data) {
    const p = data.personal || {};
    return `
      <div class="resume-header">
        <div class="header-left">
          <h1>${escapeHtml(p.fullName || 'Your Name')}</h1>
          ${p.jobTitle ? `<div class="header-title-badge">${escapeHtml(p.jobTitle)}</div>` : ''}
          <div class="header-contact">
            ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.location)}</span>` : ''}
            ${p.website ? `<a href="${escapeHtml(p.website)}" target="_blank"><i class="fa-solid fa-globe"></i> ${escapeHtml(p.website.replace(/^https?:\/\//, ''))}</a>` : ''}
            ${p.linkedin ? `<span><i class="fa-brands fa-linkedin"></i> ${escapeHtml(p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, ''))}</span>` : ''}
            ${p.github ? `<span><i class="fa-brands fa-github"></i> ${escapeHtml(p.github.replace(/^https?:\/\/(www\.)?github\.com\//, ''))}</span>` : ''}
          </div>
        </div>
        ${p.photoUrl ? `<img src="${escapeHtml(p.photoUrl)}" class="header-avatar" alt="Avatar">` : ''}
      </div>

      ${data.summary ? `
        <div class="resume-section">
          <div class="section-heading"><i class="fa-solid fa-user-tie"></i> Summary</div>
          <div class="summary-text">${escapeHtml(data.summary)}</div>
        </div>
      ` : ''}

      ${data.experience && data.experience.length ? `
        <div class="resume-section">
          <div class="section-heading"><i class="fa-solid fa-briefcase"></i> Experience</div>
          ${data.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="item-role">${escapeHtml(exp.role || '')}</span>
                  ${exp.company ? `<span class="item-company">• ${escapeHtml(exp.company)}</span>` : ''}
                  ${exp.location ? `<span style="font-size:0.8rem; color:var(--resume-text-muted);">(${escapeHtml(exp.location)})</span>` : ''}
                </div>
                <span class="item-date">${escapeHtml(exp.startDate || '')}${exp.endDate ? ` — ${escapeHtml(exp.endDate)}` : ''}</span>
              </div>
              ${renderBullets(exp.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills && data.skills.length ? `
        <div class="resume-section">
          <div class="section-heading"><i class="fa-solid fa-code"></i> Skills</div>
          <div class="skills-wrapper">
            ${data.skills.map(s => `
              <div class="skill-group">
                <span class="skill-group-name">${escapeHtml(s.category || 'Skills')}:</span>
                <div class="skill-pills">
                  ${(s.items || '').split(',').map(item => item.trim()).filter(Boolean).map(pill => `
                    <span class="skill-pill">${escapeHtml(pill)}</span>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${data.projects && data.projects.length ? `
        <div class="resume-section">
          <div class="section-heading"><i class="fa-solid fa-laptop-code"></i> Projects</div>
          ${data.projects.map(proj => `
            <div class="project-item">
              <div class="project-top">
                <span class="project-title">${escapeHtml(proj.title || '')}</span>
                ${proj.link ? `<a class="project-link" href="${escapeHtml(proj.link)}" target="_blank">${escapeHtml(proj.link)}</a>` : ''}
              </div>
              ${proj.tech ? `<div class="project-tech">Tech: ${escapeHtml(proj.tech)}</div>` : ''}
              ${renderBullets(proj.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.education && data.education.length ? `
        <div class="resume-section">
          <div class="section-heading"><i class="fa-solid fa-graduation-cap"></i> Education</div>
          ${data.education.map(edu => `
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="item-role">${escapeHtml(edu.degree || '')}</span>
                  ${edu.school ? `<span class="item-company">• ${escapeHtml(edu.school)}</span>` : ''}
                </div>
                <span class="item-date">${escapeHtml(edu.startDate || '')}${edu.endDate ? ` — ${escapeHtml(edu.endDate)}` : ''}</span>
              </div>
              ${edu.details ? `<div style="font-size:0.82rem; color:var(--resume-text-muted); margin-top:2px;">${escapeHtml(edu.details)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certifications && data.certifications.length ? `
        <div class="resume-section">
          <div class="section-heading"><i class="fa-solid fa-award"></i> Certifications</div>
          ${data.certifications.map(c => `
            <div style="margin-bottom: 6px; display: flex; justify-content: space-between; font-size: 0.86rem;">
              <span><strong>${escapeHtml(c.name)}</strong>${c.issuer ? ` — ${escapeHtml(c.issuer)}` : ''}</span>
              ${c.date ? `<span style="color:var(--resume-text-muted);">${escapeHtml(c.date)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.custom && data.custom.enabled && data.custom.content ? `
        <div class="resume-section">
          <div class="section-heading"><i class="fa-solid fa-puzzle-piece"></i> ${escapeHtml(data.custom.title || 'Additional Info')}</div>
          ${renderBullets(data.custom.content)}
        </div>
      ` : ''}
    `;
  }

  // Template 2: Executive Pro
  function buildExecutiveHTML(data) {
    const p = data.personal || {};
    return `
      <div class="resume-header">
        <div class="header-left">
          <h1>${escapeHtml(p.fullName || 'Your Name')}</h1>
          ${p.jobTitle ? `<div class="header-title-badge">${escapeHtml(p.jobTitle)}</div>` : ''}
          <div class="header-contact">
            ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.location)}</span>` : ''}
            ${p.linkedin ? `<span><i class="fa-brands fa-linkedin"></i> ${escapeHtml(p.linkedin)}</span>` : ''}
            ${p.website ? `<span><i class="fa-solid fa-globe"></i> ${escapeHtml(p.website)}</span>` : ''}
          </div>
        </div>
      </div>

      ${data.summary ? `
        <div class="resume-section">
          <div class="section-heading">Executive Summary <span class="accent-bar"></span></div>
          <div class="summary-text">${escapeHtml(data.summary)}</div>
        </div>
      ` : ''}

      ${data.experience && data.experience.length ? `
        <div class="resume-section">
          <div class="section-heading">Professional Experience <span class="accent-bar"></span></div>
          ${data.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="item-role">${escapeHtml(exp.role || '')}</span>
                  ${exp.company ? `<span class="item-company"> | ${escapeHtml(exp.company)}</span>` : ''}
                </div>
                <span class="item-date">${escapeHtml(exp.startDate || '')}${exp.endDate ? ` — ${escapeHtml(exp.endDate)}` : ''}</span>
              </div>
              ${renderBullets(exp.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.education && data.education.length ? `
        <div class="resume-section">
          <div class="section-heading">Education <span class="accent-bar"></span></div>
          ${data.education.map(edu => `
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="item-role">${escapeHtml(edu.degree || '')}</span>
                  ${edu.school ? `<span class="item-company"> | ${escapeHtml(edu.school)}</span>` : ''}
                </div>
                <span class="item-date">${escapeHtml(edu.startDate || '')}${edu.endDate ? ` — ${escapeHtml(edu.endDate)}` : ''}</span>
              </div>
              ${edu.details ? `<div style="font-size:0.84rem; color:var(--resume-text-muted);">${escapeHtml(edu.details)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills && data.skills.length ? `
        <div class="resume-section">
          <div class="section-heading">Core Competencies & Skills <span class="accent-bar"></span></div>
          ${data.skills.map(s => `
            <div class="skill-group">
              <span class="skill-group-name">${escapeHtml(s.category)}: </span>
              <span>${escapeHtml(s.items)}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.projects && data.projects.length ? `
        <div class="resume-section">
          <div class="section-heading">Selected Strategic Projects <span class="accent-bar"></span></div>
          ${data.projects.map(proj => `
            <div class="timeline-item">
              <div class="timeline-header">
                <span class="item-role">${escapeHtml(proj.title)}</span>
                ${proj.link ? `<span style="font-size:0.8rem; color:var(--resume-accent);">${escapeHtml(proj.link)}</span>` : ''}
              </div>
              ${renderBullets(proj.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certifications && data.certifications.length ? `
        <div class="resume-section">
          <div class="section-heading">Certifications & Credentials <span class="accent-bar"></span></div>
          ${data.certifications.map(c => `
            <div style="margin-bottom: 5px; font-size: 0.86rem;">
              <strong>${escapeHtml(c.name)}</strong> — ${escapeHtml(c.issuer)} (${escapeHtml(c.date)})
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.custom && data.custom.enabled && data.custom.content ? `
        <div class="resume-section">
          <div class="section-heading">${escapeHtml(data.custom.title || 'Additional Information')} <span class="accent-bar"></span></div>
          ${renderBullets(data.custom.content)}
        </div>
      ` : ''}
    `;
  }

  // Template 3: Minimalist ATS
  function buildMinimalHTML(data) {
    const p = data.personal || {};
    return `
      <div class="resume-header">
        <div class="header-left">
          <h1>${escapeHtml(p.fullName || 'Your Name')}</h1>
          ${p.jobTitle ? `<div class="header-title-badge">${escapeHtml(p.jobTitle)}</div>` : ''}
          <div class="header-contact">
            ${p.email ? `<span>${escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span>${escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span>${escapeHtml(p.location)}</span>` : ''}
            ${p.linkedin ? `<span>${escapeHtml(p.linkedin)}</span>` : ''}
            ${p.github ? `<span>${escapeHtml(p.github)}</span>` : ''}
          </div>
        </div>
      </div>

      ${data.summary ? `
        <div class="resume-section">
          <div class="section-heading">PROFESSIONAL SUMMARY</div>
          <div class="summary-text">${escapeHtml(data.summary)}</div>
        </div>
      ` : ''}

      ${data.experience && data.experience.length ? `
        <div class="resume-section">
          <div class="section-heading">WORK EXPERIENCE</div>
          ${data.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="item-role">${escapeHtml(exp.role || '')}</span> —
                  <span class="item-company">${escapeHtml(exp.company || '')}</span>
                </div>
                <span class="item-date">${escapeHtml(exp.startDate || '')}${exp.endDate ? ` - ${escapeHtml(exp.endDate)}` : ''}</span>
              </div>
              ${renderBullets(exp.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.education && data.education.length ? `
        <div class="resume-section">
          <div class="section-heading">EDUCATION</div>
          ${data.education.map(edu => `
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="item-role">${escapeHtml(edu.degree || '')}</span>,
                  <span class="item-company">${escapeHtml(edu.school || '')}</span>
                </div>
                <span class="item-date">${escapeHtml(edu.startDate || '')}${edu.endDate ? ` - ${escapeHtml(edu.endDate)}` : ''}</span>
              </div>
              ${edu.details ? `<div style="font-size:0.82rem; color:var(--resume-text-muted);">${escapeHtml(edu.details)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.skills && data.skills.length ? `
        <div class="resume-section">
          <div class="section-heading">SKILLS & TECHNOLOGIES</div>
          ${data.skills.map(s => `
            <div class="skill-group">
              <span class="skill-group-name">${escapeHtml(s.category)}: </span>
              <span>${escapeHtml(s.items)}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.projects && data.projects.length ? `
        <div class="resume-section">
          <div class="section-heading">PROJECTS</div>
          ${data.projects.map(proj => `
            <div class="timeline-item">
              <div class="timeline-header">
                <span class="item-role">${escapeHtml(proj.title)}</span>
                ${proj.link ? `<span style="font-size:0.8rem;">${escapeHtml(proj.link)}</span>` : ''}
              </div>
              ${proj.tech ? `<div style="font-size:0.8rem; font-style:italic;">Technologies: ${escapeHtml(proj.tech)}</div>` : ''}
              ${renderBullets(proj.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.certifications && data.certifications.length ? `
        <div class="resume-section">
          <div class="section-heading">CERTIFICATIONS</div>
          ${data.certifications.map(c => `
            <div style="font-size: 0.84rem; margin-bottom: 4px;">
              • ${escapeHtml(c.name)} (${escapeHtml(c.issuer)}, ${escapeHtml(c.date)})
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${data.custom && data.custom.enabled && data.custom.content ? `
        <div class="resume-section">
          <div class="section-heading">${escapeHtml((data.custom.title || 'ADDITIONAL').toUpperCase())}</div>
          ${renderBullets(data.custom.content)}
        </div>
      ` : ''}
    `;
  }

  // Template 4: Creative Sidebar (2-column layout)
  function buildSidebarHTML(data) {
    const p = data.personal || {};
    return `
      <aside class="sidebar-col">
        ${p.photoUrl ? `<img src="${escapeHtml(p.photoUrl)}" class="sidebar-avatar" alt="Avatar">` : ''}
        <h1 class="sidebar-name">${escapeHtml(p.fullName || 'Your Name')}</h1>
        ${p.jobTitle ? `<div class="sidebar-title">${escapeHtml(p.jobTitle)}</div>` : ''}

        <div>
          <div class="sidebar-section-title">Contact</div>
          <div class="sidebar-contact-list">
            ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.location)}</span>` : ''}
            ${p.website ? `<span><i class="fa-solid fa-globe"></i> ${escapeHtml(p.website.replace(/^https?:\/\//, ''))}</span>` : ''}
            ${p.linkedin ? `<span><i class="fa-brands fa-linkedin"></i> ${escapeHtml(p.linkedin)}</span>` : ''}
            ${p.github ? `<span><i class="fa-brands fa-github"></i> ${escapeHtml(p.github)}</span>` : ''}
          </div>
        </div>

        ${data.education && data.education.length ? `
          <div>
            <div class="sidebar-section-title">Education</div>
            ${data.education.map(edu => `
              <div style="margin-bottom: 10px; font-size: 0.8rem;">
                <div style="font-weight: 700;">${escapeHtml(edu.degree)}</div>
                <div style="color: var(--resume-accent); font-weight: 600;">${escapeHtml(edu.school)}</div>
                <div style="color: var(--resume-text-muted); font-size: 0.75rem;">${escapeHtml(edu.startDate)} - ${escapeHtml(edu.endDate)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.skills && data.skills.length ? `
          <div>
            <div class="sidebar-section-title">Skills</div>
            ${data.skills.map(s => `
              <div style="margin-bottom: 8px;">
                <div style="font-weight: 700; font-size: 0.8rem; margin-bottom: 2px;">${escapeHtml(s.category)}</div>
                <div style="font-size: 0.78rem; line-height: 1.4;">${escapeHtml(s.items)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.certifications && data.certifications.length ? `
          <div>
            <div class="sidebar-section-title">Certifications</div>
            ${data.certifications.map(c => `
              <div style="font-size: 0.78rem; margin-bottom: 5px;">
                <div style="font-weight: 600;">${escapeHtml(c.name)}</div>
                <div style="color: var(--resume-text-muted);">${escapeHtml(c.issuer)} (${escapeHtml(c.date)})</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </aside>

      <main class="main-col">
        ${data.summary ? `
          <div class="resume-section">
            <div class="section-heading">Profile Summary</div>
            <div class="summary-text">${escapeHtml(data.summary)}</div>
          </div>
        ` : ''}

        ${data.experience && data.experience.length ? `
          <div class="resume-section">
            <div class="section-heading">Work Experience</div>
            ${data.experience.map(exp => `
              <div class="timeline-item">
                <div class="timeline-header">
                  <div>
                    <span class="item-role">${escapeHtml(exp.role)}</span>
                    <span class="item-company"> @ ${escapeHtml(exp.company)}</span>
                  </div>
                  <span class="item-date">${escapeHtml(exp.startDate)} — ${escapeHtml(exp.endDate)}</span>
                </div>
                ${renderBullets(exp.bullets)}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.projects && data.projects.length ? `
          <div class="resume-section">
            <div class="section-heading">Featured Projects</div>
            ${data.projects.map(proj => `
              <div class="timeline-item">
                <div class="timeline-header">
                  <span class="item-role">${escapeHtml(proj.title)}</span>
                  ${proj.link ? `<span style="font-size:0.78rem; color:var(--resume-accent);">${escapeHtml(proj.link)}</span>` : ''}
                </div>
                ${proj.tech ? `<div style="font-size:0.78rem; font-style:italic; color:var(--resume-text-muted);">Stack: ${escapeHtml(proj.tech)}</div>` : ''}
                ${renderBullets(proj.bullets)}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${data.custom && data.custom.enabled && data.custom.content ? `
          <div class="resume-section">
            <div class="section-heading">${escapeHtml(data.custom.title || 'Additional Info')}</div>
            ${renderBullets(data.custom.content)}
          </div>
        ` : ''}
      </main>
    `;
  }

  // Template 5: Compact Grid (Space-efficient)
  function buildCompactHTML(data) {
    const p = data.personal || {};
    return `
      <div class="resume-header">
        <div class="header-left">
          <h1>${escapeHtml(p.fullName || 'Your Name')}</h1>
          ${p.jobTitle ? `<div class="header-title-badge">${escapeHtml(p.jobTitle)}</div>` : ''}
        </div>
        <div class="header-contact">
          ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${escapeHtml(p.email)}</span>` : ''}
          ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${escapeHtml(p.phone)}</span>` : ''}
          ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(p.location)}</span>` : ''}
          ${p.linkedin ? `<span><i class="fa-brands fa-linkedin"></i> ${escapeHtml(p.linkedin)}</span>` : ''}
          ${p.website ? `<span><i class="fa-solid fa-globe"></i> ${escapeHtml(p.website)}</span>` : ''}
          ${p.github ? `<span><i class="fa-brands fa-github"></i> ${escapeHtml(p.github)}</span>` : ''}
        </div>
      </div>

      ${data.summary ? `
        <div class="resume-section">
          <div class="section-heading">Summary</div>
          <div style="font-size: 0.82rem; line-height: 1.5;">${escapeHtml(data.summary)}</div>
        </div>
      ` : ''}

      ${data.experience && data.experience.length ? `
        <div class="resume-section">
          <div class="section-heading">Experience</div>
          ${data.experience.map(exp => `
            <div class="timeline-item">
              <div class="timeline-header">
                <div>
                  <span class="item-role">${escapeHtml(exp.role)}</span>
                  <span class="item-company"> — ${escapeHtml(exp.company)}</span>
                </div>
                <span class="item-date">${escapeHtml(exp.startDate)} - ${escapeHtml(exp.endDate)}</span>
              </div>
              ${renderBullets(exp.bullets)}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="compact-grid-2col">
        <div>
          ${data.education && data.education.length ? `
            <div class="resume-section">
              <div class="section-heading">Education</div>
              ${data.education.map(edu => `
                <div class="timeline-item">
                  <div class="timeline-header">
                    <span class="item-role">${escapeHtml(edu.degree)}</span>
                    <span class="item-date">${escapeHtml(edu.startDate)}-${escapeHtml(edu.endDate)}</span>
                  </div>
                  <div style="font-size:0.78rem; font-weight:600; color:var(--resume-accent);">${escapeHtml(edu.school)}</div>
                  ${edu.details ? `<div style="font-size:0.74rem; color:var(--resume-text-muted);">${escapeHtml(edu.details)}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${data.certifications && data.certifications.length ? `
            <div class="resume-section">
              <div class="section-heading">Certifications</div>
              ${data.certifications.map(c => `
                <div style="font-size:0.78rem; margin-bottom:4px;">
                  <strong>${escapeHtml(c.name)}</strong> (${escapeHtml(c.issuer)})
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div>
          ${data.skills && data.skills.length ? `
            <div class="resume-section">
              <div class="section-heading">Skills</div>
              ${data.skills.map(s => `
                <div style="font-size:0.78rem; margin-bottom:4px;">
                  <strong>${escapeHtml(s.category)}:</strong> ${escapeHtml(s.items)}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${data.projects && data.projects.length ? `
            <div class="resume-section">
              <div class="section-heading">Projects</div>
              ${data.projects.map(proj => `
                <div style="margin-bottom:6px;">
                  <div style="font-weight:700; font-size:0.82rem;">${escapeHtml(proj.title)}</div>
                  <div style="font-size:0.74rem; color:var(--resume-text-muted);">${escapeHtml(proj.tech)}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>

      ${data.custom && data.custom.enabled && data.custom.content ? `
        <div class="resume-section">
          <div class="section-heading">${escapeHtml(data.custom.title || 'Additional Info')}</div>
          ${renderBullets(data.custom.content)}
        </div>
      ` : ''}
    `;
  }

  // Master Render Function
  function renderResumePreview() {
    const root = document.getElementById('resume-content');
    if (!root) return;

    // Apply active template class
    root.className = `resume-content-root template-${customization.template}`;

    // Apply color, paper tone and font styles
    applyCustomizationVariables();

    let html = '';
    switch (customization.template) {
      case 'executive':
        html = buildExecutiveHTML(resumeData);
        break;
      case 'minimal':
        html = buildMinimalHTML(resumeData);
        break;
      case 'sidebar':
        html = buildSidebarHTML(resumeData);
        break;
      case 'compact':
        html = buildCompactHTML(resumeData);
        break;
      case 'neon-modern':
      default:
        html = buildNeonModernHTML(resumeData);
        break;
    }

    root.innerHTML = html;
    saveToLocalStorage();
  }

  // =========================================================================
  // Zoom Controls
  // =========================================================================
  function updateZoom(newZoom) {
    zoomLevel = Math.max(0.5, Math.min(1.5, Math.round(newZoom * 100) / 100));
    const viewport = document.getElementById('paper-viewport');
    const indicator = document.getElementById('zoom-indicator');
    if (viewport) {
      viewport.style.transform = `scale(${zoomLevel})`;
    }
    if (indicator) {
      indicator.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
  }

  // =========================================================================
  // Event Listeners & Binding
  // =========================================================================
  function setupEventListeners() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetSection = btn.dataset.section;
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        const targetTab = document.getElementById(`tab-${targetSection}`);
        if (targetTab) targetTab.classList.add('active');
      });
    });

    // Personal details input bindings
    const personalInputs = [
      'fullName', 'jobTitle', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'photoUrl'
    ];
    personalInputs.forEach(prop => {
      const el = document.getElementById(`p-${prop}`);
      if (el) {
        el.addEventListener('input', (e) => {
          resumeData.personal[prop] = e.target.value;
          renderResumePreview();
        });
      }
    });

    // Summary input binding
    const summaryEl = document.getElementById('p-summary');
    if (summaryEl) {
      summaryEl.addEventListener('input', (e) => {
        resumeData.summary = e.target.value;
        renderResumePreview();
      });
    }

    // Quick suggestions for summary
    document.querySelectorAll('.btn-suggestion').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        const targetId = btn.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl && text) {
          targetEl.value = text;
          resumeData.summary = text;
          renderResumePreview();
          showToast("Summary suggestion applied!");
        }
      });
    });

    // Custom section inputs
    const customEnabled = document.getElementById('custom-section-enabled');
    const customTitle = document.getElementById('custom-section-title');
    const customContent = document.getElementById('custom-section-content');
    if (customEnabled) {
      customEnabled.addEventListener('change', (e) => {
        resumeData.custom.enabled = e.target.checked;
        renderResumePreview();
      });
    }
    if (customTitle) {
      customTitle.addEventListener('input', (e) => {
        resumeData.custom.title = e.target.value;
        renderResumePreview();
      });
    }
    if (customContent) {
      customContent.addEventListener('input', (e) => {
        resumeData.custom.content = e.target.value;
        renderResumePreview();
      });
    }

    // Dynamic repeater: Experience
    document.getElementById('btn-add-experience').addEventListener('click', () => {
      resumeData.experience.unshift({
        id: generateId('exp'),
        role: "Software Engineer",
        company: "Company Name",
        location: "City, Country",
        startDate: "2023",
        endDate: "Present",
        bullets: "• Achieved measurable milestone..."
      });
      renderExperienceForm();
      renderResumePreview();
      showToast("New position added!");
    });

    document.getElementById('experience-items-container').addEventListener('input', (e) => {
      if (e.target.classList.contains('exp-field')) {
        const card = e.target.closest('.repeater-item-card');
        if (!card) return;
        const id = card.dataset.id;
        const prop = e.target.dataset.prop;
        const item = resumeData.experience.find(x => x.id === id);
        if (item) {
          item[prop] = e.target.value;
          renderResumePreview();
        }
      }
    });

    document.getElementById('experience-items-container').addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-action="delete-exp"]');
      if (delBtn) {
        const id = delBtn.dataset.id;
        resumeData.experience = resumeData.experience.filter(x => x.id !== id);
        renderExperienceForm();
        renderResumePreview();
        showToast("Position removed");
      }
    });

    // Dynamic repeater: Education
    document.getElementById('btn-add-education').addEventListener('click', () => {
      resumeData.education.unshift({
        id: generateId('edu'),
        degree: "B.S. in Computer Science",
        school: "University Name",
        startDate: "2019",
        endDate: "2023",
        details: "Relevant Coursework / Honors"
      });
      renderEducationForm();
      renderResumePreview();
      showToast("Education degree added!");
    });

    document.getElementById('education-items-container').addEventListener('input', (e) => {
      if (e.target.classList.contains('edu-field')) {
        const card = e.target.closest('.repeater-item-card');
        if (!card) return;
        const id = card.dataset.id;
        const prop = e.target.dataset.prop;
        const item = resumeData.education.find(x => x.id === id);
        if (item) {
          item[prop] = e.target.value;
          renderResumePreview();
        }
      }
    });

    document.getElementById('education-items-container').addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-action="delete-edu"]');
      if (delBtn) {
        const id = delBtn.dataset.id;
        resumeData.education = resumeData.education.filter(x => x.id !== id);
        renderEducationForm();
        renderResumePreview();
        showToast("Education entry removed");
      }
    });

    // Dynamic repeater: Skills
    document.getElementById('btn-add-skill-group').addEventListener('click', () => {
      resumeData.skills.push({
        id: generateId('skill'),
        category: "New Skill Category",
        items: "Skill 1, Skill 2, Skill 3"
      });
      renderSkillsForm();
      renderResumePreview();
      showToast("Skill category added!");
    });

    document.getElementById('skills-items-container').addEventListener('input', (e) => {
      if (e.target.classList.contains('skill-field')) {
        const card = e.target.closest('.repeater-item-card');
        if (!card) return;
        const id = card.dataset.id;
        const prop = e.target.dataset.prop;
        const item = resumeData.skills.find(x => x.id === id);
        if (item) {
          item[prop] = e.target.value;
          renderResumePreview();
        }
      }
    });

    document.getElementById('skills-items-container').addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-action="delete-skill"]');
      if (delBtn) {
        const id = delBtn.dataset.id;
        resumeData.skills = resumeData.skills.filter(x => x.id !== id);
        renderSkillsForm();
        renderResumePreview();
        showToast("Skill category removed");
      }
    });

    // Dynamic repeater: Projects
    document.getElementById('btn-add-project').addEventListener('click', () => {
      resumeData.projects.unshift({
        id: generateId('proj'),
        title: "New Project",
        tech: "React, Node.js",
        link: "github.com/username/project",
        bullets: "• Implemented feature..."
      });
      renderProjectsForm();
      renderResumePreview();
      showToast("Project added!");
    });

    document.getElementById('projects-items-container').addEventListener('input', (e) => {
      if (e.target.classList.contains('proj-field')) {
        const card = e.target.closest('.repeater-item-card');
        if (!card) return;
        const id = card.dataset.id;
        const prop = e.target.dataset.prop;
        const item = resumeData.projects.find(x => x.id === id);
        if (item) {
          item[prop] = e.target.value;
          renderResumePreview();
        }
      }
    });

    document.getElementById('projects-items-container').addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-action="delete-proj"]');
      if (delBtn) {
        const id = delBtn.dataset.id;
        resumeData.projects = resumeData.projects.filter(x => x.id !== id);
        renderProjectsForm();
        renderResumePreview();
        showToast("Project removed");
      }
    });

    // Dynamic repeater: Certifications
    document.getElementById('btn-add-certification').addEventListener('click', () => {
      resumeData.certifications.push({
        id: generateId('cert'),
        name: "Certificate Name",
        issuer: "Issuing Organization",
        date: "2024",
        url: ""
      });
      renderCertificationsForm();
      renderResumePreview();
      showToast("Certification added!");
    });

    document.getElementById('certifications-items-container').addEventListener('input', (e) => {
      if (e.target.classList.contains('cert-field')) {
        const card = e.target.closest('.repeater-item-card');
        if (!card) return;
        const id = card.dataset.id;
        const prop = e.target.dataset.prop;
        const item = resumeData.certifications.find(x => x.id === id);
        if (item) {
          item[prop] = e.target.value;
          renderResumePreview();
        }
      }
    });

    document.getElementById('certifications-items-container').addEventListener('click', (e) => {
      const delBtn = e.target.closest('[data-action="delete-cert"]');
      if (delBtn) {
        const id = delBtn.dataset.id;
        resumeData.certifications = resumeData.certifications.filter(x => x.id !== id);
        renderCertificationsForm();
        renderResumePreview();
        showToast("Certification removed");
      }
    });

    // Customization: Templates
    document.querySelectorAll('.template-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.template-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        customization.template = pill.dataset.template;
        renderResumePreview();
        showToast(`Template changed to ${pill.textContent.trim()}`);
      });
    });

    // Customization: Accent Color presets
    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        const color = swatch.dataset.color;
        customization.accentColor = color;

        const picker = document.getElementById('accent-color-picker');
        const hexTag = document.getElementById('accent-color-hex');
        if (picker) picker.value = color;
        if (hexTag) hexTag.textContent = color.toUpperCase();

        renderResumePreview();
        showToast(`Accent color updated to ${color}`);
      });
    });

    // Customization: Custom Hex Color Picker
    const colorPicker = document.getElementById('accent-color-picker');
    const colorHexTag = document.getElementById('accent-color-hex');
    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        customization.accentColor = color;
        if (colorHexTag) colorHexTag.textContent = color.toUpperCase();

        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        renderResumePreview();
      });
    }

    // Customization: Font family
    const fontSelect = document.getElementById('font-family-select');
    if (fontSelect) {
      fontSelect.addEventListener('change', (e) => {
        customization.fontFamily = e.target.value;
        renderResumePreview();
        showToast("Typography font family updated");
      });
    }

    // Customization: Font size
    const fontSizeSelect = document.getElementById('font-size-select');
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', (e) => {
        customization.fontSize = e.target.value;
        renderResumePreview();
      });
    }

    // Customization: Section Spacing
    const spacingSelect = document.getElementById('spacing-select');
    if (spacingSelect) {
      spacingSelect.addEventListener('change', (e) => {
        customization.spacing = e.target.value;
        renderResumePreview();
      });
    }

    // Customization: Paper Tone
    document.querySelectorAll('.paper-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.paper-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        customization.paperTone = swatch.dataset.paper;
        renderResumePreview();
        showToast(`Paper tone updated`);
      });
    });

    // Zoom buttons
    document.getElementById('btn-zoom-in').addEventListener('click', () => updateZoom(zoomLevel + 0.1));
    document.getElementById('btn-zoom-out').addEventListener('click', () => updateZoom(zoomLevel - 0.1));
    document.getElementById('btn-zoom-reset').addEventListener('click', () => updateZoom(1.0));

    // Load Sample Data
    document.getElementById('btn-load-sample').addEventListener('click', () => {
      resumeData = JSON.parse(JSON.stringify(sampleData));
      renderAllForms();
      renderResumePreview();
      showToast("Sample resume loaded successfully!");
    });

    // Reset Form
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all resume fields?")) {
        resumeData = JSON.parse(JSON.stringify(blankData));
        renderAllForms();
        renderResumePreview();
        showToast("All fields cleared");
      }
    });

    // Browser Print
    document.getElementById('btn-print').addEventListener('click', () => {
      window.print();
    });

    // High Resolution PDF Download via html2pdf.js
    document.getElementById('btn-download-pdf').addEventListener('click', generatePDF);
  }

  // Sync customization UI controls with state
  function syncCustomizationUI() {
    // Template
    document.querySelectorAll('.template-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.template === customization.template);
    });
    // Accent Color
    const colorPicker = document.getElementById('accent-color-picker');
    const colorHexTag = document.getElementById('accent-color-hex');
    if (colorPicker) colorPicker.value = customization.accentColor;
    if (colorHexTag) colorHexTag.textContent = customization.accentColor.toUpperCase();
    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color.toLowerCase() === customization.accentColor.toLowerCase());
    });
    // Font
    const fontSelect = document.getElementById('font-family-select');
    if (fontSelect) fontSelect.value = customization.fontFamily;
    const fontSizeSelect = document.getElementById('font-size-select');
    if (fontSizeSelect) fontSizeSelect.value = customization.fontSize;
    const spacingSelect = document.getElementById('spacing-select');
    if (spacingSelect) spacingSelect.value = customization.spacing;
    // Paper
    document.querySelectorAll('.paper-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.paper === customization.paperTone);
    });
  }

  // =========================================================================
  // PDF Generation Engine
  // =========================================================================
  function generatePDF() {
    const sheet = document.getElementById('resume-sheet');
    const viewport = document.getElementById('paper-viewport');
    if (!sheet) return;

    showToast("Generating high-resolution PDF...");

    // Store original zoom and temporarily reset viewport scaling for crisp canvas capture
    const originalTransform = viewport.style.transform;
    viewport.style.transform = 'none';

    const personName = (resumeData.personal.fullName || 'Resume').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${personName}_Resume.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(opt).from(sheet).save()
        .then(() => {
          viewport.style.transform = originalTransform;
          showToast("PDF downloaded successfully!");
        })
        .catch((err) => {
          viewport.style.transform = originalTransform;
          console.error("PDF generation failed:", err);
          showToast("Export failed, opening print dialog instead...", true);
          window.print();
        });
    } else {
      viewport.style.transform = originalTransform;
      showToast("PDF library unavailable, launching print dialog...", true);
      window.print();
    }
  }

  // =========================================================================
  // Initialization
  // =========================================================================
  function init() {
    loadFromLocalStorage();
    syncCustomizationUI();
    renderAllForms();
    renderResumePreview();
    setupEventListeners();
  }

  // Start when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
