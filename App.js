const { useState, useEffect } = React;

/* Main App */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeView, setActiveView] = useState('dashboard');
  const [authView, setAuthView] = useState('login');
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [user, setUser] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [projects, setProjects] = useState([
    { id: '1', title: 'Website Redesign', taskCount: 15, progress: 60, team: [{initials: 'JM'}, {initials: 'SK'}, {initials: 'AM'}] },
    { id: '2', title: 'Mobile App', taskCount: 22, progress: 30, team: [{initials: 'SK'}, {initials: 'LP'}] },
    { id: '3', title: 'Marketing Campaign', taskCount: 8, progress: 95, team: [{initials: 'JM'}, {initials: 'LP'}] },
    { id: '4', title: 'E-commerce Platform', taskCount: 30, progress: 15, team: [{initials: 'AM'}] },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useFeatherIcons();

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleBypassLogin = () => {
    const tempUser = { name: 'Dev User', email: 'dev@synergysphere.com', initials: 'DU' };
    handleLoginSuccess(tempUser);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setActiveView('dashboard');
  };

  const handleSaveProject = (projectData) => {
    if (projectData.id) {
      setProjects(projects.map(p => p.id === projectData.id ? { ...p, ...projectData } : p));
      setEditingProject(null);
    } else {
      const newProject = {
        ...projectData,
        id: Date.now().toString(),
        taskCount: 0,
        progress: 0,
        team: [{ initials: user.initials }]
      };
      setProjects([...projects, newProject]);
      setIsCreatingProject(false);
    }
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };
  
  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };
  
  const handleGoBack = () => {
    setSelectedProject(null);
    setIsCreatingProject(false);
    setEditingProject(null);
  };
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isLoggedIn) {
    if (authView === 'login') {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={() => setAuthView('signup')} onBypassLogin={handleBypassLogin} isDarkMode={isDarkMode} />;
    } else {
      return <SignUpScreen onNavigateToLogin={() => setAuthView('login')} isDarkMode={isDarkMode} />;
    }
  }

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Topbar toggleSidebar={() => setIsCollapsed(!isCollapsed)} isMobile={isMobile} onNewProjectClick={() => setIsCreatingProject(true)} isDarkMode={isDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleSidebar={() => setIsCollapsed(!isCollapsed)} 
          user={user} 
          isMobile={isMobile} 
          activeView={activeView} 
          setActiveView={setActiveView} 
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
        <main className={`flex-1 overflow-y-auto p-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {activeView === 'dashboard' && <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Dashboard Content Here</h2>}
          
          {activeView === 'projects' && (
            isCreatingProject || editingProject ? (
              <ProjectForm 
                project={editingProject}
                onSave={handleSaveProject} 
                onCancel={handleGoBack}
                isDarkMode={isDarkMode}
              />
            ) : selectedProject ? (
              <ProjectDetailsPage project={selectedProject} onGoBack={handleGoBack} isDarkMode={isDarkMode} />
            ) : (
              <ProjectsPage 
                projects={projects} 
                onSelectProject={handleSelectProject}
                onEditProject={(p) => setEditingProject(p)}
                onDeleteProject={handleDeleteProject}
                isDarkMode={isDarkMode}
              />
            )
          )}
          
          {activeView === 'team' && <TeamPage isDarkMode={isDarkMode} />}
          {activeView === 'settings' && <h2 className="text-2xl font-bold mb-6 text-gray-200">Settings Page Content</h2>}
        </main>
      </div>
    </div>
  );
  
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);