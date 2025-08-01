import { useState } from "react";
import { Users, Filter, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TeamScheduleProps {
  userRole: "worker" | "hr" | "manager";
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  isOnline: boolean;
  schedule: {
    monday: "wfo" | "wfh" | "off";
    tuesday: "wfo" | "wfh" | "off";
    wednesday: "wfo" | "wfh" | "off";
    thursday: "wfo" | "wfh" | "off";
    friday: "wfo" | "wfh" | "off";
    saturday: "wfo" | "wfh" | "off";
    sunday: "wfo" | "wfh" | "off";
  };
}

const TeamSchedule = ({ userRole }: TeamScheduleProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock team data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Chen",
      role: "Frontend Developer",
      department: "Engineering",
      avatar: "SC",
      isOnline: true,
      schedule: {
        monday: "wfo",
        tuesday: "wfh",
        wednesday: "wfo",
        thursday: "wfh",
        friday: "wfo",
        saturday: "off",
        sunday: "off",
      },
    },
    {
      id: "2",
      name: "Marcus Johnson",
      role: "Product Manager",
      department: "Product",
      avatar: "MJ",
      isOnline: true,
      schedule: {
        monday: "wfh",
        tuesday: "wfo",
        wednesday: "wfh",
        thursday: "wfo",
        friday: "wfh",
        saturday: "off",
        sunday: "off",
      },
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      role: "Designer",
      department: "Design",
      avatar: "ER",
      isOnline: false,
      schedule: {
        monday: "wfo",
        tuesday: "wfo",
        wednesday: "wfh",
        thursday: "wfh",
        friday: "wfo",
        saturday: "off",
        sunday: "off",
      },
    },
    {
      id: "4",
      name: "Alex Kim",
      role: "Backend Developer",
      department: "Engineering",
      avatar: "AK",
      isOnline: true,
      schedule: {
        monday: "wfh",
        tuesday: "wfh",
        wednesday: "wfo",
        thursday: "wfo",
        friday: "wfh",
        saturday: "off",
        sunday: "off",
      },
    },
  ];

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "wfo": return "bg-wfo";
      case "wfh": return "bg-wfh";
      case "off": return "bg-off";
      default: return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "wfo": return "Office";
      case "wfh": return "Home";
      case "off": return "Off";
      default: return "";
    }
  };

  const getDaySummary = (day: string) => {
    const daySchedules = teamMembers.map(member => member.schedule[day as keyof typeof member.schedule]);
    const wfoCount = daySchedules.filter(status => status === "wfo").length;
    const wfhCount = daySchedules.filter(status => status === "wfh").length;
    
    return { wfoCount, wfhCount, total: teamMembers.length };
  };

  const filteredMembers = selectedDepartment === "all" 
    ? teamMembers 
    : teamMembers.filter(member => member.department === selectedDepartment);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Schedule</h2>
          <p className="text-muted-foreground">December 2 - December 8, 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            <Eye className="w-4 h-4 mr-2" />
            {viewMode === "grid" ? "List" : "Grid"}
          </Button>
        </div>
      </div>

      {/* Department Filter */}
      <div className="flex gap-2">
        <Button
          variant={selectedDepartment === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDepartment("all")}
        >
          All Departments
        </Button>
        <Button
          variant={selectedDepartment === "Engineering" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDepartment("Engineering")}
        >
          Engineering
        </Button>
        <Button
          variant={selectedDepartment === "Product" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDepartment("Product")}
        >
          Product
        </Button>
        <Button
          variant={selectedDepartment === "Design" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedDepartment("Design")}
        >
          Design
        </Button>
      </div>

      {/* Daily Summary */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Office Attendance Overview</h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const summary = getDaySummary(day);
            return (
              <div key={day} className="text-center">
                <p className="text-sm font-medium mb-2">{dayLabels[index]}</p>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    {summary.wfoCount}/{summary.total} in office
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-wfo h-2 rounded-full transition-all" 
                      style={{ width: `${(summary.wfoCount / summary.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Team Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Avatar>
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                {member.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <Badge variant="secondary" className="text-xs">{member.department}</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const status = member.schedule[day as keyof typeof member.schedule];
                return (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded ${getStatusColor(status)} flex items-center justify-center`}
                    title={`${dayLabels[index]}: ${getStatusLabel(status)}`}
                  >
                    <span className="text-xs text-white font-medium">
                      {dayLabels[index][0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Legend</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-wfo rounded"></div>
            <span className="text-sm">Work from Office</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-wfh rounded"></div>
            <span className="text-sm">Work from Home</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-off rounded"></div>
            <span className="text-sm">Day Off</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm">Online Now</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamSchedule;