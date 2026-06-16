import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entity Intelligence | Spyford SecureOps",
  description: "Manage and analyze security entities (IPs, domains, users, assets)",
};

interface Entity {
  id: string;
  type: "ip" | "domain" | "user" | "asset" | "email";
  name: string;
  value: string;
  risk_score: number;
  threat_level: "critical" | "high" | "medium" | "low" | "unknown";
  last_seen: string;
  relationships: number;
  verified: boolean;
}

export default function Entities() {
  const entities: Entity[] = [
    {
      id: "1",
      type: "ip",
      name: "Suspicious External IP",
      value: "192.168.1.104",
      risk_score: 87,
      threat_level: "critical",
      last_seen: "2024-06-09 14:32:15",
      relationships: 12,
      verified: true,
    },
    {
      id: "2",
      type: "domain",
      name: "Phishing Domain",
      value: "secure-account-verify.com",
      risk_score: 92,
      threat_level: "critical",
      last_seen: "2024-06-09 10:15:00",
      relationships: 8,
      verified: true,
    },
    {
      id: "3",
      type: "user",
      name: "Compromised User Account",
      value: "john.doe@company.com",
      risk_score: 65,
      threat_level: "high",
      last_seen: "2024-06-09 09:45:22",
      relationships: 45,
      verified: true,
    },
    {
      id: "4",
      type: "email",
      name: "Phishing Email Address",
      value: "noreply@trusted-update.net",
      risk_score: 78,
      threat_level: "high",
      last_seen: "2024-06-08 16:20:00",
      relationships: 23,
      verified: false,
    },
    {
      id: "5",
      type: "asset",
      name: "Database Server",
      value: "db-prod-01.internal",
      risk_score: 34,
      threat_level: "low",
      last_seen: "2024-06-09 15:00:00",
      relationships: 67,
      verified: true,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ip":
        return "🌐";
      case "domain":
        return "🔗";
      case "user":
        return "👤";
      case "asset":
        return "💻";
      case "email":
        return "✉️";
      default:
        return "📌";
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "critical":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "unknown":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-red-600 dark:text-red-400";
    if (score >= 60) return "text-orange-600 dark:text-orange-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Entity Intelligence
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and analyze security entities (IPs, domains, users, assets)
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Entity
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Entities
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">5,432</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Critical Threats
          </p>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">18</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            High Risk
          </p>
          <p className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-400">
            42
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Verified
          </p>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
            89%
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search entities..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Types</option>
          <option>IP Addresses</option>
          <option>Domains</option>
          <option>Users</option>
          <option>Assets</option>
          <option>Emails</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Risk Levels</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* Entity Cards */}
      <div className="grid grid-cols-1 gap-4">
        {entities.map((entity) => (
          <div
            key={entity.id}
            className={`rounded-lg border p-6 ${getThreatColor(entity.threat_level)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-3xl">{getTypeIcon(entity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-lg">
                      {entity.name}
                    </h3>
                    {entity.verified && (
                      <span className="text-lg">✓</span>
                    )}
                  </div>
                  <p className="text-sm mt-1 opacity-75 font-mono break-all">
                    {entity.value}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div
                  className={`text-3xl font-bold ${getRiskScoreColor(entity.risk_score)}`}
                >
                  {entity.risk_score}
                </div>
                <p className="text-xs mt-1 opacity-75">Risk Score</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs opacity-75">Threat Level</p>
                <p className="font-semibold mt-1">{entity.threat_level}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">Last Seen</p>
                <p className="font-semibold mt-1">{entity.last_seen}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">Relationships</p>
                <p className="font-semibold mt-1">{entity.relationships}</p>
              </div>
              <div className="flex gap-2 justify-end md:justify-start">
                <button className="px-2 py-1 text-xs rounded border current-color border-current hover:opacity-80 transition-opacity">
                  Analyze
                </button>
                <button className="px-2 py-1 text-xs rounded border current-color border-current hover:opacity-80 transition-opacity">
                  Block
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Entity Relationship Graph */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Entity Relationships
        </h2>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Visualization showing connections between related entities
          </p>
          <div className="inline-block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Entity relationship graph placeholder
            </p>
          </div>
        </div>
      </div>

      {/* Intelligence Tags */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Intelligence Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "APT-28",
            "Phishing",
            "C2",
            "Ransomware",
            "Data Exfiltration",
            "Credential Theft",
            "Lateral Movement",
            "Persistence",
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
