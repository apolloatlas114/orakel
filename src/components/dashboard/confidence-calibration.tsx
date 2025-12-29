"use client";

interface ConfidenceCalibrationProps {
  userConfidence: number;
  historicalAccuracy: number;
}

export function ConfidenceCalibration({
  userConfidence,
  historicalAccuracy,
}: ConfidenceCalibrationProps) {
  const gap = userConfidence - historicalAccuracy;
  const isOverconfident = gap > 10;
  const isUnderconfident = gap < -10;
  const isCalibrated = Math.abs(gap) <= 10;

  return (
    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Confidence Calibration</h3>
          <span className="text-xs text-white/40">Post-Decision Analysis</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Main Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-2">
              Your Confidence
            </p>
            <p className="text-3xl font-bold text-white">{userConfidence}%</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 text-center">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-2">
              Historical Accuracy
            </p>
            <p
              className={`text-3xl font-bold ${
                historicalAccuracy >= userConfidence
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {historicalAccuracy}%
            </p>
          </div>
        </div>

        {/* Visual Gap */}
        <div>
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span>Calibration Gap</span>
            <span
              className={
                isCalibrated
                  ? "text-emerald-400"
                  : isOverconfident
                  ? "text-red-400"
                  : "text-amber-400"
              }
            >
              {gap > 0 ? "+" : ""}{gap}%
            </span>
          </div>
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            {/* Center marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30" />
            {/* Gap indicator */}
            <div
              className={`absolute top-0 bottom-0 rounded-full ${
                isOverconfident
                  ? "bg-red-500"
                  : isUnderconfident
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{
                left: gap >= 0 ? "50%" : `${50 + gap / 2}%`,
                width: `${Math.abs(gap) / 2}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>Underconfident</span>
            <span>Calibrated</span>
            <span>Overconfident</span>
          </div>
        </div>

        {/* Insight */}
        <div
          className={`p-4 rounded-xl border ${
            isCalibrated
              ? "bg-emerald-500/10 border-emerald-500/20"
              : isOverconfident
              ? "bg-red-500/10 border-red-500/20"
              : "bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <p
            className={`text-sm ${
              isCalibrated
                ? "text-emerald-400"
                : isOverconfident
                ? "text-red-400"
                : "text-amber-400"
            }`}
          >
            {isCalibrated
              ? "✓ Your confidence levels are well calibrated with your actual accuracy."
              : isOverconfident
              ? "You tend to overestimate accuracy at higher confidence levels."
              : "You tend to underestimate your accuracy at this confidence level."}
          </p>
        </div>

        {/* Recommendation */}
        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-white/40">Recommendation</p>
          <p className="text-sm text-white/70 mt-1">
            {isCalibrated
              ? "Continue tracking to maintain calibration awareness."
              : isOverconfident
              ? "Consider reducing confidence on similar decisions by 15-20%."
              : "Your instincts may be better than you think. Trust your analysis."}
          </p>
        </div>
      </div>
    </div>
  );
}

