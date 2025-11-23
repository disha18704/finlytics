"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // <--- IMPORT THIS
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/Chart";
import { stock_info } from "../../src/data/stockInfo";
import {
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { ChevronDown } from "lucide-react";

type GraphDataItem = {
  date: string;
  open: number;
};

type PredictionData = {
  open: number;
  close: number;
};

const Page = () => {
  const searchParams = useSearchParams(); // <--- USE THE HOOK
  const stockNameFromUrl = searchParams.get("name"); // Get ticker safely

  const [graphData, setGraphData] = useState<GraphDataItem[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [ticker, setTicker] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<string>("annual");
  const [predictions, setPredictions] = useState<PredictionData | null>(null);

  function getCurrentFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return {
      current_date: `${year}-${month}-${day}`,
      // Start from 2 years ago to ensure we have enough data for the 60-day window
      prev_year_date: `${year - 2}-${month}-${day}`, 
    };
  }

  useEffect(() => {
    // Debugging: Check if code is running
    console.log("🔄 Effect triggered. Stock:", stockNameFromUrl);

    if (!stockNameFromUrl) {
      console.log("❌ No stock name in URL. Waiting...");
      return;
    }

    const fetchGraphData = async (stock_name: string) => {
      const { current_date, prev_year_date } = getCurrentFormattedDate();
      const interval = "1mo";

      console.log(`📡 Fetching Graph Data for ${stock_name}...`);

      try {
        // Use 127.0.0.1 to avoid localhost IPv6 issues
        const api_url = "https://finlytics-backend-1218026744.europe-west1.run.app/fetch-ticker-data/";
        
        const data = {
          ticker: stock_name,
          start_date: prev_year_date,
          end_date: current_date,
          interval: interval,
        };

        const response = await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        console.log("Graph Data Status:", response.status);

        if (response.ok) {
          const jsonData = await response.json();
          setGraphData(jsonData);
          // Safe access to stock info
          const info = stock_info[stock_name as keyof typeof stock_info];
          setCompanyName(info?.name || stock_name);
          setTicker(stock_name);
        } else {
          console.error("Graph fetch failed:", await response.text());
        }
      } catch (err) {
        console.error("Graph fetch error:", err);
      }
    };

    const fetchPredictions = async (stock_name: string) => {
      const { current_date, prev_year_date } = getCurrentFormattedDate();
      const interval = "1d";

      console.log(`🔮 Fetching Predictions for ${stock_name}...`);

      try {
        const api_url = "https://finlytics-backend-1218026744.europe-west1.run.app/predict-prices/";
        
        const data = {
          ticker: stock_name,
          start_date: prev_year_date,
          end_date: current_date,
          interval: interval,
        };

        const response = await fetch(api_url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        console.log("Prediction Status:", response.status);

        if (response.ok) {
          const jsonData = await response.json();
          console.log("Predictions received:", jsonData);
          setPredictions(jsonData);
        } else {
          console.error("Prediction fetch failed:", await response.text());
        }
      } catch (err) {
        console.error("Prediction fetch error:", err);
      }
    };

    // Run functions
    fetchGraphData(stockNameFromUrl);
    fetchPredictions(stockNameFromUrl);

  }, [stockNameFromUrl]); // <--- RUN WHENEVER URL CHANGES

  // ... Rest of your Chart config and return statement remains exactly the same ...
  // (Copy your existing JSX return logic here)

  const chartData = graphData.map((data, index) => ({
    month: new Date(data.date).toLocaleString("default", { month: "long" }),
    value: data.open,
  }));

  const chartConfig = {
    value: {
      label: "value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const currentStock = ticker
    ? stock_info[ticker as keyof typeof stock_info]
    : null;

  return (
    <div className="min-h-screen px-4 pt-24 text-white">
      <div className="container mx-auto flex h-full gap-4 max-w-[95%]">
        {/* ... Your existing Cards ... */}
        <Card className="flex-1 bg-black/80 border border-white/20 backdrop-blur-md rounded-2xl px-4 py-4">
          <CardHeader className="mb-8 flex items-baseline">
            <h1 className="text-3xl font-bold mr-4 text-white">
              {companyName || stockNameFromUrl}
            </h1>
            <p className="text-lg text-gray-400">{ticker}</p>
          </CardHeader>
          <CardBody className="pt-6">
            <div className="flex-grow">
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value ? value.slice(0, 3) : ""}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="value"
                    type="linear"
                    stroke="#FF5733"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardBody>
        </Card>

        <Card className="flex-1 bg-black/80 border border-white/20 backdrop-blur-md rounded-2xl px-4 py-4">
          <CardHeader>
            <h1 className="text-3xl font-bold text-white">About the Company</h1>
          </CardHeader>
          <CardBody className="pt-6">
            <div className="flex-grow space-y-4">
              <p className="text-lg text-gray-400">{currentStock?.about}</p>

              <div className="flex items-baseline">
                <strong className="text-white whitespace-nowrap">
                  Gross Margin:
                </strong>
                <div className="mx-2 flex-grow border-b border-dotted border-gray-600"></div>
                <span className="text-gray-400">
                  {currentStock?.gross_margin}
                </span>
              </div>

              <div className="flex items-baseline">
                <strong className="text-white whitespace-nowrap">
                  Net Profit:
                </strong>
                <div className="mx-2 flex-grow border-b border-dotted border-gray-600"></div>
                <span className="text-gray-400">
                  {currentStock?.net_profit}
                </span>
              </div>

              <div className="flex items-baseline">
                <strong className="text-white whitespace-nowrap">
                  Earnings Per Share:
                </strong>
                <div className="mx-2 flex-grow border-b border-dotted border-gray-600"></div>
                <span className="text-gray-400">{currentStock?.eps}</span>
              </div>

              <div className="flex items-baseline">
                <strong className="text-white whitespace-nowrap">
                  Return on Equity:
                </strong>
                <div className="mx-2 flex-grow border-b border-dotted border-gray-600"></div>
                <span className="text-gray-400">{currentStock?.roe}</span>
              </div>

              <div className="flex items-baseline">
                <strong className="text-white whitespace-nowrap">
                  Compound Annual Growth Rate:
                </strong>
                <div className="mx-2 flex-grow border-b border-dotted border-gray-600"></div>
                <span className="text-gray-400">{currentStock?.cagr}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="container mx-auto flex h-full gap-4 max-w-[95%] mt-4 mb-8">
        <Card className="flex-1 bg-black/80 border border-white/20 backdrop-blur-md rounded-2xl px-4 py-4">
          <CardHeader>
            <h1 className="text-3xl font-bold text-white">
              Predictions for Tomorrow
            </h1>
          </CardHeader>
          <CardBody className="pt-6">
            <div className="flex-grow">
              {predictions ? (
                <div className="flex justify-around items-center min-h-[300px]">
                  <div className="text-center flex flex-col items-center justify-center">
                    <p className="text-gray-400 mb-4">
                      Predicted Opening Price
                    </p>
                    <div className="border-2 border-white/20 rounded-full h-32 w-32 flex items-center justify-center">
                      <span className="text-2xl text-white">
                        ${predictions.open.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center">
                    <p className="text-gray-400 mb-4">
                      Predicted Closing Price
                    </p>
                    <div className="border-2 border-white/20 rounded-full h-32 w-32 flex items-center justify-center">
                      <span className="text-2xl text-white">
                        ${predictions.close.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-[300px]">
                  <Spinner
                    size="lg"
                    color="white"
                    classNames={{
                      circle1: "border-white/80",
                      circle2: "border-white/60",
                    }}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="flex-1 bg-black/80 border border-white/20 backdrop-blur-md rounded-2xl px-4 py-4">
          <CardHeader className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Quick Glance</h1>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="bordered"
                  className="capitalize text-white border border-white/20 bg-black/80 hover:bg-black rounded-md flex items-center gap-2"
                >
                  {selectedReport === "annual"
                    ? "Annual Report"
                    : selectedReport === "quarterly"
                    ? "Quarterly Report"
                    : "Material Events"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Report Selection"
                onAction={(key) => setSelectedReport(key as string)}
                className="bg-black/80 rounded-md border border-white/20 p-2 min-w-[160px]"
              >
                <DropdownItem
                  key="annual"
                  className="text-white hover:bg-black/60 rounded-sm px-2 py-2 data-[hover=true]:bg-black/60"
                >
                  Annual Report
                </DropdownItem>
                <DropdownItem
                  key="quarterly"
                  className="text-white hover:bg-black/60 rounded-sm px-2 py-2 data-[hover=true]:bg-black/60"
                >
                  Quarterly Report
                </DropdownItem>
                <DropdownItem
                  key="material"
                  className="text-white hover:bg-black/60 rounded-sm px-2 py-2 data-[hover=true]:bg-black/60"
                >
                  Material Events
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>
          <CardBody className="pt-6">
            <div className="flex-grow space-y-4">
              <div className="space-y-4">
                {selectedReport === "annual" &&
                  currentStock?.ten_k?.map((item, index) => (
                    <div key={index} className="flex items-baseline">
                      <div className="h-1.5 w-1.5 bg-white/60 rounded-full mr-3 mt-2" />
                      <span className="text-gray-400">{item}</span>
                    </div>
                  ))}

                {selectedReport === "quarterly" &&
                  currentStock?.ten_q?.map((item, index) => (
                    <div key={index} className="flex items-baseline">
                      <div className="h-1.5 w-1.5 bg-white/60 rounded-full mr-3 mt-2" />
                      <span className="text-gray-400">{item}</span>
                    </div>
                  ))}

                {selectedReport === "material" &&
                  currentStock?.eight_k?.map((item, index) => (
                    <div key={index} className="flex items-baseline">
                      <div className="h-1.5 w-1.5 bg-white/60 rounded-full mr-3 mt-2" />
                      <span className="text-gray-400">{item}</span>
                    </div>
                  ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Page;