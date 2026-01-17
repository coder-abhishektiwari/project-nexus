import { Link } from "react-router-dom";
import { Code2, Mail, Github, Linkedin, ExternalLink } from "lucide-react";
import logo from "../images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#09090b] text-white pt-20 pb-10 border-t border-zinc-800/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Project Nexus
              </span>
            </div>
            <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
              The premier platform for high-quality academic source code. 
              We help students bridge the gap between learning and building real-world applications.
            </p>
            <div className="flex gap-4 items-center">
              <a 
                href="https://github.com" 
                className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
                target="_blank" rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
                target="_blank" rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:abhishektiwari1706@gmail.com" 
                className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6">Explore</h3>
            <ul className="space-y-4">
              {['All Projects', 'Custom Request', 'Contact Us', 'Login / Sign Up'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'All Projects' ? '/projects' : item === 'Custom Request' ? '/request' : item === 'Contact Us' ? '/contact' : '/auth'} 
                    className="text-zinc-500 hover:text-indigo-400 text-sm font-medium transition-colors duration-200 flex items-center group"
                  >
                    <span className="mr-0 group-hover:mr-2 transition-all duration-200 opacity-0 group-hover:opacity-100 text-indigo-500">•</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6">Legal</h3>
            <ul className="space-y-4">
              {['Terms & Conditions', 'Refund Policy', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/ /g, '-').replace('&', 'and')}`}
                    className="text-zinc-500 hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-4">Support</h3>
              <p className="text-zinc-500 text-sm mb-4">Have questions or need help with a project?</p>
              <a 
                href="mailto:support@projectnexus.com" 
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold group transition-colors"
              >
                support@projectnexus.com
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} Project Nexus. Developed by Abhishek Tiwari.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All systems operational
            </span>
            <p>Built with passion and code</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;