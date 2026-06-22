'use client';

import { ChartConfig } from '@/components/ui/chart';
import { useInsightsContext } from '@/contexts/insightsContext';
import { BarChart } from './Charts/Bar';
import { ColumnChart } from './Charts/Column';
import { LineChart } from './Charts/Line';
import { StackedAreaChart } from './Charts/StackedArea';
import { StackedBarChart } from './Charts/StackedBar';
import { StackedColumnChart } from './Charts/StackedColumn';
import { generateChartData } from './functions';
import { SimpleChart } from './SimpleChart';

// Local minimal type definitions to satisfy imports in this file.
// Replace these with your project's real types or import them from the shared types module.
interface ITask {
  id: string;
  title?: string;
  [key: string]: any;
}
interface IStatus {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: any;
}
interface ILabel {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: any;
}
interface ISize {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: any;
}
interface IPriority {
  id: string;
  name: string;
  label: string;
  color: string;
  [key: string]: any;
}

const chartConfig = {} satisfies ChartConfig;

type ChartLayout =
  | 'column'
  | 'line'
  | 'stacked-area'
  | 'stacked-bar'
  | 'stacked-column'
  | 'bar';

interface Props {
  layout: ChartLayout;
  data: {
    tasks: ITask[];
    statuses: IStatus[];
    labels: ILabel[];
    sizes: ISize[];
    priorities: IPriority[];
  };
}

export function ChartRenderer({ layout, data }: Props) {
  const { xAxis, groupBy } = useInsightsContext();
  const { tasks, statuses, labels, sizes, priorities } = data;

  const { data: chartData, colors } = generateChartData(
    String(xAxis),
    String(groupBy),
    tasks,
    statuses,
    labels,
    sizes,
    priorities
  );

  const charts = {
    column: ColumnChart,
    line: LineChart,
    'stacked-area': StackedAreaChart,
    'stacked-bar': StackedBarChart,
    'stacked-column': StackedColumnChart,
    bar: BarChart,
  };

  const Chart = charts[layout];

  return (
    <div className="relative h-110 w-full border rounded-sm p-6">
      {!chartData?.length && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          No data available
        </div>
      )}

      <Chart data={chartData || []} colors={colors} config={chartConfig} />
    </div>
  );
}
