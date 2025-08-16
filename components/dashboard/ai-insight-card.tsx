import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import Link from "next/link"

export function AiInsightCard() {
  return (
    <Card className="material-background">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
          <Lightbulb className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <CardTitle>AI Financial Assistant</CardTitle>
          <CardDescription>Get personalized insights and tips.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          You've spent <strong>$250 on dining out</strong> this month. Consider cooking at home more often to save
          money.
        </p>
        <Button asChild size="sm" className="w-full">
          <Link href="/ai">Ask AI Assistant</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
