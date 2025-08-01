import { useState } from "react";
import { Calendar, Users, MessageSquare, Settings, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WeeklyPlanner from "./WeeklyPlanner";
import TeamSchedule from "./TeamSchedule";
import PollsSection from "./PollsSection";
import AIAssistant from "./AIAssistant";

const WorkPlannerLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userRole, setUserRole] = useState<"worker" | "hr" | "manager">("worker");
  const [showAssistant, setShowAssistant] = useState(false);

  const navigation = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "planner", label: "My Schedule", icon: Calendar },
    { id: "team", label: "Team View", icon: Users },
    { id: "polls", label: "Polls", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "planner":
        return <WeeklyPlanner userRole={userRole} />;
      case "team":
        return <TeamSchedule userRole={userRole} />;
      case "polls":
        return <PollsSection userRole={userRole} />;
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Role</label>
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="worker">Worker</option>
                  <option value="hr">HR/Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome to HybridWork</h1>
              <p className="text-lg opacity-90">Plan your hybrid work schedule seamlessly</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">This Week</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">WFO: 3 days • WFH: 2 days</p>
                <Button size="sm" onClick={() => setActiveTab("planner")}>View Schedule</Button>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-wfh" />
                  <h3 className="font-semibold">Team Status</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">8 online • 12 total members</p>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("team")}>View Team</Button>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                  <h3 className="font-semibold">Active Polls</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">2 polls awaiting your vote</p>
                <Button size="sm" variant="outline" onClick={() => setActiveTab("polls")}>Vote Now</Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
            <h1 className="text-xl font-bold">HybridWork</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="capitalize">{userRole}</Badge>
            <Button
              size="sm"
              onClick={() => setShowAssistant(!showAssistant)}
              className="bg-secondary hover:bg-secondary/90"
            >
              AI Assistant
            </Button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {renderContent()}
        </main>

        {/* AI Assistant Sidebar */}
        {showAssistant && (
          <AIAssistant onClose={() => setShowAssistant(false)} userRole={userRole} />
        )}
      </div>
    </div>
  );
};

export default WorkPlannerLayout;