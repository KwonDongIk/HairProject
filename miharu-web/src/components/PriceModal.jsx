import { createPortal } from "react-dom";
import { useEffect } from "react";

export default function PriceModal({ open, onClose, onGoReserve }) {
  if (!open) return null;

  // Lock scroll
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  const modal = (
    <>
      <div
        className="fixed left-0 top-0 w-screen h-screen z-[2147483646] bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-[2147483647] w-screen h-screen flex items-center justify-center p-4 pointer-events-none"
        aria-modal="true"
        role="dialog"
      >
        <div
          className="pointer-events-auto bg-white text-gray-900 max-w-[480px] w-full rounded-xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
        >
          <h2 className="text-xl font-semibold mb-2">가격 안내</h2>
          <ul className="list-none p-0 m-0 grid gap-2">
            <li className="flex items-center justify-between"><span>커트</span><span>30,000원</span></li>
            <li className="flex items-center justify-between"><span>염색</span><span>80,000원</span></li>
            <li className="flex items-center justify-between"><span>펌</span><span>120,000원</span></li>
          </ul>
          <p className="mt-2 text-sm text-gray-500">
            모든 시술은 모발 상태와 추가 옵션에 따라 금액이 달라질 수 있습니다.
          </p>
          <div className="mt-4 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onGoReserve}
              className="rounded-[10px] bg-indigo-600 text-white px-4 py-2"
            >
              예약하러 가기
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-[10px] border border-gray-200 px-4 py-2"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
