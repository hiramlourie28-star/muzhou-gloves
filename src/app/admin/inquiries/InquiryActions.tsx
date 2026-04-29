"use client";

import { setInquiryStatus, deleteInquiry } from "../_actions";

export function StatusButtons({ id, current }: { id: string; current: string }) {
  const next = current === "new" ? "contacted" : current === "contacted" ? "closed" : "new";
  const nextLabel =
    next === "contacted" ? "标记已联系" : next === "closed" ? "归档" : "重新打开";
  return (
    <form action={setInquiryStatus} className="inline">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={next} />
      <button className="text-blue-600 hover:underline text-sm">{nextLabel}</button>
    </form>
  );
}

export function DeleteButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteInquiry}
      onSubmit={(e) => {
        if (!confirm(`确认删除 ${name} 的询价记录？此操作不可恢复。`))
          e.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <button className="text-red-600 hover:underline text-sm">删除</button>
    </form>
  );
}
