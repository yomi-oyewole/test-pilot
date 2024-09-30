"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Chrome,
  Flame,
  Globe,
  Play,
  Plus,
  Settings,
  BarChart,
  Code,
  Bug,
  FileText,
  Zap,
  Camera,
} from "lucide-react";

type Browser = "chrome" | "firefox" | "safari" | "edge" | "opera" | "electron";

type RecordedStep = {
  action: string;
  timestamp: number;
  screenshot: string;
};

export default function TestPilot() {
  const [selectedBrowser, setSelectedBrowser] = useState<Browser>("chrome");
  const [isRecording, setIsRecording] = useState(false);
  const [testCases, setTestCases] = useState<string[]>([]);
  const [scriptType, setScriptType] = useState<"javascript" | "typescript">(
    "javascript"
  );
  const [generatedScript, setGeneratedScript] = useState("");
  const [url, setUrl] = useState("");
  const [recordedSteps, setRecordedSteps] = useState<RecordedStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const popupRef = useRef<Window | null>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedSteps([]);
    popupRef.current = window.open(
      url,
      "TestPilotRecording",
      "width=1024,height=768"
    );
    if (popupRef.current) {
      popupRef.current.onload = () => {
        // Inject recording script into the popup
        const script = popupRef.current!.document.createElement("script");
        script.textContent = `
          document.body.addEventListener('click', (e) => {
            window.opener.postMessage({
              action: 'click',
              target: e.target.tagName,
              timestamp: Date.now()
            }, '*')
          })
        `;
        popupRef.current!.document.body.appendChild(script);
      };
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (popupRef.current) {
      popupRef.current.close();
    }
    // Analyze recorded steps and generate report
    analyzeRecordedSteps();
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, `Test Case ${testCases.length + 1}`]);
  };

  const handleGenerateScript = () => {
    const script = generateCypressScript(recordedSteps, scriptType);
    setGeneratedScript(script);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleMessage = (event: MessageEvent) => {
    if (isRecording) {
      const { action, timestamp } = event.data;
      const screenshot = captureScreenshot();
      setRecordedSteps((prev) => [...prev, { action, timestamp, screenshot }]);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isRecording]);

  const captureScreenshot = () => {
    // In a real implementation, this would capture a screenshot of the popup window
    // For this example, we'll use a placeholder
    return `screenshot_${Date.now()}.png`;
  };

  const analyzeRecordedSteps = () => {
    // In a real implementation, this would use AI to analyze the steps and generate a report
    console.log("Analyzing recorded steps...");
    // For now, we'll just log the steps
    console.log(recordedSteps);
  };

  const generateCypressScript = (
    steps: RecordedStep[],
    type: "javascript" | "typescript"
  ) => {
    const scriptStart =
      type === "typescript"
        ? "describe('Recorded Test', () => {\n  it('performs recorded actions', () => {"
        : "describe('Recorded Test', function() {\n  it('performs recorded actions', function() {";

    const scriptEnd = "  })\n})";

    const actions = steps
      .map((step) => {
        return `    cy.get('${step.action}').click()`;
      })
      .join("\n");

    return `${scriptStart}\n    cy.visit('${url}')\n${actions}\n${scriptEnd}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 text-center">
            TestPilot
          </h1>
          <Tabs defaultValue="record" className="w-full">
            <TabsList className="grid w-full grid-cols-6 rounded-xl bg-gray-100 p-1">
              <TabsTrigger
                value="record"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-purple-500"
              >
                <Play className="w-4 h-4 mr-2" />
                Record
              </TabsTrigger>
              <TabsTrigger
                value="analyze"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-500"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Analyze
              </TabsTrigger>
              <TabsTrigger
                value="generate"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-500"
              >
                <Code className="w-4 h-4 mr-2" />
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="report"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-orange-500"
              >
                <FileText className="w-4 h-4 mr-2" />
                Report
              </TabsTrigger>
              <TabsTrigger
                value="bugs"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-yellow-500"
              >
                <Bug className="w-4 h-4 mr-2" />
                Bugs
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-500"
              >
                <Zap className="w-4 h-4 mr-2" />
                Pricing
              </TabsTrigger>
            </TabsList>
            <TabsContent value="record">
              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center">
                    <Play className="mr-2" /> Record User Flow
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Enter a URL, select a browser, and start recording your test
                    scenario.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="url">Website URL</Label>
                      <Input
                        id="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={handleUrlChange}
                        className="border border-gray-300"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="browser">Select Browser</Label>
                      <Select
                        value={selectedBrowser}
                        onValueChange={(value: Browser) =>
                          setSelectedBrowser(value)
                        }
                      >
                        <SelectTrigger id="browser" className="bg-white">
                          <SelectValue placeholder="Select a browser" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="bg-white rounded-md border"
                        >
                          <SelectItem value="chrome">
                            <Chrome className="mr-2 h-4 w-4" />
                            Chrome
                          </SelectItem>
                          <SelectItem value="firefox">
                            <Flame className="mr-2 h-4 w-4" />
                            Firefox
                          </SelectItem>
                          <SelectItem value="safari">
                            <Globe className="mr-2 h-4 w-4" />
                            Safari
                          </SelectItem>
                          <SelectItem value="edge">
                            <Globe className="mr-2 h-4 w-4" />
                            Edge
                          </SelectItem>
                          <SelectItem value="opera">
                            <Globe className="mr-2 h-4 w-4" />
                            Opera
                          </SelectItem>
                          <SelectItem value="electron">
                            <Globe className="mr-2 h-4 w-4" />
                            Electron
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {recordedSteps.length > 0 && (
                      <div className="flex flex-col space-y-1.5">
                        <Label>Time Travel</Label>
                        <div className="flex items-center space-x-2">
                          <Slider
                            min={0}
                            max={recordedSteps.length - 1}
                            step={1}
                            value={[currentStepIndex]}
                            onValueChange={(value) =>
                              setCurrentStepIndex(value[0])
                            }
                          />
                          <Button size="sm" variant="outline">
                            <Camera className="mr-2 h-4 w-4" />
                            Screenshot
                          </Button>
                        </div>
                        <div className="mt-2">
                          <p>
                            Step {currentStepIndex + 1}:{" "}
                            {recordedSteps[currentStepIndex]?.action}
                          </p>
                          <p>
                            Timestamp:{" "}
                            {new Date(
                              recordedSteps[currentStepIndex]?.timestamp
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={
                          isRecording
                            ? handleStopRecording
                            : handleStartRecording
                        }
                        disabled={!url}
                      >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {isRecording
                            ? "Recording in Progress"
                            : "Start Recording"}
                        </DialogTitle>
                        <DialogDescription>
                          {isRecording
                            ? 'Your actions are being recorded. Click "Stop Recording" when finished.'
                            : 'Click "Start Recording" to begin capturing your user flow.'}
                        </DialogDescription>
                      </DialogHeader>
                      {isRecording && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span>Recording...</span>
                        </div>
                      )}
                      <Button
                        onClick={
                          isRecording
                            ? handleStopRecording
                            : handleStartRecording
                        }
                      >
                        {isRecording ? "Stop Recording" : "Start Recording"}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="analyze">
              <Card>
                <CardHeader className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
                  <CardTitle className="flex items-center">
                    <BarChart className="mr-2" /> AI-Powered Analysis
                  </CardTitle>
                  <CardDescription className="text-pink-100">
                    Analyze recorded user flows and align them with your test
                    case plan.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="testcase">Test Cases</Label>
                      {testCases.map((testCase, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            id={`testcase-${index}`}
                            value={testCase}
                            readOnly
                          />
                          <Button size="icon">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={handleAddTestCase}
                        variant="outline"
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Test Case
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Run Analysis</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="generate">
              <Card>
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center">
                    <Code className="mr-2" /> Generate Cypress Scripts
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    Automatically generate Cypress test scripts based on your
                    recorded flows.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="scriptType">Script Type</Label>
                      <Select
                        value={scriptType}
                        onValueChange={(value: "javascript" | "typescript") =>
                          setScriptType(value)
                        }
                      >
                        <SelectTrigger id="scriptType">
                          <SelectValue placeholder="Select script type" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="generatedScript">Generated Script</Label>
                      <Textarea
                        id="generatedScript"
                        value={generatedScript}
                        readOnly
                        className="h-40 font-mono"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleGenerateScript}>
                    Generate Script
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="report">
              <Card>
                <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2" /> Comprehensive Reporting
                  </CardTitle>
                  <CardDescription className="text-orange-100">
                    View detailed test reports and performance metrics.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label>Test Coverage</Label>
                      <Progress value={75} className="w-full" />
                      <span className="text-sm text-gray-500">
                        75% of features covered
                      </span>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label>Performance Metrics</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-100 p-4 rounded">
                          <p className="text-lg font-semibold">Load Time</p>
                          <p className="text-2xl font-bold text-blue-600">
                            1.2s
                          </p>
                        </div>
                        <div className="bg-green-100 p-4 rounded">
                          <p className="text-lg font-semibold">Success Rate</p>
                          <p className="text-2xl font-bold text-green-600">
                            98%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Generate Full Report</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="bugs">
              <Card>
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-green-500 text-white">
                  <CardTitle className="flex items-center">
                    <Bug className="mr-2" /> Bug Management
                  </CardTitle>
                  <CardDescription className="text-yellow-100">
                    Track and manage detected bugs in your application.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="bg-red-100 p-4 rounded">
                      <h3 className="text-lg font-semibold text-red-700">
                        Login Form Submission Error
                      </h3>
                      <p className="text-sm text-red-600">
                        Steps to reproduce: 1. Open login form, 2. Enter
                        credentials, 3. Click submit
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded">
                      <h3 className="text-lg font-semibold text-yellow-700">
                        Slow Page Load on Product Listing
                      </h3>
                      <p className="text-sm text-yellow-600">
                        Performance issue detected on the product listing page.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Add New Bug Report</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="pricing">
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2" /> Pricing Plans
                  </CardTitle>
                  <CardDescription className="text-green-100">
                    Choose the plan that fits your testing needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border p-4 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">Free Plan</h3>
                      <ul className="list-disc list-inside mb-4">
                        <li>10 active projects per month</li>
                        <li>Basic test case management</li>
                        <li>2 browsers for cross-browser testing</li>
                        <li>Email support (48h response time)</li>
                      </ul>
                      <Button variant="outline" className="w-full">
                        Current Plan
                      </Button>
                    </div>
                    <div className="border p-4 rounded-lg bg-blue-50">
                      <h3 className="text-xl font-bold mb-2">Paid Plan</h3>
                      <p className="text-2xl font-bold mb-2">
                        €20 <span className="text-sm font-normal">/month</span>
                      </p>
                      <ul className="list-disc list-inside mb-4">
                        <li>Unlimited projects</li>
                        <li>Advanced test case management</li>
                        <li>All browsers for cross-browser testing</li>
                        <li>Priority support (24h response time)</li>
                      </ul>
                      <Button className="w-full">Upgrade Now</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="bg-gray-100 p-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">TestPilot v1.0</p>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
