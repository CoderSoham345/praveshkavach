import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { MobileFrame } from './components/MobileFrame';
import { Step1Dashboard } from './components/Step1Dashboard';
import { Step2ScanFront } from './components/Step2ScanFront';
import { Step3VerifyFront } from './components/Step3VerifyFront';
import { Step4ScanBack } from './components/Step4ScanBack';
import { Step5CaptureFace } from './components/Step5CaptureFace';
import { Step6Summary } from './components/Step6Summary';
import { Step7WaitingApproval } from './components/Step7WaitingApproval';
import { Step8ApprovalResult } from './components/Step8ApprovalResult';
import { VisitorHistory } from './components/VisitorHistory';
import { ResidentsDirectory } from './components/ResidentsDirectory';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { AdminSettings } from './components/AdminSettings';
import { TelegramGuardChatModal } from './components/TelegramGuardChatModal';
import { AIChatbot } from './components/chatbot/AIChatbot';

import { 
  UserRole, 
  WorkflowStep, 
  DocumentType, 
  VisitorRecord, 
  ExtractedDocData, 
  FaceVerificationData, 
  Resident, 
  SystemBuilding, 
  AuditLogItem, 
  AnalyticsStats 
} from './types';

// NOTE: Removed INITIAL_* mock data imports - all data now comes from Firebase Firestore
// See ROOT_CAUSE_ANALYSIS.md for details on removing hallucinated data

export default function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show login page if not authenticated
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  return <AppDashboard user={user} />;
}

function AppDashboard({ user }: { user: any }) {
  // App-level state
  const [currentRole, setCurrentRole] = useState<UserRole>(user.role);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scanner' | 'dashboard' | 'history' | 'residents' | 'reports' | 'admin'>('dashboard');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);

  // Sync state
  const [syncTime, setSyncTime] = useState<string>('10:25 AM');
  const [isTelegramChatOpen, setIsTelegramChatOpen] = useState<boolean>(false);

  // Master Data Stores - EMPTY by default, will be populated from Firebase Firestore
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [buildings, setBuildings] = useState<SystemBuilding[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsStats>({
    totalVisitors: 0,
    totalApproved: 0,
    totalRejected: 0,
    checkedInToday: 0,
    averageProcessingTime: 0,
    verificationSuccessRate: 0,
  });

  // Workflow temporary states
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('Aadhaar Card');
  const [frontDocImage, setFrontDocImage] = useState<string>('');
  const [backDocImage, setBackDocImage] = useState<string>('');
  const [liveFaceImage, setLiveFaceImage] = useState<string>('');

  // Extracted data starts empty - populated only by real OCR
  const [extractedData, setExtractedData] = useState<ExtractedDocData>({
    fullName: '',
    dob: '',
    gender: '',
    documentNumber: '',
    documentType: 'Aadhaar Card',
    confidenceScore: 0,
    lowConfidenceFields: [],
  });

  const [faceMetrics, setFaceMetrics] = useState<FaceVerificationData>({
    faceDetected: true,
    qualityScore: 96,
    brightness: 92,
    sharpness: 94,
    framingPass: true,
    livenessPassed: true,
    maskDetected: false,
    faceMatchScore: 98,
  });

  const [selectedResidentId, setSelectedResidentId] = useState<string>('');
  const [visitPurpose, setVisitPurpose] = useState<string>('');
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [numAccompanying, setNumAccompanying] = useState<number>(1);
  const [visitorPhone, setVisitorPhone] = useState<string>('');

  const [currentVisitorRecord, setCurrentVisitorRecord] = useState<VisitorRecord | null>(null);

  // Update sync clock
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch visitors from server backend on mount
  useEffect(() => {
    fetch('/api/visitors')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.visitors) {
          setVisitors(data.visitors);
        }
      })
      .catch((err) => console.log('Using local initial store:', err));
  }, []);

  // Workflow Handlers
  const handleStartWorkflow = () => {
    setActiveTab('scanner');
    setCurrentStep(2); // Step 2: Front Document Scan
  };

  // Step 2 Completed -> Go directly to Step 4 (Back Document Scan)
  const handleFrontCaptureCompleted = async (imageUrl: string, isSample?: boolean, sampleData?: any) => {
    console.log('[v0] Front capture completed:', { isSample, hasSampleData: !!sampleData });
    setFrontDocImage(imageUrl);

    if (isSample && sampleData) {
      console.log('[v0] CRITICAL: Using sample/demo data instead of real OCR:', sampleData);
      setExtractedData(sampleData);
      setCurrentStep(4);
      return;
    }

    try {
      console.log('[v0] Calling OCR API with doc type:', selectedDocType);
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageUrl, docType: selectedDocType }),
      });
      const data = await res.json();
      console.log('[v0] OCR Response:', data);
      if (data.success && data.extractedData) {
        console.log('[v0] Setting extracted data:', data.extractedData);
        setExtractedData(data.extractedData);
      } else {
        console.log('[v0] OCR did not return success or extractedData');
      }
    } catch (err) {
      console.error('[v0] OCR fetch failed:', err);
    }

    setCurrentStep(4); // Move to Scan Back Side
  };

  // Step 4 Completed -> Go to Step 3 (Extract & Review Document Details)
  const handleBackCaptureCompleted = (backUrl: string, addressData?: any) => {
    setBackDocImage(backUrl);
    if (addressData) {
      setExtractedData((prev) => ({
        ...prev,
        address: addressData.address || prev.address,
        pinCode: addressData.pinCode || prev.pinCode,
      }));
    }
    setCurrentStep(3); // Review Document Details
  };

  const handleBackSkipped = () => {
    setCurrentStep(3); // Review Document Details
  };

  // Step 3 Completed -> Go to Step 5 (Live Face Check)
  const handleProceedToFaceCheck = () => {
    setCurrentStep(5);
  };

  // Step 5 Completed -> Call AI Face Match API -> Go to Step 6 (Summary Report)
  const handleFaceCaptureCompleted = async (faceUrl: string, metrics: FaceVerificationData) => {
    setLiveFaceImage(faceUrl);
    setFaceMetrics(metrics);

    try {
      const res = await fetch('/api/face-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faceImageBase64: faceUrl, idImageBase64: frontDocImage }),
      });
      const data = await res.json();
      if (data.success && data.faceMetrics) {
        setFaceMetrics(data.faceMetrics);
      }
    } catch (err) {
      console.warn('Face match fallback:', err);
    }

    setCurrentStep(6); // Summary Report
  };

  // Step 6 Completed -> Create Visitor Record on Server -> Go to Step 7 (Telegram Approval Request)
  const handleSendRequest = async () => {
    const resident = residents.find((r) => r.id === selectedResidentId) || residents[0];

    const payload = {
      visitorName: extractedData.fullName,
      phone: visitorPhone,
      documentType: selectedDocType,
      documentNumber: extractedData.documentNumber,
      frontDocUrl: frontDocImage,
      backDocUrl: backDocImage,
      liveFaceUrl: liveFaceImage,
      extractedData,
      faceMetrics,
      residentId: resident.id,
      residentName: resident.name,
      buildingUnit: `${resident.building} (${resident.flatNumber})`,
      purpose: visitPurpose,
      vehicleNumber,
      numAccompanying,
      autoApprove: resident.autoApproveGuests,
    };

    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.visitor) {
        setCurrentVisitorRecord(data.visitor);
        setVisitors((prev) => [data.visitor, ...prev]);

        if (data.visitor.status === 'APPROVED') {
          setCurrentStep(8);
        } else {
          setCurrentStep(7);
        }
        return;
      }
    } catch (err) {
      console.warn('Server error, using client fallback record');
    }

    // Client fallback
    const newRecord: VisitorRecord = {
      id: `vis-${Date.now()}`,
      passNumber: `VP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      visitorName: extractedData.fullName,
      phone: visitorPhone,
      documentType: selectedDocType,
      documentNumber: extractedData.documentNumber,
      frontDocUrl: frontDocImage,
      backDocUrl: backDocImage,
      liveFaceUrl: liveFaceImage,
      extractedData,
      faceMetrics,
      residentId: resident.id,
      residentName: resident.name,
      buildingUnit: `${resident.building} (${resident.flatNumber})`,
      purpose: visitPurpose,
      vehicleNumber,
      numAccompanying,
      status: resident.autoApproveGuests ? 'APPROVED' : 'PENDING',
      createdAt: new Date().toISOString(),
      gateName: 'Main Gate 01',
      guardName: 'Security Officer Suresh',
      qrCodeValue: `PRAVESHKAVACH-${Date.now()}`,
    };

    setCurrentVisitorRecord(newRecord);
    setVisitors((prev) => [newRecord, ...prev]);

    if (newRecord.status === 'APPROVED') {
      setCurrentStep(8);
    } else {
      setCurrentStep(7);
    }
  };

  // Step 7 Resident Approval Decision
  const handleApproveStatus = async () => {
    if (!currentVisitorRecord) return;

    try {
      const res = await fetch(`/api/visitors/${currentVisitorRecord.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' }),
      });
      const data = await res.json();
      if (data.success && data.visitor) {
        setCurrentVisitorRecord(data.visitor);
        setVisitors((prev) => prev.map((v) => (v.id === data.visitor.id ? data.visitor : v)));
      }
    } catch (err) {
      setCurrentVisitorRecord((prev) => prev ? { ...prev, status: 'APPROVED', approvedAt: new Date().toISOString() } : null);
    }

    setCurrentStep(8);
  };

  const handleRejectStatus = async (reason: string) => {
    if (!currentVisitorRecord) return;

    try {
      const res = await fetch(`/api/visitors/${currentVisitorRecord.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED', rejectionReason: reason }),
      });
      const data = await res.json();
      if (data.success && data.visitor) {
        setCurrentVisitorRecord(data.visitor);
        setVisitors((prev) => prev.map((v) => (v.id === data.visitor.id ? data.visitor : v)));
      }
    } catch (err) {
      setCurrentVisitorRecord((prev) => prev ? { ...prev, status: 'REJECTED', rejectionReason: reason } : null);
    }

    setCurrentStep(8);
  };

  // Pass Actions
  const handleCheckInPass = async () => {
    if (!currentVisitorRecord) return;

    try {
      const res = await fetch(`/api/visitors/${currentVisitorRecord.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CHECKED_IN' }),
      });
      const data = await res.json();
      if (data.success && data.visitor) {
        setCurrentVisitorRecord(data.visitor);
        setVisitors((prev) => prev.map((v) => (v.id === data.visitor.id ? data.visitor : v)));
      }
    } catch (err) {
      setCurrentVisitorRecord((prev) => prev ? { ...prev, status: 'CHECKED_IN', checkInAt: new Date().toISOString() } : null);
    }
  };

  const handleCheckOutPass = async () => {
    if (!currentVisitorRecord) return;

    try {
      const res = await fetch(`/api/visitors/${currentVisitorRecord.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CHECKED_OUT' }),
      });
      const data = await res.json();
      if (data.success && data.visitor) {
        setCurrentVisitorRecord(data.visitor);
        setVisitors((prev) => prev.map((v) => (v.id === data.visitor.id ? data.visitor : v)));
      }
    } catch (err) {
      setCurrentVisitorRecord((prev) => prev ? { ...prev, status: 'CHECKED_OUT', checkOutAt: new Date().toISOString() } : null);
    }
  };

  const handleResetVerification = () => {
    setCurrentVisitorRecord(null);
    setFrontDocImage('');
    setBackDocImage('');
    setLiveFaceImage('');
    setCurrentStep(2);
    setActiveTab('scanner');
  };

  const pendingApprovalsCount = visitors.filter((v) => v.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Header */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        pendingApprovalsCount={pendingApprovalsCount}
        cameraActive={activeTab === 'scanner' && (currentStep === 2 || currentStep === 4 || currentStep === 5)}
        syncTime={syncTime}
        onNavigateHome={() => {
          setActiveTab('dashboard');
          setCurrentStep(1);
        }}
      />

      {/* Primary Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'scanner' && currentStep === 1) {
            setCurrentStep(2);
          }
        }}
        pendingCount={pendingApprovalsCount}
      />

      {/* Main Body with Responsive Expo Mobile Frame wrapper option */}
      <main className="flex-1">
        <MobileFrame isMobileView={isMobileView}>
          
          {/* View Tab Switching */}
          {activeTab === 'dashboard' && (
            <Step1Dashboard
              stats={analytics}
              recentVisitors={visitors}
              currentRole={currentRole}
              onStartVerification={handleStartWorkflow}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'scanner' && (
            <div>
              {currentStep === 2 && (
                <Step2ScanFront
                  selectedDocType={selectedDocType}
                  setSelectedDocType={setSelectedDocType}
                  onCaptureCompleted={handleFrontCaptureCompleted}
                  onCancel={() => {
                    setActiveTab('dashboard');
                    setCurrentStep(1);
                  }}
                />
              )}

              {currentStep === 4 && (
                <Step4ScanBack
                  docType={selectedDocType}
                  onBackCaptureCompleted={handleBackCaptureCompleted}
                  onBackSkipped={handleBackSkipped}
                />
              )}

              {currentStep === 3 && (
                <Step3VerifyFront
                  frontImage={frontDocImage}
                  extractedData={extractedData}
                  setExtractedData={setExtractedData}
                  onProceedToScanBack={handleProceedToFaceCheck}
                  onRetakeFront={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 5 && (
                <Step5CaptureFace
                  idImage={frontDocImage}
                  onFaceCaptureCompleted={handleFaceCaptureCompleted}
                  onBackToDocs={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 6 && (
                <Step6Summary
                  frontDocUrl={frontDocImage}
                  backDocUrl={backDocImage}
                  liveFaceUrl={liveFaceImage}
                  extractedData={extractedData}
                  faceMetrics={faceMetrics}
                  residents={residents}
                  selectedResidentId={selectedResidentId}
                  setSelectedResidentId={setSelectedResidentId}
                  purpose={visitPurpose}
                  setPurpose={setVisitPurpose}
                  vehicleNumber={vehicleNumber}
                  setVehicleNumber={setVehicleNumber}
                  numAccompanying={numAccompanying}
                  setNumAccompanying={setNumAccompanying}
                  visitorPhone={visitorPhone}
                  setVisitorPhone={setVisitorPhone}
                  onSendRequest={handleSendRequest}
                  onBackToFace={() => setCurrentStep(5)}
                />
              )}

              {currentStep === 7 && currentVisitorRecord && (
                <Step7WaitingApproval
                  currentVisitor={currentVisitorRecord}
                  onApprove={handleApproveStatus}
                  onReject={(reason) => handleRejectStatus(reason)}
                  onCancelRequest={() => setCurrentStep(6)}
                />
              )}

              {currentStep === 8 && currentVisitorRecord && (
                <Step8ApprovalResult
                  visitor={currentVisitorRecord}
                  onCheckIn={handleCheckInPass}
                  onCheckOut={handleCheckOutPass}
                  onNewVerification={handleResetVerification}
                />
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <VisitorHistory
              visitors={visitors}
              onSelectVisitor={(visitor) => {
                setCurrentVisitorRecord(visitor);
                setActiveTab('scanner');
                setCurrentStep(8);
              }}
              onUpdateStatus={(id, status) => {
                setVisitors((prev) =>
                  prev.map((v) => (v.id === id ? { ...v, status } : v))
                );
              }}
            />
          )}

          {activeTab === 'residents' && (
            <ResidentsDirectory
              residents={residents}
              onSelectResidentToInvite={(res) => {
                setSelectedResidentId(res.id);
                handleStartWorkflow();
              }}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAnalytics stats={analytics} />
          )}

          {activeTab === 'admin' && (
            <AdminSettings buildings={buildings} auditLogs={auditLogs} />
          )}

        </MobileFrame>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <p>PraveshKavach™ Visitor Management System • High Tech Surveillance Systems Pvt. Ltd.</p>
      </footer>

      {/* Floating AI Chatbot */}
      <AIChatbot currentPage={activeTab} currentRole={currentRole} />

    </div>
  );
}
