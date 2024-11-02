import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigation } from './components/Navigation/Navigation';
import AccountDetails from './pages/AccountDetails';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { ThemeProvider } from './contexts/ThemeContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 0, // Always fetch fresh data
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100">
            <Navigation />
            <main className="py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/accounts/:id" element={<AccountDetails />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: '#ef4444',
                },
              },
            }} 
          />
          <ReactQueryDevtools 
            initialIsOpen={false}
            position="bottom"
            buttonPosition="bottom-right"
            styleNonce="your-nonce-here"
           
            
            
          />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
