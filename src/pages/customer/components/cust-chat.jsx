import { useState } from "react"
import { Send, Loader2, MessageSquare, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import axios from "axios"
import { toast } from "react-toastify"

export default function CustChat() {
  const API_URL = "http://localhost:8000/api"

  const [activeTab, setActiveTab] = useState("travel")
  
  const [travelMessages, setTravelMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! I'm your travel planning assistant. Tell me about your travel plans, and I'll help you create a perfect itinerary with hotel and transportation recommendations.",
      timestamp: new Date(),
    },
  ])
  
  const [databaseMessages, setDatabaseMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I'm your database assistant. You can ask me questions about hotels, rooms, bookings, and more.",
      timestamp: new Date(),
    },
  ])
  
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Get the current active messages based on the tab
  const messages = activeTab === "travel" ? travelMessages : databaseMessages
  const setMessages = activeTab === "travel" ? setTravelMessages : setDatabaseMessages

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
      let response;
      
      if (activeTab === "travel") {
        // Call travel planning API
        response = await axios.post(`${API_URL}/travel/plan`, {
          query: input
        })
        
        // Add AI response
        const aiResponse = {
          role: "assistant",
          content: response.data.result,
          timestamp: new Date(),
        }
        
        setTravelMessages((prev) => [...prev, aiResponse])
      } else {
        // Call database query API
        response = await axios.post(`${API_URL}/llmsql/query`, {
          prompt: input
        })
        
        // Add AI response
        const aiResponse = {
          role: "assistant",
          content: response.data.result,
          timestamp: new Date(),
        }
        
        setDatabaseMessages((prev) => [...prev, aiResponse])
      }
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
      <CardHeader className="bg-sidebar-primary text-sidebar-primary-foreground p-4">
        <div className="flex items-center gap-2">
          {activeTab === "travel" ? <Map className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
          <div>
            <CardTitle>Customer Assistant</CardTitle>
            <CardDescription className="text-sidebar-primary-foreground/80">
              Get travel recommendations or ask questions about our services
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="h-10">
            <TabsTrigger value="travel" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Travel Planner
            </TabsTrigger>
            <TabsTrigger value="database" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              General Questions
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="travel" className="flex-1 p-0 m-0">
          <ScrollArea className="h-[calc(100vh-17rem)] p-4">
            {travelMessages.map((message, index) => (
              <div key={index} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className={message.role === "assistant" ? (message.isError ? "bg-destructive" : "bg-primary") : "bg-muted"}>
                    <AvatarFallback>{message.role === "assistant" ? "AI" : "You"}</AvatarFallback>
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
            {isLoading && activeTab === "travel" && (
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
        </TabsContent>
        
        <TabsContent value="database" className="flex-1 p-0 m-0">
          <ScrollArea className="h-[calc(100vh-17rem)] p-4">
            {databaseMessages.map((message, index) => (
              <div key={index} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className={message.role === "assistant" ? (message.isError ? "bg-destructive" : "bg-primary") : "bg-muted"}>
                    <AvatarFallback>{message.role === "assistant" ? "AI" : "You"}</AvatarFallback>
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
            {isLoading && activeTab === "database" && (
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
        </TabsContent>
      </Tabs>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Textarea
            placeholder={activeTab === "travel" 
              ? "Ask about travel plans (e.g., 'Plan a 3-day trip to Mumbai with budget hotels', 'What are good attractions in Delhi?')..." 
              : "Ask about our services (e.g., 'What rooms are available in Royal Park hotel?', 'Tell me about drivers in Kolkata')..."
            }
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