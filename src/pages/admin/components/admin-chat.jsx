import { useState } from "react"
import { Send, Loader2, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"
import axios from "axios"
import { toast } from "react-toastify"

export default function AdminChat() {
  const API_URL = "http://127.0.0.1:8000/api/llmsql"
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I'm your SQL assistant. You can ask me questions about your database in natural language.",
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

    try {
      // Call the backend API
      const response = await axios.post(`${API_URL}/query`, {
        prompt: input
      })

      // Add AI response
      const aiResponse = {
        role: "assistant",
        content: response.data.result,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error fetching response:", error)
      
      // Show error toast
      toast.error("An error occurred while processing your request. Please try again.")
      
      // Add error message
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date(),
        isError: true
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-[calc(100vh-2rem)] flex flex-col">
      <CardHeader className="bg-sidebar-primary text-sidebar-primary-foreground">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <div>
            <CardTitle>Admin SQL Assistant</CardTitle>
            <CardDescription className="text-sidebar-primary-foreground/80">
              Ask questions about your database using natural language
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-13rem)] p-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <Avatar className={message.role === "assistant" ? (message.isError ? "bg-destructive" : "bg-primary") : "bg-muted"}>
                  <AvatarFallback>{message.role === "assistant" ? "AI" : "AD"}</AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-4 ${
                    message.role === "assistant" 
                      ? message.isError 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-muted text-foreground" 
                      : "bg-primary text-primary-foreground"
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
            placeholder="Ask a question about your database (e.g., 'Show me all hotels in Mumbai', 'List available rooms at Royal Park hotel')..."
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