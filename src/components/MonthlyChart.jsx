import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function MonthlyChart({ transactions }) {
  const months = [];

  // Son 6 ayı hazırla
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthName = date.toLocaleDateString("tr-TR", {
      month: "short",
    });

    const monthlyTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date + "T12:00:00");

      return (
        transactionDate.getFullYear() === year &&
        transactionDate.getMonth() === month
      );
    });

    const income = monthlyTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const expense = monthlyTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    months.push({
      month: monthName,
      Gelir: income,
      Gider: expense,
    });
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-6">
        Aylık Gelir - Gider
      </h2>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={months}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}₺`} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="Gelir" fill="#10b981" radius={[5, 5, 0, 0]} />
            <Bar dataKey="Gider" fill="#f43f5e" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default MonthlyChart;
