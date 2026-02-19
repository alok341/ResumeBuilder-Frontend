import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetResume } from "@/lib/api";
import type { Resume } from "@/types/resume";
import ResumePreview from "@/components/ResumePreview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Mail, Printer, Loader2 } from "lucide-react";
import EmailShareDialog from "@/components/EmailShareDialog";
import html2pdf from "html2pdf.js";

const Preview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [generatingForEmail, setGeneratingForEmail] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    apiGetResume(id)
      .then(setResume)
      .catch(() => toast({ title: "Failed to load resume", variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [id]);

  const generatePDF = async (): Promise<File | null> => {
    if (!previewRef.current || !resume) return null;
    
    try {
      const element = previewRef.current;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `${resume.title.replace(/\s+/g, "_")}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };
      
      const pdfBlob = await html2pdf().from(element).set(opt).outputPdf('blob');
      const newPdfFile = new File([pdfBlob], opt.filename, { type: 'application/pdf' });
      return newPdfFile;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const newPdfFile = await generatePDF();
      if (newPdfFile) {
        // Download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(newPdfFile);
        link.download = newPdfFile.name;
        link.click();
        setPdfFile(newPdfFile); // Save for email if needed later
        toast({ title: "PDF downloaded successfully!" });
      } else {
        toast({ title: "Failed to generate PDF", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const handleEmailClick = async () => {
    setGeneratingForEmail(true);
    try {
      // Generate PDF first
      const newPdfFile = await generatePDF();
      if (newPdfFile) {
        setPdfFile(newPdfFile);
        setShowEmailDialog(true); // Open dialog only after PDF is ready
      } else {
        toast({ title: "Failed to generate PDF for email", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setGeneratingForEmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-foreground">Resume not found</h2>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <Header />
      
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEmailClick}
              disabled={generatingForEmail}
            >
              {generatingForEmail ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {generatingForEmail ? "Generating PDF..." : "Email"}
            </Button>
            <Button size="sm" onClick={handleDownloadPDF} disabled={downloading} className="btn-glow">
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 print:p-0">
        <div className="flex justify-center">
          <div ref={previewRef} className="shadow-xl print:shadow-none">
            <ResumePreview resume={resume} scale={1} />
          </div>
        </div>
      </div>

      <Footer />

      <EmailShareDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        resumeId={id || ""}
        resumeTitle={resume.title}
        pdfFile={pdfFile}
      />
    </div>
  );
};

export default Preview;