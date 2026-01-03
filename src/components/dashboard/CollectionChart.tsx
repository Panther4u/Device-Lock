import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jul', collected: 245000, pending: 45000 },
  { month: 'Aug', collected: 312000, pending: 52000 },
  { month: 'Sep', collected: 289000, pending: 38000 },
  { month: 'Oct', collected: 367000, pending: 61000 },
  { month: 'Nov', collected: 423000, pending: 72000 },
  { month: 'Dec', collected: 489000, pending: 58000 },
];

export const CollectionChart = () => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Collection Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly EMI collection overview</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Collected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 16%)" />
            <XAxis
              dataKey="month"
              stroke="hsl(215, 20%, 55%)"
              tick={{ fill: 'hsl(215, 20%, 55%)' }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              tick={{ fill: 'hsl(215, 20%, 55%)' }}
              axisLine={{ stroke: 'hsl(222, 47%, 16%)' }}
              tickFormatter={(value) => `₹${(value / 1000)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 47%, 16%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
            />
            <Area
              type="monotone"
              dataKey="collected"
              stroke="hsl(199, 89%, 48%)"
              fillOpacity={1}
              fill="url(#colorCollected)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="pending"
              stroke="hsl(38, 92%, 50%)"
              fillOpacity={1}
              fill="url(#colorPending)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
