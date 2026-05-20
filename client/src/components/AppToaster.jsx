import { Toaster } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

export default function AppToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: isDark ? 'rgba(42, 31, 61, 0.96)' : 'rgba(255, 255, 255, 0.98)',
          color: isDark ? '#f5f3ff' : '#1e1b4b',
          border: isDark
            ? '1px solid rgba(196, 181, 253, 0.28)'
            : '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '12px',
          fontSize: '14px',
          boxShadow: isDark
            ? '0 12px 40px rgba(0,0,0,0.35)'
            : '0 12px 32px rgba(91, 33, 182, 0.12)',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: isDark ? '#14532d' : '#ecfdf5',
          },
        },
        error: {
          iconTheme: {
            primary: '#f87171',
            secondary: isDark ? '#450a0a' : '#fef2f2',
          },
        },
      }}
    />
  );
}
