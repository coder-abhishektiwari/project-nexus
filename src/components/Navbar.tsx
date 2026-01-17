import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "../images/logo.png";
import ProfileDropdown from "@/components/ProfileDropdown";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Custom Request", path: "/request" },
    { name: "Terms", path: "/terms" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm py-3" : "bg-white py-5"
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          {/* <img src={logo} alt="Logo" className="h-10 w-10 object-contain group-hover:rotate-12 transition-transform duration-300" /> */}
          <span className="text-xl font-black tracking-tighter text-slate-900">
            PROJECT<span className="text-indigo-600">NEXUS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Action Buttons / Profile */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 hover:bg-amber-100 transition-colors">
              <Shield className="h-3.5 w-3.5" />
              Admin Panel
            </Link>
          )}

          <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden md:block" />

          {user ? (
            <ProfileDropdown />
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" className="text-slate-600 font-bold hover:bg-slate-50 rounded-xl">
                  Log in
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-white z-[60] p-6 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-2xl font-bold text-slate-900 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-slate-100" />
            
            <div className="flex flex-col gap-4">
              {user ? (
                <Button 
                  variant="destructive" 
                  className="w-full h-12 rounded-xl font-bold"
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                >
                  Log out
                </Button>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 font-bold">Login</Button>
                  </Link>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full h-12 bg-indigo-600 rounded-xl font-bold">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;