import { Routes, Route, Navigate } from 'react-router-dom'
import { 
    ProtectedRoute, 
    JobseekerRoute, 
    EmployerRoute, 
    GuestRoute 
} from './ProtectedRoute'

// Layouts
import { AuthLayout, DashboardLayout } from '../layouts'

// Auth Pages
import { Login, RegisterJobseeker, RegisterEmployer } from '../pages/auth'

// Home
import { Home } from '../pages/home'

// Jobseeker Pages
import { 
    Dashboard as JobseekerDashboard, 
    Profile as JobseekerProfile,
    Jobs as MatchedJobs,
    JobDetails,
    MyApplications,
    Assessment
} from '../pages/jobseeker'

// Employer Pages
import { 
    Dashboard as EmployerDashboard, 
    Profile as EmployerProfile,
    Jobs as ManageJobs,
    CreateJob,
    Applications as ViewApplications
} from '../pages/employer'

// Messaging
import { Messages } from '../pages/messaging'

const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />

            {/* Auth Routes - Guest Only */}
            <Route element={<AuthLayout />}>
                <Route 
                    path="/login" 
                    element={
                        <GuestRoute>
                            <Login />
                        </GuestRoute>
                    } 
                />
                <Route 
                    path="/register/jobseeker" 
                    element={
                        <GuestRoute>
                            <RegisterJobseeker />
                        </GuestRoute>
                    } 
                />
                <Route 
                    path="/register/employer" 
                    element={
                        <GuestRoute>
                            <RegisterEmployer />
                        </GuestRoute>
                    } 
                />
            </Route>

            {/* Jobseeker Routes */}
            <Route element={<DashboardLayout />}>
                <Route 
                    path="/jobseeker/dashboard" 
                    element={
                        <JobseekerRoute>
                            <JobseekerDashboard />
                        </JobseekerRoute>
                    } 
                />
                <Route 
                    path="/jobseeker/profile" 
                    element={
                        <JobseekerRoute>
                            <JobseekerProfile />
                        </JobseekerRoute>
                    } 
                />
                <Route 
                    path="/jobseeker/assessment" 
                    element={
                        <JobseekerRoute>
                            <Assessment />
                        </JobseekerRoute>
                    } 
                />
                <Route 
                    path="/jobseeker/jobs" 
                    element={
                        <JobseekerRoute>
                            <MatchedJobs />
                        </JobseekerRoute>
                    } 
                />
                <Route 
                    path="/jobseeker/jobs/:id" 
                    element={
                        <JobseekerRoute>
                            <JobDetails />
                        </JobseekerRoute>
                    } 
                />
                <Route 
                    path="/jobseeker/applications" 
                    element={
                        <JobseekerRoute>
                            <MyApplications />
                        </JobseekerRoute>
                    } 
                />
            </Route>

            {/* Employer Routes */}
            <Route element={<DashboardLayout />}>
                <Route 
                    path="/employer/dashboard" 
                    element={
                        <EmployerRoute>
                            <EmployerDashboard />
                        </EmployerRoute>
                    } 
                />
                <Route 
                    path="/employer/profile" 
                    element={
                        <EmployerRoute>
                            <EmployerProfile />
                        </EmployerRoute>
                    } 
                />
                <Route 
                    path="/employer/jobs/create" 
                    element={
                        <EmployerRoute>
                            <CreateJob />
                        </EmployerRoute>
                    } 
                />
                <Route 
                    path="/employer/jobs/:id/edit" 
                    element={
                        <EmployerRoute>
                            <CreateJob />
                        </EmployerRoute>
                    } 
                />
                <Route 
                    path="/employer/jobs" 
                    element={
                        <EmployerRoute>
                            <ManageJobs />
                        </EmployerRoute>
                    } 
                />
                <Route 
                    path="/employer/applications" 
                    element={
                        <EmployerRoute>
                            <ViewApplications />
                        </EmployerRoute>
                    } 
                />
            </Route>

            {/* Messaging Routes - All authenticated users */}
            <Route element={<DashboardLayout />}>
                <Route 
                    path="/messages" 
                    element={
                        <ProtectedRoute>
                            <Messages />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/jobseeker/messages" 
                    element={
                        <JobseekerRoute>
                            <Messages />
                        </JobseekerRoute>
                    } 
                />
                <Route 
                    path="/employer/messages" 
                    element={
                        <EmployerRoute>
                            <Messages />
                        </EmployerRoute>
                    } 
                />
            </Route>

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default AppRouter
