import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export type ChartLayout =
  | 'column'
  | 'line'
  | 'stacked-area'
  | 'stacked-bar'
  | 'stacked-column'
  | 'bar';

export type CustomField = 'status' | 'label' | 'size' | 'priority';

interface IInsightsContext {
  layout: ChartLayout;
  xAxis: CustomField;
  groupBy: CustomField | 'none';

  setLayout: Dispatch<SetStateAction<ChartLayout>>;
  setXAxis: Dispatch<SetStateAction<CustomField>>;
  setGroupBy: Dispatch<SetStateAction<CustomField | 'none'>>;
}

export const InsightsContext = createContext<IInsightsContext | null>(null);

export const useInsightsContext = () => {
  const context = useContext(InsightsContext);

  if (!context) {
    throw new Error(
      'useInsightsContext should be used within <InsightsContext>'
    );
  }

  return context;
};
