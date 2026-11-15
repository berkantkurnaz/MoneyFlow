import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function CategoryChart({ transactions }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense",
  );

  const categoryTotals = expenses.reduce((result, transaction) => {
    const category = transaction.category || "Diğer";
    const amount = Number(transaction.amount) || 0;

    result[category] = (result[category] || 0) + amount;

    return result;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#f43f5e",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Kategori Bazlı Harcamalar
      </h2>

      {data.length === 0 ? (
        <p className="text-slate-400 text-center py-16">
          Henüz gider kaydı bulunmuyor.
        </p>
      ) : (
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={95}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatCurrency(value)} />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default CategoryChart;
