import React, { useState } from "react";
import { FlaskConical, Upload, FileText, Sparkles, TrendingUp, AlertCircle } from "lucide-react";

export const LabsView: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadedFile("lab_results.pdf");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Lab Results
        </h1>
        <p className="text-gray-400 text-sm mt-1">Upload and analyze your lab results with AI</p>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-white/[0.1] rounded-xl p-8 text-center hover:border-teal-500/50 transition-colors cursor-pointer"
        onClick={handleUpload}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-teal-500/10">
            <Upload size={32} className="text-teal-400" />
          </div>
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
              <p className="text-gray-400">Analyzing your lab results...</p>
            </>
          ) : (
            <>
              <p className="text-white font-medium">Upload Lab Results</p>
              <p className="text-gray-500 text-sm">PDF or image file, max 10MB</p>
            </>
          )}
        </div>
      </div>

      {/* Uploaded File */}
      {uploadedFile && (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-white font-medium">{uploadedFile}</p>
              <p className="text-gray-500 text-sm">Successfully analyzed</p>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-indigo-400" />
              <span className="text-white font-semibold">AI Analysis</span>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <span className="text-emerald-400 font-medium">Vitamin D:</span> 28 ng/mL (Slightly Low)
              </p>
              <p className="text-gray-300">
                <span className="text-emerald-400 font-medium">Cholesterol:</span> Normal range
              </p>
              <p className="text-gray-300">
                <span className="text-amber-400 font-medium">TSH:</span> 2.4 mIU/L (Optimal)
              </p>
              <p className="text-gray-300">
                <span className="text-emerald-400 font-medium">Hemoglobin:</span> 14.2 g/dL (Normal)
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
              <TrendingUp size={16} className="text-indigo-400" />
              <span className="text-gray-400 text-sm">Comparing with previous results from 3 months ago</span>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for no file */}
      {!uploadedFile && (
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-8 text-center">
          <FlaskConical size={48} className="mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">Upload your lab results to see AI-powered analysis</p>
        </div>
      )}
    </div>
  );
};