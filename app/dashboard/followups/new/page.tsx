"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Loader2, CheckIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock client data
const clients = [
  { id: "1", name: "Alex Johnson", email: "alex@acme.com" },
  { id: "2", name: "Samantha Williams", email: "samantha@globex.com" },
  { id: "3", name: "David Miller", email: "david@universalexports.com" },
  { id: "4", name: "Jessica Chen", email: "jessica@soylentcorp.com" },
  { id: "5", name: "Michael Rodriguez", email: "michael@umbrellacorp.com" },
];

// Sample AI-generated email
const sampleEmail = `Dear [Client Name],

Thank you for taking the time to meet with me yesterday to discuss your company's marketing strategy. I appreciated the opportunity to learn more about your goals and challenges.

Based on our conversation, I wanted to follow up with some additional thoughts on how our solution could help address the specific pain points you mentioned around customer acquisition and retention.

I've attached a brief overview of our approach that I believe would be particularly relevant to your situation. If you'd like to discuss further or have any questions, please don't hesitate to reach out.

Would you be available for a brief call next week to continue our discussion? I'm available Tuesday or Thursday afternoon if either works for you.

Looking forward to hearing from you.

Best regards,
[Your Name]`;

export default function NewFollowupPage() {
  const [client, setClient] = useState("");
  const [subject, setSubject] = useState("");
  const [meetingContext, setMeetingContext] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendOption, setSendOption] = useState("now");
  const [date, setDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleGenerate = () => {
    if (!client || !meetingContext) {
      toast({
        title: "Missing information",
        description: "Please select a client and provide meeting context.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const selectedClient = clients.find((c) => c.id === client);
      let generatedEmail = sampleEmail;

      if (selectedClient) {
        generatedEmail = generatedEmail.replace(
          "[Client Name]",
          selectedClient.name
        );
      }

      setEmailContent(generatedEmail);
      setIsGenerating(false);

      toast({
        title: "Email generated",
        description: "Your follow-up email has been created.",
      });
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!client || !subject || !emailContent) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to send or schedule email
    setTimeout(() => {
      setIsSubmitting(false);

      toast({
        title: "Success",
        description:
          sendOption === "now"
            ? "Your follow-up email has been sent."
            : "Your follow-up email has been scheduled.",
      });

      router.push("/dashboard/followups");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Create Follow-up Email
        </h2>
        <p className="text-muted-foreground">
          Generate an AI-powered follow-up email based on your meeting context.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client & Meeting Details</CardTitle>
              <CardDescription>
                Select a client and provide context about your meeting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {client
                        ? clients?.find((c) => c.id === client)?.name ||
                          "Select a client..."
                        : "Select a client..."}
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[700px] p-0">
                    <Command>
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {clients?.map((clientItem) => (
                            <CommandItem
                              key={clientItem.id}
                              onSelect={() => {
                                setClient(clientItem.id);
                                setOpen(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  client === clientItem.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex-1">
                                <p>{clientItem.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {clientItem.email}
                                </p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  placeholder="Follow-up from our meeting"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingContext">Meeting Context</Label>
                <Textarea
                  id="meetingContext"
                  placeholder="Describe what was discussed in your meeting..."
                  rows={4}
                  value={meetingContext}
                  onChange={(e) => setMeetingContext(e.target.value)}
                />
              </div>

              <Button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !client || !meetingContext}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate AI Email"
                )}
              </Button>
            </CardContent>
          </Card>

          {emailContent && (
            <Card>
              <CardHeader>
                <CardTitle>Email Draft</CardTitle>
                <CardDescription>
                  Review and edit the generated email before sending.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <Textarea
                      rows={12}
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      className="resize-none font-mono text-sm"
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="rounded-md border p-4 whitespace-pre-line">
                      {emailContent}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {emailContent && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Options</CardTitle>
                <CardDescription>
                  Choose when to send your follow-up email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={sendOption}
                  onValueChange={setSendOption}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now">Send immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="later" id="later" />
                    <Label htmlFor="later">Schedule for later</Label>
                  </div>

                  {sendOption === "later" && (
                    <div className="pl-6 pt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/followups">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting || !emailContent}>
                  {isSubmitting
                    ? "Submitting..."
                    : sendOption === "now"
                    ? "Send Now"
                    : "Schedule"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </form>
    </div>
  );
}
