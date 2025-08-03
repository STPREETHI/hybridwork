import { Crown, TrendingUp, Calendar, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// LeaderboardEntry structure: id, name, department, officeAttendance, streak, avatar, rank
// LeaderboardProps: userRole

const Leaderboard = ({ userRole }) => {
  const leaderboardData = [
    {
      id: "1",
      name: "Alex Chen",
      department: "Engineering",
      officeAttendance: 92,
      streak: 8,
      avatar: "AC",
      rank: 1
    },
    {
      id: "2", 
      name: "Sarah Wilson",
      department: "Design",
      officeAttendance: 88,
      streak: 6,
      avatar: "SW",
      rank: 2
    },
    {
      id: "3",
      name: "Mike Rodriguez", 
      department: "Marketing",
      officeAttendance: 85,
      streak: 5,
      avatar: "MR",
      rank: 3
    },
    {
      id: "4",
      name: "Emma Davis",
      department: "Sales",
      officeAttendance: 82,
      streak: 4,
      avatar: "ED",
      rank: 4
    },
    {
      id: "5",
      name: "James Kim",
      department: "Engineering", 
      officeAttendance: 78,
      streak: 3,
      avatar: "JK",
      rank: 5
    }
  ];

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1">
            <Crown className="w-4 h-4 text-warning" />
            <Badge className="bg-gradient-to-r from-warning to-warning/80 text-white">
              1st
            </Badge>
          </div>
        );
      case 2:
        return <Badge className="bg-gradient-to-r from-muted-foreground to-muted-foreground/80 text-white">2nd</Badge>;
      case 3:
        return <Badge className="bg-gradient-to-r from-secondary to-secondary/80 text-white">3rd</Badge>;
      default:
        return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 75) return "text-primary";
    if (percentage >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Office Presence Leaderboard</h2>
          <p className="text-muted-foreground">Celebrating consistent hybrid work participation</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            This Month
          </Badge>
        </div>
      </div>

      {/* Top 3 Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {leaderboardData.slice(0, 3).map((entry, index) => (
          <Card 
            key={entry.id}
            className={`p-4 text-center ${
              index === 0 
                ? "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20" 
                : index === 1
                ? "bg-gradient-to-br from-muted/10 to-muted/5 border-muted/20"
                : "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20"
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                index === 0 ? "bg-gradient-to-br from-warning to-warning/80" :
                index === 1 ? "bg-gradient-to-br from-muted-foreground to-muted-foreground/80" :
                "bg-gradient-to-br from-secondary to-secondary/80"
              }`}>
                {entry.avatar}
              </div>
              
              {getRankBadge(entry.rank)}
              
              <div>
                <h3 className="font-semibold text-foreground">{entry.name}</h3>
                <p className="text-xs text-muted-foreground">{entry.department}</p>
              </div>
              
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Attendance</span>
                  <span className={`font-bold ${getAttendanceColor(entry.officeAttendance)}`}>
                    {entry.officeAttendance}%
                  </span>
                </div>
                <Progress value={entry.officeAttendance} className="h-2" />
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{entry.streak} week streak</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Full Rankings</h3>
        </div>
        
        <div className="space-y-3">
          {leaderboardData.map((entry) => (
            <div 
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getRankBadge(entry.rank)}
                
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-semibold">
                  {entry.avatar}
                </div>
                
                <div>
                  <p className="font-medium text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.department}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-bold ${getAttendanceColor(entry.officeAttendance)}`}>
                  {entry.officeAttendance}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.streak} week streak
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;