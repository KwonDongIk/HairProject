import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PriceModal from "../components/PriceModal";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const goReserveConfirm = () => {
    const ok = window.confirm("예약 페이지로 이동할까요?");
    if (ok) navigate("/reserve");
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <main className="grid gap-6">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 shadow p-6">
          <h1 className="text-3xl font-semibold leading-tight">
            <span className="block">어서 오세요</span>
            <span className="block">미하루헤어입니다</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            <span className="block">원하시는 메뉴를 확인하고</span>
            <span className="block">아래 버튼으로 확인해주세요</span>
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              가격 확인하기
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 shadow p-6">
          <h1 className="text-2xl font-semibold leading-tight">
            <span className="block">예약하기 버튼을 클릭하시면</span>
            <span className="block">예약 페이지로 이동합니다</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            <span className="block">원하는 메뉴를 선택하고,</span>
            <span className="block">가능한 시간을 입력해주세요</span>
          </p>
          <div className="mt-4">
            <Link
              className="inline-flex items-center rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              to="/reserve"
            >
              예약 진행하기
            </Link>
          </div>
        </div>
      </main>

      <PriceModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onGoReserve={goReserveConfirm}
      />
    </div>
  );
}
