import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useProjectDownload } from "@/hooks/useProjectDownload";

const ProjectCard = ({ project }: any) => {
  const { hasPurchased, handleDownload, paymentLoading } =
    useProjectDownload(project);

  return (
    <Card className="glass border-border overflow-hidden hover-scale group cursor-pointer shadow-subtle hover:shadow-medium transition-all">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img 
          src={project.screenshot_url} 
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 right-3">
          {project.is_free ? (
            <Badge className="bg-accent text-accent-foreground">Free</Badge>
          ) : (
            <Badge className="bg-primary text-primary-foreground">
              ₹{project.price}
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-2">{project.name}</h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Best for: {project.best_for}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 gap-2">
        <Link to={`/project/${project.id}`} className="flex-1">
          <Button variant="outline" className="w-full glass">
            <ExternalLink className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>

        <Button 
          className="flex-1 shadow-subtle"
          onClick={handleDownload}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}

          {project.is_free || hasPurchased ? "Download" : "Buy Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
