import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: 인증 API 연동
      await new Promise((r) => setTimeout(r, 400));
      alert("로그인 성공 (샘플)");
      navigate("/home");
    } catch (e) {
      alert("로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <form className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 shadow p-6 grid gap-3" onSubmit={onSubmit}>
        <h2 className="text-2xl font-semibold">로그인</h2>
        <input
          name="id"
          placeholder="아이디"
          value={form.id}
          onChange={onChange}
          required
          className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={onChange}
          required
          className="block w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" disabled={loading} className="mt-1 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50">
          {loading ? "확인 중..." : "로그인"}
        </button>
        <div className="mt-2">
          <Link className="inline-flex items-center rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" to="/home">
            홈으로
          </Link>
        </div>
      </form>
    </div>
  );
}

