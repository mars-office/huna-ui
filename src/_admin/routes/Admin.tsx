import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import NotificationsAdmin from './NotificationsAdmin';

export const Admin = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="notifications" element={<NotificationsAdmin />} />
    </Routes>
  );
};

export default Admin;
