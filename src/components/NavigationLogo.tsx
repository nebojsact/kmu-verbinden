import { Link } from 'react-router-dom';

export const NavigationLogo = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link to="/">
        <img 
          src="/lovable-uploads/99b20d6f-6ed5-4b74-b196-e550f338ca17.new.png"
          alt="KMU Verein Logo" 
          className="w-40"
        />
      </Link>
    </div>
  );
};