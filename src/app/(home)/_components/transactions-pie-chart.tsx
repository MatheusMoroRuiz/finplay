"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import PercentageItem from "./percentage-item";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#FFFFFF",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  typesPercentage: TransactionPercentagePerType | undefined;
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
}

const defaultPercentages: TransactionPercentagePerType = {
  [TransactionType.DEPOSIT]: 0,
  [TransactionType.EXPENSE]: 0,
  [TransactionType.INVESTMENT]: 0,
};

// Normaliza para 0..100 (se vier 0..1, multiplica por 100)
const toPercent0to100 = (v: number) => (v <= 1 ? v * 100 : v);

// Verifica se todas as chaves estão ausentes ou zeradas
const isZeroOrEmpty = (
  p: Partial<Record<TransactionType, number>> | undefined
) =>
  !p ||
  [
    TransactionType.DEPOSIT,
    TransactionType.EXPENSE,
    TransactionType.INVESTMENT,
  ].every((k) => p[k] == null || p[k] === 0);

const TransactionsPieChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  // Usa o que veio ou default
  const raw = typesPercentage ?? defaultPercentages;

  // Se veio vazio/zerado, calcula a partir dos totais (fallback)
  const sum = depositsTotal + expensesTotal + investmentsTotal;
  const computedFromTotals: TransactionPercentagePerType =
    sum > 0
      ? {
          [TransactionType.DEPOSIT]: depositsTotal / sum,
          [TransactionType.EXPENSE]: expensesTotal / sum,
          [TransactionType.INVESTMENT]: investmentsTotal / sum,
        }
      : defaultPercentages;

  const effective = isZeroOrEmpty(raw) ? computedFromTotals : raw;

  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      amount: depositsTotal,
      fill: "#55B02E",
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: "#E93030",
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investmentsTotal,
      fill: "#FFFFFF",
    },
  ];

  return (
    <Card className="flex flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>

        <div className="space-y-3">
          <PercentageItem
            icon={<TrendingUpIcon size={16} className="text-primary" />}
            title="Receita"
            value={Number(
              (effective[TransactionType.DEPOSIT] ?? 0) * 100
            ).toFixed(2)}
          />
          <PercentageItem
            icon={<TrendingDownIcon size={16} className="text-red-500" />}
            title="Despesas"
            value={Number(
              (effective[TransactionType.EXPENSE] ?? 0) * 100
            ).toFixed(2)}
          />
          <PercentageItem
            icon={<PiggyBankIcon size={16} />}
            title="Investido"
            value={Number(
              (effective[TransactionType.INVESTMENT] ?? 0) * 100
            ).toFixed(2)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;
