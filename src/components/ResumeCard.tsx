import React from "react";
import { useNavigate } from "react-router-dom";
import type { Resume } from "@/types/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, MoreVertical, Eye, Download, Mail, FileText } from "lucide-react";
import ResumePreview from "./ResumePreview";

interface Props {
  resume: Resume;
  onDelete: (id: string) => void;
  onShare: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
}

const ResumeCard = ({ resume, onDelete, onShare, onDownload }: Props) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      setIsDeleting(true);
      try {
        await onDelete(resume._id || resume.id || "");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/editor/${resume._id || resume.id}`);
  };

  const handlePreview = () => {
    navigate(`/preview/${resume._id || resume.id}`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-[794/1123] bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Mini Preview */}
        <div className="absolute inset-0 p-4 opacity-40 group-hover:opacity-30 transition-opacity">
          <ResumePreview resume={resume} scale={0.15} />
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
          <Button size="sm" variant="secondary" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </div>

        {/* Template Badge */}
        <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
          Template {resume.template?.theme || "01"}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold truncate">{resume.title}</h3>
            <p className="text-xs text-muted-foreground">
              Updated {new Date(resume.updatedAt || "").toLocaleDateString()}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" /> Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(resume)}>
                <Mail className="h-4 w-4 mr-2" /> Share via Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(resume)}>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" /> 
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default ResumeCard;