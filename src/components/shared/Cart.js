"use client";

export default function Cart({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Lớp mask đen */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Nội dung giỏ hàng */}
      <div className="z-60 bg-white w-[30%] p-6 shadow-lg right-0 absolute top-0 bottom-0">
        <div className=" flex items-center justify-between pb-6 border-b-[1px] border-black px-4">
          <h2 className="text-3xl">Cart</h2>
          <button className="text-black text-2xl" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
