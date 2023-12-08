import { Route, Routes } from 'react-router-dom';
import ParkingLotsList from './ParkingLotsList';

export const Admin = () => {
  return (
    <Routes>
      <Route path="parkinglots" element={<ParkingLotsList />} />
    </Routes>
  );
};

export default Admin;
