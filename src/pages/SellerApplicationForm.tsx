import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, ChevronRight, ChevronLeft,
  Terminal, ShieldCheck, Rocket,
  IndianRupee, Briefcase, FileCode2,
  Lock, Zap, HeartHandshake,
  XCircle,
  AlertTriangle,
  FileText,
  BookOpen,
  Scroll,
  Github,
  Trash2,
  FileArchive,
  CloudUpload,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";

import { supabase } from "@/integrations/supabase/client";
import DocumentationRules from "./../documents/DocumentationRules"

const SellerApplicationForm = () => {
  const [zipFile, setZipFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('zip');
  const [step, setStep] = useState(1);
  const [showRules, setShowRules] = useState(false);
  const [sourceFile, setSourceFile] = useState(null);
  // GitHub States
  const [githubUrl, setGithubUrl] = useState("");
  const [isGithubVerified, setIsGithubVerified] = useState(false);
  const [githubError, setGithubError] = useState("");
  const [confirmAccount, setConfirmAccount] = useState("");
  const [kycConsent, setKycConsent] = useState(false);
  const [finalConsent, setFinalConsent] = useState(false);

  //data validaiton rules
  const isValidName = (name) => /^[A-Za-z ]{3,50}$/.test(name.trim());
  const isValidPhone = (phone) => /^(\+91)?[6-9]\d{9}$/.test(phone);
  const isValidPAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  const isValidAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
  const isValidIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
  const isValidAccountNumber = (acc) => /^\d{9,18}$/.test(acc);


  // Handle input change
  const handleChange = (key) => (e) => {
    setFormData(prev => ({
      ...prev,
      [key]: e.target.value
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!isValidName(formData.full_name))
          return alert("Invalid name. Numbers not allowed.");

        if (!isValidPhone(formData.whatsapp))
          return alert("Invalid WhatsApp number.");

        if (!formData.github_profile.includes("github.com"))
          return alert("Invalid GitHub profile URL.");

        return true;

      case 2:
        if (!formData.documentation_url)
          return alert("Documentation file required.");

        if (formData.upload_method === "zip" && !formData.source_zip_url)
          return alert("ZIP file missing.");

        if (formData.upload_method === "github" && !formData.github_repo_url)
          return alert("GitHub repo missing.");

        return true;

      case 3:
        if (!isValidPAN(formData.pan_number))
          return alert("Invalid PAN number.");

        if (!isValidAadhaar(formData.aadhaar_number))
          return alert("Invalid Aadhaar number.");

        if (!kycConsent)
          return alert("KYC consent is required.");

        return true;

      case 4:
        if (!isValidName(formData.bank_account_name))
          return alert("Invalid account holder name.");

        if (!isValidIFSC(formData.bank_ifsc))
          return alert("Invalid IFSC code.");

        if (!isValidAccountNumber(formData.bank_account_number))
          return alert("Invalid account number.");

        if (formData.bank_account_number !== confirmAccount)
          return alert("Account numbers do not match.");

        return true;

      case 5:
        if (!finalConsent)
          return alert("You must accept the Creator Honor Code.");

      default:
        return true;
    }
  };



  const handleGithubVerify = () => {
    if (githubUrl.includes("github.com/")) {
      setIsGithubVerified(true);
      setGithubError("");
      setFormData(prev => ({
        ...prev,
        upload_method: "github",
        github_repo_url: githubUrl
      }));
    } else {
      setGithubError("Invalid GitHub URL");
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = await uploadDoc(file);

    setFormData({
      ...formData,
      documentation_url: url
    });

    setDocFile(file);
  };

  const removeDoc = () => setDocFile(null);
  const totalSteps = 5;

  // --- Step wise Rejection Content ---
  const rejectionGuides = {
    1: {
      title: "Identity Rejection Risks",
      reasons: ["Fake Name", "Invalid WhatsApp", "Private or fake GitHub Profile"],
      color: "border-amber-200 bg-amber-50 text-amber-900"
    },
    2: {
      title: "Code Rejection Risks",
      reasons: ["Plagiarized Code", "Missing ReadMe File", "Not Running Project"],
      color: "border-rose-200 bg-rose-50 text-rose-900"
    },
    3: {
      title: "KYC Rejection Risks",
      reasons: ["Name Should be match with your given name", "Invalid ID's"],
      color: "border-orange-200 bg-orange-50 text-orange-900"
    },
    4: {
      title: "Bank Rejection Risks",
      reasons: ["Incorrect Details", "Not Should Be Any Company", "Third-party Bank Details"],
      color: "border-blue-200 bg-blue-50 text-blue-900"
    },
    5: {
      title: "Final Audit Risks",
      reasons: ["Please Check Your All Details Carefully and should not Violate Terms."],
      color: "border-indigo-200 bg-indigo-50 text-indigo-900"
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));


  //backend
  const [formData, setFormData] = useState({
    full_name: "",
    whatsapp: "",
    github_profile: "",
    linkedin_profile: "",

    upload_method: "",
    source_zip_url: "",
    github_repo_url: "",
    documentation_url: "",

    pan_number: "",
    aadhaar_number: "",

    bank_account_name: "",
    bank_ifsc: "",
    bank_account_number: ""
  });



  // zip upload helper
  const uploadZip = async (file) => {
    const user = (await supabase.auth.getUser()).data.user;
    const path = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("seller-source")
      .upload(path, file);

    if (error) throw error;

    return supabase.storage
      .from("seller-source")
      .getPublicUrl(path).data.publicUrl;
  };

  // doc upload helper
  const uploadDoc = async (file) => {
    const user = (await supabase.auth.getUser()).data.user;
    const path = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("seller-docs")
      .upload(path, file);

    if (error) throw error;

    return supabase.storage
      .from("seller-docs")
      .getPublicUrl(path).data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Login required");

    const payload = {
      user_id: user.id,
      full_name: formData.full_name,
      whatsapp: formData.whatsapp,
      github_profile: formData.github_profile,
      linkedin_profile: formData.linkedin_profile,

      upload_method: formData.upload_method,

      source_zip_url:
        formData.upload_method === "zip"
          ? formData.source_zip_url
          : null,

      github_repo_url:
        formData.upload_method === "github"
          ? formData.github_repo_url
          : null,

      documentation_url: formData.documentation_url,

      pan_number: formData.pan_number,
      aadhaar_number: formData.aadhaar_number,

      bank_account_name: formData.bank_account_name,
      bank_ifsc: formData.bank_ifsc,
      bank_account_number: formData.bank_account_number,
    };

    // 🔍 check existing application
    const { data: existing, error: fetchErr } = await supabase
      .from("seller_applications")
      .select("id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchErr) {
      alert(fetchErr.message);
      return;
    }

    // 🟢 FIRST TIME APPLY
    if (!existing) {
      const { error } = await supabase
        .from("seller_applications")
        .insert({ ...payload, status: "processing" });

      if (error) return alert(error.message);

      alert("Application submitted for admin review 🚀");
      return;
    }

    // 🟡 RE-APPLY AFTER REJECT
    if (existing.status === "rejected") {
      const { error } = await supabase
        .from("seller_applications")
        .update({ ...payload, status: "processing" })
        .eq("id", existing.id);

      if (error) return alert(error.message);

      alert("Application resubmitted successfully 🔄");
      return;
    }

    // 🔴 BLOCK OTHER STATES
    alert("Your application is already under review or approved.");
  };






  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">

        {/* LEFT PANEL */}
        <div className="lg:col-span-4 bg-[#0F172A] p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Terminal size={300} className="-rotate-12 -translate-x-20 translate-y-20" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Rocket className="text-white" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter leading-none">
                Step {step} of {totalSteps}
              </h2>
              <p className="text-slate-400 text-sm font-medium italic">
                {step === 1 && "The journey of a thousand sales starts here."}
                {step === 2 && "Showcase the power of your clean code."}
                {step === 3 && "Setting up your digital bank account."}
                {step === 4 && "Final legal handshake. You're almost there!"}
              </p>
            </div>

            {/* PROGRESS DOTS */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700'}`}
                />
              ))}
            </div>
          </div>

          <div className={`p-6 rounded-[2rem] border-2 shadow-sm transition-all duration-500 ${rejectionGuides[step].color}`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} />
              <h4 className="text-[12px] font-[1000] uppercase tracking-tighter leading-none">
                {rejectionGuides[step].title}
              </h4>
            </div>
            <ul className="space-y-3">
              {rejectionGuides[step].reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[12px] font-bold italic leading-tight">
                  <XCircle size={14} className="shrink-0 mt-0.5" />
                  {reason}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-black/5">
              <p className="text-[11px] font-black uppercase opacity-60">Pro Tip:</p>
              <p className="text-[12px] font-medium leading-relaxed italic">Double-check these points to ensure 100% approval rate.</p>
            </div>
          </div>


        </div>

        {/* RIGHT PANEL: FORM CONTENT */}
        <div className="lg:col-span-8 p-10 md:p-16">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-3xl font-[1000] tracking-tight text-slate-950">Basic Identity</h3>
                  <p className="text-slate-500 text-sm">Let's start with who you are. This stays private between us.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                    <Input placeholder="John Doe"
                      value={formData.full_name}
                      onChange={(e) => {
                        if (/^[A-Za-z ]*$/.test(e.target.value)) {
                          handleChange("full_name")(e);
                        }
                      }}
                      className="h-12 rounded-xl border-slate-200 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest">WhatsApp Number</label>
                    <Input placeholder="+91 00000 00000"
                      value={formData.whatsapp}
                      onChange={(e) => {
                        if (/^[0-9+]*$/.test(e.target.value)) {
                          handleChange("whatsapp")(e);
                        }
                      }}
                      className="h-12 rounded-xl border-slate-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">GitHub Profile</label>
                  <Input placeholder="https://github.com/username"
                    value={formData.github_profile}
                    onChange={handleChange("github_profile")}
                    className="h-12 rounded-xl border-slate-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">LinkedIn Profile (optional)</label>
                  <Input placeholder="https://linkedin.com/username"
                    value={formData.linkedin_profile}
                    onChange={handleChange("linkedin_profile")}
                    className="h-12 rounded-xl border-slate-200" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 min-h-[600px]"
              >

                {/* TOGGLE BUTTON: Ye button content switch karega */}
                <Button
                  onClick={() => setShowRules(!showRules)}
                  variant="outline"
                  className={`rounded-2xl border-2 font-black text-[10px] uppercase gap-2 transition-all ${showRules
                    ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                    : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                    }`}
                >
                  {showRules ? <><FileCode2 size={14} /> Back to Upload</> : <><BookOpen size={14} /> View Report Rules</>}
                </Button>

                {/* Header with Toggle Button */}
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-[1000] tracking-tight text-slate-950 uppercase italic">
                      {showRules ? "REPORT GUIDELINES" : "SAMPLE SUBMISSION"}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium">
                      {showRules
                        ? "Follow these industry standards for your project documentation."
                        : "Select your preferred method to submit your sample project."}
                    </p>
                  </div>


                </div>

                {/* --- CONDITIONAL RENDERING --- */}
                {showRules ? (
                  /* --- VIEW A: REPORT RULES (Word Document Style) --- */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border-2 border-slate-100  overflow-hidden shadow-sm"
                  >
                    {/* Scrollable Area (Standard A4 Width) */}
                    <div className="w-full max-w-[950px] bg-white shadow-2xl overflow-y-auto h-[70vh] custom-scrollbar mx-auto border border-gray-200">
                      <DocumentationRules />
                    </div>
                  </motion.div>
                ) : (
                  /* --- VIEW B: ORIGINAL UPLOAD PANEL --- */
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* OWNERSHIP WARNING */}

                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-4 items-center">

                      <ShieldCheck className="text-rose-600 shrink-0" size={24} />

                      <p className="text-[11px] text-rose-800 leading-tight font-bold">

                        STRICT POLICY: If providing a GitHub link, it must belong to the profile you shared in Step 1.

                        Ownership mismatch will result in permanent account suspension.

                      </p>

                    </div>


                    {/* METHOD A: ZIP UPLOAD */}
                    <div className="w-full space-y-8 p-2">

                      {/* 1. SELECTION BOXES (ZIP vs GITHUB) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ZIP METHOD CARD */}
                        <div
                          onClick={() => {
                            setUploadMethod("zip");
                            setFormData(prev => ({
                              ...prev,
                              upload_method: "zip",
                              github_repo_url: ""
                            }));
                          }}
                          className={`relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[180px] ${uploadMethod === 'zip'
                            ? 'border-amber-500 bg-amber-50/50 ring-4 ring-amber-100'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                        >
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-4 ${uploadMethod === 'zip' ? 'bg-amber-500 text-white' : 'bg-slate-50 text-slate-400'}`}>
                            <FileArchive size={28} />
                          </div>
                          <div className="text-center">
                            <h4 className="text-sm font-black text-slate-900 uppercase italic">Upload Source ZIP</h4>
                            <p className="text-[10px] text-amber-600 font-bold tracking-widest uppercase mt-1">Win11 Compressed</p>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${uploadMethod === 'zip' ? 'border-amber-600' : 'border-slate-300'}`}>
                              {uploadMethod === 'zip' && <div className="h-2.5 w-2.5 bg-amber-600 rounded-full" />}
                            </div>
                          </div>
                        </div>

                        {/* GITHUB METHOD CARD */}
                        <div
                          onClick={() => {
                            setUploadMethod("link");
                            setFormData(prev => ({
                              ...prev,
                              upload_method: "github",
                              source_zip_url: ""
                            }));
                          }}

                          className={`relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[180px] ${uploadMethod === 'link'
                            ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-100'
                            : 'border-slate-100 bg-white hover:border-slate-200'
                            }`}
                        >
                          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-4 ${uploadMethod === 'link' ? 'bg-[#24292e] text-white' : 'bg-slate-50 text-slate-400'}`}>
                            <Github size={28} />
                          </div>
                          <div className="text-center">
                            <h4 className="text-sm font-black text-slate-900 uppercase italic">Github Repository</h4>
                            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-1">Public URL Only</p>
                          </div>
                          <div className="absolute top-4 right-4">
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${uploadMethod === 'link' ? 'border-indigo-600' : 'border-slate-300'}`}>
                              {uploadMethod === 'link' && <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. DYNAMIC CONTENT AREA */}
                      <div className="w-full min-h-[160px]">
                        {uploadMethod === 'zip' && (
                          <AnimatePresence mode="wait">
                            {!zipFile ? (
                              <motion.div
                                key="zip-empty"
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="relative border-2 border-dashed border-amber-200 rounded-[2.5rem] p-12 text-center bg-amber-50/20 hover:bg-amber-50/40 transition-all cursor-pointer"
                              >
                                <input
                                  type="file"
                                  accept="application/zip,application/x-zip-compressed"
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    const url = await uploadZip(file);

                                    setFormData(prev => ({
                                      ...prev,
                                      upload_method: "zip",
                                      source_zip_url: url,
                                      github_repo_url: null
                                    }));



                                    setZipFile(file);
                                  }}
                                />

                                <CloudUpload className="mx-auto text-amber-400 mb-3" size={42} />
                                <p className="text-xs font-black text-amber-600 uppercase italic">Select Source Code (.zip)</p>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="zip-filled"
                                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-between p-6 bg-amber-500 rounded-[2.5rem] text-white shadow-xl shadow-amber-100"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    <FileArchive size={28} />
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black uppercase opacity-80 leading-none">ZIP Compressed Attached</p>
                                    <p className="text-sm font-bold truncate max-w-[200px] italic mt-1">{zipFile.name}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setZipFile(null);
                                    setFormData(prev => ({
                                      ...prev,
                                      source_zip_url: "",
                                      upload_method: ""
                                    }));
                                  }}
                                  className="h-10 w-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-rose-600 transition-all group"
                                >
                                  <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}

                        {uploadMethod === 'link' && (
                          <AnimatePresence mode="wait">
                            {!isGithubVerified ? (
                              <motion.div
                                key="git-input"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-4"
                              >
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="https://github.com/username/repo"
                                    className="w-full bg-slate-50 h-16 rounded-2xl px-6 pr-32 font-bold text-indigo-600 outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all"
                                  />
                                  <div className="absolute right-2 top-2 flex gap-1">
                                    <button onClick={() => setGithubUrl("")} className="h-12 w-12 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl flex items-center justify-center transition-all">
                                      <X size={20} />
                                    </button>
                                    <button onClick={handleGithubVerify} className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 transition-all">
                                      <Check size={20} />
                                    </button>
                                  </div>
                                </div>
                                {githubError && <p className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1 ml-2"><AlertCircle size={12} /> {githubError}</p>}
                              </motion.div>
                            ) : (
                              <motion.div
                                key="git-verified"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center justify-between p-6 bg-[#0F172A] rounded-[2.5rem] text-white shadow-2xl"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                                    <Github size={24} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 leading-none">
                                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Repository Verified</p>
                                      <CheckCircle2 size={12} className="text-emerald-400" />
                                    </div>
                                    <p className="text-sm font-bold truncate max-w-[250px] italic mt-1 text-slate-300">{githubUrl}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setIsGithubVerified(false);
                                    setGithubUrl("");
                                    setFormData(prev => ({
                                      ...prev,
                                      github_repo_url: "",
                                      upload_method: ""
                                    }));
                                  }}

                                  className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-rose-600 transition-all group">
                                  <Trash2 size={18} className="text-white/60 group-hover:text-white" />
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        )}
                      </div>

                    </div>

                    {/* --- WORD DOCUMENT UPLOAD (NEW BLUE THEME) --- */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Technical Documentation (.DOCX)</label>

                      <AnimatePresence mode="wait">
                        {!docFile ? (
                          // UPLOAD STATE
                          <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group relative border-2 border-dashed border-blue-100 rounded-[2rem] p-8 text-center hover:border-blue-400 transition-all bg-blue-50/30"
                          >
                            <FileText className="mx-auto text-blue-300 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
                            <p className="text-[10px] font-black uppercase text-blue-600 tracking-tighter italic">Click to upload Word File (.docx)</p>
                            <p className="text-[8px] font-bold uppercase mt-1 text-blue-400">Documentation / Setup Guide</p>
                            <input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept=".docx, .doc"
                              onChange={handleDocUpload}
                            />
                          </motion.div>
                        ) : (
                          // FILE SELECTED STATE (SUCCESS SHOW)
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between p-6 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-100 border border-blue-500"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <FileText className="text-white" size={20} />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest leading-none mb-1">File Attached</p>
                                <p className="text-xs font-bold text-white truncate max-w-[250px] italic">{docFile.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="text-white" size={24} />
                              <button
                                onClick={removeDoc}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                title="Remove File"
                              >
                                <XCircle className="text-blue-200" size={18} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* HEADER */}
                <div className="space-y-1 border-b border-slate-100 pb-6">
                  <h3 className="text-3xl font-black tracking-tight text-slate-950 uppercase italic">KYC DETAILS</h3>
                  <p className="text-sm text-slate-500 font-medium tracking-wide">Secure your creator account with a quick KYC.</p>
                </div>

                {/* ENCRYPTION BADGE - SIMPLE & SMALL */}
                <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <ShieldCheck className="text-emerald-600" size={20} />
                  <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-tight">
                    AES-256 Encrypted • Only used for legal & tax compliance
                  </p>
                </div>

                {/* KYC INPUTS - 2 COLUMN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">PAN Card Number</label>
                    <Input
                      placeholder="ABCDE1234F"
                      value={formData.pan_number}
                      onChange={(e) =>
                        handleChange("pan_number")({
                          target: { value: e.target.value.toUpperCase() }
                        })
                      }
                      className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-600 font-mono uppercase font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Aadhaar Number</label>
                    <Input
                      type="password"
                      placeholder="XXXX XXXX XXXX"
                      value={formData.aadhaar_number}
                      onChange={(e) => {
                        if (/^\d*$/.test(e.target.value)) {
                          handleChange("aadhaar_number")(e);
                        }
                      }}
                      className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-600 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* COMPACT BENEFITS LIST */}
                <div className="grid grid-cols-3 gap-4 py-2">
                  {[
                    { t: "Safe Payouts", icon: <IndianRupee size={14} /> },
                    { t: "No Scams", icon: <Zap size={14} /> },
                    { t: "Verified Badge", icon: <CheckCircle2 size={14} /> }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-500">
                      <div className="text-indigo-500">{item.icon}</div>
                      <span className="text-[10px] font-black uppercase tracking-tighter">{item.t}</span>
                    </div>
                  ))}
                </div>

                {/* CONSENT BOX - CLEANER DESIGN */}
                <div className=" relative ">
                  <div className="flex items-start gap-4 relative z-10">
                    <input
                      type="checkbox"
                      id="kyc-consent"
                      onChange={(e) => setKycConsent(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-none accent-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="kyc-consent" className="cursor-pointer space-y-1">
                      <p className="text-xs font-bold leading-snug text-slate-500">
                        I confirm that these documents belong to me. I authorize Nexus to securely verify my identity.
                      </p>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Verified Digital Signature</p>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* HEADER WITH SKIP BUTTON */}
                <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight text-slate-950">PAYOUT BANK</h3>
                    <p className="text-sm text-slate-500 font-medium tracking-wide">Where should we send your money?</p>
                  </div>
                  <Button
                    variant="link"
                    onClick={nextStep}
                    className="text-indigo-600 font-bold text-sm hover:no-underline p-0"
                  >
                    I'll do this later →
                  </Button>
                </div>

                {/* BANK FORM - COMPACT GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Account Holder Name</label>
                    <Input placeholder="Full Name (as per Bank)"
                      value={formData.bank_account_name}
                      onChange={(e) => {
                        if (/^[A-Za-z ]*$/.test(e.target.value)) {
                          handleChange("bank_account_name")(e);
                        }
                      }}
                      className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-600 font-semibold" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">IFSC Code</label>
                    <Input placeholder="e.g. HDFC0001234"
                      value={formData.bank_ifsc}
                      onChange={handleChange("bank_ifsc")}
                      className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-600 font-mono uppercase font-bold" />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Account Number</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input type="password" placeholder="Account Number"
                        value={formData.bank_account_number}
                        onChange={handleChange("bank_account_number")}
                        className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-600 font-mono font-bold" />

                      <Input placeholder="Confirm Account Number"
                        value={confirmAccount}
                        onChange={(e) => setConfirmAccount(e.target.value)}
                        className="h-14 rounded-2xl bg-white border-2 border-slate-100 focus:border-indigo-600 font-mono font-bold" />
                    </div>
                  </div>
                </div>

                {/* TRUST FOOTER */}
                <div className="flex items-center gap-3 py-4 border-t border-slate-100">
                  <div className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium italic">
                    Your banking data is encrypted. We only use it for verified payouts.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-3xl font-[1000] tracking-tight text-slate-950">Final Handshake</h3>
                  <p className="text-slate-500 text-sm">Review our core values before joining the inner circle.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: <Lock className="text-indigo-500 h-4 w-4" />, t: "IP Ownership", d: "I confirm that I own 100% of the code rights." },
                    { icon: <Zap className="text-orange-500 h-4 w-4" />, t: "Quality Standard", d: "I agree that Nexus Admin can reject projects with bugs." },
                    { icon: <HeartHandshake className="text-emerald-500 h-4 w-4" />, t: "Collaboration", d: "I will provide basic support via documentation." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="mt-1">{item.icon}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.t}</p>
                        <p className="text-xs text-slate-500 leading-tight">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <input type="checkbox"
                    checked={finalConsent}
                    onChange={(e) => setFinalConsent(e.target.checked)}
                    className="h-5 w-5 accent-indigo-600 rounded-md" />
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-tighter">I agree to the Creator Honor Code</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER BUTTONS */}
          <div className="mt-12 flex justify-between gap-4">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="px-8 h-14 rounded-2xl font-bold text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={() => {
                  if (!validateStep()) {
                    alert("Please complete all required fields in this step");
                    return;
                  }
                  nextStep();
                }}
                className="px-10 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100 transition-all"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="px-10 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-[1000] shadow-xl shadow-emerald-100 transition-all animate-pulse"
                onClick={handleSubmit}
              >
                Submit Application <CheckCircle2 className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};

export default SellerApplicationForm;