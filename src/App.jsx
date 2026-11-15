import { useState } from "react";
import MonthlyChart from "./components/MonthlyChart";
import CategoryChart from "./components/CategoryChart";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  Trash2,
  ShoppingCart,
  House,
  Car,
  Coffee,
  X,
  Pencil,
} from "lucide-react";

import useLocalStorage from "./hooks/useLocalStorage";

// Para birimi formatı
const currency = (amount) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(amount);

// Bugünün tarihini yerel saatle al
const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// İşlem kategorileri
const categories = {
  income: ["Maaş", "Ek Gelir", "Yatırım", "Diğer"],
  expense: [
    "Market",
    "Faturalar",
    "Ulaşım",
    "Kira",
    "Sağlık",
    "Eğlence",
    "Alışveriş",
    "Diğer",
  ],
};

// İşlem ikonları
const categoryIcons = {
  Market: ShoppingCart,
  Kira: House,
  Ulaşım: Car,
  Eğlence: Coffee,
};

// Sol menü

function Sidebar({ activePage, onPageChange }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "İşlemler", icon: ArrowLeftRight },
    { name: "Bütçe Yönetimi", icon: Wallet },
    { name: "İstatistikler", icon: ChartNoAxesCombined },
  ];

  return (
    <aside className="w-full md:w-64 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-slate-100 p-4 md:p-6 flex flex-col shrink-0">
      <div className="flex items-center gap-3 mb-6 md:mb-12">
        <div className="bg-violet-600 text-white p-2.5 rounded-xl">
          <Wallet size={24} />
        </div>

        <span className="text-2xl font-bold text-slate-800">
          Money<span className="text-violet-600">Flow</span>
        </span>
      </div>

      <p className="hidden md:block text-xs font-semibold text-slate-400 mb-4">
        MENÜ
      </p>

      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium {
               activePage === item.name
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50"
             }`}
              onClick={() => onPageChange(item.name)}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="hidden md:block mt-auto">
        <button className="flex items-center gap-3 text-slate-500 px-4 py-3 text-sm">
          <Settings size={19} />
          Ayarlar
        </button>

        <div className="mt-5 p-4 bg-violet-50 rounded-2xl">
          <p className="text-sm font-semibold text-violet-800">MoneyFlow</p>
          <p className="text-xs text-violet-600 mt-1">
            Finansal kontrol artık sende!
          </p>
        </div>
      </div>
    </aside>
  );
}

// Özet kartları
function SummaryCard({ title, amount, icon: Icon, color, description }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <div className={`p-2.5 rounded-xl ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mt-4">
        {currency(amount)}
      </h2>

      <p className="text-xs text-slate-400 mt-2">{description}</p>
    </div>
  );
}

function BudgetForm({ initialBudget, onClose, onSave }) {
  const [amount, setAmount] = useState(initialBudget.toString());

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }

    onSave(numericAmount);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Aylık Bütçeyi Düzenle
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Bu ay için harcama limitini belirle.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Aylık bütçe (₺)
          </label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            placeholder="Örn. 20000"
          />

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700"
            >
              Bütçeyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Yeni işlem ekleme penceresi
function TransactionForm({ onClose, onAdd, initialTransaction }) {
  const [type, setType] = useState(initialTransaction?.type || "expense");

  const [title, setTitle] = useState(initialTransaction?.title || "");

  const [amount, setAmount] = useState(
    initialTransaction?.amount?.toString() || "",
  );

  const [category, setCategory] = useState(
    initialTransaction?.category || "Market",
  );

  const [date, setDate] = useState(initialTransaction?.date || today());

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(categories[newType][0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);

    if (
      !title.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0 ||
      !date ||
      date > today()
    ) {
      return;
    }

    const updatedTransaction = {
      id: initialTransaction?.id || crypto.randomUUID(),
      type,
      title: title.trim(),
      amount: numericAmount,
      category,
      date,
      createdAt: initialTransaction?.createdAt || new Date().toISOString(),
    };

    onAdd(updatedTransaction);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {initialTransaction ? "İşlemi Düzenle" : "Yeni İşlem"}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Gelir veya gider bilgilerini gir.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
            aria-label="Formu kapat"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`py-3 rounded-xl font-medium text-sm ${
                type === "income"
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-slate-50 text-slate-500 border border-slate-100"
              }`}
            >
              <TrendingUp size={17} className="inline mr-2" />
              Gelir
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`py-3 rounded-xl font-medium text-sm ${
                type === "expense"
                  ? "bg-rose-100 text-rose-700 border border-rose-300"
                  : "bg-slate-50 text-slate-500 border border-slate-100"
              }`}
            >
              <TrendingDown size={17} className="inline mr-2" />
              Gider
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              İşlem açıklaması
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn. Market alışverişi"
              required
              maxLength={60}
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tutar (₺)
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              min="0.01"
              step="0.01"
              required
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Kategori
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 bg-white outline-none focus:border-violet-500"
            >
              {categories[type].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tarih
            </label>

            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700"
            >
              {initialTransaction ? "Değişiklikleri Kaydet" : "İşlemi Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// İşlem listesi
function TransactionList({ transactions, onDelete, onEdit }) {
  const [filter, setFilter] = useState("all");

  const filteredTransactions = transactions
    .filter((item) => (filter === "all" ? true : item.type === filter))
    .sort((a, b) => {
      return (
        b.date.localeCompare(a.date) ||
        (b.createdAt || "").localeCompare(a.createdAt || "")
      );
    });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h3 className="font-semibold text-slate-800">İşlemler</h3>
          <p className="text-sm text-slate-400 mt-1">
            Gelir ve gider kayıtların
          </p>
        </div>

        <div className="flex gap-2">
          {[
            { label: "Tümü", value: "all" },
            { label: "Gelir", value: "income" },
            { label: "Gider", value: "expense" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-3 py-2 text-xs rounded-lg font-medium ${
                filter === item.value
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-50 text-slate-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-10">
          <Wallet size={35} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">Henüz işlem bulunmuyor.</p>
          <p className="text-xs text-slate-400 mt-1">
            Yeni bir gelir veya gider ekleyebilirsin.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredTransactions.map((transaction) => {
            const Icon = categoryIcons[transaction.category] || Wallet;

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-700">
                      {transaction.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p
                    className={`text-sm font-semibold whitespace-nowrap ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {currency(transaction.amount)}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                      title="Düzenle"
                      aria-label={`${transaction.title} işlemini düzenle`}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(transaction.id)}
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      title="İşlemi sil"
                      aria-label={`${transaction.title} işlemini sil`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Dashboard
function Dashboard({
  transactions,
  onAddClick,
  onDelete,
  onEdit,
  budget,
  onBudgetClick,
}) {
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = totalIncome - totalExpense;

  // Sadece seçili ayın giderlerini bütçede kullanacağız.
  const currentMonth = today().slice(0, 7);

  const monthlyExpense = transactions
    .filter(
      (item) => item.type === "expense" && item.date.startsWith(currentMonth),
    )
    .reduce((total, item) => total + item.amount, 0);

  const monthlyBudget = budget;

  const remainingBudget = monthlyBudget - monthlyExpense;

  const budgetPercentage = Math.min(
    (monthlyExpense / monthlyBudget) * 100,
    100,
  );

  return (
    <div className="flex-1 p-5 md:p-8 min-w-0">
      <header className="flex justify-between items-center mb-8 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Finansal durumuna genel bakış.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500">
            <Bell size={20} />
          </button>

          <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
            MF
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
        <SummaryCard
          title="Toplam Bakiye"
          amount={balance}
          icon={Wallet}
          color="bg-violet-50 text-violet-600"
          description="Toplam gelir ve gider farkı"
        />

        <SummaryCard
          title="Toplam Gelir"
          amount={totalIncome}
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-600"
          description="Kaydedilen tüm gelirler"
        />

        <SummaryCard
          title="Toplam Gider"
          amount={totalExpense}
          icon={TrendingDown}
          color="bg-rose-50 text-rose-600"
          description="Kaydedilen tüm giderler"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-semibold text-slate-800">Aylık Bütçe</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Bu ayki harcamaların
                </p>
              </div>
              <button
                onClick={onBudgetClick}
                className="text-sm text-violet-600 font-medium hover:text-violet-800"
              >
                Düzenle
              </button>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-sm text-slate-500">Harcanan</span>
              <span className="text-sm font-semibold text-slate-700">
                {currency(monthlyExpense)} / {currency(monthlyBudget)}
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  monthlyExpense > monthlyBudget
                    ? "bg-rose-500"
                    : "bg-violet-600"
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>

            <p
              className={`text-sm mt-3 font-medium ${
                remainingBudget < 0 ? "text-rose-600" : "text-emerald-600"
              }`}
            >
              {remainingBudget >= 0
                ? `${currency(remainingBudget)} bütçen kaldı.`
                : `${currency(Math.abs(remainingBudget))} bütçe aşıldı!`}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyChart transactions={transactions} />

            <CategoryChart transactions={transactions} />
          </div>
          <TransactionList
            transactions={transactions}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-fit">
          <h3 className="font-semibold text-slate-800 mb-5">Finansal Özet</h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Gelir</span>
                <span className="font-semibold text-emerald-600">
                  {currency(totalIncome)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${
                      totalIncome + totalExpense > 0
                        ? (totalIncome / (totalIncome + totalExpense)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">Gider</span>
                <span className="font-semibold text-rose-600">
                  {currency(totalExpense)}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${
                      totalIncome + totalExpense > 0
                        ? (totalExpense / (totalIncome + totalExpense)) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-violet-50 rounded-xl">
            <p className="text-sm font-semibold text-violet-800">
              Finansal durumun
            </p>
            <p className="text-xs text-violet-600 mt-2 leading-relaxed">
              {transactions.length === 0
                ? "İlk gelir veya gider kaydını ekleyerek finansal takibine başlayabilirsin."
                : balance >= 0
                  ? "Şu an toplam bakiyen pozitif. Bütçeni takip etmeye devam et!"
                  : "Giderlerin gelirlerinden fazla. Harcamalarını gözden geçirebilirsin."}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onAddClick}
        className="fixed bottom-6 right-6 bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-full shadow-lg transition"
        aria-label="Yeni işlem ekle"
      >
        <Plus size={25} />
      </button>
    </div>
  );
}

// Ana uygulama

function App() {
  // Gelir ve gider kayıtları
  const [transactions, setTransactions] = useLocalStorage(
    "moneyflow_transactions",
    [],
  );

  // Aylık bütçeler
  const [budgets, setBudgets] = useLocalStorage("moneyflow_budgets", {});
  const [activePage, setActivePage] = useState("Dashboard");
  // Formların açılıp kapanması
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBudgetFormOpen, setIsBudgetFormOpen] = useState(false);

  // Düzenlenen işlem
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Geçerli ay
  const currentMonth = today().slice(0, 7);

  // Seçili ayın bütçesi
  const monthlyBudget = budgets[currentMonth] ?? 20000;

  // İşlem ekleme veya güncelleme
  const saveTransaction = (transaction) => {
    setTransactions((previous) => {
      const exists = previous.some((item) => item.id === transaction.id);

      if (exists) {
        return previous.map((item) =>
          item.id === transaction.id ? transaction : item,
        );
      }

      return [...previous, transaction];
    });

    setEditingTransaction(null);
  };

  // İşlem silme
  const deleteTransaction = (id) => {
    const confirmed = window.confirm("Bu işlemi silmek istediğine emin misin?");

    if (!confirmed) return;

    setTransactions((previous) => previous.filter((item) => item.id !== id));
  };

  // İşlem düzenleme formunu açma
  const editTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  // Formu kapatma
  const closeTransactionForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  // Bütçeyi kaydetme
  const saveBudget = (amount) => {
    setBudgets((previous) => ({
      ...previous,
      [currentMonth]: amount,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      {activePage === "Dashboard" && (
        <Dashboard
          transactions={transactions}
          onAddClick={() => {
            setEditingTransaction(null);
            setIsFormOpen(true);
          }}
          onDelete={deleteTransaction}
          onEdit={editTransaction}
          budget={monthlyBudget}
          onBudgetClick={() => setIsBudgetFormOpen(true)}
        />
      )}

      {activePage === "İşlemler" && (
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">İşlemler</h1>
              <p className="text-slate-500 mt-1">
                Tüm gelir ve gider kayıtlarını yönet.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsFormOpen(true);
              }}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-xl font-medium"
            >
              + Yeni İşlem
            </button>
          </div>

          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            onEdit={editTransaction}
          />
        </main>
      )}

      {activePage === "Bütçe Yönetimi" && (
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-slate-800">Bütçe Yönetimi</h1>

          <p className="text-slate-500 mt-1 mb-6">
            Aylık bütçeni buradan düzenleyebilirsin.
          </p>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 max-w-xl">
            <p className="text-sm text-slate-500">Bu ayın bütçesi</p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
                maximumFractionDigits: 0,
              }).format(monthlyBudget)}
            </p>

            <button
              onClick={() => setIsBudgetFormOpen(true)}
              className="mt-5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-medium"
            >
              Bütçeyi Düzenle
            </button>
          </div>
        </main>
      )}

      {activePage === "İstatistikler" && (
        <main className="flex-1 min-w-0 p-4 md:p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            İstatistikler
          </h1>

          <p className="text-slate-500 mb-6">
            Gelirlerini ve harcamalarını grafiklerle incele.
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <MonthlyChart transactions={transactions} />
            <CategoryChart transactions={transactions} />
          </div>
        </main>
      )}

      {activePage !== "Dashboard" && (
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-slate-800">{activePage}</h1>
          <p className="text-slate-500 mt-2">
            Bu sayfa üzerinde yakında çalışacağız.
          </p>
        </main>
      )}

      {isFormOpen && (
        <TransactionForm
          initialTransaction={editingTransaction}
          onClose={closeTransactionForm}
          onAdd={saveTransaction}
        />
      )}

      {isBudgetFormOpen && (
        <BudgetForm
          initialBudget={monthlyBudget}
          onClose={() => setIsBudgetFormOpen(false)}
          onSave={saveBudget}
        />
      )}
    </div>
  );
}

export default App;
