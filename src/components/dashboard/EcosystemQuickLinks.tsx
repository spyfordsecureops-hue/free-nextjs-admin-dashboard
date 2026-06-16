import Link from "next/link";
import React from "react";

interface EcosystemModule {
  name: string;
  path: string;
  icon: string;
  description: string;
  status: "operational" | "warning" | "critical";
  metric: string;
}

const modules: EcosystemModule[] = [
  {
    name: "Autonomous Cyber Defense",
    path: "/autonomous-defense",
    icon: "🛡️",
    description: "Real-time threat detection & automated response",
    status: "operational",
    metric: "2,847 threats blocked",
  },
  {
    name: "Evidence Management",
    path: "/evidence",
    icon: "📋",
    description: "Secure forensic evidence storage & chain of custody",
    status: "operational",
    metric: "1,247 items stored",
  },
  {
    name: "Entities",
    path: "/entities",
    icon: "🎯",
    description: "Security entities analysis & threat scoring",
    status: "operational",
    metric: "3,542 entities monitored",
  },
  {
    name: "Threat Intelligence",
    path: "/threat-intelligence",
    icon: "🔍",
    description: "Integrated threat feeds & indicators",
    status: "operational",
    metric: "847 IOCs tracked",
  },
  {
    name: "Security Analytics",
    path: "/security-analytics",
    icon: "📊",
    description: "Compliance metrics & performance tracking",
    status: "operational",
    metric: "99.8% uptime",
  },
];

export function EcosystemQuickLinks() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Spyford SecureOps Ecosystem
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quick access to security modules
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {modules.map((module) => (
          <Link
            key={module.path}
            href={module.path}
            className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-900/20"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="text-3xl">{module.icon}</span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  module.status === "operational"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {module.status}
              </span>
            </div>

            <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
              {module.name}
            </h3>

            <p className="mb-3 flex-grow text-xs text-gray-600 dark:text-gray-400">
              {module.description}
            </p>

            <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {module.metric}
              </span>
              <span className="text-lg text-gray-400">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
