import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyDistributionChartProps {
  data: {
    sale: number;
    rent: number;
    shortStay: number;
  };
}

const PropertyDistributionChart = ({ data }: PropertyDistributionChartProps) => {
  const { t } = useLanguage();

  const chartData = [
    { name: t('sale'), value: data.sale, color: 'hsl(var(--chart-1))' },
    { name: t('rent'), value: data.rent, color: 'hsl(var(--chart-2))' },
    { name: t('shortStay'), value: data.shortStay, color: 'hsl(var(--chart-3))' },
  ];

  const total = data.sale + data.rent + data.shortStay;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('propertyDistribution')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {chartData.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.name}</div>
              <div className="text-xs text-muted-foreground">
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDistributionChart;
