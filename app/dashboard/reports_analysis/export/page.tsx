"use client";

import { useState } from 'react';
import { ArrowLeft, Download, FileText, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export default function ExportPage() {
  const [exportType, setExportType] = useState<'pdf' | 'excel'>('pdf');
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState('month');

  const reportTypes = [
    { id: 'meeting-summary', name: 'Meeting Summary Report', description: 'All meetings with details' },
    { id: 'attendance', name: 'Attendance Report', description: 'Participant attendance records' },
    { id: 'minutes', name: 'Meeting Minutes', description: 'Detailed meeting minutes' },
    { id: 'analytics', name: 'Analytics Report', description: 'Statistics and trends' },
  ];

  const handleExport = () => {
    alert(`Exporting ${selectedReport} as ${exportType.toUpperCase()}...`);
    // Export logic would go here
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/reports_analysis"
          className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Export Reports</h1>
          <p className="text-gray-400 mt-1">Export meeting data to Excel or PDF</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Export Format</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setExportType('pdf')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  exportType === 'pdf'
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <FileText className={`w-8 h-8 mx-auto mb-3 ${
                  exportType === 'pdf' ? 'text-red-400' : 'text-gray-400'
                }`} />
                <p className={`font-medium ${
                  exportType === 'pdf' ? 'text-white' : 'text-gray-400'
                }`}>PDF</p>
              </button>
              <button
                onClick={() => setExportType('excel')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  exportType === 'excel'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <FileSpreadsheet className={`w-8 h-8 mx-auto mb-3 ${
                  exportType === 'excel' ? 'text-emerald-400' : 'text-gray-400'
                }`} />
                <p className={`font-medium ${
                  exportType === 'excel' ? 'text-white' : 'text-gray-400'
                }`}>Excel</p>
              </button>
            </div>
          </div>

          {/* Report Type Selection */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Report Type</h2>
            <div className="space-y-2">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedReport === report.id
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-[#0f0f0f] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <h3 className="text-white font-medium mb-1">{report.name}</h3>
                  <p className="text-sm text-gray-400">{report.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Date Range</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>

        {/* Export Preview & Action */}
        <div className="space-y-6">
          {/* Preview */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Export Preview</h2>
            <div className="space-y-4">
              <PreviewItem label="Format" value={exportType.toUpperCase()} />
              <PreviewItem 
                label="Report Type" 
                value={reportTypes.find(r => r.id === selectedReport)?.name || 'Not selected'} 
              />
              <PreviewItem label="Date Range" value={dateRange.charAt(0).toUpperCase() + dateRange.slice(1)} />
              <PreviewItem label="Estimated Size" value="~2.5 MB" />
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Export Options</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-[#0f0f0f] border-gray-800" defaultChecked />
                <span className="text-gray-300">Include participant details</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-[#0f0f0f] border-gray-800" defaultChecked />
                <span className="text-gray-300">Include attendance records</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-[#0f0f0f] border-gray-800" />
                <span className="text-gray-300">Include meeting minutes</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-[#0f0f0f] border-gray-800" />
                <span className="text-gray-300">Include attachments</span>
              </label>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={!selectedReport}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg font-medium flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
