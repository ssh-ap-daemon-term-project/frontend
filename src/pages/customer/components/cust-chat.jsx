import { useState } from "react"
import { Send, Loader2, Database, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"

export default function CustChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I'm your SQL assistant. You can ask me questions about your database or request SQL queries.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Example response - in a real app, this would come from your backend
      const response = {
        role: "assistant",
        content: `Here's a SQL query based on your request:

\`\`\`sql
SELECT 
  u.username, 
  u.email, 
  h.city, 
  h.rating
FROM 
  users u
JOIN 
  hotels h ON u.id = h.userId
WHERE 
  h.rating > 4.0
ORDER BY 
  h.rating DESC;
\`\`\`

This query will return all hotels with ratings above 4.0, ordered by rating from highest to lowest, along with the hotel owner's username and email.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="w-full h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader className="bg-sidebar-primary text-sidebar-primary-foreground">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <div>
            <CardTitle>Admin SQL Assistant</CardTitle>
            <CardDescription className="text-sidebar-primary-foreground/80">
              Ask questions about your database or generate SQL queries
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">


            <ScrollArea className="h-[calc(100vh-13rem)] p-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className={message.role === "assistant" ? "bg-primary" : "bg-muted"}>
                      <AvatarFallback>{message.role === "assistant" ? "AI" : "AD"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-4 ${
                        message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/80"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar className="bg-primary">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-4 bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>

      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Textarea
            placeholder="Ask a question about your database..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[60px] flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}