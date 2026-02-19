import { FileText} from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-10">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">ResumeBuilder</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Build ATS-friendly resumes like a pro. Stand out from the crowd.
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          Made with  by{" "}
          <span className="font-medium text-foreground">Alok Kumar Dubey</span>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
