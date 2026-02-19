import React, { useState } from "react";
import { apiSendResumeEmail } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  resumeTitle: string;
  pdfFile?: File | null;
}

const EmailShareDialog = ({ open, onOpenChange, resumeId, resumeTitle, pdfFile }: Props) => {
  const [formData, setFormData] = useState({
    recipientEmail: "",
    subject: `Resume: ${resumeTitle}`,
    message: "Please find my resume attached.\n\nBest regards,",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.recipientEmail) {
      newErrors.recipientEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = "Please enter a valid email address";
    }

    if (!pdfFile) {
      newErrors.pdf = "PDF file is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    if (!pdfFile) {
      setStatus("error");
      return;
    }

    try {
      setSending(true);
      setStatus("idle");

      await apiSendResumeEmail(
        formData.recipientEmail,
        formData.subject,
        formData.message,
        pdfFile
      );

      setStatus("success");
      
      // Reset form after 2 seconds and close
      setTimeout(() => {
        onOpenChange(false);
        setStatus("idle");
        setFormData({
          recipientEmail: "",
          subject: `Resume: ${resumeTitle}`,
          message: "Please find my resume attached.\n\nBest regards,",
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus("error");
    } finally {
      setSending(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Share Resume via Email
          </DialogTitle>
          <DialogDescription>
            Send your resume directly to a recruiter or hiring manager.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Sent!</h3>
            <p className="text-sm text-muted-foreground">
              Your resume has been sent to {formData.recipientEmail}
            </p>
          </div>
        ) : status === "error" ? (
          <div className="py-8 text-center">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Send</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Something went wrong. Please try again.
            </p>
            <Button onClick={() => setStatus("idle")} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {!pdfFile && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                No PDF file available. Please generate a PDF first.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Email *</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="hiring@company.com"
                value={formData.recipientEmail}
                onChange={(e) => handleChange("recipientEmail", e.target.value)}
                disabled={sending}
                className={errors.recipientEmail ? "border-destructive" : ""}
              />
              {errors.recipientEmail && (
                <p className="text-xs text-destructive">{errors.recipientEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                disabled={sending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Add a personal message..."
                rows={4}
                disabled={sending}
              />
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Attachments:</p>
              <p className="text-muted-foreground">
                {pdfFile ? pdfFile.name : "No PDF selected"}
              </p>
            </div>
          </div>
        )}

        {status === "idle" && (
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSend}
              disabled={sending || !pdfFile}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailShareDialog;