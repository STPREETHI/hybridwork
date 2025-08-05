import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, Coffee, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// WeeklyPlannerProps: userRole
// WorkStatus options: "wfo", "wfh", "off"

const WeeklyPlanner = ({ userRole }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekSchedule, setWeekSchedule] = useState({
    monday: "wfo",
    tuesday: "wfh",
    wednesday: "wfo",
    thursday: "wfh",
    friday: "wfo",
    saturday: "off",
    sunday: "off",
  });

  const days = [
    { key: "monday", label: "Mon", date: "Dec 2" },
    { key: "tuesday", label: "Tue", date: "Dec 3" },
    { key: "wednesday", label: "Wed", date: "Dec 4" },
    { key: "thursday", label: "Thu", date: "Dec 5" },
    { key: "friday", label: "Fri", date: "Dec 6" },
    { key: "saturday", label: "Sat", date: "Dec 7" },
    { key: "sunday", label: "Sun", date: "Dec 8" },
  ];

  const statusConfig = {
    wfo: { label: "Work from Office", icon: Coffee, color: "bg-wfo", textColor: "text-white" },
    wfh: { label: "Work from Home", icon: Home, color: "bg-wfh", textColor: "text-white" },
    off: { label: "Day Off", icon: Calendar, color: "bg-off", textColor: "text-white" },
  };

  const toggleDayStatus = (day) => {
    if (userRole !== "worker") return; // Only workers can modify their schedule
    
    const statuses = ["wfo", "wfh", "off"];
    const currentIndex = statuses.indexOf(weekSchedule[day]);
    const nextIndex = (currentIndex + 1) % statuses.length;
    
    setWeekSchedule(prev => ({
      ...prev,
      [day]: statuses[nextIndex]
    }));
  };

  const getWeekSummary = () => {
    const wfoCount = Object.values(weekSchedule).filter(status => status === "wfo").length;
    const wfhCount = Object.values(weekSchedule).filter(status => status === "wfh").length;
    const offCount = Object.values(weekSchedule).filter(status => status === "off").length;
    
    return { wfoCount, wfhCount, offCount };
  };

  const { wfoCount, wfhCount, offCount } = getWeekSummary();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weekly Schedule</h2>
          <p className="text-muted-foreground">December 2 - December 8, 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-wfo rounded-full"></div>
            <div>
              <p className="text-sm text-muted-foreground">Work from Office</p>
              <p className="text-2xl font-bold">{wfoCount} days</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-wfh rounded-full"></div>
            <div>
              <p className="text-sm text-muted-foreground">Work from Home</p>
              <p className="text-2xl font-bold">{wfhCount} days</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-off rounded-full"></div>
            <div>
              <p className="text-sm text-muted-foreground">Days Off</p>
              <p className="text-2xl font-bold">{offCount} days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map((day) => {
            const status = weekSchedule[day.key];
            const config = statusConfig[status];
            const Icon = config.icon;
            
            return (
              <div
                key={day.key}
                className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-105 ${config.color} ${config.textColor}`}
                onClick={() => toggleDayStatus(day.key)}
              >
                <div className="text-center space-y-3">
                  <div>
                    <p className="text-sm opacity-90">{day.label}</p>
                    <p className="font-medium">{day.date}</p>
                  </div>
                  <Icon className="w-6 h-6 mx-auto" />
                  <p className="text-xs font-medium">{config.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Instructions */}
      {userRole === "worker" && (
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Click on any day to cycle through: Work from Office → Work from Home → Day Off
          </p>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button variant="outline">Copy Last Week</Button>
        <Button variant="outline">Save as Template</Button>
        <Button>Submit Schedule</Button>
      </div>
    </div>
  );
};

export default WeeklyPlanner;