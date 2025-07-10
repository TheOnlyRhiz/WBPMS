import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Car, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { verificationSchema } from "@shared/schema";
import { Helmet } from 'react-helmet';

interface VerificationResult {
  verified: boolean;
  vehicle?: {
    plateNumber: string;
    type: string;
    registrationDate: string;
  };
  driver?: {
    name: string;
    licenseNumber: string;
    status: string;
  };
  message?: string;
}

const Verify = () => {
  const [plateNumber, setPlateNumber] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const verifyMutation = useMutation({
    mutationFn: async (data: { plateNumber: string }) => {
      // Validate input
      verificationSchema.parse(data);
      
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      // Always return the result, whether success or failure
      return result;
    },
    onSuccess: (data) => {
      setResult(data);
      // No toast notifications - we handle everything inline
    },
    onError: (error) => {
      // Only show toast for actual network/system errors, not verification failures
      toast({
        title: "Connection Error",
        description: "Unable to connect to verification service. Please check your connection and try again.",
        variant: "destructive",
      });
      console.error("Verification error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyMutation.mutate({ plateNumber });
  };

  const handleReset = () => {
    setResult(null);
    setPlateNumber("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Verify Vehicle - Park Management System</title>
        <meta name="description" content="Verify a vehicle's registration status before boarding. Enter the plate number to confirm if a vehicle is registered in our system." />
        <meta property="og:title" content="Verify Vehicle - Park Management System" />
        <meta property="og:description" content="Ensure your safety by verifying vehicles before boarding at Nigerian motor parks." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Car className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Vehicle Verification
              </h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Enter a plate number to verify vehicle registration
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white">
            {!result ? (
              <div className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <Label htmlFor="plate-number" className="text-2xl font-semibold text-gray-900 block mb-2">
                      Enter Plate Number
                    </Label>
                    <p className="text-gray-500">Type the vehicle's plate number below</p>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="plate-number"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                      placeholder="ABC-123XY"
                      className="w-full text-center text-3xl font-mono font-bold py-6 px-4 bg-gray-50 border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:bg-white transition-all uppercase tracking-wider"
                      required
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-6">
                      Enter exactly as shown on the vehicle
                    </p>
                    
                    <Button 
                      type="submit" 
                      size="lg"
                      className="px-12 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      disabled={verifyMutation.isPending || !plateNumber.trim()}
                    >
                      {verifyMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Checking...
                        </div>
                      ) : (
                        "Verify Vehicle"
                      )}
                    </Button>
                  </div>
                  
                  {/* Error Message Below Button - Only show when form is being used */}
                  {result && !result.verified && (
                    <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
                      <div className="flex items-start gap-4">
                        <AlertTriangle className="h-8 w-8 text-red-600 mt-1 flex-shrink-0" />
                        <div className="text-left">
                          <h4 className="text-xl font-bold text-red-900 mb-3">Vehicle Not Found</h4>
                          <p className="text-red-800 mb-4 text-lg">
                            The vehicle with plate number <span className="font-mono font-bold bg-red-100 px-2 py-1 rounded">{plateNumber}</span> is not registered in our records.
                          </p>
                          <div className="bg-red-100 rounded-xl p-4 border border-red-300">
                            <p className="font-bold text-red-900 mb-3 text-lg">🚨 Safety Advisory:</p>
                            <ul className="text-red-800 space-y-2 text-base">
                              <li className="flex items-start gap-2">
                                <span className="font-bold text-red-600">•</span>
                                <span><strong>Do not board</strong> unverified vehicles for your safety</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="font-bold text-red-600">•</span>
                                <span>Double-check the plate number spelling and try again</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="font-bold text-red-600">•</span>
                                <span>Choose only verified vehicles from authorized operators</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="font-bold text-red-600">•</span>
                                <span>Report suspicious or unregistered vehicles to park management immediately</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
                
                {/* Info Cards */}
                <div className="grid md:grid-cols-2 gap-4 mt-12">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Verified Vehicles</h4>
                        <p className="text-sm text-green-700">Registered and safe for transport</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-1">Safety First</h4>
                        <p className="text-sm text-orange-700">Always verify before boarding</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {result.verified ? (
                  <div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 mb-6">
                      <div className="flex items-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                        <h3 className="text-green-800 font-medium text-lg">Vehicle Verified</h3>
                      </div>
                      <p className="mt-1 text-green-700">This vehicle is registered in our system.</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-heading font-semibold text-lg mb-3 text-primary">Vehicle Details</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-600 text-sm">Plate Number:</div>
                          <div className="font-mono font-bold">{result.vehicle?.plateNumber}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-600 text-sm">Vehicle Type:</div>
                          <div>{result.vehicle?.type}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-600 text-sm">Registration Date:</div>
                          <div>{result.vehicle?.registrationDate && formatDate(result.vehicle.registrationDate)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h3 className="font-heading font-semibold text-lg mb-3 text-primary">Driver Information</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-600 text-sm">Driver Name:</div>
                          <div>{result.driver?.name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-600 text-sm">License Number:</div>
                          <div className="font-mono">{result.driver?.licenseNumber}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-gray-600 text-sm">Status:</div>
                          <div>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              result.driver?.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {result.driver?.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
                    <div className="flex items-center">
                      <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                      <h3 className="text-red-800 font-medium text-lg">Vehicle Not Verified</h3>
                    </div>
                    <p className="mt-1 text-red-700">This vehicle is not registered in our system.</p>
                    <div className="mt-3 bg-white p-3 rounded border border-red-100">
                      <p className="text-gray-700 text-sm">For your safety, we recommend:</p>
                      <ul className="list-disc list-inside mt-2 text-sm text-gray-700 space-y-1">
                        <li>Double-check the plate number and try again</li>
                        <li>Choose a registered vehicle from our park</li>
                        <li>Report any unregistered vehicles operating in the park</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleReset} 
                  className="w-full"
                >
                  Search Again
                </Button>
              </div>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <h3 className="text-lg font-heading font-semibold text-primary mb-2">Why Verify?</h3>
            <p className="text-gray-600">Verifying vehicles helps ensure you're traveling with registered drivers who meet our safety standards. All registered vehicles undergo regular inspections and their drivers have proper credentials.</p>
          </div>
        </div>
        

      </div>
    </>
  );
};

export default Verify;
