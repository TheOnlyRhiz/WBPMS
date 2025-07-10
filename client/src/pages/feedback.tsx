import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, CheckCircle, AlertTriangle } from "lucide-react";
import StarRating from "@/components/ui/star-rating";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Helmet } from "react-helmet";

const feedbackFormSchema = z.object({
  passengerName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  passengerEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  plateNumber: z.string().min(5, { message: "Plate number is required" }),
  rating: z.number().min(1, { message: "Please provide a rating" }),
  feedbackType: z.string().min(1, { message: "Please select a feedback type" }),
  message: z
    .string()
    .min(10, { message: "Feedback must be at least 10 characters" }),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must consent to submit feedback",
    }),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

const Feedback = () => {
  const { toast } = useToast();
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      passengerName: "",
      passengerEmail: "",
      plateNumber: "",
      rating: 0,
      feedbackType: "",
      message: "",
      consent: false,
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (data: Omit<FeedbackFormValues, "consent">) => {
      const res = await apiRequest("POST", "/api/feedbacks", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }
      return await res.json();
    },
    onSuccess: () => {
      setErrorMessage(""); // Clear any previous errors
      form.reset();
      setShowSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    },
    onError: (error: any) => {
      console.error("Feedback submission error:", error);
      // Extract just the message from the error
      const errorMsg =
        error?.message ||
        "There was an error submitting your feedback. Please try again.";
      setErrorMessage(errorMsg);
    },
  });

  const onSubmit = (values: FeedbackFormValues) => {
    setErrorMessage(""); // Clear any previous errors
    const { consent, ...feedbackData } = values;
    feedbackMutation.mutate(feedbackData);
  };

  return (
    <>
      <Helmet>
        <title>Submit Feedback - Park Management System</title>
        <meta
          name="description"
          content="Help us improve transportation services by sharing your experience with our drivers and vehicles. Submit your feedback about your journey."
        />
        <meta
          property="og:title"
          content="Submit Feedback - Park Management System"
        />
        <meta
          property="og:description"
          content="Share your experience and help improve the transport system in Nigerian motor parks."
        />
      </Helmet>

      <div className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary">
              Passenger Feedback
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Help us improve transportation services by sharing your experience
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
            {showSuccess ? (
              <Alert className="mt-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-800 font-medium">
                  Feedback Submitted Successfully!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Thank you for your feedback. Your input helps us improve our
                  transportation services.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="passengerName">Your Name</Label>
                      <Input
                        id="passengerName"
                        placeholder="Enter your name"
                        {...form.register("passengerName")}
                        className="mt-1"
                      />
                      {form.formState.errors.passengerName && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.passengerName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="passengerEmail">Email Address</Label>
                      <Input
                        id="passengerEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        {...form.register("passengerEmail")}
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Optional, for follow-up if needed
                      </p>
                      {form.formState.errors.passengerEmail && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.passengerEmail.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="plateNumber">Vehicle Plate Number</Label>
                    <div className="relative rounded-md shadow-sm mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Car className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="plateNumber"
                        placeholder="Enter plate number (e.g. ABC-123XY)"
                        className="pl-10 font-mono uppercase"
                        {...form.register("plateNumber")}
                        onChange={(e) =>
                          form.setValue(
                            "plateNumber",
                            e.target.value.toUpperCase(),
                          )
                        }
                      />
                    </div>
                    {form.formState.errors.plateNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.plateNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label>Rate Your Experience</Label>
                    <div className="mt-2">
                      <StarRating
                        value={form.watch("rating")}
                        onChange={(rating) =>
                          form.setValue("rating", rating, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                    {form.formState.errors.rating && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.rating.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="feedbackType">Feedback Type</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue("feedbackType", value, {
                          shouldValidate: true,
                        })
                      }
                      defaultValue={form.watch("feedbackType")}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliment">Compliment</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="report">Safety Report</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.feedbackType && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.feedbackType.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="message">Your Feedback</Label>
                    <Textarea
                      id="message"
                      placeholder="Please share details about your experience..."
                      rows={5}
                      className="mt-1"
                      {...form.register("message")}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="consent"
                        checked={form.watch("consent")}
                        onCheckedChange={(checked) =>
                          form.setValue("consent", checked as boolean, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                    <div className="ml-3">
                      <Label
                        htmlFor="consent"
                        className="font-medium text-gray-700"
                      >
                        I consent to my feedback being stored and used for
                        service improvement
                      </Label>
                      {form.formState.errors.consent && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.consent.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={feedbackMutation.isPending}
                  >
                    {feedbackMutation.isPending
                      ? "Submitting..."
                      : "Submit Feedback"}
                  </Button>

                  {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;
