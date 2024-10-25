import React from 'react';

const TrioMidSummary = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="mt-4 p-4 rounded-lg shadow-md text-white">
        No valid data available for summary.
      </div>
    );
  }

  const results = data.reduce((acc, row) => {
    const result = row?.earlyResult?.toLowerCase();
    if (['win', 'draw', 'lose'].includes(result)) {
      acc[result] = (acc[result] || 0) + 1;
    }
    return acc;
  }, {});

  const determineOverallResult = () => {
    const counts = Object.values(results);
    if (counts.length === 0) return 'Unknown';

    const maxCount = Math.max(...counts);
    const winningResults = Object.keys(results).filter(key => results[key] === maxCount);

    if (winningResults.length > 1) {
      return 'Draw';
    }

    return winningResults[0].charAt(0).toUpperCase() + winningResults[0].slice(1);
  };

  const overallResult = determineOverallResult();

  const getResultColor = (result) => {
    switch (result) {
      case 'Win': return 'text-green-500';
      case 'Draw': return 'text-yellow-500';
      case 'Lose': return 'text-red-500';
      default: return 'text-white';
    }
  };

  return (
    <div className="mt-4 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-3 text-white">Result Summary</h3>
      <div className="flex justify-between items-center">
        <div className={`font-bold text-lg ${getResultColor(overallResult)}`}>
          Overall Result: {overallResult}
        </div>
      </div>
    </div>
  );
};

export default TrioMidSummary;