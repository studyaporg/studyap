"use client";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "../ui/separator";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import LoadingQuestions from "../LoadingQuestions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
const frameworks = [
  {
  value: "AP Research",
  label: "AP Research"
},
{
  value: "AP Seminar",
  label: "AP Seminar"
},
{
  value: "AP Art and Design : 2-D Design",
  label: "AP Art and Design : 2-D Design"
},
{
  value: "AP Art and Design : 3-D Design",
  label: "AP Art and Design : 3-D Design"
},
{
  value: "AP Art and Design : Drawing",
  label: "AP Art and Design : Drawing"
},
{
  value: "AP Art History",
  label: "AP Art History"
},
{
  value: "AP Biology",
  label: "AP Biology"
},
{
  value: "AP Calculus AB",
  label: "AP Calculus AB"
},
{
  value: "AP Calculus BC",
  label: "AP Calculus BC"
},
{
  value: "AP Chemistry",
  label: "AP Chemistry"
},
{
  value: "AP Chinese Language and Culture",
  label: "AP Chinese Language and Culture"
},
{
  value: "AP Computer Science A",
  label: "AP Computer Science A"
},
{
  value: "AP Computer Science Principles",
  label: "AP Computer Science Principles"
},
{
  value: "AP English Language and Composition",
  label: "AP English Language and Composition"
},
{
  value: "AP English Literature and Composition",
  label: "AP English Literature and Composition"
},
{
  value: "AP Environmental Science",
  label: "AP Environmental Science"
},
{
  value: "AP European History",
  label: "AP European History"
},
{
  value: "AP French Language and Culture",
  label: "AP French Language and Culture"
},
{
  value: "AP German Language and Culture",
  label: "AP German Language and Culture"
},
{
  value: "AP Government and Politics ",
  label: "AP Government and Politics "
},
{
  value: "AP Government and Politics ",
  label: "AP Government and Politics "
},
{
  value: "AP Human Geography",
  label: "AP Human Geography"
},
{
  value: "AP Italian Language and Culture",
  label: "AP Italian Language and Culture"
},
{
  value: "AP Japanese Language and Culture",
  label: "AP Japanese Language and Culture"
},
{
  value: "AP Latin",
  label: "AP Latin"
},
{
  value: "AP Macroeconomics",
  label: "AP Macroeconomics"
},
{
  value: "AP Microeconomics",
  label: "AP Microeconomics"
},
{
  value: "AP Music Theory",
  label: "AP Music Theory"
},
{
  value: "AP Physics 1",
  label: "AP Physics 1"
},
{
  value: "AP Physics 2",
  label: "AP Physics 2"
},
{
  value: "AP Physics C: E & M",
  label: "AP Physics C: E & M"
},
{
  value: "AP Physics C: Mechanics",
  label: "AP Physics C: Mechanics"
},
{
  value: "AP Psychology",
  label: "AP Psychology"
},
{
  value: "AP Spanish Language and Culture",
  label: "AP Spanish Language and Culture"
},
{
  value: "AP Spanish Literature and Culture",
  label: "AP Spanish Literature and Culture"
},
{
  value: "AP Statistics",
  label: "AP Statistics"
},
{
  value: "AP US History",
  label: "AP US History"
},
{
  value: "AP World History: Modern",
  label: "AP World History: Modern"
},

]

type Props = {
  topic: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = React.useState(false);
  const [finishedLoading, setFinishedLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const { toast } = useToast();
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post("/api/game", { amount, topic, type });
      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: "mcq",
      amount: 3,
    },
  });
  
  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            toast({
              title: "Error",
              description: "Something went wrong. Please try again later.",
              variant: "destructive",
            });
          }
        }
      },
      onSuccess: ({ gameId }: { gameId: string }) => {
        setFinishedLoading(true);
        setTimeout(() => {
          if (form.getValues("type") === "mcq") {
            router.push(`/play/mcq/${gameId}`);
          } else if (form.getValues("type") === "open_ended") {
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  };
  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finishedLoading} />;
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-screen">Subject</FormLabel>
                    <FormControl>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[800px] justify-between"
                          >
                            {value
                              ? frameworks.find((framework) => framework.value === value)?.label
                              : "Select a subject..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[800px] p-0">
                          <Command>
                            <CommandInput placeholder="Search subject..." />
                            <CommandEmpty>No subject found.</CommandEmpty>
                            <CommandGroup>
                              {frameworks.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                    form.setValue("topic", currentValue)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === framework.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {framework.value}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on
                      here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many questions?"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                        min={1}
                        max={15}
                      />
                    </FormControl>
                    <FormDescription>
                      You can choose how many questions you would like to be
                      quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                  className="w-1/2 rounded-none rounded-l-lg"
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                  type="button"
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                  className="w-1/2 rounded-none rounded-r-lg"
                  onClick={() => form.setValue("type", "open_ended")}
                  type="button"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
