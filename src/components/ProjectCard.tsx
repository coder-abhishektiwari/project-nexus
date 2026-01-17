import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ExternalLink, TrendingUp, CheckCircle, ShoppingCart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjectDownload } from "@/hooks/useProjectDownload";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }: any) => {
  const { hasPurchased, handleDownload, paymentLoading } = useProjectDownload(project);
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/project/${project.id}`)} 
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1 flex flex-col h-full cursor-pointer"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative w-full h-52 overflow-hidden bg-slate-100">
        <img
          src={project.screenshot_url}
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* TOP OVERLAYS */}
        <div className="absolute top-3 left-3 flex gap-2">
          {hasPurchased && (
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white rounded-lg shadow-lg flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Owned
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3">
          {project.is_free ? (
            <Badge className="bg-white/90 backdrop-blur-md text-emerald-600 border-none shadow-sm hover:bg-white font-bold">
              FREE
            </Badge>
          ) : (
            <Badge className="bg-indigo-600 text-white border-none shadow-lg font-bold">
              ₹{project.price}
            </Badge>
          )}
        </div>

        {/* HOVER VIEW DETAILS BUTTON (Subtle) */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full text-slate-900 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl">
                <ArrowUpRight className="h-5 w-5" />
             </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {project.name}
          </h3>
          <div className="flex items-center text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 whitespace-nowrap">
            <TrendingUp className="h-3 w-3 mr-1 text-indigo-500" />
            {project.downloads_count || 0}
          </div>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-5">
          {project.description}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
          {project.technologies?.slice(0, 3).map((tag: string) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100/50"
            >
              {tag}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center ml-1">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <Button
          type="button"
          className={`w-full h-11 rounded-xl font-bold transition-all duration-300 ${
            project.is_free || hasPurchased 
            ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-200" 
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : project.is_free || hasPurchased ? (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download Code
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Get Access
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;