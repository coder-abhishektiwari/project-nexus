import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, ShieldCheck, LogIn, ArrowLeft } from 'lucide-react';

import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

const emailSchema = z.string().trim().email("Invalid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (error: any) {
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (!error) {
      navigate("/admin");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50"> {/* 🟢 Added light background */}
      {/* Animated background - Assuming animate-float works via global CSS */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-sm z-10 animate-fade-in"> {/* 🟢 Max width reduced for focus */}
        
        {/* Logo/Header */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg"> {/* 🟢 Rounded Full Logo */}
            <ShieldCheck className="h-9 w-9 text-white" /> {/* 🟢 Icon Color White */}
          </div>
          <span className="font-extrabold text-3xl mt-3 text-gray-800">Admin Login</span>
          <p className="text-sm text-gray-500 mt-1">Access the Nexus Management Panel</p> {/* 🟢 Tagline added */}
        </div>

        {/* Login Form Card */}
        <Card className="shadow-2xl border-gray-100 p-8 bg-white/95 backdrop-blur-md"> {/* 🟢 Better Card Styling */}
          <form onSubmit={handleLogin} className="space-y-6"> {/* 🟢 Increased spacing */}
            
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="font-semibold text-gray-700">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> {/* 🟢 Icon added */}
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary transition text-black/60 bg-white" // 🟢 Icon space and focus style
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="font-semibold text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 " /> {/* 🟢 Icon added */}
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••••••"
                  className="pl-10 h-12 border-gray-300 focus:border-primary focus:ring-primary transition text-black/60 bg-white" // 🟢 Icon space and focus style
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-black/30 flex items-center justify-center gap-2" // 🟢 Better Button Styling (Black theme)
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> {/* 🟢 Loading Icon */}
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" /> {/* 🟢 Login Icon */}
                  Login to Dashboard
                </>
              )}
            </Button>

            <div className="text-center text-xs text-gray-500 pt-2"> {/* 🟢 Smaller text and color */}
              Admin access only. Unauthorized access is prohibited.
            </div>
          </form>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-primary transition flex items-center justify-center gap-1">
            <ArrowLeft className="h-4 w-4" /> {/* 🟢 Arrow Icon */}
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );

};
export default AdminLogin;
