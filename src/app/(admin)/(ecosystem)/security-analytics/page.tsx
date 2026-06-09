import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Analytics | Spyford SecureOps",
  description: "Security metrics, trends, and performance analytics",
};

export default function SecurityAnalytics() {
  const analyticsData = [
    {
      title: "Detection Rate",
      value: "99.2%",
      change: "+2.1%",
      period: "vs last month",
    },
    {
      title: "Mean Time to Detect",
      value: "2.3 min",
      change: "-18%",
      period: "vs last month",
    },
    {
      title: "Mean Time to Respond",
      value: "4.5 min",
      change: "-25%",
      period: "vs last month",
    },
    {
      title: "Incident Severity Reduction",
      value: "35%",
      change: "+8%",
      period: "vs last month",
    },
  ];

  const incidents = [
    {
      date: "Jun 9, 2024",
      count: 284,
      blocked: 278,
      contained: 6,
      trend: "down",
    },
    {
      date: "Jun 8, 2024",
      count: 312,
      blocked: 301,
      contained: 11,
      trend: "up",
    },
    {
      date: "Jun 7, 2024",
      count: 298,
      blocked: 289,
      contained: 9,
      trend: "down",
    },
    {
      date: "Jun 6, 2024",
      count: 267,
      blocked: 258,
      contained: 9,
      trend: "down",
    },
    {
      date: "Jun 5, 2024",
      count: 254,
      blocked: 247,
      contained: 7,
      trend: "down",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Security Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Security metrics, trends, and performance analysis
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export
          </button>
          <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Last 24 Hours</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.map((metric) => (
          <div
            key={metric.title}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.title}
            </p>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </p>
              <p className="mt-2 text-sm">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {metric.change}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  {metric.period}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Trend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Daily Incident Summary
        </h2>
        <div className="space-y-4">
          {incidents.map((incident, idx) => {
            const maxCount = Math.max(...incidents.map((i) => i.count));
            const barWidth = (incident.count / maxCount) * 100;

            return (
              <div key={incident.date}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {incident.date}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {incident.count} incidents
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500 h-full flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${(incident.blocked / incident.count) * barWidth}%` }}
                    >
                      {incident.blocked > 0 && `${incident.blocked}`}
                    </div>
                    <div
                      className="bg-yellow-500 h-full flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${(incident.contained / incident.count) * barWidth}%` }}
                    >
                      {incident.contained > 0 && `${incident.contained}`}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>🟢 Blocked: {incident.blocked}</span>
                  <span>🟡 Contained: {incident.contained}</span>
                  <span
                    className={`${
                      incident.trend === "down"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {incident.trend === "down" ? "↓" : "↑"} Trending
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Score */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Current Risk Score
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">
                28
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Out of 100 (Lower is Better)
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                ↓ 12% improvement
              </p>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-green-200 dark:border-green-900 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">LOW</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Compliance Status
          </h3>
          <div className="space-y-3">
            {[
              { name: "SOC 2 Type II", status: "compliant", score: 98 },
              { name: "ISO 27001", status: "compliant", score: 96 },
              { name: "NIST Cybersecurity", status: "compliant", score: 94 },
              { name: "GDPR", status: "compliant", score: 92 },
            ].map((comp) => (
              <div key={comp.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {comp.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${comp.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">
                    {comp.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Threat Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: "Malware", count: 487, color: "bg-red-500" },
            { type: "Phishing", count: 642, color: "bg-orange-500" },
            { type: "Exploits", count: 234, color: "bg-yellow-500" },
            { type: "Other", count: 156, color: "bg-gray-500" },
          ].map((threat) => (
            <div
              key={threat.type}
              className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div
                className={`w-12 h-12 rounded-full ${threat.color} mx-auto mb-2`}
              />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {threat.type}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {threat.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Metrics
        </h3>
        <div className="space-y-4">
          {[
            {
              metric: "System Availability",
              value: 99.99,
              target: 99.95,
              status: "exceeding",
            },
            {
              metric: "False Positive Rate",
              value: 2.1,
              target: 3.0,
              status: "exceeding",
            },
            {
              metric: "Investigation Time",
              value: 45,
              target: 60,
              status: "exceeding",
            },
            {
              metric: "Response Success Rate",
              value: 98.5,
              target: 95.0,
              status: "exceeding",
            },
          ].map((perf) => (
            <div key={perf.metric} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {perf.metric}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Target: {perf.target}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {perf.value}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {perf.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
