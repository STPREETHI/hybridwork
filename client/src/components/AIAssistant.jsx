import { useState } from "react";
import { X, Send, Bot, Lightbulb, HelpCircle, Settings2, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// AIAssistantProps: onClose, userRole
// Message structure: id, type, content, timestamp

const AIAssistant = ({ onClose, userRole }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "assistant",
      content: `Hi! I'm your HybridWork AI assistant. I'm here to help you navigate the platform and make the most of your hybrid work planning. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const quickActions = [
    { id: "schedule", label: "How to set my schedule?", icon: Calendar },
    { id: "team", label: "View team availability", icon: Users },
    { id: "polls", label: "Understanding polls", icon: HelpCircle },
    { id: "features", label: "Platform features", icon: Lightbulb },
  ];

  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("schedule") || message.includes("planner")) {
      return `To set your weekly schedule:
      
1. Go to the "My Schedule" tab in the sidebar
2. Click on any day to cycle through: Work from Office → Work from Home → Day Off
3. Your changes are saved automatically
4. Click "Submit Schedule" when you're ready to share with your team

💡 Tip: You can copy last week's schedule or save templates for recurring patterns!`;
    }
    
    if (message.includes("team") || message.includes("colleague")) {
      return `To view your team's schedule:
      
1. Navigate to the "Team View" tab
2. Filter by department if needed
3. Each person's card shows their weekly plan with color coding:
   - Blue: Work from Office
   - Green: Work from Home
   - Gray: Day Off
   
🟢 Green dot = Currently online
📊 The overview chart shows office capacity for each day`;
    }
    
    if (message.includes("poll") || message.includes("vote")) {
      return `Polls help your team make decisions together:
      
${userRole === "worker" ? 
  `• Vote with 👍 or 👎 on active polls
• See real-time results and AI insights
• Check the "Polls" tab for new votes needed` :
  `• Create new polls with the "Create Poll" button
• Add context in the description
• View real-time voting results
• AI provides insights based on team patterns`}

💡 Common poll topics: office collaboration days, team events, policy changes`;
    }
    
    if (message.includes("feature") || message.includes("help")) {
      return `HybridWork Platform Features:
      
📅 **Weekly Planner**: Set your WFO/WFH schedule
👥 **Team View**: See everyone's availability  
🗳️ **Polls**: Participate in team decisions
🤖 **AI Assistant**: Get help and insights (that's me!)

${userRole === "hr" ? `🔧 **HR Tools**: Manage teams, broadcast updates` : ""}
${userRole === "manager" ? `📊 **Manager Dashboard**: Department summaries, create polls` : ""}

🔔 You'll get notifications for schedule reminders and updates!`;
    }
    
    if (message.includes("setup") || message.includes("getting started")) {
      return `Getting Started with HybridWork:

1. **Set Your Role**: Make sure your role (${userRole}) is correct in Settings
2. **Plan Your Week**: Use the Weekly Planner to set WFO/WFH days
3. **Check Your Team**: View team schedules for collaboration planning
4. **Stay Updated**: Watch for polls and notifications

Need help with anything specific? Just ask!`;
    }
    
    return `I understand you're asking about "${userMessage}". Here are some things I can help with:

• Setting up your weekly work schedule
• Understanding team availability
• How to vote in polls and create them
• Platform features and navigation
• Getting started tips

Try asking about any of these topics, or click one of the quick action buttons below!`;
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    
    const assistantResponse = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: getAIResponse(inputMessage),
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage, assistantResponse]);
    setInputMessage("");
  };

  const handleQuickAction = (actionId) => {
    const actionMap = {
      schedule: "How do I set my weekly schedule?",
      team: "How can I view my team's availability?",
      polls: "How do polls work?",
      features: "What features are available?",
    };
    
    setInputMessage(actionMap[actionId] || "");
  };

  return (
    <div className="w-80 bg-card border-l h-[calc(100vh-73px)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground mb-3">Quick Help:</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                className="h-auto p-2 text-xs"
                onClick={() => handleQuickAction(action.id)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 p-2 text-sm border rounded-lg"
          />
          <Button size="sm" onClick={sendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;