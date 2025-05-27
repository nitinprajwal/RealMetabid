import { Link } from 'react-router-dom';
import { Home, Mail, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto container-px py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-white text-blue-900 rounded-md flex items-center justify-center">
                <Home size={20} />
              </div>
              <span className="text-xl font-bold">PropertyBid</span>
            </div>
            <p className="text-slate-300 mb-4">
              The premier platform for real estate bidding using blockchain technology.
              Find your dream property and make secure bids with cryptocurrency.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-amber-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-amber-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-amber-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-amber-400 transition-colors">Properties</Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-amber-400 transition-colors">Connect Wallet</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-amber-400 transition-colors">Dashboard</Link>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-amber-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-amber-400 transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-amber-400 transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail size={20} className="mr-2 text-amber-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">prajwalbr0304@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 text-amber-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">+916363450449</span>
              </li>
              <li className="flex items-start">
                <Home size={20} className="mr-2 text-amber-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300">
                  India<br />
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>© 2025 PropertyBid. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center">
            <span>Powered by</span>
            <ExternalLink size={14} className="mx-1" />
            <a href="#" className="text-amber-400 hover:underline">Blockchain Technology</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;