
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/config/userQuery.config';
import ToastProvider from './config/ToastProvider.config';
import Home from './feat/home/Home';
import CheckAttendanceScanner from './feat/worker/component/CheckAttendanceScanner';
import CheckOutScanner from './feat/worker/component/CheckOutScanner';
import EnterQuantityReportSection from './feat/worker/component/EnterQuantityReportSection';
import UpdateItemStationSection from './feat/worker/component/UpdateItemStationSection';

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check-attendance" element={<CheckAttendanceScanner />} />
          <Route path="/check-out" element={<CheckOutScanner />} />
          <Route path="/enter-quantity-report" element={<EnterQuantityReportSection />} />
          <Route path="/update-item-station" element={<UpdateItemStationSection />} /> 
        </Routes>
        <ToastProvider />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
