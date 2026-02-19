import type { AuthResponse, LoginRequest, RegisterRequest, Resume } from "@/types/resume";

const API_BASE = "http://localhost:8080"; // Change this to your backend URL

const getHeaders = (isJson = true): HeadersInit => {
  const headers: HeadersInit = {};
  const token = localStorage.getItem("token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
};

// Auth
export const apiRegister = (data: RegisterRequest): Promise<AuthResponse> =>
  fetch(`${API_BASE}/api/auth/register`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse);

export const apiLogin = (data: LoginRequest): Promise<AuthResponse> =>
  fetch(`${API_BASE}/api/auth/login`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse);

export const apiGetProfile = (): Promise<AuthResponse> =>
  fetch(`${API_BASE}/api/auth/profile`, { headers: getHeaders() }).then(handleResponse);

export const apiResendVerification = (email: string) =>
  fetch(`${API_BASE}/api/auth/resend-verification-email`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ email }) }).then(handleResponse);

// Resumes
export const apiGetResumes = (): Promise<Resume[]> =>
  fetch(`${API_BASE}/api/resumes`, { headers: getHeaders() }).then(handleResponse);

export const apiCreateResume = (title: string): Promise<Resume> =>
  fetch(`${API_BASE}/api/resumes`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ title }) }).then(handleResponse);

export const apiGetResume = (id: string): Promise<Resume> =>
  fetch(`${API_BASE}/api/resumes/${id}`, { headers: getHeaders() }).then(handleResponse);

export const apiUpdateResume = (id: string, data: Resume): Promise<Resume> =>
  fetch(`${API_BASE}/api/resumes/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse);

export const apiDeleteResume = (id: string): Promise<void> =>
  fetch(`${API_BASE}/api/resumes/${id}`, { method: "DELETE", headers: getHeaders() }).then(() => undefined);

// Templates
export const apiGetTemplates = (): Promise<{ availavleTemplates: string[]; allTemplates: string[]; subscriptionPlan: string[]; isPremium: boolean }> =>
  fetch(`${API_BASE}/api/templates`, { headers: getHeaders() }).then(handleResponse);

// Payments
export const apiCreateOrder = (planType: string) =>
  fetch(`${API_BASE}/api/payment/create-order`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ planType }) }).then(handleResponse);

export const apiVerifyPayment = (data: { razorpay_order_Id: string; razorpay_payment_Id: string; razorpay_signature: string }) =>
  fetch(`${API_BASE}/api/payment/verify`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) }).then(handleResponse);

export const apiGetPaymentHistory = () =>
  fetch(`${API_BASE}/api/payment/history`, { headers: getHeaders() }).then(handleResponse);
// Add these to your api.ts file:
export const apiUploadProfileImage = (imageFile: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile);
  return fetch(`${API_BASE}/api/auth/upload-image`, {
    method: "POST",
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}` 
      // Don't set Content-Type for multipart/form-data
    },
    body: formData
  }).then(async (res) => {
    const data = await res.json();
    console.log("Upload response:", data); // Check what URL comes back
    return data;
  });
};
// Resume images upload (multiple files)
export const apiUploadResumeImages = (
  resumeId: string, 
  thumbnail?: File, 
  profileImage?: File
): Promise<{ thumbnailLink?: string; profileImageLink?: string; message: string }> => {
  const formData = new FormData();
  if (thumbnail) formData.append("thumbnail", thumbnail);
  if (profileImage) formData.append("profileImage", profileImage);
  
  return fetch(`${API_BASE}/api/resumes/${resumeId}/upload-images`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: formData
  }).then(handleResponse);
};

// Email sending
export const apiSendResumeEmail = (
  recipientEmail: string,
  subject: string,
  message: string,
  pdfFile: File
): Promise<{ success: boolean; message: string }> => {
  const formData = new FormData();
  formData.append("recipientEmail", recipientEmail);
  formData.append("subject", subject);
  formData.append("message", message);
  formData.append("pdfFile", pdfFile);
  
  return fetch(`${API_BASE}/api/email/send-resume`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    body: formData
  }).then(handleResponse);
};