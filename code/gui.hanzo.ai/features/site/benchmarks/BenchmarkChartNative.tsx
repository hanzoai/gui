import { BenchmarkChart } from './BenchmarkChart'

export const BenchmarkChartNative = () => (
  <BenchmarkChart
    large
    data={[
      { name: 'Gui', value: 108 },
      { name: 'React Native', value: 106 },
    ]}
  />
)
