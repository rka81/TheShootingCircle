import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type Session } from "@shared/schema";
import { colors } from "../ui/theme";
import { addDays, format, isWithinInterval, startOfWeek, endOfWeek } from "date-fns";

// Weekly Progress Chart
export const WeeklyProgressChart: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today);
  const endOfCurrentWeek = endOfWeek(today);

  // Generate all days of the week
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      date,
      day: format(date, "EEE"),
      accuracy: 0,
      hasData: false
    };
  });

  // Fill in data for days with sessions
  sessions.forEach(session => {
    const sessionDate = new Date(session.createdAt);
    if (isWithinInterval(sessionDate, { start: startOfCurrentWeek, end: endOfCurrentWeek })) {
      const dayIndex = sessionDate.getDay();
      daysOfWeek[dayIndex].accuracy = session.accuracy;
      daysOfWeek[dayIndex].hasData = true;
    }
  });

  const chartData = daysOfWeek.map(day => ({
    name: day.day,
    accuracy: day.hasData ? day.accuracy : null,
  }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke={colors.primary} 
            strokeWidth={2}
            dot={{ fill: colors.primary, r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Accuracy Trend Chart (for Statistics page)
export const AccuracyTrendChart: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
  // Take last 10 sessions for trend
  const trendData = [...sessions]
    .slice(0, 10)
    .reverse()
    .map((session, index) => ({
      name: `Session ${index + 1}`,
      accuracy: session.accuracy
    }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
          <Tooltip formatter={(value) => [`${value}%`, "Accuracy"]} />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke={colors.primary} 
            fill={`${colors.primary}20`}
            strokeWidth={2}
            dot={{ fill: colors.primary, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Monthly Chart (for Statistics page)
export const MonthlyChart: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
  // Create data for current and previous month
  const thisMonth = new Date().getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  
  const thisMonthName = format(new Date(new Date().setMonth(thisMonth)), "MMMM");
  const lastMonthName = format(new Date(new Date().setMonth(lastMonth)), "MMMM");
  
  const thisMonthSessions = sessions.filter(
    session => new Date(session.createdAt).getMonth() === thisMonth
  );
  
  const lastMonthSessions = sessions.filter(
    session => new Date(session.createdAt).getMonth() === lastMonth
  );
  
  const thisMonthTotalShots = thisMonthSessions.reduce((sum, s) => sum + s.totalShots, 0);
  const thisMonthScoredShots = thisMonthSessions.reduce((sum, s) => sum + s.scoredShots, 0);
  
  const lastMonthTotalShots = lastMonthSessions.reduce((sum, s) => sum + s.totalShots, 0);
  const lastMonthScoredShots = lastMonthSessions.reduce((sum, s) => sum + s.scoredShots, 0);
  
  const data = [
    { name: "Goals", [lastMonthName]: lastMonthScoredShots, [thisMonthName]: thisMonthScoredShots },
    { name: "Attempts", [lastMonthName]: lastMonthTotalShots, [thisMonthName]: thisMonthTotalShots }
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={lastMonthName} fill={colors.primary} />
          <Bar dataKey={thisMonthName} fill={colors.accent} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
