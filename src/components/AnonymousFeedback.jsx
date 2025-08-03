import { useState } from "react";
import { MessageSquare, Send, Eye, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// FeedbackItem structure: id, message, category, timestamp, status
// AnonymousFeedbackProps: userRole

const AnonymousFeedback = ({ userRole }) => {
  const [newFeedback, setNewFeedback] = useState("");
  const [category, setCategory] = useState("suggestion");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [feedbackItems] = useState([
    {
      id: "1",
      message: "The coffee machine in the office needs to be refilled more frequently. It's often empty by noon.",
      category: "concern",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "new"
    },
    {
      id: "2",
      message: "Love the new flexible seating arrangement! It makes collaboration much easier.",
      category: "praise", 
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "reviewed"
    },
    {
      id: "3",
      message: "Could we add more video conferencing rooms? Sometimes it's hard to find a quiet space for calls.",
      category: "suggestion",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "addressed"
    }
  ]);

  const handleSubmit = async () => {
    if (!newFeedback.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your anonymous feedback. We'll review it shortly.",
      });
      setNewFeedback("");
      setIsSubmitting(false);
    }, 1000);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "suggestion":
        return "bg-primary/10 text-primary border-primary/20";
      case "concern":
        return "bg-warning/10 text-warning border-warning/20";
      case "praise":
        return "bg-success/10 text-success border-success/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "reviewed":
        return <Eye className="w-4 h-4 text-primary" />;
      case "addressed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Anonymous Feedback</h2>
        <p className="text-muted-foreground">Share your thoughts safely and anonymously</p>
      </div>

      {/* Submit New Feedback */}
      <Card className="p-6 bg-gradient-to-br from-blue-light to-white border-blue-medium/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Submit Feedback</h3>
          </div>
          
          <div className="flex gap-2">
            {["suggestion", "concern", "praise"].map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className={category === cat ? "bg-primary" : ""}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your feedback anonymously..."
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={!newFeedback.trim() || isSubmitting}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? "Submitting..." : "Submit Anonymously"}
          </Button>
        </div>
      </Card>

      {/* Admin View - Show Feedback Items */}
      {(userRole === "hr" || userRole === "manager") && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Feedback</h3>
          
          {feedbackItems.map((item) => (
            <Card key={item.id} className="p-4 hover:shadow-md transition-all duration-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getStatusIcon(item.status)}
                    <span className="text-xs capitalize text-muted-foreground">
                      {item.status}
                    </span>
                  </div>
                </div>
                
                <p className="text-foreground leading-relaxed">{item.message}</p>
                
                {item.status === "new" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Mark as Reviewed
                    </Button>
                    <Button size="sm" variant="outline">
                      Mark as Addressed
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnonymousFeedback;