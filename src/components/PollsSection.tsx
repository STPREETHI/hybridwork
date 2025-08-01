import { useState } from "react";
import { ThumbsUp, ThumbsDown, Plus, Clock, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Poll {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  votes: {
    up: number;
    down: number;
  };
  userVote?: "up" | "down";
  suggestion?: string;
  voters: string[];
}

interface PollsSectionProps {
  userRole: "worker" | "hr" | "manager";
}

const PollsSection = ({ userRole }: PollsSectionProps) => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "1",
      title: "Should we all come in on Friday?",
      description: "Team collaboration day - let's discuss the Q1 planning together",
      createdBy: "Sarah Chen (Manager)",
      createdAt: "2 hours ago",
      expiresAt: "Tomorrow 9:00 AM",
      votes: { up: 8, down: 2 },
      suggestion: "Friday shows the highest potential for full team collaboration",
      voters: ["John", "Sarah", "Mike", "+7 others"],
    },
    {
      id: "2",
      title: "WFH Wednesday initiative?",
      description: "Proposal to make Wednesday a default WFH day for focused work",
      createdBy: "HR Team",
      createdAt: "1 day ago",
      expiresAt: "In 2 days",
      votes: { up: 15, down: 3 },
      suggestion: "Wednesday typically has the lowest office attendance",
      voters: ["Alex", "Emily", "Marcus", "+15 others"],
    },
  ]);

  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: "",
    description: "",
  });

  const handleVote = (pollId: string, voteType: "up" | "down") => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId) {
        const newVotes = { ...poll.votes };
        
        // Remove previous vote if exists
        if (poll.userVote === "up") newVotes.up--;
        if (poll.userVote === "down") newVotes.down--;
        
        // Add new vote
        if (voteType === "up") newVotes.up++;
        if (voteType === "down") newVotes.down++;
        
        return {
          ...poll,
          votes: newVotes,
          userVote: poll.userVote === voteType ? undefined : voteType,
        };
      }
      return poll;
    }));
  };

  const createPoll = () => {
    if (!newPoll.title.trim()) return;
    
    const poll: Poll = {
      id: Date.now().toString(),
      title: newPoll.title,
      description: newPoll.description,
      createdBy: "You",
      createdAt: "Just now",
      expiresAt: "In 24 hours",
      votes: { up: 0, down: 0 },
      voters: [],
    };
    
    setPolls([poll, ...polls]);
    setNewPoll({ title: "", description: "" });
    setShowCreatePoll(false);
  };

  const getVotePercentage = (poll: Poll, type: "up" | "down") => {
    const total = poll.votes.up + poll.votes.down;
    if (total === 0) return 0;
    return (poll.votes[type] / total) * 100;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Polls</h2>
          <p className="text-muted-foreground">Vote on workplace decisions and initiatives</p>
        </div>
        {(userRole === "manager" || userRole === "hr") && (
          <Button onClick={() => setShowCreatePoll(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        )}
      </div>

      {/* Create Poll Form */}
      {showCreatePoll && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Poll</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Poll Question</label>
              <input
                type="text"
                value={newPoll.title}
                onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                placeholder="e.g., Should we have a team lunch on Friday?"
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                value={newPoll.description}
                onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
                placeholder="Add more context about the poll..."
                className="w-full p-3 border rounded-lg h-24"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={createPoll}>Create Poll</Button>
              <Button variant="outline" onClick={() => setShowCreatePoll(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active Polls */}
      <div className="space-y-4">
        {polls.map((poll) => (
          <Card key={poll.id} className="p-6">
            <div className="space-y-4">
              {/* Poll Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{poll.title}</h3>
                  {poll.description && (
                    <p className="text-muted-foreground mb-3">{poll.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By {poll.createdBy}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {poll.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {poll.votes.up + poll.votes.down} votes
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="ml-4">
                  Expires {poll.expiresAt}
                </Badge>
              </div>

              {/* Voting Results */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4 text-success" />
                        Yes ({poll.votes.up})
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getVotePercentage(poll, "up").toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={getVotePercentage(poll, "up")} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <ThumbsDown className="w-4 h-4 text-destructive" />
                        No ({poll.votes.down})
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {getVotePercentage(poll, "down").toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={getVotePercentage(poll, "down")} className="h-2" />
                  </div>
                </div>
              </div>

              {/* AI Suggestion */}
              {poll.suggestion && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">AI Insight</p>
                      <p className="text-sm text-muted-foreground">{poll.suggestion}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Vote Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Button
                    variant={poll.userVote === "up" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote(poll.id, "up")}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Yes
                  </Button>
                  <Button
                    variant={poll.userVote === "down" ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleVote(poll.id, "down")}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    No
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Voted by: {poll.voters.slice(0, 3).join(", ")}
                  {poll.voters.length > 3 && ` +${poll.voters.length - 3} others`}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {polls.length === 0 && !showCreatePoll && (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No active polls</h3>
            <p className="text-muted-foreground">
              {userRole === "worker" 
                ? "Check back later for new polls from your team"
                : "Create your first poll to gather team feedback"}
            </p>
            {(userRole === "manager" || userRole === "hr") && (
              <Button onClick={() => setShowCreatePoll(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create First Poll
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PollsSection;