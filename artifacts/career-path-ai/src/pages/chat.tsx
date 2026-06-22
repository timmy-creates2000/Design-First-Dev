import { useState, useRef, useEffect } from "react";
import { useGetChatHistory, useSendChatMessage, getGetChatHistoryQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const { data: history, isLoading } = useGetChatHistory();
  const sendMessageMutation = useSendChatMessage();
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = history || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessageMutation.isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;

    const messageContent = input.trim();
    setInput("");

    sendMessageMutation.mutate({ data: { content: messageContent } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetChatHistoryQueryKey() });
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-muted/20">
      <header className="bg-card border-b p-4 shadow-sm z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-primary leading-tight">CareerBot</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6 pb-4" ref={scrollRef}>
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold font-heading mb-3">Hi! I'm CareerBot.</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                I can help you prepare for interviews, review your resume, suggest courses, or answer any career-related questions in the Nigerian tech space.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={msg.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-card border shadow-sm rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {sendMessageMutation.isPending && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-card border shadow-sm rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center h-12">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-muted/50 border-muted-foreground/20 rounded-full h-12 pl-6 pr-12 focus-visible:ring-1 focus-visible:ring-primary"
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 w-10 h-10 rounded-full"
            disabled={!input.trim() || sendMessageMutation.isPending}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}