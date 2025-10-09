import { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export default function Reservation() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    service: "커트",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      alert(data.message || "예약 성공!");
    } catch (err) {
      alert("예약 실패. 잠시 후 다시 시도해주세요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-md rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 shadow p-6 grid gap-3">
      <h2 className="text-2xl font-semibold">예약하기</h2>
      <input
        name="name"
        placeholder="이름"
        value={form.name}
        onChange={onChange}
        required
        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="phone"
        placeholder="전화번호"
        value={form.phone}
        onChange={onChange}
        required
        className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input name="date" type="date" value={form.date} onChange={onChange} required className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <input name="time" type="time" value={form.time} onChange={onChange} required className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <select name="service" value={form.service} onChange={onChange} className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option>커트</option>
        <option>염색</option>
        <option>펌</option>
      </select>
      <button disabled={loading} className="mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50">
        {loading ? "전송중..." : "예약 요청"}
      </button>
    </form>
  );
}

