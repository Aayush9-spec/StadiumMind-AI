import React from "react";

interface AlertItem {
  id: number;
  title: string;
  detail: string;
  level: "high" | "medium" | "low";
  roles: string[];
  time: string;
}

const alertsData: AlertItem[] = [
  {
    id: 1,
    title: "Gate C Overcrowding",
    detail: "Risk Level: High • Egress density critical",
    level: "high",
    roles: ["Organizer", "Security"],
    time: "2 min ago"
  },
  {
    id: 2,
    title: "Medical Assist Sector A",
    detail: "EMS dispatch requested for heat exhaustion",
    level: "high",
    roles: ["Organizer", "Medical"],
    time: "4 min ago"
  },
  {
    id: 3,
    title: "Heavy Rain Incoming",
    detail: "Concourse runoff expected in 30 minutes",
    level: "medium",
    roles: ["Organizer", "Volunteer", "Fan", "Security", "Medical"],
    time: "5 min ago"
  },
  {
    id: 4,
    title: "Metro Line 2 Delay",
    detail: "8 min headway delay on main exit loop",
    level: "low",
    roles: ["Organizer", "Volunteer", "Fan"],
    time: "7 min ago"
  }
];

interface AlertPanelProps {
  activeRole: string;
}

export default function AlertPanel({ activeRole }: AlertPanelProps) {
  const filteredAlerts = alertsData.filter(item => item.roles.includes(activeRole));
  
  const getAlertClasses = (level: "high" | "medium" | "low") => {
    if (level === "high") return "bg-red-500/10 border-red-500/20 text-red-400 text-red-350";
    if (level === "medium") return "bg-amber-500/10 border-amber-500/20 text-amber-400 text-amber-350";
    return "bg-blue-500/10 border-blue-500/20 text-blue-400 text-blue-350";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
        <span>Contextual Alerts ({activeRole})</span>
        <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-black text-[9px] border border-red-500/20">
          {filteredAlerts.length}
        </span>
      </div>

      {filteredAlerts.map(alert => {
        const classes = getAlertClasses(alert.level).split(" ");
        const bgBorder = `${classes[0]} ${classes[1]}`;
        const titleColor = classes[2];
        const detailColor = classes[3];
        return (
          <div key={alert.id} className={`p-3 border rounded-xl space-y-1 ${bgBorder}`}>
            <p className={`text-xs font-bold ${titleColor}`}>{alert.title}</p>
            <p className={`text-[10px] ${detailColor}`}>{alert.detail} • {alert.time}</p>
          </div>
        );
      })}
    </div>
  );
}
