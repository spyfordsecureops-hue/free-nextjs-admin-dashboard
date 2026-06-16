import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threat Intelligence | Spyford SecureOps",
  description: "Threat intelligence feeds, indicators of compromise, and threat analysis",
};

interface ThreatFeed {
  id: string;
  name: string;
  source: string;
  indicators: number;
  last_updated: string;
  status: "active" | "inactive" | "error";
  coverage: number;
}

interface IOC {
  id: string;
  type: string;
  value: string;
  threat_actor: string;
  first_seen: string;
  last_seen: string;
  confidence: number;
  campaigns: string[];
}

export default function ThreatIntelligence() {
  const threatFeeds: ThreatFeed[] = [
    {
      id: "1",
      name: "MISP Feed",
      source: "community",
      indicators: 2847,
      last_updated: "2024-06-09 15:00:00",
      status: "active",
      coverage: 98,
    },
    {
      id: "2",
      name: "Cyber Threat Coalition",
      source: "commercial",
      indicators: 5432,
      last_updated: "2024-06-09 14:30:00",
      status: "active",
      coverage: 99,
    },
    {
      id: "3",
      name: "VirusTotal Intelligence",
      source: "commercial",
      indicators: 12847,
      last_updated: "2024-06-09 15:15:00",
      status: "active",
      coverage: 97,
    },
    {
      id: "4",
      name: "Internal Indicators",
      source: "internal",
      indicators: 1234,
      last_updated: "2024-06-09 14:00:00",
      status: "active",
      coverage: 100,
    },
  ];

  const iocs: IOC[] = [
    {
      id: "1",
      type: "IP Address",
      value: "192.168.1.104",
      threat_actor: "APT-28",
      first_seen: "2024-04-01",
      last_seen: "2024-06-09",
      confidence: 95,
      campaigns: ["Operation Stealth", "Campaign Alpha"],
    },
    {
      id: "2",
      type: "Domain",
      value: "malware-distribution.net",
      threat_actor: "Lazarus Group",
      first_seen: "2024-03-15",
      last_seen: "2024-06-08",
      confidence: 98,
      campaigns: ["Campaign Lazarus", "Supply Chain Attack"],
    },
    {
      id: "3",
      type: "File Hash",
      value: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      threat_actor: "Carbanak",
      first_seen: "2024-02-20",
      last_seen: "2024-06-05",
      confidence: 92,
      campaigns: ["Financial Theft", "Banking Malware"],
    },
    {
      id: "4",
      type: "Email",
      value: "admin@trusted-service.net",
      threat_actor: "Phishing Campaign",
      first_seen: "2024-05-10",
      last_seen: "2024-06-09",
      confidence: 87,
      campaigns: ["CEO Fraud", "Business Email Compromise"],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "🟢";
      case "inactive":
        return "🔴";
      case "error":
        return "⚠️";
      default:
        return "❓";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Threat Intelligence
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Threat feeds, indicators of compromise, and threat actor analysis
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Add Feed
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Active Feeds
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">4</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Indicators
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            22,360
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Threat Actors
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">847</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Coverage
          </p>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
            98.5%
          </p>
        </div>
      </div>

      {/* Threat Feeds */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Threat Intelligence Feeds
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {threatFeeds.map((feed) => (
            <div key={feed.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(feed.status)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {feed.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feed.source}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  {feed.indicators} indicators
                </span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="text-xs font-medium mb-1">Last Updated</p>
                  <p>{feed.last_updated}</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Coverage</p>
                  <p>{feed.coverage}%</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Status</p>
                  <p className="capitalize">{feed.status}</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators of Compromise */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Indicators of Compromise
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {iocs.map((ioc) => (
            <div
              key={ioc.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
                      {ioc.type}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {ioc.threat_actor}
                    </span>
                  </div>
                  <p className="font-mono text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded break-all text-gray-900 dark:text-gray-100">
                    {ioc.value}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {ioc.confidence}%
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Confidence
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <div>
                  <p className="text-xs font-medium">First Seen</p>
                  <p>{ioc.first_seen}</p>
                </div>
                <div>
                  <p className="text-xs font-medium">Last Seen</p>
                  <p>{ioc.last_seen}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-medium mb-1">Related Campaigns</p>
                  <div className="flex flex-wrap gap-1">
                    {ioc.campaigns.map((campaign) => (
                      <span
                        key={campaign}
                        className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300"
                      >
                        {campaign}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                  Block
                </button>
                <button className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                  Report
                </button>
                <button className="px-3 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Actor Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Threat Actors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "APT-28", indicators: 847, campaigns: 34 },
            { name: "Lazarus Group", indicators: 623, campaigns: 28 },
            { name: "Carbanak", indicators: 512, campaigns: 19 },
          ].map((actor) => (
            <div
              key={actor.name}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {actor.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Indicators:</span>
                  <span className="font-medium">{actor.indicators}</span>
                </div>
                <div className="flex justify-between">
                  <span>Campaigns:</span>
                  <span className="font-medium">{actor.campaigns}</span>
                </div>
              </div>
              <button className="mt-4 w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
