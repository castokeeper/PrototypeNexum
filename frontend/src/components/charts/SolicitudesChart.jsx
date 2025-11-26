import { memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
    aprobadas: '#10b981',
    rechazadas: '#ef4444',
    pendientes: '#f59e0b'
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 backdrop-blur-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {payload[0].name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Cantidad: <span className="font-bold text-slate-900 dark:text-slate-100">{payload[0].value}</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Porcentaje: <span className="font-bold text-slate-900 dark:text-slate-100">{payload[0].payload.porcentaje}%</span>
                </p>
            </div>
        );
    }
    return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, porcentaje, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (porcentaje < 5) return null; // No mostrar label si es muy pequeño

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="font-bold text-sm drop-shadow-lg"
        >
            {`${porcentaje}%`}
        </text>
    );
};

const SolicitudesChart = memo(({ data, title = "Distribución de Solicitudes" }) => {
    // Calcular datos para el gráfico
    const chartData = [
        {
            name: 'Aprobadas',
            value: data.aprobadas || 0,
            porcentaje: data.total > 0 ? ((data.aprobadas / data.total) * 100).toFixed(1) : 0
        },
        {
            name: 'Rechazadas',
            value: data.rechazadas || 0,
            porcentaje: data.total > 0 ? ((data.rechazadas / data.total) * 100).toFixed(1) : 0
        },
        {
            name: 'Pendientes',
            value: data.pendientes || 0,
            porcentaje: data.total > 0 ? ((data.pendientes / data.total) * 100).toFixed(1) : 0
        }
    ].filter(item => item.value > 0); // Solo mostrar valores > 0

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
                <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <p className="text-lg font-semibold">No hay datos para mostrar</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name.toLowerCase()]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => (
                            <span className="text-slate-900 dark:text-slate-100 font-medium">
                                {value} ({entry.payload.value})
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
});

SolicitudesChart.displayName = 'SolicitudesChart';

export default SolicitudesChart;

