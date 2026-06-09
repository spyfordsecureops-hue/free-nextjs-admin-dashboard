import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autonomous Cyber Defense | Spyford SecureOps",
  description: "Real-time autonomous threat detection and automated response system",
};

interface DefenseMetric {
  label: string;
  value: string | number;
  status: "active" | "warning" | "critical";
  trend?: "up" | "down";
}

interface ThreatEvent {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  action: string;
  status: "blocked" | "mitigated" | "contained";
}

export default function AutonomousCyberDefense() {
  const metrics: DefenseMetric[] = [
    { label: "Active Threats Blocked", value: 2847, status: "active", trend: "down" },
    { label: "System Health", value: "98.5%", status: "active" },
    { label: "Detection Latency", value: "245ms", status: "active", trend: "down" },
    { label: "Response Time", value: "180ms", status: "active", trend: "down" },
  ];

  const recentEvents: ThreatEvent[] = [
    {
      id: "1",
      type: "Brute Force Attack",
      severity: "critical",
      timestamp: "2 minutes ago",
      action: "Rate limited & blocked",
      status: "blocked",
    },
    {
      id: "2",
      type: "SQL Injection Attempt",
      severity: "high",
      timestamp: "5 minutes ago",
      action: "Query sanitized & logged",
      status: "mitigated",
    },
    {
      id: "3",
      type: "DDoS Detection",
      severity: "high",
      timestamp: "12 minutes ago",
      action: "Traffic rerouted",
      status: "contained",
    },
    {
      id: "4",
      type: "Suspicious Login",
      severity: "medium",
      timestamp: "18 minutes ago",
      action: "MFA challenged",
      status: "mitigated",
    },
  ];

  const defenseLayers = [
    {
      name: "Network Layer",
      status: "operational",
      protections: ["DDoS Mitigation", "Intrusion Detection", "Traffic Filtering"],
    },
    {
      name: "Application Layer",
      status: "operational",
      protections: ["WAF Rules", "Input Validation", "Rate Limiting"],
    },
    {
      name: "Authentication Layer",
      status: "operational",
      protections: ["MFA", "Anomaly Detection", "Session Management"],
    },
    {
      name: "Data Layer",
      status: "operational",
      protections: ["Encryption", "Access Control", "Audit Logging"],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
      case "high":
        return "bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "low":
        return "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800";
      default:
        return "bg-gray-50 dark:bg-gray-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "blocked":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "mitigated":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300";
      case "contained":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Autonomous Cyber Defense
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Real-time threat detection and automated response system
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Configure Rules
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.label}
              </p>
              <div
                className={`w-3 h-3 rounded-full ${
                  metric.status === "active"
                    ? "bg-green-500"
                    : metric.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </span>
              {metric.trend && (
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "down"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {metric.trend === "down" ? "↓" : "↑"} 12%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Defense Layers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Defense Layers Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {defenseLayers.map((layer) => (
            <div
              key={layer.name}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {layer.name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {layer.status}
                </span>
              </div>
              <ul className="space-y-2">
                {layer.protections.map((protection) => (
                  <li
                    key={protection}
                    className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {protection}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Threat Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Threat Events
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentEvents.map((event) => (
            <div
              key={event.id}
              className={`p-6 border-l-4 ${
                event.severity === "critical"
                  ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                  : event.severity === "high"
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
                  : event.severity === "medium"
                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
                  : "border-green-500 bg-green-50 dark:bg-green-900/10"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {event.type}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {event.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {event.timestamp}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadgeColor(event.status)}`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Automated Response
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700 dark:text-gray-300">
                Block malicious IPs automatically
              </span>
            </li>
            <li className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700 dark:text-gray-300">
                Rate limit suspicious traffic
              </span>
            </li>
            <li className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-gray-700 dark:text-gray-300">
                Trigger MFA on anomalies
              </span>
            </li>
            <li className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700 dark:text-gray-300">
                Enable emergency lockdown
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Threat Level
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Level
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  LOW
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "20%" }}
                />
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Last elevated: 2 hours ago</p>
              <p>24h Events: 2,847 blocked</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
