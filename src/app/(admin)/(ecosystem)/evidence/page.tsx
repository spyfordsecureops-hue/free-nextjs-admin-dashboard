import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evidence Management | Spyford SecureOps",
  description: "Manage security evidence, logs, and forensic data",
};

interface EvidenceItem {
  id: string;
  type: "log" | "artifact" | "image" | "pcap" | "document";
  name: string;
  source: string;
  timestamp: string;
  size: string;
  classification: "public" | "internal" | "confidential" | "restricted";
  status: "active" | "archived" | "pending_review";
  chain_of_custody: boolean;
}

export default function Evidence() {
  const evidenceItems: EvidenceItem[] = [
    {
      id: "1",
      type: "log",
      name: "Access Log - Authentication Failure",
      source: "auth-server-01",
      timestamp: "2024-06-09 14:32:15 UTC",
      size: "2.4 MB",
      classification: "confidential",
      status: "active",
      chain_of_custody: true,
    },
    {
      id: "2",
      type: "pcap",
      name: "Network Traffic Capture - Suspicious Activity",
      source: "firewall-01",
      timestamp: "2024-06-09 14:28:00 UTC",
      size: "156 MB",
      classification: "confidential",
      status: "active",
      chain_of_custody: true,
    },
    {
      id: "3",
      type: "artifact",
      name: "Malware Sample - Trojan.Win32",
      source: "endpoint-detector",
      timestamp: "2024-06-09 13:45:22 UTC",
      size: "512 KB",
      classification: "restricted",
      status: "active",
      chain_of_custody: true,
    },
    {
      id: "4",
      type: "document",
      name: "Incident Report - Unauthorized Access Attempt",
      source: "security-team",
      timestamp: "2024-06-09 12:00:00 UTC",
      size: "1.2 MB",
      classification: "internal",
      status: "pending_review",
      chain_of_custody: true,
    },
    {
      id: "5",
      type: "image",
      name: "Memory Dump - System Forensics",
      source: "forensics-lab",
      timestamp: "2024-06-08 18:30:45 UTC",
      size: "8.5 GB",
      classification: "restricted",
      status: "archived",
      chain_of_custody: true,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "log":
        return "📋";
      case "artifact":
        return "📦";
      case "image":
        return "💾";
      case "pcap":
        return "📡";
      case "document":
        return "📄";
      default:
        return "📁";
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "public":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "internal":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "confidential":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
      case "restricted":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500";
      case "archived":
        return "bg-gray-50 dark:bg-gray-900/10 border-l-4 border-gray-500";
      case "pending_review":
        return "bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500";
      default:
        return "bg-white dark:bg-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Evidence Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Secure storage and chain of custody for forensic evidence
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Upload Evidence
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">847 GB</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">12</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chain of Custody</p>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">100%</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search evidence..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Types</option>
          <option>Logs</option>
          <option>Artifacts</option>
          <option>Images</option>
          <option>PCAP</option>
          <option>Documents</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Classifications</option>
          <option>Public</option>
          <option>Internal</option>
          <option>Confidential</option>
          <option>Restricted</option>
        </select>
      </div>

      {/* Evidence List */}
      <div className="space-y-3">
        {evidenceItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${getStatusColor(item.status)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 flex gap-4">
                <div className="text-2xl flex-shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {item.name}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getClassificationColor(item.classification)}`}>
                      {item.classification}
                    </span>
                    {item.chain_of_custody && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                        ✓ Chain of Custody
                      </span>
                    )}
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Source:</span> {item.source}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {item.size}
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> {item.timestamp}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={`font-semibold ${
                          item.status === "active"
                            ? "text-green-600 dark:text-green-400"
                            : item.status === "archived"
                            ? "text-gray-600 dark:text-gray-400"
                            : "text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                  View
                </button>
                <button className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                  More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Retention Policy */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Retention Policy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Active Evidence
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Retained for 7 years or until case closure
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Archived Evidence
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Retained for 3 years after closure
            </p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Purged Evidence
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Securely deleted with audit trail
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
