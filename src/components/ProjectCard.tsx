import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    price: number;
    isFree: boolean;
    technologies: string[];
    screenshot: string;
    bestFor: string;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="glass border-border/50 overflow-hidden hover-scale group cursor-pointer">
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img 
          src={project.screenshot} 
          alt={project.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          {project.isFree ? (
            <Badge className="bg-accent text-accent-foreground">Free</Badge>
          ) : (
            <Badge className="bg-primary text-primary-foreground">₹{project.price}</Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
          {project.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Best for: {project.bestFor}
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 gap-2">
        <Link to={`/project/${project.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
        <Button className="flex-1 glow-primary">
          <Download className="mr-2 h-4 w-4" />
          {project.isFree ? "Download" : "Buy Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
