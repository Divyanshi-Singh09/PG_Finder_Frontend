import React, { useState, useEffect } from 'react';
import { ShieldCheck, Upload, FileText, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import { getOwnerVerificationStatus, uploadVerificationDocument, submitOwnerVerification } from '../../services/verificationService';
import { useAuth } from '../../context/AuthContext';

export default function OwnerVerification() {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.mobile || '');
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await getOwnerVerificationStatus();
      if (res.data?.record) {
        setRecord(res.data.record);
        if (res.data.record.fullName) setFullName(res.data.record.fullName);
        if (res.data.record.phone) setPhone(res.data.record.phone);
      }
    } catch (err) {
      showToast('Failed to load verification status', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleFileUpload = (docType, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit', 'error');
      return;
    }

    setUploadingDocType(docType);
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const fileData = reader.result;
        await uploadVerificationDocument(docType, fileData, file.name);
        showToast(`${docType.replace('_', ' ')} uploaded successfully!`, 'success');
        loadStatus();
      } catch (err) {
        showToast(err.message || 'Failed to upload document', 'error');
      } finally {
        setUploadingDocType(null);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      setErrorMsg('Please enter your legal name and contact phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await submitOwnerVerification(fullName, phone);
      showToast('Verification submitted for admin review!', 'success');
      loadStatus();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit verification.');
    } finally {
      setSubmitting(false);
    }
  };

  const docsMap = {};
  if (record?.documents) {
    record.documents.forEach((d) => {
      docsMap[d.type] = d;
    });
  }

  const getStatusBanner = () => {
    const status = record?.verificationStatus || 'NOT_STARTED';
    switch (status) {
      case 'APPROVED':
        return (
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <span>Owner Account Verified!</span>
            </div>
            <p className="text-xs text-emerald-700">
              Your landlord identity & ownership verification has been approved. The "Verified Owner" trust badge is live on your profile and properties.
            </p>
          </div>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return (
          <div className="p-6 bg-blue-50 rounded-3xl border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-extrabold text-lg">
              <Clock className="w-6 h-6 text-blue-600" />
              <span>Verification Under Admin Review</span>
            </div>
            <p className="text-xs text-blue-700">
              Your verification package was submitted on {record?.submittedAt ? new Date(record.submittedAt).toLocaleDateString() : 'today'}. Our administration team is reviewing your documents.
            </p>
          </div>
        );
      case 'REJECTED':
        return (
          <div className="p-6 bg-rose-50 rounded-3xl border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-lg">
              <AlertCircle className="w-6 h-6 text-rose-600" />
              <span>Verification Required Resubmission</span>
            </div>
            <p className="text-xs text-rose-700">
              Reason: "{record?.rejectionReason || 'Please upload clearer ownership documents.'}"
            </p>
            <p className="text-xs text-rose-600 font-semibold pt-1">
              Please update your documents below and resubmit for verification.
            </p>
          </div>
        );
      default:
        return (
          <div className="p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-[#0F172A] font-extrabold text-lg">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <span>Complete Landlord Verification</span>
            </div>
            <p className="text-xs text-slate-600">
              Upload your verification documents to earn the "Verified Owner" badge and build trust with seekers.
            </p>
          </div>
        );
    }
  };

  return (
    <Container className="py-8 font-sans">
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Header Banner */}
        {getStatusBanner()}

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-[#0F172A] tracking-tight">Identity & Property Ownership Verification</h2>
            <p className="text-xs text-slate-500 mt-1">
              Documents are stored securely and accessible only to authorized administration officers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={record?.verificationStatus === 'APPROVED' || record?.verificationStatus === 'SUBMITTED'}
              />
              <Input
                label="Contact Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={record?.verificationStatus === 'APPROVED' || record?.verificationStatus === 'SUBMITTED'}
              />
            </div>

            {/* Document Upload Grid */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-extrabold text-[#0F172A] uppercase tracking-wider">Required Verification Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { type: 'IDENTITY_PROOF', title: 'Identity Proof', desc: 'Government ID, Aadhaar or Passport' },
                  { type: 'ADDRESS_PROOF', title: 'Address Proof', desc: 'Utility Bill or Address Proof' },
                  { type: 'OWNERSHIP_PROOF', title: 'Property Ownership', desc: 'Deed or Property Tax Receipt' },
                ].map((doc) => {
                  const uploaded = docsMap[doc.type];
                  const isUploading = uploadingDocType === doc.type;
                  const isLocked = record?.verificationStatus === 'APPROVED' || record?.verificationStatus === 'SUBMITTED';

                  return (
                    <div key={doc.type} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#0F172A]">{doc.title}</span>
                          {uploaded && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{doc.desc}</p>
                      </div>

                      <div className="pt-2">
                        {uploaded ? (
                          <div className="space-y-2">
                            <span className="text-[10px] font-semibold text-slate-600 block truncate">
                              ✓ {uploaded.fileName || 'Uploaded'}
                            </span>
                            {!isLocked && (
                              <label className="cursor-pointer text-xs font-bold text-blue-600 hover:underline block">
                                Change Document
                                <input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={(e) => handleFileUpload(doc.type, e)}
                                />
                              </label>
                            )}
                          </div>
                        ) : (
                          <label className={`w-full py-2.5 px-3 bg-white hover:bg-blue-50 border border-slate-200 rounded-xl text-xs font-bold text-[#2563EB] flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            isLocked ? 'pointer-events-none opacity-50' : ''
                          }`}>
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileUpload(doc.type, e)}
                              disabled={isLocked}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submission Action */}
            {record?.verificationStatus !== 'APPROVED' && record?.verificationStatus !== 'SUBMITTED' && (
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  type="submit"
                  loading={submitting}
                  disabled={!record?.documents || record.documents.length === 0}
                >
                  Submit for Verification
                </Button>
              </div>
            )}

          </form>
        </div>

      </div>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </Container>
  );
}
