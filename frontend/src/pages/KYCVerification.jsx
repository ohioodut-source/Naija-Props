import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Shield, Upload, FileCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

const KYCVerification = () => {
    const { user, fetchUser } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [documentType, setDocumentType] = useState('National ID Card');
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (!user) {
            addToast('Please login to access KYC verification', 'error');
            navigate('/login');
            return;
        }

        // Fetch current status
        const checkStatus = async () => {
            try {
                const res = await fetch(`${API_URL}/kyc/status`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data.status);
                }
            } catch (e) {
                console.error("Error fetching KYC status:", e);
            }
        };
        checkStatus();
    }, [user, navigate, addToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            addToast('Please select a file to upload', 'error');
            return;
        }

        setSubmitting(true);
        // Simulate file upload network delay
        setTimeout(async () => {
            try {
                // Mocking the file url for demo purposes
                const payload = {
                    document_type: documentType,
                    file_url: `/mock/uploads/id_${Date.now()}.jpg`
                };

                const res = await fetch(`${API_URL}/kyc/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    addToast('Identity verification submitted successfully! You are now verified.', 'success');
                    setStatus('Approved');
                    // Refresh user data globally to get updated is_verified status
                    if (fetchUser) await fetchUser();
                } else {
                    const err = await res.json();
                    addToast(err.detail || 'Verification failed', 'error');
                }
            } catch (err) {
                addToast('Network error while communicating with server', 'error');
            } finally {
                setSubmitting(false);
            }
        }, 1500);
    };

    if (user && user.is_verified) {
        return (
            <div className="min-h-screen bg-[#0F172A] pt-24 pb-12 flex items-center justify-center">
                <div className="bg-[#1E293B] p-8 rounded-xl shadow-2xl border border-gray-800 text-center max-w-md w-full mx-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Verification Complete</h2>
                    <p className="text-gray-400 mb-6">Your identity has been verified. You can now post properties and enjoy full access to NaijaProps.</p>
                    <button onClick={() => navigate('/post')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg w-full transition-transform hover:scale-[1.02]">
                        Continue to Post Property
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] pt-24 pb-12 flex items-center justify-center">
            <div className="bg-[#1E293B] p-8 rounded-xl shadow-2xl border border-gray-800 max-w-lg w-full mx-4 transition-all duration-300 transform">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-indigo-500/10 p-4 rounded-full">
                        <Shield className="w-10 h-10 text-indigo-400" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">Identity Verification</h2>
                <p className="text-gray-400 text-center mb-8">
                    To maintain a secure community, we require all property listers to verify their identity.
                </p>

                {status && status !== 'Approved' && (
                    <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-yellow-500 font-medium">Verification Pending</h4>
                            <p className="text-sm text-yellow-500/80 mt-1">Your documents are currently under review by our compliance team.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Document Type</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full bg-[#0F172A] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                            <option>National ID Card</option>
                            <option>International Passport</option>
                            <option>Driver's License</option>
                            <option>Voter's Card (NIN)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Upload Document</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg bg-[#0F172A] hover:bg-gray-800/50 transition-colors cursor-pointer relative group">
                            <div className="space-y-1 text-center">
                                {file ? (
                                    <FileCheck className="mx-auto h-12 w-12 text-green-400 group-hover:scale-110 transition-transform" />
                                ) : (
                                    <Upload className="mx-auto h-12 w-12 text-gray-500 group-hover:scale-110 transition-transform" />
                                )}
                                <div className="flex text-sm text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none">
                                        <span>{file ? 'Change file' : 'Upload a file'}</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            accept=".jpg,.jpeg,.png,.pdf"
                                        />
                                    </label>
                                    {!file && <p className="pl-1">or drag and drop</p>}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {file ? file.name : 'PNG, JPG, PDF up to 10MB'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || !file}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white ${submitting || !file ? 'bg-gray-600 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#1E293B] hover:-translate-y-0.5 transition-all'}`}
                    >
                        {submitting ? 'Authenticating...' : 'Submit for Verification'}
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-4">
                        By submitting, you agree to our Terms of Service and Privacy Policy regarding data collection. Your data is encrypted and securely stored.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default KYCVerification;
