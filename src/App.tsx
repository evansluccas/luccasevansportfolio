import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectForm from "./pages/admin/AdminProjectForm";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminBlogForm from "./pages/admin/AdminBlogForm";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminAboutCards from "./pages/admin/AdminAboutCards";
import AdminHeroStats from "./pages/admin/AdminHeroStats";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute requireAdmin>
                <AdminProjects />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/new" element={
              <ProtectedRoute requireAdmin>
                <AdminProjectForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/:id" element={
              <ProtectedRoute requireAdmin>
                <AdminProjectForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog" element={
              <ProtectedRoute requireAdmin>
                <AdminBlog />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/new" element={
              <ProtectedRoute requireAdmin>
                <AdminBlogForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/blog/:id" element={
              <ProtectedRoute requireAdmin>
                <AdminBlogForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/experiences" element={
              <ProtectedRoute requireAdmin>
                <AdminExperiences />
              </ProtectedRoute>
            } />
            <Route path="/admin/skills" element={
              <ProtectedRoute requireAdmin>
                <AdminSkills />
              </ProtectedRoute>
            } />
            <Route path="/admin/about" element={
              <ProtectedRoute requireAdmin>
                <AdminAboutCards />
              </ProtectedRoute>
            } />
            <Route path="/admin/stats" element={
              <ProtectedRoute requireAdmin>
                <AdminHeroStats />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin>
                <AdminSettings />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
