import { FaHeart } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

  const patterns = {
    light: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    dark: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  };

  return (
    <footer 
      className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-gray-200 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
      style={{ 
        backgroundImage: `linear-gradient(to bottom, rgba(30, 41, 59, 0.05), rgba(30, 41, 59, 0.05)), ${theme === 'dark' ? patterns.dark : patterns.light}`,
        backgroundSize: '60px 60px'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
            Created with <FaHeart className="text-red-500 animate-pulse" /> by{' '}
            <span className="font-medium">Raktim Chatterjee</span> in Bengaluru, India
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: 2024-12-08T02:43:26+05:30
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
