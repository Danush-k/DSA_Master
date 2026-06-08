import { useState, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Info } from 'lucide-react';
import useProgressStore from '../store/useProgressStore.js';
import { formatLocalDate } from '../utils/helpers.jsx';

export default function Heatmap() {
  const dailySolves = useProgressStore(useShallow((s) => s.profiles[s.activeProfileId]?.dailySolves || {}));
  const [selectedYear, setSelectedYear] = useState('Current');


  // Compute list of years from dailySolves
  const years = useMemo(() => {
    const list = new Set(['Current']);
    Object.keys(dailySolves).forEach(dateStr => {
      const year = dateStr.split('-')[0];
      if (year && year.length === 4) {
        list.add(year);
      }
    });
    list.add(new Date().getFullYear().toString());
    const sorted = Array.from(list).filter(y => y !== 'Current').sort((a, b) => b.localeCompare(a));
    return ['Current', ...sorted];
  }, [dailySolves]);

  const getMonthName = (mIndex) => {
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return names[mIndex];
  };

  const stats = useMemo(() => {
    const today = new Date();
    let startDate, endDate;
    let monthsToShow = [];

    if (selectedYear === 'Current') {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 364);
      endDate = today;

      let curYear = today.getFullYear();
      let curMonth = today.getMonth();
      for (let i = 11; i >= 0; i--) {
        let m = curMonth - i;
        let y = curYear;
        if (m < 0) {
          m += 12;
          y -= 1;
        }
        monthsToShow.push({ year: y, month: m });
      }
    } else {
      const yearNum = parseInt(selectedYear);
      startDate = new Date(yearNum, 0, 1);
      endDate = new Date(yearNum, 11, 31);

      for (let m = 0; m < 12; m++) {
        monthsToShow.push({ year: yearNum, month: m });
      }
    }

    const startStr = formatLocalDate(startDate);
    const endStr = formatLocalDate(endDate);

    let totalSubmissions = 0;
    const activeDates = new Set();

    Object.entries(dailySolves).forEach(([dateStr, count]) => {
      if (dateStr >= startStr && dateStr <= endStr && count > 0) {
        totalSubmissions += count;
        activeDates.add(dateStr);
      }
    });

    const activeDaysCount = activeDates.size;

    let maxStreak = 0;
    let currentStreak = 0;
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      const dateStr = formatLocalDate(tempDate);
      if (dailySolves[dateStr] > 0) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        currentStreak = 0;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    return {
      totalSubmissions,
      activeDays: activeDaysCount,
      maxStreak,
      monthsToShow,
    };
  }, [selectedYear, dailySolves]);

  const getMonthWeeks = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let d = 1; d <= numDays; d++) {
      const date = new Date(year, month, d);
      const dateStr = formatLocalDate(date);
      const count = dailySolves[dateStr] || 0;
      days.push({
        date: dateStr,
        dayNum: d,
        count,
        level: count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4,
      });
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  return (
    <div className="heatmap-card animate-fade-in">
      <div className="heatmap-header">
        <div className="heatmap-title-container">
          <span>{stats.totalSubmissions} submissions in the past {selectedYear === 'Current' ? 'one year' : selectedYear}</span>
          <span className="heatmap-info-icon heatmap-tooltip" data-tip="Total solved questions in the selected period.">
            <Info size={14} />
          </span>
        </div>
        <div className="heatmap-stats-wrapper">
          <div className="heatmap-stat-item">
            Total active days: <span className="heatmap-stat-value">{stats.activeDays}</span>
          </div>
          <div className="heatmap-stat-item">
            Max streak: <span className="heatmap-stat-value">{stats.maxStreak}</span>
          </div>
          <select
            className="heatmap-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map(y => (
              <option key={y} value={y}>{y === 'Current' ? 'Current' : y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="heatmap-grid-outer">
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flex: 1 }}>
          {/* Day of week labels */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, fontSize: 9, color: 'var(--text-tertiary)', width: 15, flexShrink: 0, marginTop: 0 }}>
            <span style={{ height: 10, lineHeight: '10px' }}>Su</span>
            <span style={{ height: 10, lineHeight: '10px', visibility: 'hidden' }}>Mo</span>
            <span style={{ height: 10, lineHeight: '10px' }}>Tu</span>
            <span style={{ height: 10, lineHeight: '10px', visibility: 'hidden' }}>We</span>
            <span style={{ height: 10, lineHeight: '10px' }}>Th</span>
            <span style={{ height: 10, lineHeight: '10px', visibility: 'hidden' }}>Fr</span>
            <span style={{ height: 10, lineHeight: '10px' }}>Sa</span>
          </div>

          <div className="heatmap-months-row">
            {stats.monthsToShow.map(({ year, month }) => {
              const weeks = getMonthWeeks(year, month);
              return (
                <div className="heatmap-month-column" key={`${year}-${month}`}>
                  <div className="heatmap-month-weeks-grid">
                    {weeks.map((week, wi) => (
                      <div className="heatmap-week-col" key={wi}>
                        {week.map((day, di) => (
                          day ? (
                            <div
                              key={di}
                              className="heatmap-day-node"
                              data-level={day.level}
                              title={`${day.date}: ${day.count} problems solved`}
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                background: day.level === 0 ? 'var(--bg-tertiary)' :
                                            day.level === 1 ? 'var(--heatmap-1)' :
                                            day.level === 2 ? 'var(--heatmap-2)' :
                                            day.level === 3 ? 'var(--heatmap-3)' : 'var(--heatmap-4)',
                              }}
                            />
                          ) : (
                            <div key={di} className="heatmap-day-node empty" style={{ width: 10, height: 10, borderRadius: 2 }} />
                          )
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="heatmap-month-text">{getMonthName(month)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend Stack */}
        <div className="heatmap-legend-vert-stack" title="Color Legend">
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-4)' }} />
            <span className="heatmap-legend-label">6+ solves</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-3)' }} />
            <span className="heatmap-legend-label">4-5 solves</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-2)' }} />
            <span className="heatmap-legend-label">2-3 solves</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--heatmap-1)' }} />
            <span className="heatmap-legend-label">1 solve</span>
          </div>
          <div className="heatmap-legend-item">
            <div className="heatmap-legend-square" style={{ background: 'var(--bg-tertiary)' }} />
            <span className="heatmap-legend-label">0 solves</span>
          </div>
        </div>
      </div>
    </div>
  );
}
