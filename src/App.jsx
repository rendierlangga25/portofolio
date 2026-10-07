import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Public from './pages/public/Public.jsx'
import Login from './pages/admin/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Messages from './pages/admin/Messages.jsx'
import * as P from './pages/admin/Pages.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Guard from './components/admin/Guard.jsx'
import {ToastProvider} from './components/admin/Toast.jsx'
export default function App(){return(
<BrowserRouter><ToastProvider><Routes>
<Route path="/" element={<Public/>}/>
<Route path="/admin/login" element={<Login/>}/>
<Route path="/admin" element={<Guard><AdminLayout/></Guard>}>
<Route index element={<Dashboard/>}/>
<Route path="profile" element={<P.Profile/>}/><Route path="about" element={<P.About/>}/>
<Route path="experience" element={<P.Experience/>}/><Route path="projects" element={<P.Projects/>}/><Route path="certificates" element={<P.Certificates/>}/>
<Route path="skills" element={<P.Skills/>}/><Route path="education" element={<P.Education/>}/>
<Route path="contact" element={<P.Contact/>}/><Route path="social" element={<P.Social/>}/>
<Route path="settings" element={<P.Settings/>}/><Route path="messages" element={<Messages/>}/>
</Route>
<Route path="*" element={<Navigate to="/" replace/>}/>
</Routes></ToastProvider></BrowserRouter>)}
