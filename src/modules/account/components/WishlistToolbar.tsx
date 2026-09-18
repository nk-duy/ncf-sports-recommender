"use client";

import React, { useState } from "react";
import { Checkbox } from "@mantine/core";

interface WishlistToolbarProps {
  totalItems: number;
}

export default function WishlistToolbar({ totalItems }: WishlistToolbarProps) {
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <div className="bg-[#F0F2F5] rounded-md p-3 flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <Checkbox 
          color="gray"
          size="sm"
        />
        <span className="text-sm text-gray-700">
          Chọn tất cả {totalItems} sản phẩm trang này
        </span>
      </div>
      <div className="text-sm text-gray-500">
        Đã chọn: <span className="font-bold text-gray-700">{selectedCount}</span> mục
      </div>
    </div>
  );
}
