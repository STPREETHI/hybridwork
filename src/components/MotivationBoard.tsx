import { useState } from "react";
import { Heart, Star, Trophy, MessageCircle, Plus, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MotivationPost {
  id: string;
  author: string;
  message: string;
  type: "goal" | "shoutout" | "motivation";
  likes: number;
  timestamp: Date;
  department: string;
}

interface MotivationBoardProps {
  userRole: "worker" | "hr" | "manager";
}

const MotivationBoard = ({ userRole }: MotivationBoardProps) => {
  const [posts] = useState<MotivationPost[]>([
    {
      id: "1",
      author: "Sarah M.",
      message: "Completed our Q4 project ahead of schedule! Team collaboration was amazing 🚀",
      type: "goal",
      likes: 12,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      department: "Engineering"
    },
    {
      id: "2", 
      author: "Mike R.",
      message: "Shoutout to the design team for the beautiful new website redesign!",
      type: "shoutout",
      likes: 8,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      department: "Design"
    },
    {
      id: "3",
      author: "Lisa K.",
      message: "Remember: Every small step forward is progress. Keep pushing! 💪",
      type: "motivation",
      likes: 15,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      department: "HR"
    }
  ]);

  const getPostIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Trophy className="w-4 h-4 text-warning" />;
      case "shoutout":
        return <Star className="w-4 h-4 text-secondary" />;
      case "motivation":
        return <Zap className="w-4 h-4 text-primary" />;
      default:
        return <MessageCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getPostColor = (type: string) => {
    switch (type) {
      case "goal":
        return "from-warning/10 to-warning/5 border-warning/20";
      case "shoutout":
        return "from-secondary/10 to-secondary/5 border-secondary/20";
      case "motivation":
        return "from-primary/10 to-primary/5 border-primary/20";
      default:
        return "from-muted/10 to-muted/5 border-muted/20";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Motivation Board</h2>
          <p className="text-muted-foreground">Share goals, celebrate wins, and inspire your team</p>
        </div>
        {(userRole === "hr" || userRole === "manager") && (
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Post
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className={`p-4 bg-gradient-to-r ${getPostColor(post.type)} hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {getPostIcon(post.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{post.author}</span>
                  <Badge variant="outline" className="text-xs">
                    {post.department}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(post.timestamp)}
                  </span>
                </div>
                
                <p className="text-foreground leading-relaxed">{post.message}</p>
                
                <div className="flex items-center gap-4 pt-2">
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </button>
                  <Badge 
                    variant="secondary" 
                    className="text-xs capitalize"
                  >
                    {post.type}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MotivationBoard;