import { Route, Routes } from 'react-router-dom';
import ParkingLots from './ParkingLots';

export const Admin = () => {
  return (
    <Routes>
      <Route path="parkinglots" element={<ParkingLots />} />
    </Routes>
  );
};

export default Admin;
