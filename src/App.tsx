
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/config/userQuery.config';
import ToastProvider from './config/ToastProvider.config';
import Home from './feat/home/Home';

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <ToastProvider />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
