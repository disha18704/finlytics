"use client";

import React, { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
// import { Item } from '@radix-ui/react-select';
import Link from "next/link";
import { CircularProgress } from "@nextui-org/progress";

type Props = {};
const page = (props: Props) => {
  const [tickerName, setTickerName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [graphData, setGraphData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [userChoice, setUserChoice] = useState("ten_k");

  function getCurrentFormattedDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const temp = {
      current_date: `${year}-${month}-${day}`,
      prev_year_date: `${year - 1}-${month}-${day}`,
    };

    return temp;
  }

  useEffect(() => {
    const fetchGraphData = async (stock_name: string) => {
      const { current_date, prev_year_date } = getCurrentFormattedDate();
      const interval = "1mo";

      console.log(stock_name, prev_year_date, current_date, interval);

      try {
        const api_url = "http://localhost:8000/fetch-ticker-data/";
        const data = {
          ticker: stock_name,
          start_date: prev_year_date,
          end_date: current_date,
          interval: interval,
        };

        const response = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        console.log("fetchGraphData response", response);

        if (response.ok) {
          const jsonData = await response.json();
          console.log(jsonData);

          setGraphData(jsonData);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPredictions = async (stock_name: string) => {
      const { current_date, prev_year_date } = getCurrentFormattedDate();
      const interval = "1d";

      try {
        // const api_url = `http://0.0.0.0:8000/predict-prices/${stock_name}/${prev_year_date}/${current_date}/${interval}`;

        // const response = await fetch(api_url, {
        //   headers: new Headers({
        //     "ngrok-skip-browser-warning": "69420",
        //   }),
        // });

        const api_url = "http://localhost:8000/predict-prices/";
        const data = {
          ticker: stock_name,
          start_date: prev_year_date,
          end_date: current_date,
          interval: interval,
        };

        const response = await fetch(api_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        console.log("fetchPredictions response", response);

        if (response.ok) {
          const jsonData = await response.json();
          console.log(jsonData);

          setPredictions(jsonData);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const searchParams = new URLSearchParams(window.location.search);
    const stock_name = searchParams.get("name");
    const date = new Date();
    setCurrentDate(date.toLocaleString());

    console.log(date.toLocaleString());

    if (!stock_name) return;
    setTickerName(stock_name);
    fetchGraphData(stock_name);

    fetchPredictions(stock_name);
  }, []);

  const chartData = [
    { month: "January", value: graphData[0]?.open },
    { month: "February", value: graphData[1]?.open },
    { month: "March", value: graphData[2]?.open },
    { month: "April", value: graphData[3]?.open },
    { month: "May", value: graphData[4]?.open },
    { month: "June", value: graphData[5]?.open },
    { month: "July", value: graphData[6]?.open },
    { month: "August", value: graphData[7]?.open },
    { month: "September", value: graphData[8]?.open },
    { month: "October", value: graphData[9]?.open },
    { month: "November", value: graphData[10]?.open },
    { month: "December", value: graphData[11]?.open },
  ];

  const chartConfig = {
    value: {
      label: "value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const stock_info = {
    HBIO: {
      name: "Harvard Bioscience, Inc.",
      about:
        "Harvard Bioscience, Inc. is a global developer and manufacturer of life science tools and systems for research and drug discovery. It operates within the biotechnology sector, providing high-quality laboratory instruments and consumables to academic, research, and pharmaceutical customers​​",
      gross_margin: "58.6%",
      net_profit: "-$12.4 million",
      eps: "-$0.29",
      roe: "-20.40%",
      cagr: "None",
      ten_k: [
        "Provides comprehensive financial and operational data for the fiscal year ending December 31, 2023.",
        "Includes detailed sections like business overview, products, and operational highlights.",
        "Discusses risk factors affecting financial performance and operations in Item 1A.",
        "Corporate governance and management details are covered in Item 10.",
        "Financial statements, including cash flow, income statement, and footnotes, are provided.",
      ],
      ten_q: [
        "Summarizes financial performance for a specific quarter, tied to 2023 year-end filings.",
        "Highlights cybersecurity measures under Item 1C.",
        "Legal proceedings and corporate changes are disclosed under Item 3.",
        "Contains quarterly updates on risk factors and operations.",
        "Explains any significant financial changes compared to the previous quarter.",
      ],
      eight_k: [
        "Disclosed resignation of CFO David J. Green, effective January 31, 2023.",
        "The board appointed David J. Green as SVP and interim CFO until a replacement was found.",
        "Discussed the board's plans to recruit a new CFO.",
        "Detailed impacts of this leadership change on operations and financial reporting.",
        "Reflects stock price impact and governance focus during the transition.",
      ],
    },
    NATH: {
      name: "Nathan's Famous, Inc.",
      about:
        "Nathan's Famous, Inc. operates in the food industry, best known for its brand of hot dogs and associated products. It engages in the operation of restaurants, franchising, and licensing its famous brand for various food products​.",
      growth_margin: "30.5%",
      net_profit: "15.2%",
      eps: "$3.45",
      roe: "25.8%",
      cagr: "2.3%",

      ten_k: [
        "Business operations overview, focusing on food services and franchising.",
        "Lists risk factors impacting operations and market performance in Item 1A.",
        "Details properties, including owned and leased real estate, in Item 2.",
        "Discloses legal proceedings under Item 3, emphasizing any potential liabilities.",
        "Footnotes to financials offer additional operational and compliance insights.",
      ],
      ten_q: [
        "Reports updates on operational performance across business segments.",
        "Highlights quarterly risk assessments and financial performance changes.",
        "Legal disclosures regarding ongoing litigation or settlements.",
        "Includes management commentary on strategic initiatives in MD&A.",
        "Provides updated financial statements and comparative quarterly data.",
      ],
      eight_k: [
        "Focuses on significant business developments or operational changes.",
        "Lists updates on risk factors affecting short-term market performance.",
        "Shares property acquisition or disposal details if applicable.",
        "Discloses changes in legal proceedings or new lawsuits.",
        "Reflects impacts of SEC-mandated mine safety disclosures (if relevant).",
      ],
    },
    ATOM: {
      name: "Atomera Energy PLC",
      about:
        "Atomera Incorporated is a materials science company focusing on advancing semiconductor technology. It specializes in developing and licensing its proprietary technology, Mears Silicon Technology (MST), designed to improve the performance and efficiency of semiconductor devices​.",
      growth_margin: "hi",
      net_profit: "none",
      eps: "-$1.20",
      roe: "Negative",
      cagr: "-",

      ten_k: [
        "Reports revenue of $0.55M for FY 2022, a drop from $0.65M in 2021.",
        "Highlights a net loss of $18.09M in 2022, compared to $16.84M in the prior year.",
        "Notes cash reserves of $1.9M as of December 31, 2022.",
        "Discusses challenges in scaling its R&D-focused operations.",
        "Stockholder equity stood at $10.2M by the fiscal year-end.",
      ],
      ten_q: [
        "Updates on quarterly revenue trends ($0.55M vs. $0.65M previously).",
        "Reports a net loss of $0.18M for the quarter, up from $0.13M in the prior quarter.",
        "Details total assets of $10.5M and liabilities of $10.2M, indicating tight equity margins.",
        "Reflects on analyst ratings, with Craig-Hallum reaffirming a 'Buy' with a $10 target.",
        "Notes quarterly operational expenses affecting profitability.",
      ],
      eight_k: [
        "Highlights the company’s stock repurchase program authorized in February 2023.",
        "Stock price on February 21, 2023, stood at $6.59 per share.",
        "Updates on fiscal year-end financial statements for 2022.",
        "Reflects strategic discussions among the board on stock buybacks.",
        "Stresses investor confidence measures following financial results disclosure.",
      ],
    },
    MYFW: {
      name: "First Western Financial, Inc.",
      about:
        "First Western Financial, Inc. is a financial services company offering wealth advisory, private banking, mortgage lending, and asset management services. It serves high-net-worth individuals, families, and businesses with tailored financial solutions​",
      growth_margin: "none",
      net_profit: "22.5%",
      eps: "-$1.85",
      roe: "12.3%",
      cagr: "8.7%",
      ten_k: [
        "Summarizes the company’s financial condition for FY 2023.",
        "Includes detailed financial statements and notes to clarify key metrics.",
        "Management and board composition are discussed, along with governance.",
        "Highlights long-term strategies to improve profitability and ROE.",
        "Discloses critical risk factors influencing lending and investment portfolios.",
      ],
      ten_q: [
        "Updates on net interest margin and non-interest income changes.",
        "Notes quarterly financial performance and comparisons with prior periods.",
        "Highlights loan portfolio updates and provisions for credit losses.",
        "Discusses changes in equity and asset composition quarter-over-quarter.",
        "Provides MD&A insights into competitive positioning and market trends.",
      ],
      eight_k: [
        "Covers significant corporate actions or board-approved initiatives.",
        "Details changes in executive leadership or significant hiring.",
        "Reflects on regulatory filings and compliance updates.",
        "Provides details on new financing or acquisition activities.",
        "Summarizes shareholder decisions or stock price-affecting events.",
      ],
    },
    IBEX: {
      name: "IBEX Limited",
      about:
        "IBEX Limited is a leading global provider of outsourced customer engagement services, offering solutions in customer care, technical support, and sales for various industries. The company delivers business process outsourcing (BPO) services to improve client relationships and operational efficiencies​​",
      growth_margin: "35.8%",
      net_profit: "7.5%",
      eps: "-$1.25",
      roe: "14.2%",
      cagr: "6.5%",
      ten_k: [
        "Revenue for FY 2021 increased to $1.03B from $826M in the prior year.",
        "Net income for FY 2021 was $82.99M, compared to $64.6M in 2020.",
        "Stock price improved from $12.36 in 2020 to $13.51 in 2021.",
        "Reflects strong growth in key market verticals and operational efficiencies.",
        "Notes growth strategies focusing on digital transformation services.",
      ],
      ten_q: [
        "Quarterly updates on revenue growth and expense management.",
        "Highlights significant stock price fluctuations during reporting periods.",
        "Discusses updated financial metrics affecting shareholders’ equity.",
        "Reflects quarterly performance in emerging verticals and client expansions.",
        "Offers financial forecasts and growth expectations for future quarters.",
      ],
      eight_k: [
        "Announced a board-approved share repurchase program.",
        "Detailed timeline and rationale for repurchasing shares.",
        "Stock price updates are included as of specific reporting dates.",
        "Reflects board confidence in long-term growth prospects.",
        "Includes additional material developments influencing financial outlook.",
      ],
    },
  };

  const temp = stock_info[tickerName];

  return (
    <div style={{ color: "white", display: "flex", flexDirection: "column" }}>
      {/* Styled Ticker Name and Company Name */}

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          backgroundColor: "black",
          font: "caption",
          padding: "10px",
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginRight: "8px",
            fontFamily: "sans-serif",
          }}
        >
          {temp?.name}
        </span>
        <span
          style={{
            fontSize: "18px",
            fontWeight: "lighter",
            color: "gray",
            fontFamily: "sans-serif",
          }}
        >
          {tickerName}
        </span>
      </div>

      <div
        style={{
          backgroundColor: "#27272a",
          height: 2,
        }}
      ></div>

      {/* Chart */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          marginTop: "20px",
        }}
      >
        {/* Chart */}
        <div style={{ width: "50%" }}>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="value"
                type="linear"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "20px", // Space between the chart and text
            whiteSpace: "nowrap",
            width: "50%",
            textWrap: "wrap",
          }}
        >
          {/* About The Company */}

          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 25,
                fontFamily: "sans-serif",
              }}
            >
              About
            </p>
            <div
              style={{
                backgroundColor: "#27272a",
                height: 2,
                width: 30,
              }}
            ></div>
            <p
              style={{
                fontSize: 15,
                color: "#cccccc",
              }}
            >
              {temp?.about}
            </p>
          </div>

          {/* KEY STATS */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 130,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 18,
                  marginBottom: 15,
                  fontFamily: "sans-serif",
                }}
              >
                Key Stats
              </p>

              <div
                style={{
                  fontSize: 12,
                  color: "#cccccc",
                  // backgroundColor: 'red',
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginBottom: 5,
                  }}
                >
                  <p>Gross Margin</p>
                  <div
                    style={{
                      backgroundColor: "#27272a",
                      height: 1,
                      flexGrow: 1,
                      marginLeft: 10,
                      width: 400,
                      marginRight: 10,
                    }}
                  ></div>
                  <p>{temp?.gross_margin}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginBottom: 5,
                  }}
                >
                  <p>Net Profit</p>
                  <div
                    style={{
                      backgroundColor: "#27272a",
                      height: 1,
                      // flexGrow: 1,
                      marginLeft: 10,
                      width: 400,

                      marginRight: 10,
                    }}
                  ></div>
                  <p>{temp?.net_profit}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginBottom: 5,
                  }}
                >
                  <p>Earnings Per Share</p>
                  <div
                    style={{
                      backgroundColor: "#27272a",
                      height: 1,
                      // flexGrow: 1,
                      marginLeft: 10,
                      width: 400,

                      marginRight: 10,
                    }}
                  ></div>
                  <p>{temp?.eps}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginBottom: 5,
                  }}
                >
                  <p>Return on Equity</p>
                  <div
                    style={{
                      backgroundColor: "#27272a",
                      height: 1,
                      // flexGrow: 1,
                      marginLeft: 10,
                      width: 400,

                      marginRight: 10,
                    }}
                  ></div>
                  <p>{temp?.roe}</p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    marginBottom: 5,
                  }}
                >
                  <p>Compound Annual Growth Rate</p>
                  <div
                    style={{
                      backgroundColor: "#27272a",
                      height: 1,
                      // flexGrow: 1,
                      marginLeft: 10,
                      width: 400,

                      marginRight: 10,
                    }}
                  ></div>
                  <p>{temp?.cagr}</p>
                </div>
              </div>
            </div>

            {/* <div>
        <p style={{
          marginBottom:10,
        }}>
          Predictions For Tomorrow
        </p>

        <p style={{
          marginBottom:10
        }}>
          Predicted Opening Price:{predictions?.open?.toString().substring(0,5)}
        </p>

        <p>
          Predicted Closing Price:{predictions?.close?.toString().substring(0,5)}
        </p>

      </div> */}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 50,
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          flexDirection: "column",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: 50,
            fontFamily: "sans-serif",
            textDecoration: "underline",
            textDecorationColor: "#27272a", // Set underline color
            textDecorationThickness: "2px", // Optional: Adjust the thickness of the underline
            textUnderlineOffset: "18px", // Add space between text and underline
          }}
        >
          Predictions for Tomorrow
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
            gap: 100,
          }}
        >
          <div
            style={{
              display: "flex",
              borderWidth: 3,
              borderColor: "#cccccc",
              height: 200,
              width: 200,
              borderRadius: 100,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              justifyItems: "center",
              alignSelf: "center",
              fontSize: 50,
            }}
          >
            <p>{predictions?.open?.toString().substring(0, 5)}</p>
          </div>
          <div
            style={{
              display: "flex",
              borderWidth: 3,
              borderColor: "#cccccc",
              height: 200,
              width: 200,
              borderRadius: 100,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              justifyItems: "center",
              alignSelf: "center",
              fontSize: 50,
            }}
          >
            <p>{predictions?.close?.toString().substring(0, 5)}</p>
          </div>
        </div>
      </div>

      <p
        style={{
          marginTop: 70,
          fontSize: 25,
          fontFamily: "sans-serif",
        }}
      >
        Quick Glance:
      </p>

      <div
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          {userChoice === "ten_k" ? (
            <ul>
              {temp?.ten_k.map((item, index) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{ height: 2, width: 5, backgroundColor: "#cccccc" }}
                  ></div>
                  <li
                    key={index}
                    style={{
                      textAlign: "center",
                      marginLeft: 10,
                      color: "#cccccc",
                    }}
                  >
                    {item}
                  </li>
                </div>
              ))}
            </ul>
          ) : null}

          {userChoice === "ten_q" ? (
            <ul>
              {temp?.ten_q.map((item, index) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{ height: 2, width: 5, backgroundColor: "#cccccc" }}
                  ></div>
                  <li
                    key={index}
                    style={{
                      textAlign: "center",
                      marginLeft: 10,
                      color: "#cccccc",
                    }}
                  >
                    {item}
                  </li>
                </div>
              ))}
            </ul>
          ) : null}

          {userChoice === "eight_k" ? (
            <ul>
              {temp?.eight_k.map((item, index) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{ height: 2, width: 5, backgroundColor: "#cccccc" }}
                  ></div>
                  <li
                    key={index}
                    style={{
                      textAlign: "center",
                      marginLeft: 10,
                      color: "#cccccc",
                    }}
                  >
                    {item}
                  </li>
                </div>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <Select onValueChange={setUserChoice}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Reports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ten_k">Annual Report</SelectItem>
              <SelectItem value="ten_q">Quarterly Report</SelectItem>
              <SelectItem value="eight_k">Material Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default page;
