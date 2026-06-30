import { ComplianceReport } from '@/types';

export default function ComplianceReportDisplay({ report }: { report: ComplianceReport }) {
  const getRecommendationColor = (status: string) => {
    const colors: Record<string, string> = {
      'strong-fit': 'bg-green-900/30 border-green-700 text-green-300',
      'good-fit': 'bg-blue-900/30 border-blue-700 text-blue-300',
      'consider': 'bg-yellow-900/30 border-yellow-700 text-yellow-300',
      'pass': 'bg-red-900/30 border-red-700 text-red-300',
    };
    return colors[status] || '';
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-900/20 text-red-300 border-red-700',
      medium: 'bg-yellow-900/20 text-yellow-300 border-yellow-700',
      low: 'bg-blue-900/20 text-blue-300 border-blue-700',
    };
    return colors[severity] || '';
  };

  return (
    <div className="space-y-6">
      {/* Header & Recommendation */}
      <div className={`border rounded-lg p-6 ${getRecommendationColor(report.recommendation.status)}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{report.guestName}</h2>
            <p className="opacity-90">{report.company}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Generated {new Date(report.generatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="border-t border-current pt-4 mt-4 opacity-90">
          <p className="font-semibold mb-2">
            Recommendation: <span className="uppercase">{report.recommendation.status.replace('-', ' ')}</span>
          </p>
          <p className="text-sm mb-3">Confidence: {Math.round(report.recommendation.confidence * 100)}%</p>
          <ul className="text-sm space-y-1">
            {report.recommendation.reasoning.map((reason, i) => (
              <li key={i}>• {reason}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profile Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.profileOverview.currentRole && (
            <div>
              <p className="text-slate-400 text-sm">Current Role</p>
              <p className="text-white font-medium">{report.profileOverview.currentRole}</p>
            </div>
          )}
          {report.profileOverview.experience && (
            <div>
              <p className="text-slate-400 text-sm">Experience</p>
              <p className="text-white font-medium">{report.profileOverview.experience}</p>
            </div>
          )}
          {report.profileOverview.location && (
            <div>
              <p className="text-slate-400 text-sm">Location</p>
              <p className="text-white font-medium">{report.profileOverview.location}</p>
            </div>
          )}
          {report.profileOverview.linkedinData?.followers && (
            <div>
              <p className="text-slate-400 text-sm">LinkedIn Followers</p>
              <p className="text-white font-medium">{report.profileOverview.linkedinData.followers.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Company Analysis */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Company Analysis</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.companyAnalysis.profile.industry && (
              <div>
                <p className="text-slate-400 text-sm">Industry</p>
                <p className="text-white font-medium">{report.companyAnalysis.profile.industry}</p>
              </div>
            )}
            {report.companyAnalysis.profile.size && (
              <div>
                <p className="text-slate-400 text-sm">Company Size</p>
                <p className="text-white font-medium">{report.companyAnalysis.profile.size}</p>
              </div>
            )}
            {report.companyAnalysis.profile.founded && (
              <div>
                <p className="text-slate-400 text-sm">Founded</p>
                <p className="text-white font-medium">{report.companyAnalysis.profile.founded}</p>
              </div>
            )}
            {report.companyAnalysis.signals.fundingStage && (
              <div>
                <p className="text-slate-400 text-sm">Funding Stage</p>
                <p className="text-white font-medium">{report.companyAnalysis.signals.fundingStage}</p>
              </div>
            )}
          </div>

          {report.companyAnalysis.signals.profitabilityIndicators && report.companyAnalysis.signals.profitabilityIndicators.length > 0 && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Profitability Indicators</p>
              <div className="space-y-1">
                {report.companyAnalysis.signals.profitabilityIndicators.map((indicator, i) => (
                  <p key={i} className="text-green-400 text-sm">✓ {indicator}</p>
                ))}
              </div>
            </div>
          )}

          {report.companyAnalysis.signals.newsHeadlines && report.companyAnalysis.signals.newsHeadlines.length > 0 && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Recent News</p>
              <ul className="space-y-1">
                {report.companyAnalysis.signals.newsHeadlines.map((headline, i) => (
                  <li key={i} className="text-slate-300 text-sm">• {headline}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ICP Fit Analysis */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">ICP Fit Analysis</h3>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 font-medium">Overall ICP Score</span>
            <span className="text-2xl font-bold text-blue-400">{Math.round(report.icpFitAnalysis.overallICPScore)}/100</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${report.icpFitAnalysis.overallICPScore}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: 'stageAlignment', label: 'Funding Stage Alignment' },
            { key: 'profitabilityAlignment', label: 'Profitability Alignment' },
            { key: 'productTypeAlignment', label: 'Product Type Alignment' },
            { key: 'geographyAlignment', label: 'Geography Alignment' },
            { key: 'presenceQualityScore', label: 'Online Presence Quality' },
          ].map(({ key, label }) => {
            const alignment = report.icpFitAnalysis[key as keyof typeof report.icpFitAnalysis] as any;
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">{label}</span>
                  <span className="text-slate-400">{Math.round(alignment.score)}/100</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${alignment.score}%` }} />
                </div>
                <p className="text-slate-400 text-sm">{alignment.details}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Online Presence */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Online Presence</h3>
        <div className="space-y-4">
          <p className="text-slate-300">{report.onlinePresence.qualityAssessment}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {report.onlinePresence.linkedinFollowers && (
              <div className="bg-slate-700 rounded p-3">
                <p className="text-slate-400 text-xs">LinkedIn</p>
                <p className="text-white font-semibold">{(report.onlinePresence.linkedinFollowers / 1000).toFixed(1)}K</p>
              </div>
            )}
            {report.onlinePresence.twitterFollowers && (
              <div className="bg-slate-700 rounded p-3">
                <p className="text-slate-400 text-xs">Twitter/X</p>
                <p className="text-white font-semibold">{(report.onlinePresence.twitterFollowers / 1000).toFixed(1)}K</p>
              </div>
            )}
            {report.onlinePresence.youtubePresence && (
              <div className="bg-slate-700 rounded p-3">
                <p className="text-slate-400 text-xs">YouTube</p>
                <p className="text-white font-semibold">{report.onlinePresence.youtubeSubscribers ? (report.onlinePresence.youtubeSubscribers / 1000).toFixed(1) + 'K' : 'Present'}</p>
              </div>
            )}
            {report.onlinePresence.speakingEngagements && (
              <div className="bg-slate-700 rounded p-3">
                <p className="text-slate-400 text-xs">Speaking Engagements</p>
                <p className="text-white font-semibold">{report.onlinePresence.speakingEngagements}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Red Flags */}
      {report.redFlags.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Red Flags</h3>
          <div className="space-y-3">
            {report.redFlags.map((flag, i) => (
              <div key={i} className={`border rounded p-3 ${getSeverityColor(flag.severity)}`}>
                <div className="flex items-start gap-3">
                  <span className="font-semibold uppercase text-xs mt-0.5">{flag.severity}</span>
                  <div>
                    <p className="font-medium">{flag.title}</p>
                    <p className="text-sm opacity-90 mt-1">{flag.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Follow-up */}
      {report.recommendation.suggestedFollowUp && report.recommendation.suggestedFollowUp.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Suggested Follow-up Questions</h3>
          <ul className="space-y-2">
            {report.recommendation.suggestedFollowUp.map((question, i) => (
              <li key={i} className="text-blue-200 text-sm">• {question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
