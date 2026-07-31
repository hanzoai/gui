import { BenchmarkChart } from '~/features/site/benchmarks/BenchmarkChart'

export const BenchmarkChartWeb = () => (
  <BenchmarkChart
    animateEnter
    skipOthers
    large
    data={[
      { name: 'Gui', value: 0.02 },
      { name: 'react-native-web', value: 0.063 },
      { name: 'Dripsy', value: 0.108 },
    ]}
  />
)
