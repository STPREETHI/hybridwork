import { useState } from "react";
import { Calendar, Users, MessageSquare, Settings, Home, User, Heart, Trophy, MessageCircle, Cloud, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WeeklyPlanner from "./WeeklyPlanner";
import TeamSchedule from "./TeamSchedule";
import PollsSection from "./PollsSection";
import AIAssistant from "./AIAssistant";
import WeatherWidget from "./WeatherWidget";
import MotivationBoard from "./MotivationBoard";
import Leaderboard from "./Leaderboard";
import AnonymousFeedback from "./AnonymousFeedback";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const WorkPlannerLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [userRole, setUserRole] = useState("worker");
  const [showAssistant, setShowAssistant] = useState(false);

  const navigation = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "planner", label: "My Schedule", icon: Calendar },
    { id: "team", label: "Team View", icon: Users },
    { id: "polls", label: "Polls", icon: MessageSquare },
    { id: "motivation", label: "Motivation", icon: Heart },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "feedback", label: "Feedback", icon: MessageCircle },
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
      case "motivation":
        return <MotivationBoard userRole={userRole} />;
      case "leaderboard":
        return <Leaderboard userRole={userRole} />;
      case "feedback":
        return <AnonymousFeedback userRole={userRole} />;
      case "settings":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Role</label>
                <select 
                  value={userRole} 
                  onChange={(e) => setUserRole(e.target.value)}
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
          <div className="p-4 md:p-6 space-y-6">
            <div className="relative bg-gradient-to-r from-primary to-secondary rounded-xl p-6 md:p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Welcome to HybridWork
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-4">Plan your hybrid work schedule seamlessly</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-gradient-to-br from-blue-light to-white border-blue-medium/20 rounded-lg p-6 shadow-sm border hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">This Week</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">WFO: 3 days • WFH: 2 days</p>
                <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => setActiveTab("planner")}>View Schedule</Button>
              </div>

              <div className="bg-gradient-to-br from-pink-light to-white border-pink-medium/20 rounded-lg p-6 shadow-sm border hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-6 h-6 text-secondary" />
                  <h3 className="font-semibold">Team Status</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">8 online • 12 total members</p>
                <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white" onClick={() => setActiveTab("team")}>View Team</Button>
              </div>

              <div className="bg-gradient-to-br from-blue-light to-white border-blue-medium/20 rounded-lg p-6 shadow-sm border hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold">Active Polls</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">2 polls awaiting your vote</p>
                <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white" onClick={() => setActiveTab("polls")}>Vote Now</Button>
              </div>

              <WeatherWidget />
            </div>
            {/* Other dashboard cards... */}
          </div>
        );
    }
  };

  const SidebarContent = () => (
    <nav className="p-4 space-y-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
          >
            <Icon className="w-5 h-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg"></div>
                <h1 className="text-xl font-bold hidden md:block">HybridWork</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
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
        {/* Sidebar for Desktop */}
        <aside className="w-64 bg-card border-r min-h-[calc(100vh-65px)] hidden md:block">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>

        {/* AI Assistant Sidebar */}
        {showAssistant && (
          <div className="hidden lg:block">
            <AIAssistant onClose={() => setShowAssistant(false)} userRole={userRole} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkPlannerLayout;