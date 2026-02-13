import './DeveloperPage.css';
import HariImage from '../assets/Hari.jpg';
import SurajImage from '../assets/Suraj.jpg';

const DeveloperPage = () => {
    return (
        <div className="developer-page">
            {/* Hero Section */}
            <section className="page-hero">
                <div className="container">
                    <h1 className="page-title">Meet Our Developers</h1>
                    <p className="page-subtitle">The talented team behind Shahraj Exporter platform</p>
                </div>
            </section>

            {/* Developers Section */}
            <section className="developers-section">
                <div className="container">
                    <div className="developers-grid">
                        {/* Developer 1 - Harikumar Patel */}
                        <div className="developer-card">
                            <div className="developer-photo">
                                <img src={HariImage} alt="Harikumar Patel" />
                            </div>
                            <div className="developer-info">
                                <h2 className="developer-name">Harikumar Patel</h2>
                                <h3 className="developer-role">Full Stack Developer</h3>
                                <p className="developer-email">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v.5L8 8 2 3.5V3zm0 1.5l6 4.5 6-4.5V12a1 1 0 01-1 1H3a1 1 0 01-1-1V4.5z" />
                                    </svg>
                                    harikumarpatel14@gmail.com
                                </p>

                                <div className="developer-section">
                                    <h4>Education</h4>
                                    <div className="education-item">
                                        <strong>Conestoga College</strong>
                                        <p>Cloud Data Management, 3.2/4.0</p>
                                        <p className="minor-text">Major in Microsoft SharePoint, Project Management, UI/UX, and SQL Database</p>
                                        <p className="date-text">May 2023 - August 2024</p>
                                    </div>
                                    <div className="education-item">
                                        <strong>Uka Tarsadia University</strong>
                                        <p>Master of Computer Application, 8.2/10.0</p>
                                        <p className="minor-text">Major in IoT, Flutter mobile application, ASP.NET, Advanced RDBMS, and Game Development</p>
                                        <p className="date-text">August 2019 - August 2021</p>
                                    </div>
                                    <div className="education-item">
                                        <strong>Uka Tarsadia University</strong>
                                        <p>Bachelor of Computer Application, 9.2/10.0</p>
                                        <p className="minor-text">Major in Database Design and Implementation, ASP.NET Core, Programming in Java and UNIX</p>
                                        <p className="date-text">August 2015 - May 2018</p>
                                    </div>
                                </div>

                                <div className="developer-section">
                                    <h4>Skills</h4>
                                    <div className="skills-grid">
                                        <div className="skill-category">
                                            <strong>Programming:</strong>
                                            <p>C#, Java, JavaScript, Python, C++</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Frameworks:</strong>
                                            <p>.NET, .NET Core, React, Angular, Flutter</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Database:</strong>
                                            <p>SQL Server, MySQL, Microsoft Azure SQL</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Cloud Platforms:</strong>
                                            <p>Microsoft Azure, AWS Cloud</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>DevOps:</strong>
                                            <p>Azure DevOps, Git, Jenkins, Docker</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Methodologies:</strong>
                                            <p>Scrum, Kanban, Agile Development</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="developer-section">
                                    <h4>Work Experience</h4>
                                    <div className="work-item">
                                        <strong>Unistar Softech Private Limited</strong>
                                        <p className="job-title">Web Developer</p>
                                        <p className="date-text">July 2021 - April 2023 • Bardoli, Gujarat</p>
                                        <ul>
                                            <li>Created and managed web applications using C# .NET, Entity Framework, and SQL Server</li>
                                            <li>Built responsive user interfaces with JavaScript frameworks (React/Angular)</li>
                                            <li>Increased productivity by 20% through agile development processes</li>
                                            <li>Reduced development time by 20% using industry-standard design patterns</li>
                                        </ul>
                                    </div>
                                    <div className="work-item">
                                        <strong>Initial Infotech</strong>
                                        <p className="job-title">Software Engineer</p>
                                        <p className="date-text">May 2018 - June 2019 • Bardoli, Gujarat</p>
                                        <ul>
                                            <li>Built data-driven applications using C# .NET, Entity Framework, and SQL Server</li>
                                            <li>Achieved 95% client specification compliance through thorough requirement analysis</li>
                                            <li>Improved UI/UX resulting in 25% increase in user engagement</li>
                                            <li>Enhanced development efficiency by 25% through adoption of Flutter SDK</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="developer-section">
                                    <h4>Key Projects</h4>
                                    <div className="project-item">
                                        <strong>Cross-Platform E-commerce Mobile Application</strong>
                                        <p className="project-role">Lead Developer</p>
                                        <ul>
                                            <li>Led team developing scalable platform with Flutter, ASP.NET Web API, and SQL Server</li>
                                            <li>Served over 5,000 users with 95% client satisfaction rate</li>
                                            <li>Improved loading times by 30% through performance optimization</li>
                                        </ul>
                                    </div>
                                    <div className="project-item">
                                        <strong>IoT-Based Presence Management System</strong>
                                        <p className="project-role">Senior Developer</p>
                                        <ul>
                                            <li>Developed real-time faculty availability management system</li>
                                            <li>Reduced scheduling conflicts by 50% and increased faculty utilization by 45%</li>
                                            <li>Integrated 20+ IoT sensors with Flutter mobile app for 200+ faculty members</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="developer-section">
                                    <h4>Core Competencies</h4>
                                    <div className="competencies-grid">
                                        <div className="competency-item">
                                            <span className="competency-icon">💻</span>
                                            <strong>Full Stack Development</strong>
                                            <p>End-to-end application development</p>
                                        </div>
                                        <div className="competency-item">
                                            <span className="competency-icon">☁️</span>
                                            <strong>Cloud Architecture</strong>
                                            <p>Azure & AWS Solutions</p>
                                        </div>
                                        <div className="competency-item">
                                            <span className="competency-icon">📱</span>
                                            <strong>Mobile Development</strong>
                                            <p>Cross-Platform Applications</p>
                                        </div>
                                        <div className="competency-item">
                                            <span className="competency-icon">🔄</span>
                                            <strong>DevOps & CI/CD</strong>
                                            <p>Automated Deployment Pipelines</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Developer 2 - Suraj */}
                        <div className="developer-card">
                            <div className="developer-photo">
                                <img src={SurajImage} alt="Suraj Rajput" />
                            </div>
                            <div className="developer-info">
                                <h2 className="developer-name">Suraj Rajput</h2>
                                <h3 className="developer-role">Software Tester & Designer</h3>

                                <div className="developer-section">
                                    <h4>Education</h4>
                                    <div className="education-item">
                                        <strong>Uka Tarsadia University</strong>
                                        <p>Master of Computer Application, 6.77 CGPA</p>
                                        <p className="minor-text">Major in Database and Software Testing</p>
                                        <p className="date-text">December 2020</p>
                                    </div>
                                    <div className="education-item">
                                        <strong>Uka Tarsadia University</strong>
                                        <p>Bachelor of Computer Application (Hons), 6.67 CGPA</p>
                                        <p className="minor-text">Major in Database and VB.NET</p>
                                        <p className="date-text">July 2018</p>
                                    </div>
                                </div>

                                <div className="developer-section">
                                    <h4>Technical Skills</h4>
                                    <div className="skills-grid">
                                        <div className="skill-category">
                                            <strong>Operating Systems:</strong>
                                            <p>Windows, Ubuntu</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Languages:</strong>
                                            <p>C++, C#, JavaScript, Java, ASP.NET</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Web Technologies:</strong>
                                            <p>CSS, HTML, JavaScript</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Specializations:</strong>
                                            <p>Android Development, Software Testing</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Database:</strong>
                                            <p>Database Design and Development</p>
                                        </div>
                                        <div className="skill-category">
                                            <strong>Tools:</strong>
                                            <p>MS Office Suite</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="developer-section">
                                    <h4>Professional Strengths</h4>
                                    <ul className="strengths-list">
                                        <li>Advanced programming and problem-solving capabilities</li>
                                        <li>Excellent multi-tasking with strong deadline management</li>
                                        <li>Performs efficiently under pressure and stressful conditions</li>
                                        <li>Quick learner with enthusiasm for new technologies</li>
                                        <li>Optimistic and flexible approach to challenges</li>
                                        <li>Outstanding communication and analytical skills</li>
                                        <li>Strong cooperative team player</li>
                                    </ul>
                                </div>

                                <div className="developer-section">
                                    <h4>Professional Experience</h4>
                                    <div className="work-item">
                                        <strong>Initial Infotech</strong>
                                        <p className="job-title">Software Developer</p>
                                        <p className="date-text">May 2020 - May 2024 • Bardoli, Gujarat</p>
                                        <ul>
                                            <li>Developed and designed robust software solutions</li>
                                            <li>Performed comprehensive functional and non-functional testing</li>
                                            <li>Enhanced software usability, stability, and reliability</li>
                                            <li>Ensured quality assurance throughout development lifecycle</li>
                                            <li>Collaborated with cross-functional teams for optimal results</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="developer-section">
                                    <h4>Core Competencies</h4>
                                    <div className="competencies-grid">
                                        <div className="competency-item">
                                            <span className="competency-icon">🧪</span>
                                            <strong>Software Testing</strong>
                                            <p>Functional & Non-functional Testing</p>
                                        </div>
                                        <div className="competency-item">
                                            <span className="competency-icon">🎨</span>
                                            <strong>UI/UX Design</strong>
                                            <p>User-Centric Design Solutions</p>
                                        </div>
                                        <div className="competency-item">
                                            <span className="competency-icon">📱</span>
                                            <strong>Mobile Development</strong>
                                            <p>Android Application Development</p>
                                        </div>
                                        <div className="competency-item">
                                            <span className="competency-icon">⚙️</span>
                                            <strong>Quality Assurance</strong>
                                            <p>Ensuring Software Reliability</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DeveloperPage;
