const { useState, useEffect } = React;

/* Single call to Feather Icons to improve performance */
const useFeatherIcons = () => {
  useEffect(() => {
    feather.replace();
  }, []);
};

/* New function to manage theme colors */
const getThemeColors = (isDarkMode) => {
  if (isDarkMode) {
    return {
      bgPrimary: 'bg-gray-900',
      bgSecondary: 'bg-gray-800',
      bgHover: 'hover:bg-gray-700',
      textPrimary: 'text-gray-200',
      textSecondary: 'text-gray-400',
      border: 'border-gray-700',
      accentBg: 'bg-indigo-600',
      accentHover: 'hover:bg-indigo-700',
      accentText: 'text-white',
      accentColor: 'indigo',
    };
  } else {
    return {
      bgPrimary: 'bg-white',
      bgSecondary: 'bg-gray-100',
      bgHover: 'hover:bg-gray-200',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-500',
      border: 'border-gray-200',
      accentBg: 'bg-red-600',
      accentHover: 'hover:bg-red-700',
      accentText: 'text-white',
      accentColor: 'red',
    };
  }
};

/* Sidebar Component */
function Sidebar({ isCollapsed, toggleSidebar, user, isMobile, activeView, setActiveView, onLogout, isDarkMode, toggleTheme }) {
  const theme = getThemeColors(isDarkMode);

  return (
    <div
      className={`
        ${theme.bgPrimary} ${theme.textPrimary} h-screen fixed top-0 left-0 md:relative flex flex-col transition-all duration-300 ease-in-out border-r ${theme.border} z-10
        ${isMobile && !isCollapsed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? "w-16 md:w-16" : "w-64 md:w-64"}
      `}
    >
      <div className={`p-4 flex items-center justify-end border-b ${theme.border}`}>
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-full ${theme.bgHover}`}
        >
          <i data-feather={isCollapsed ? "chevron-right" : "chevron-left"}></i>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav>
          <SidebarItem icon="home" text="Dashboard" viewName="dashboard" activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} isDarkMode={isDarkMode} />
          <SidebarItem icon="briefcase" text="Projects" viewName="projects" activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} isDarkMode={isDarkMode} />
          <SidebarItem icon="users" text="Team" viewName="team" activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} isDarkMode={isDarkMode} />
          <SidebarItem icon="settings" text="Settings" viewName="settings" activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} isDarkMode={isDarkMode} />
        </nav>
      </div>
      
      {user && (
        <div className={`p-4 border-t ${theme.border} flex items-center ${theme.bgHover} cursor-pointer`}>
          <div className={`w-10 h-10 rounded-full bg-${theme.accentColor}-500 flex items-center justify-center text-white font-bold cursor-pointer`}>
            {user.initials}
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className={`text-sm font-semibold ${theme.textPrimary} truncate`}>{user.name}</p>
              <p className={`text-xs ${theme.textSecondary} truncate`}>{user.email}</p>
            </div>
          )}
        </div>
      )}
      {!isCollapsed && (
        <div className={`p-4 border-t ${theme.border}`}>
          <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-red-400 hover:bg-gray-800 rounded-md">
            <i data-feather="log-out" className="mr-2"></i>
            Logout
          </button>
        </div>
      )}
      <div className={`p-4 border-t ${theme.border} flex justify-center`}>
        <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
          <i data-feather={isDarkMode ? 'sun' : 'moon'}></i>
        </button>
      </div>
    </div>
  );
}

/* SidebarItem Component */
function SidebarItem({ icon, text, viewName, activeView, setActiveView, isCollapsed, isDarkMode }) {
  const isActive = activeView === viewName;
  const theme = getThemeColors(isDarkMode);

  return (
    <div 
      onClick={() => setActiveView(viewName)}
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 
        ${isActive ? `${theme.accentBg} ${theme.accentText}` : `${theme.textSecondary} ${theme.bgHover}`}
      `}
    >
      <i data-feather={icon} className="w-5 h-5"></i>
      {!isCollapsed && <span className="ml-3">{text}</span>}
    </div>
  );
}

/* Topbar Component */
function Topbar({ toggleSidebar, isMobile, onNewProjectClick, isDarkMode }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New project assigned to you", time: "2 hours ago" },
    { id: 2, text: "Task deadline approaching", time: "5 hours ago" },
    { id: 3, text: "Team meeting at 3 PM", time: "1 day ago" }
  ]);
  const theme = getThemeColors(isDarkMode);

  return (
    <div className={`${theme.bgSecondary} border-b ${theme.border} p-4 flex items-center justify-between sticky top-0 z-20 shadow-lg`}>
      <div className="flex items-center">
        {isMobile && (
          <button onClick={toggleSidebar} className={`p-2 rounded-full ${theme.bgHover} ${theme.textPrimary} mr-2`}>
            <i data-feather="menu"></i>
          </button>
        )}
        <h1 className={`text-xl font-bold text-${theme.accentColor}-400`}>SynergySphere</h1>
      </div>
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <input type="text" placeholder="Search projects..." className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500 focus:border-transparent`}/>
          <i data-feather="search" className={`absolute left-3 top-2.5 ${theme.textSecondary}`}></i>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={onNewProjectClick} className={`${theme.accentBg} ${theme.accentHover} ${theme.accentText} px-4 py-2 rounded-lg flex items-center`}>
          <i data-feather="plus" className="mr-2 w-4 h-4"></i>
          <span className="hidden sm:block">New Project</span>
        </button>
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className={`p-2 rounded-full ${theme.bgHover} ${theme.textPrimary} relative`}>
            <i data-feather="bell"></i>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-72 ${theme.bgSecondary} rounded-lg shadow-lg border ${theme.border} z-30`}>
              <div className={`p-3 border-b ${theme.border}`}>
                <h3 className={`font-medium ${theme.textPrimary}`}>Notifications</h3>
              </div>
              <div className={`divide-y ${theme.border} max-h-80 overflow-y-auto`}>
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 ${theme.bgHover} cursor-pointer`}>
                    <p className={`text-sm ${theme.textPrimary}`}>{n.text}</p>
                    <p className={`text-xs ${theme.textSecondary} mt-1`}>{n.time}</p>
                  </div>
                ))}
              </div>
              <div className={`p-3 border-t ${theme.border} text-center`}>
                <button className={`text-sm text-${theme.accentColor}-400 hover:underline`}>View All</button>
              </div>
            </div>
          )}
        </div>
        <div className={`w-8 h-8 rounded-full bg-${theme.accentColor}-500 flex items-center justify-center text-white cursor-pointer`}>
          <i data-feather="user"></i>
        </div>
      </div>
    </div>
  );
}

/* ProjectCard Component now accepts onEdit and onDelete handlers */
function ProjectCard({ project, onClick, onEdit, onDelete, isDarkMode }) {
  const theme = getThemeColors(isDarkMode);

  return (
    <div className={`${theme.bgSecondary} ${theme.textPrimary} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer p-6 flex flex-col justify-between transform hover:-translate-y-0.5 hover:shadow-lg`}>
      <div onClick={onClick} className="flex-1 cursor-pointer">
        <h3 className={`text-xl font-semibold ${theme.textPrimary} mb-2`}>{project.title}</h3>
        <p className={`${theme.textSecondary} text-sm`}>Tasks: {project.taskCount}</p>
        <div className="mt-4 flex -space-x-2">
          {project.team.map((member, index) => (
            <div key={index} className={`w-8 h-8 rounded-full bg-${theme.accentColor}-700 flex items-center justify-center text-${theme.accentColor}-200 text-xs font-bold ring-2 ring-${theme.accentColor}-900`}>
              {member.initials}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <p className={`text-sm ${theme.textSecondary}`}>Progress: <span className="font-medium">{project.progress}%</span></p>
        <div className={`w-full bg-${theme.accentColor}-700 rounded-full h-2.5 mt-1`}>
          <div className={`${theme.accentBg} h-2.5 rounded-full`} style={{ width: `${project.progress}%` }}></div>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={() => onEdit(project)} className={`text-sm text-${theme.accentColor}-400 hover:text-${theme.accentColor}-300 transition-colors duration-200`}>
          Edit
        </button>
        <button onClick={() => onDelete(project.id)} className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200">
          Delete
        </button>
      </div>
    </div>
  );
}

/* ProjectsPage Component - a new "page" for the projects view */
function ProjectsPage({ projects, onSelectProject, onEditProject, onDeleteProject, isDarkMode }) {
  const theme = getThemeColors(isDarkMode);
  
  return (
    <div>
      <h2 className={`text-2xl font-bold mb-6 ${theme.textPrimary}`}>My Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <ProjectCard 
            key={p.id} 
            project={p} 
            onClick={() => onSelectProject(p)} 
            onEdit={onEditProject}
            onDelete={onDeleteProject}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}

/* New ProjectForm Component for CRUD operations */
function ProjectForm({ project, onSave, onCancel, isDarkMode }) {
  const [name, setName] = useState(project ? project.title : '');
  const [description, setDescription] = useState(project ? project.description : '');
  const [tags, setTags] = useState(project ? project.tags : '');
  const [projectManager, setProjectManager] = useState(project ? project.projectManager : '');
  const [deadline, setDeadline] = useState(project ? project.deadline : '');
  const [priority, setPriority] = useState(project ? project.priority : 'Low');
  const theme = getThemeColors(isDarkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      ...project,
      title: name,
      description,
      tags,
      projectManager,
      deadline,
      priority,
    };
    onSave(newProject);
  };

  return (
    <div className={`p-6 ${theme.bgPrimary} ${theme.textPrimary} min-h-screen`}>
      <div className="flex justify-between items-center mb-6">
        <div className={`${theme.textSecondary} text-sm`}>Projects &gt; New Project</div>
        <div className="space-x-4">
          <button type="button" onClick={onCancel} className={`px-4 py-2 ${theme.textSecondary} rounded-lg ${theme.bgHover} transition-colors duration-200`}>
            Discard
          </button>
          <button type="submit" onClick={handleSubmit} className={`px-4 py-2 ${theme.accentBg} ${theme.accentText} rounded-lg font-semibold ${theme.accentHover} transition-colors duration-200`}>
            Save
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={`${theme.bgSecondary} p-6 rounded-lg shadow-md space-y-4`}>
        <div>
          <label htmlFor="name" className={`block text-sm font-medium ${theme.textSecondary}`}>Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full mt-1 p-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500`}
            required
          />
        </div>
        
        <div>
          <label htmlFor="tags" className={`block text-sm font-medium ${theme.textSecondary}`}>Tags</label>
          <input
            type="text"
            id="tags"
            placeholder="Multi-selection dropdown (placeholder)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={`w-full mt-1 p-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500`}
          />
        </div>
        
        <div>
          <label htmlFor="projectManager" className={`block text-sm font-medium ${theme.textSecondary}`}>Project Manager</label>
          <input
            type="text"
            id="projectManager"
            placeholder="Single-selection dropdown (placeholder)"
            value={projectManager}
            onChange={(e) => setProjectManager(e.target.value)}
            className={`w-full mt-1 p-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500`}
          />
        </div>
        
        <div>
          <label htmlFor="deadline" className={`block text-sm font-medium ${theme.textSecondary}`}>Deadline</label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={`w-full mt-1 p-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textSecondary}`}>Priority</label>
          <div className="mt-2 flex items-center space-x-6">
            {['Low', 'Medium', 'High'].map(p => (
              <label key={p} className="inline-flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={priority === p}
                  onChange={(e) => setPriority(e.target.value)}
                  className={`form-radio text-${theme.accentColor}-500 ${theme.bgSecondary} ${theme.border}`}
                />
                <span className={`ml-2 ${theme.textPrimary}`}>{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="image" className={`block text-sm font-medium ${theme.textSecondary}`}>Image</label>
          <div className="mt-1 flex items-center">
            <button
              type="button"
              className={`px-4 py-2 ${theme.bgHover} ${theme.textPrimary} rounded-lg flex items-center hover:${theme.bgHover} transition-colors duration-200`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.5 13a.5.5 0 01.5-.5h2a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                <path d="M13.5 13a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5z" />
                <path fillRule="evenodd" d="M15 15a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v9a1 1 0 001 1h10zM5 3a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm5 1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Upload Image
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="description" className={`block text-sm font-medium ${theme.textSecondary}`}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full mt-1 p-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500`}
            rows="4"
          />
        </div>
      </form>
    </div>
  );
}

/* New ProjectDetailsPage Component */
function ProjectDetailsPage({ project, onGoBack, isDarkMode }) {
  useFeatherIcons();
  const theme = getThemeColors(isDarkMode);

  return (
    <div className={`p-6 ${theme.bgPrimary} ${theme.textPrimary} min-h-screen`}>
      <button onClick={onGoBack} className={`flex items-center text-${theme.accentColor}-400 hover:text-${theme.accentColor}-300 transition-colors duration-200 mb-6`}>
        <i data-feather="arrow-left" className="w-5 h-5 mr-2"></i>
        Back to Projects
      </button>

      <div className={`${theme.bgSecondary} p-8 rounded-lg shadow-md`}>
        <h2 className={`text-3xl font-bold mb-4 ${theme.textPrimary}`}>{project.title}</h2>
        <p className={`${theme.textSecondary} mb-6`}>Tasks: {project.taskCount} | Progress: {project.progress}%</p>
        
        {/* Project Team */}
        <div className="mb-6">
          <h3 className={`text-xl font-semibold ${theme.textPrimary} mb-3`}>Team Members</h3>
          <div className="flex -space-x-2">
            {project.team.map((member, index) => (
              <div key={index} className={`w-10 h-10 rounded-full bg-${theme.accentColor}-700 flex items-center justify-center text-${theme.accentColor}-200 font-bold text-sm`}>
                {member.initials}
              </div>
            ))}
          </div>
        </div>

        {/* Task List (Placeholder) */}
        <div className="mb-6">
          <h3 className={`text-xl font-semibold ${theme.textPrimary} mb-3`}>Tasks</h3>
          <div className="space-y-3">
            <div className={`${theme.bgHover} p-4 rounded-lg flex justify-between items-center`}>
              <span className={`${theme.textPrimary}`}>Implement authentication</span>
              <span className="text-sm bg-indigo-500 text-white px-2 py-1 rounded-full">In Progress</span>
            </div>
            <div className={`${theme.bgHover} p-4 rounded-lg flex justify-between items-center`}>
              <span className={`${theme.textPrimary}`}>Design dashboard UI</span>
              <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* New LoginScreen Component */
function LoginScreen({ onLoginSuccess, onNavigateToSignUp, onBypassLogin, isDarkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = getThemeColors(isDarkMode);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://your-backend-api.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgPrimary} flex items-center justify-center p-4`}>
      <div className={`${theme.bgSecondary} rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform hover:scale-105 transition-transform duration-300`}>
        <div className="p-8">
          <h2 className={`text-center text-3xl font-bold ${theme.textPrimary} mb-6`}>SynergySphere</h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${theme.textSecondary} absolute left-3 top-1/2 -translate-y-1/2`}>
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500 focus:border-transparent`}
                required
              />
            </div>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${theme.textSecondary} absolute left-3 top-1/2 -translate-y-1/2`}>
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.903-.756A4.981 4.981 0 0010 2z" />
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500 focus:border-transparent`}
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                className={`w-full ${theme.accentBg} ${theme.accentText} py-2 rounded-lg font-semibold ${theme.accentHover} transition duration-300 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className={`w-full ${theme.bgHover} ${theme.textPrimary} py-2 rounded-lg font-semibold transition duration-300 ease-in-out`}
              >
                Sign Up
              </button>
            </div>
            
            <div className="text-center mt-4">
              <a href="#" className={`text-sm text-${theme.accentColor}-400 hover:text-${theme.accentColor}-300 hover:underline`}>Forgot Password?</a>
            </div>
          </form>
          <div className="mt-6">
             <button
                onClick={onBypassLogin}
                className={`w-full text-center text-sm ${theme.textSecondary} hover:underline`}
              >
                Dev Bypass
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Placeholder for SignUpScreen */
function SignUpScreen({ onNavigateToLogin, isDarkMode }) {
  const theme = getThemeColors(isDarkMode);
  return (
    <div className={`min-h-screen ${theme.bgPrimary} flex items-center justify-center`}>
      <div className={`p-8 text-center ${theme.bgSecondary} ${theme.textPrimary} rounded-lg shadow-md`}>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <p>This is the sign-up page.</p>
        <button onClick={onNavigateToLogin} className={`mt-4 px-4 py-2 ${theme.accentBg} ${theme.accentText} rounded-lg ${theme.accentHover}`}>
          Go to Login
        </button>
      </div>
    </div>
  );
}

// New TeamPage component
function TeamPage({ isDarkMode }) {
  const [members, setMembers] = useState([
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
  ]);

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = getThemeColors(isDarkMode);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call to invite a member
      const response = await fetch('https://your-backend-api.com/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newMemberEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMembers([...members, data.newMember]);
        setNewMemberEmail('');
      } else {
        setError(data.message || 'Failed to add member.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 ${theme.bgPrimary} ${theme.textPrimary} min-h-screen`}>
      <h2 className={`text-2xl font-bold mb-6 ${theme.textPrimary}`}>Team Management</h2>

      {/* Add Member Form */}
      <div className={`mb-8 ${theme.bgSecondary} p-6 rounded-lg shadow-md`}>
        <h3 className={`text-xl font-semibold mb-4 ${theme.textPrimary}`}>Invite New Member</h3>
        <form className="space-y-4" onSubmit={handleAddMember}>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter member's email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className={`w-full pl-4 pr-4 py-2 rounded-lg ${theme.bgHover} ${theme.textPrimary} border ${theme.border} focus:outline-none focus:ring-2 focus:ring-${theme.accentColor}-500 focus:border-transparent`}
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className={`w-full ${theme.accentBg} ${theme.accentText} py-2 rounded-lg font-semibold ${theme.accentHover} transition duration-300 ease-in-out disabled:opacity-50`}
            disabled={loading}
          >
            {loading ? 'Inviting...' : 'Invite Member'}
          </button>
        </form>
      </div>

      {/* Current Team Members List */}
      <div className={`${theme.bgSecondary} p-6 rounded-lg shadow-md`}>
        <h3 className={`text-xl font-semibold mb-4 ${theme.textPrimary}`}>Current Members</h3>
        <div className={`divide-y ${theme.border}`}>
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full bg-${theme.accentColor}-700 flex items-center justify-center text-${theme.accentColor}-200 font-bold text-sm`}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-4">
                  <p className={`font-semibold ${theme.textPrimary}`}>{member.name}</p>
                  <p className={`text-sm ${theme.textSecondary}`}>{member.email}</p>
                </div>
              </div>
              <button className="text-red-400 hover:text-red-600 transition-colors duration-200">
                <i data-feather="trash-2"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}