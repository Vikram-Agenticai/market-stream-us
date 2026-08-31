export type CategoryKey =
  | "markets"
  | "technology"
  | "economy"
  | "companies"
  | "opinion"
  | "business";

export const SECTIONS: { key: CategoryKey; label: string; path: string; blurb: string }[] = [
  {
    key: "markets",
    label: "Markets",
    path: "/markets",
    blurb: "Stocks, bonds, commodities and the daily movement of American capital.",
  },
  {
    key: "technology",
    label: "Technology",
    path: "/technology",
    blurb: "Artificial intelligence, semiconductors, software and the platform economy.",
  },
  {
    key: "economy",
    label: "Economy",
    path: "/economy",
    blurb: "The Federal Reserve, inflation, jobs, trade and U.S. economic policy.",
  },
  {
    key: "companies",
    label: "Companies",
    path: "/companies",
    blurb: "Earnings, deals, leadership and strategy at America's largest employers.",
  },
  {
    key: "opinion",
    label: "Opinion",
    path: "/opinion",
    blurb: "Analysis, commentary and argument on the business of the United States.",
  },
];

export function categoryLabel(key: string): string {
  const found = SECTIONS.find((s) => s.key === key);
  return found ? found.label : "Business";
}

const RULES: { key: CategoryKey; patterns: RegExp }[] = [
  {
    key: "opinion",
    patterns:
      /\b(opinion|editorial|commentary|op-ed|analysis:|column|heard on the street|point of view)\b/i,
  },
  {
    key: "markets",
    patterns:
      /\b(stock|stocks|shares|s&p|nasdaq|dow|treasur\w*|bond|yield|oil|crude|gold|bitcoin|crypto|market|investor|ipo|etf|futures|rally|selloff|sell-off)\b/i,
  },
  {
    key: "economy",
    patterns:
      /\b(fed|federal reserve|inflation|cpi|gdp|jobs report|unemployment|payroll|tariff|trade deficit|interest rate|recession|economy|economic|powell|treasury department|budget)\b/i,
  },
  {
    key: "technology",
    patterns:
      /\b(ai|artificial intelligence|openai|chip|semiconductor|nvidia|microsoft|google|alphabet|apple|amazon|meta|software|cloud|startup|tech|data center|robot|cyber)\b/i,
  },
  {
    key: "companies",
    patterns:
      /\b(earnings|acquisition|acquires|merger|ceo|chief executive|layoff|revenue|profit|quarterly results|deal|buyout|bankruptcy|airline|retailer|dealership)\b/i,
  },
];

export function classifyCategory(text: string): CategoryKey {
  for (const rule of RULES) {
    if (rule.patterns.test(text)) return rule.key;
  }
  return "business";
}
