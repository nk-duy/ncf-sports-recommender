# Next.js 16+ Modular Clean Architecture Starter

Dự án mẫu sử dụng **Next.js 16+**, **Mantine UI v9+**, **Tailwind CSS**, **Zod**, **Zustand**, **React Hook Form**, **Mantine DataTable** và **Drizzle ORM**.

README này hướng dẫn xây dựng dự án theo hướng:

```txt
Module hóa + Clean Architecture
```

Tức là:

```txt
Mỗi nghiệp vụ là một module riêng.
Mỗi module tự quản lý page, component, hook, service, repository, validation, type.
```

Cách tổ chức này giúp dự án dễ bảo trì, dễ chia việc cho nhóm, dễ mở rộng thêm tính năng mới.

---

## 1. Tech Stack

### Frontend

| Công nghệ | Mục đích sử dụng |
|---|---|
| Next.js 16+ | Framework chính để xây dựng web app React |
| App Router | Tổ chức route theo thư mục `app/` |
| React 19+ | UI library nền tảng |
| TypeScript | Kiểm tra kiểu dữ liệu, giảm lỗi khi code |
| Mantine UI v9+ | Bộ component UI chính |
| Tailwind CSS | Utility CSS để custom layout nhanh |
| Mantine DataTable | Hiển thị bảng dữ liệu, phân trang, sort, filter |
| React Hook Form | Quản lý form |
| Zod | Validate dữ liệu form/API |
| Zustand | Quản lý state phía client |

### Backend / Database

| Công nghệ | Mục đích sử dụng |
|---|---|
| Drizzle ORM | Định nghĩa schema database bằng TypeScript |
| Drizzle Kit | Generate và chạy migration |
| drizzle-seed | Seed dữ liệu mẫu |
| MySQL / PostgreSQL | Database chính, tùy cấu hình dự án |

---

## 2. Tư duy module hóa

Thay vì để tất cả file nằm chung một chỗ như:

```txt
components/
hooks/
services/
repositories/
types/
validations/
```

Dự án nên gom theo từng nghiệp vụ:

```txt
modules/
├── products/
├── users/
├── categories/
├── orders/
└── dashboard/
```

Ví dụ module `products` sẽ tự chứa toàn bộ code liên quan đến sản phẩm:

```txt
src/modules/products/
├── pages/
├── components/
├── hooks/
├── services/
├── repositories/
├── validations/
├── types/
├── stores/
├── actions/
└── index.ts
```

Như vậy khi sửa chức năng sản phẩm, lập trình viên chỉ cần vào module `products`, không cần tìm file rải rác khắp dự án.

---

## 3. Kiến trúc tổng thể

Luồng xử lý chuẩn:

```txt
Page
 ↓
Component
 ↓
Hook
 ↓
Action / API Route
 ↓
Service
 ↓
Repository
 ↓
Database
```

Trong đó:

| Lớp | Vai trò |
|---|---|
| Page | Hiển thị màn hình, gọi component/hook/action |
| Component | UI tái sử dụng trong module |
| Hook | Quản lý state client, loading, error, filter |
| Action | Server Action để gọi xử lý phía server |
| Service | Xử lý nghiệp vụ chính |
| Repository | Làm việc trực tiếp với database |
| Validation | Validate bằng Zod |
| Store | State client bằng Zustand |
| Type | Định nghĩa type/interface |
| Schema DB | Định nghĩa bảng bằng Drizzle |

---

## 4. Cấu trúc thư mục đề xuất

```txt
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   │
│   ├── products/
│   │   ├── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   │
│   ├── categories/
│   │   └── page.tsx
│   │
│   └── users/
│       └── page.tsx
│
├── modules/
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   └── ProductFilter.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   ├── services/
│   │   │   └── product.service.ts
│   │   ├── repositories/
│   │   │   └── product.repository.ts
│   │   ├── validations/
│   │   │   └── product.schema.ts
│   │   ├── types/
│   │   │   └── product.type.ts
│   │   ├── stores/
│   │   │   └── product.store.ts
│   │   ├── actions/
│   │   │   └── product.action.ts
│   │   └── index.ts
│   │
│   ├── categories/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── validations/
│   │   ├── types/
│   │   ├── stores/
│   │   ├── actions/
│   │   └── index.ts
│   │
│   └── users/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── repositories/
│       ├── validations/
│       ├── types/
│       ├── stores/
│       ├── actions/
│       └── index.ts
│
├── shared/
│   ├── components/
│   │   ├── AppShellLayout.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ConfirmDeleteModal.tsx
│   │   └── EmptyState.tsx
│   ├── hooks/
│   │   └── useDebouncedSearch.ts
│   ├── services/
│   │   └── notification.service.ts
│   ├── types/
│   │   └── common.type.ts
│   └── utils/
│       ├── format-money.ts
│       ├── format-date.ts
│       └── slugify.ts
│
├── db/
│   ├── index.ts
│   ├── schema/
│   │   ├── index.ts
│   │   ├── products.schema.ts
│   │   ├── categories.schema.ts
│   │   └── users.schema.ts
│   └── seed/
│       ├── index.ts
│       ├── products.seed.ts
│       ├── categories.seed.ts
│       └── users.seed.ts
│
├── config/
│   ├── env.ts
│   ├── constants.ts
│   └── menu.ts
│
└── styles/
    └── theme.ts

drizzle/
├── meta/
└── 0000_init.sql

drizzle.config.ts
.env.example
package.json
README.md
```

---

## 5. Quy tắc chia thư mục

### `src/app`

Chỉ dùng để khai báo route của Next.js.

Ví dụ:

```txt
src/app/products/page.tsx
src/app/products/create/page.tsx
src/app/products/[id]/edit/page.tsx
```

Các file trong `app/` nên mỏng, chủ yếu gọi code từ `modules/`.

Không nên viết quá nhiều logic trong `app/`.

---

### `src/modules`

Chứa các module nghiệp vụ chính.

Ví dụ:

```txt
products
categories
users
orders
dashboard
auth
```

Mỗi module tự quản lý code của chính nó.

---

### `src/shared`

Chứa code dùng chung cho nhiều module.

Ví dụ:

```txt
Button dùng chung
Modal xác nhận xóa
Format tiền tệ
Format ngày tháng
Hook debounce
Type phân trang
```

Không đưa logic nghiệp vụ riêng của một module vào `shared`.

---

### `src/db`

Chứa database connection, schema và seed.

Quy định:

```txt
src/db/schema      # Chỉ chứa Drizzle schema
src/db/seed        # Chỉ chứa seed data
src/db/index.ts    # Khởi tạo db connection
```

Không đặt schema database trong module.

Lý do: Drizzle cần một nơi tập trung để generate migration rõ ràng.

---

### `src/config`

Chứa cấu hình toàn cục:

```txt
env
menu
constant
app config
permission config
```

---

## 6. Cài đặt dự án

### Bước 1: Tạo project Next.js

```bash
npx create-next-app@latest my-modular-app
cd my-modular-app
```

Nên chọn:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src/ directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: Yes
```

---

### Bước 2: Cài Mantine UI

```bash
npm install @mantine/core @mantine/hooks @mantine/form @mantine/notifications
npm install @mantine/dates dayjs
npm install @tabler/icons-react
```

---

### Bước 3: Cài form, validation, state

```bash
npm install react-hook-form zod @hookform/resolvers zustand
```

---

### Bước 4: Cài Mantine DataTable

```bash
npm install mantine-datatable
```

---

### Bước 5: Cài Drizzle ORM

Nếu dùng MySQL:

```bash
npm install drizzle-orm mysql2
npm install -D drizzle-kit tsx
npm install drizzle-seed
```

Nếu dùng PostgreSQL:

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit tsx
npm install drizzle-seed
```

---

## 7. Cấu hình `.env`

Tạo file `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/my_modular_app"
```

Tạo file `.env.example`:

```env
DATABASE_URL=
```

---

## 8. Cấu hình Drizzle

Tạo file `drizzle.config.ts` ở thư mục gốc:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Nếu dùng PostgreSQL:

```ts
dialect: "postgresql"
```

---

## 9. Khởi tạo database connection

Tạo file `src/db/index.ts`:

```ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema, mode: "default" });
```

---

## 10. Tạo schema database

Tạo file `src/db/schema/products.schema.ts`:

```ts
import {
  int,
  mysqlTable,
  timestamp,
  varchar,
  decimal,
} from "drizzle-orm/mysql-core";

export const products = mysqlTable("products", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  description: varchar("description", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
```

Tạo file `src/db/schema/index.ts`:

```ts
export * from "./products.schema";
```

---

## 11. Tạo migration và seed

Thêm script vào `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx src/db/seed/index.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

Generate migration:

```bash
npm run db:generate
```

Chạy migration:

```bash
npm run db:migrate
```

---

## 12. Seed dữ liệu mẫu

Tạo file `src/db/seed/products.seed.ts`:

```ts
import { db } from "@/db";
import { products } from "@/db/schema";

export async function seedProducts() {
  await db.insert(products).values([
    {
      name: "Khóa học Next.js cơ bản",
      slug: "khoa-hoc-nextjs-co-ban",
      price: "499000",
      description: "Khóa học dành cho người mới bắt đầu.",
    },
    {
      name: "Khóa học React Hook Form",
      slug: "khoa-hoc-react-hook-form",
      price: "399000",
      description: "Học cách xây dựng form chuyên nghiệp.",
    },
  ]);
}
```

Tạo file `src/db/seed/index.ts`:

```ts
import { seedProducts } from "./products.seed";

async function main() {
  console.log("Start seeding...");

  await seedProducts();

  console.log("Seeding completed.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
```

Chạy seed:

```bash
npm run db:seed
```

---

# 13. Xây module Products mẫu

Module mẫu:

```txt
src/modules/products/
├── components/
│   ├── ProductForm.tsx
│   ├── ProductTable.tsx
│   └── ProductFilter.tsx
├── hooks/
│   └── useProducts.ts
├── services/
│   └── product.service.ts
├── repositories/
│   └── product.repository.ts
├── validations/
│   └── product.schema.ts
├── types/
│   └── product.type.ts
├── stores/
│   └── product.store.ts
├── actions/
│   └── product.action.ts
└── index.ts
```

---

## 14. Type của module

Tạo file `src/modules/products/types/product.type.ts`:

```ts
export type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  description?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type CreateProductInput = {
  name: string;
  slug: string;
  price: string;
  description?: string;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductFilter = {
  keyword?: string;
  page?: number;
  limit?: number;
};
```

---

## 15. Validation của module

Tạo file `src/modules/products/validations/product.schema.ts`:

```ts
import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(1, "Vui lòng nhập tên sản phẩm")
    .max(255, "Tên sản phẩm không được quá 255 ký tự"),

  slug: z
    .string()
    .min(1, "Vui lòng nhập slug")
    .max(255, "Slug không được quá 255 ký tự"),

  price: z
    .string()
    .min(1, "Vui lòng nhập giá sản phẩm"),

  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
```

---

## 16. Repository của module

Repository chỉ làm việc với database/API.

Tạo file `src/modules/products/repositories/product.repository.ts`:

```ts
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, like } from "drizzle-orm";
import type {
  CreateProductInput,
  ProductFilter,
  UpdateProductInput,
} from "../types/product.type";

export const productRepository = {
  async findAll(filter?: ProductFilter) {
    const keyword = filter?.keyword?.trim();

    if (keyword) {
      return db
        .select()
        .from(products)
        .where(like(products.name, `%${keyword}%`));
    }

    return db.select().from(products);
  },

  async findById(id: number) {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return result[0] ?? null;
  },

  async create(data: CreateProductInput) {
    return db.insert(products).values(data);
  },

  async update(id: number, data: UpdateProductInput) {
    return db
      .update(products)
      .set(data)
      .where(eq(products.id, id));
  },

  async delete(id: number) {
    return db.delete(products).where(eq(products.id, id));
  },
};
```

---

## 17. Service của module

Service xử lý nghiệp vụ chính.

Tạo file `src/modules/products/services/product.service.ts`:

```ts
import { productRepository } from "../repositories/product.repository";
import type {
  CreateProductInput,
  ProductFilter,
  UpdateProductInput,
} from "../types/product.type";

export const productService = {
  async getProducts(filter?: ProductFilter) {
    return productRepository.findAll(filter);
  },

  async getProductById(id: number) {
    if (!id || id <= 0) {
      throw new Error("ID sản phẩm không hợp lệ");
    }

    return productRepository.findById(id);
  },

  async createProduct(data: CreateProductInput) {
    const normalizedData = {
      ...data,
      slug: data.slug.trim().toLowerCase(),
    };

    return productRepository.create(normalizedData);
  },

  async updateProduct(id: number, data: UpdateProductInput) {
    if (!id || id <= 0) {
      throw new Error("ID sản phẩm không hợp lệ");
    }

    return productRepository.update(id, data);
  },

  async deleteProduct(id: number) {
    if (!id || id <= 0) {
      throw new Error("ID sản phẩm không hợp lệ");
    }

    return productRepository.delete(id);
  },
};
```

---

## 18. Server Action của module

Server Action giúp Client Component gọi xử lý phía server an toàn hơn.

Tạo file `src/modules/products/actions/product.action.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { productService } from "../services/product.service";
import type {
  CreateProductInput,
  ProductFilter,
  UpdateProductInput,
} from "../types/product.type";

export async function getProductsAction(filter?: ProductFilter) {
  return productService.getProducts(filter);
}

export async function createProductAction(data: CreateProductInput) {
  await productService.createProduct(data);
  revalidatePath("/products");
}

export async function updateProductAction(
  id: number,
  data: UpdateProductInput
) {
  await productService.updateProduct(id, data);
  revalidatePath("/products");
}

export async function deleteProductAction(id: number) {
  await productService.deleteProduct(id);
  revalidatePath("/products");
}
```

---

## 19. Hook của module

Hook quản lý dữ liệu phía client.

Tạo file `src/modules/products/hooks/useProducts.ts`:

```ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { getProductsAction } from "../actions/product.action";
import type { Product, ProductFilter } from "../types/product.type";

export function useProducts(initialFilter?: ProductFilter) {
  const [items, setItems] = useState<Product[]>([]);
  const [filter, setFilter] = useState<ProductFilter>(initialFilter ?? {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getProductsAction(filter);
      setItems(data as Product[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    items,
    filter,
    loading,
    error,
    setFilter,
    fetchProducts,
  };
}
```

---

## 20. Zustand store của module

Dùng cho state giao diện như keyword, selected rows, modal.

Tạo file `src/modules/products/stores/product.store.ts`:

```ts
import { create } from "zustand";

type ProductState = {
  keyword: string;
  selectedIds: number[];
  setKeyword: (keyword: string) => void;
  setSelectedIds: (ids: number[]) => void;
  reset: () => void;
};

export const useProductStore = create<ProductState>((set) => ({
  keyword: "",
  selectedIds: [],

  setKeyword: (keyword) => set({ keyword }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  reset: () =>
    set({
      keyword: "",
      selectedIds: [],
    }),
}));
```

---

## 21. Component bảng dữ liệu

Tạo file `src/modules/products/components/ProductTable.tsx`:

```tsx
"use client";

import { DataTable } from "mantine-datatable";
import type { Product } from "../types/product.type";

type ProductTableProps = {
  records: Product[];
  loading?: boolean;
};

export function ProductTable({ records, loading }: ProductTableProps) {
  return (
    <DataTable
      withTableBorder
      borderRadius="md"
      striped
      highlightOnHover
      fetching={loading}
      records={records}
      columns={[
        {
          accessor: "id",
          title: "ID",
          width: 80,
        },
        {
          accessor: "name",
          title: "Tên sản phẩm",
        },
        {
          accessor: "slug",
          title: "Slug",
        },
        {
          accessor: "price",
          title: "Giá",
        },
      ]}
    />
  );
}
```

---

## 22. Component form

Tạo file `src/modules/products/components/ProductForm.tsx`:

```tsx
"use client";

import { Button, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  type ProductFormValues,
} from "../validations/product.schema";

type ProductFormProps = {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void | Promise<void>;
};

export function ProductForm({ defaultValues, onSubmit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      price: "",
      description: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="Tên sản phẩm"
        placeholder="Nhập tên sản phẩm"
        error={errors.name?.message}
        {...register("name")}
      />

      <TextInput
        mt="md"
        label="Slug"
        placeholder="nhap-slug-san-pham"
        error={errors.slug?.message}
        {...register("slug")}
      />

      <TextInput
        mt="md"
        label="Giá"
        placeholder="Nhập giá"
        error={errors.price?.message}
        {...register("price")}
      />

      <Textarea
        mt="md"
        label="Mô tả"
        placeholder="Nhập mô tả"
        error={errors.description?.message}
        {...register("description")}
      />

      <Group justify="flex-end" mt="xl">
        <Button type="submit" loading={isSubmitting}>
          Lưu
        </Button>
      </Group>
    </form>
  );
}
```

---

## 23. Component filter

Tạo file `src/modules/products/components/ProductFilter.tsx`:

```tsx
"use client";

import { Button, Group, TextInput } from "@mantine/core";

type ProductFilterProps = {
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
};

export function ProductFilter({
  keyword,
  onKeywordChange,
  onSearch,
}: ProductFilterProps) {
  return (
    <Group mb="md">
      <TextInput
        placeholder="Tìm theo tên sản phẩm"
        value={keyword}
        onChange={(event) => onKeywordChange(event.currentTarget.value)}
      />

      <Button onClick={onSearch}>Tìm kiếm</Button>
    </Group>
  );
}
```

---

## 24. File export của module

Tạo file `src/modules/products/index.ts`:

```ts
export * from "./components/ProductForm";
export * from "./components/ProductTable";
export * from "./components/ProductFilter";

export * from "./hooks/useProducts";

export * from "./actions/product.action";

export * from "./types/product.type";
export * from "./validations/product.schema";
```

Khi import bên ngoài module, ưu tiên import từ file `index.ts`:

```ts
import { ProductTable, useProducts } from "@/modules/products";
```

---

## 25. Page danh sách sản phẩm

Tạo file `src/app/products/page.tsx`:

```tsx
"use client";

import { Alert, Button, Group, Paper, Title } from "@mantine/core";
import Link from "next/link";
import {
  ProductFilter,
  ProductTable,
  useProducts,
} from "@/modules/products";

export default function ProductListPage() {
  const {
    items,
    filter,
    loading,
    error,
    setFilter,
    fetchProducts,
  } = useProducts();

  return (
    <Paper p="lg" radius="md" shadow="sm">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Quản lý sản phẩm</Title>

        <Button component={Link} href="/products/create">
          Thêm sản phẩm
        </Button>
      </Group>

      <ProductFilter
        keyword={filter.keyword ?? ""}
        onKeywordChange={(keyword) =>
          setFilter({
            ...filter,
            keyword,
          })
        }
        onSearch={fetchProducts}
      />

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      <ProductTable records={items} loading={loading} />
    </Paper>
  );
}
```

---

## 26. Page tạo sản phẩm

Tạo file `src/app/products/create/page.tsx`:

```tsx
"use client";

import { Paper, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
  ProductForm,
  createProductAction,
  type ProductFormValues,
} from "@/modules/products";

export default function ProductCreatePage() {
  const router = useRouter();

  async function handleSubmit(values: ProductFormValues) {
    await createProductAction(values);
    router.push("/products");
  }

  return (
    <Paper p="lg" radius="md" shadow="sm">
      <Title order={2} mb="lg">
        Thêm sản phẩm
      </Title>

      <ProductForm onSubmit={handleSubmit} />
    </Paper>
  );
}
```

---

## 27. Khi nào tạo module mới?

Tạo module mới khi chức năng có nghiệp vụ riêng.

Ví dụ nên tách module:

```txt
products
categories
orders
users
roles
permissions
dashboard
reports
notifications
```

Không nên tạo module quá nhỏ cho những thứ chỉ là component dùng chung.

Ví dụ không nên tạo module riêng:

```txt
Button
Input
Modal
Card
FormatDate
```

Các phần này nên để trong `shared`.

---

## 28. Module nên có những gì?

Một module đầy đủ có thể gồm:

```txt
components     # UI riêng của module
hooks          # Hook riêng của module
services       # Logic nghiệp vụ
repositories   # Truy vấn DB/API
validations    # Zod schema
types          # TypeScript type
stores         # Zustand store
actions        # Server Actions
constants      # Hằng số riêng của module
utils          # Hàm tiện ích riêng của module
index.ts       # Public exports
```

Không bắt buộc module nào cũng có đủ tất cả thư mục.

Ví dụ module `dashboard` có thể chỉ cần:

```txt
components
services
repositories
types
```

---

## 29. Quy tắc import giữa các module

### Nên

Module khác chỉ import qua `index.ts`:

```ts
import { ProductTable } from "@/modules/products";
```

### Không nên

Không import sâu vào nội bộ module khác:

```ts
import { ProductTable } from "@/modules/products/components/ProductTable";
```

Lý do: Nếu sau này đổi cấu trúc bên trong module, các module khác sẽ ít bị ảnh hưởng.

---

## 30. Quy tắc phụ thuộc giữa các lớp

Một module nên đi theo chiều phụ thuộc sau:

```txt
Page
 → Component
 → Hook
 → Action
 → Service
 → Repository
 → Database
```

Không làm ngược lại.

### Không nên

```txt
Repository import Component
Service import Component
Database schema import Hook
Shared import Module nghiệp vụ cụ thể
```

### Nên

```txt
Page import Module
Module import Shared
Repository import Database
Service import Repository
Hook import Action
Component import Type/Validation
```

---

## 31. Shared code dùng thế nào?

`shared` chỉ chứa code thật sự dùng chung.

Ví dụ:

```txt
src/shared/components/ConfirmDeleteModal.tsx
src/shared/components/PageHeader.tsx
src/shared/utils/format-money.ts
src/shared/utils/slugify.ts
src/shared/types/pagination.type.ts
```

Ví dụ dùng trong module:

```ts
import { formatMoney } from "@/shared/utils/format-money";
```

Không nên đưa logic riêng của sản phẩm vào shared:

```txt
src/shared/services/product.service.ts
```

Sai, vì `product.service.ts` thuộc module `products`.

---

## 32. Quy tắc với Drizzle schema

Dù dự án module hóa, schema database vẫn nên để tập trung tại:

```txt
src/db/schema
```

Ví dụ:

```txt
src/db/schema/products.schema.ts
src/db/schema/categories.schema.ts
src/db/schema/users.schema.ts
```

Lý do:

```txt
- Drizzle dễ generate migration.
- Dễ nhìn toàn bộ database schema.
- Tránh mỗi module tự đặt schema một nơi.
- Dễ kiểm soát quan hệ giữa các bảng.
```

Module chỉ được import schema khi cần truy vấn ở Repository.

---

## 33. Quy tắc với seed

Seed cũng nên để tập trung tại:

```txt
src/db/seed
```

Ví dụ:

```txt
src/db/seed/products.seed.ts
src/db/seed/categories.seed.ts
src/db/seed/users.seed.ts
src/db/seed/index.ts
```

Không đặt seed trong module để tránh phân tán dữ liệu khởi tạo.

---

## 34. Quy tắc đặt tên file

| Loại file | Quy ước |
|---|---|
| Module | `products`, `users`, `orders` |
| Component | `ProductForm.tsx`, `ProductTable.tsx` |
| Hook | `useProducts.ts` |
| Service | `product.service.ts` |
| Repository | `product.repository.ts` |
| Store | `product.store.ts` |
| Action | `product.action.ts` |
| Validation | `product.schema.ts` |
| Type | `product.type.ts` |
| Database schema | `products.schema.ts` |
| Seed | `products.seed.ts` |

---

## 35. Quy ước code trong nhóm

### Không nên

```txt
- Không viết database query trực tiếp trong page.
- Không viết logic nghiệp vụ dài trong component.
- Không gọi trực tiếp database từ Client Component.
- Không validate thủ công nếu đã có Zod.
- Không để file lộn xộn ngoài module.
- Không import sâu vào nội bộ module khác.
- Không đặt tên file tiếng Việt có dấu.
- Không copy/paste code nhiều nơi.
```

### Nên

```txt
- Mỗi nghiệp vụ có module riêng.
- Page chỉ gọi component/hook/action từ module.
- Hook quản lý loading/error/state.
- Server Action gọi service.
- Service xử lý nghiệp vụ.
- Repository xử lý truy vấn database.
- Zod quản lý validate.
- TypeScript type/interface đặt trong thư mục types.
- Component nhỏ, rõ nhiệm vụ, dễ tái sử dụng.
```

---

## 36. Checklist khi tạo module mới

Ví dụ tạo module `categories`:

```txt
[ ] Tạo thư mục `src/modules/categories`
[ ] Tạo `components`
[ ] Tạo `hooks`
[ ] Tạo `services`
[ ] Tạo `repositories`
[ ] Tạo `validations`
[ ] Tạo `types`
[ ] Tạo `stores` nếu cần
[ ] Tạo `actions`
[ ] Tạo `index.ts`
[ ] Tạo schema trong `src/db/schema/categories.schema.ts`
[ ] Export schema trong `src/db/schema/index.ts`
[ ] Tạo seed trong `src/db/seed/categories.seed.ts`
[ ] Gọi seed trong `src/db/seed/index.ts`
[ ] Tạo route trong `src/app/categories/page.tsx`
```

---

## 37. Checklist trước khi nộp bài

```txt
[ ] Chạy được `npm install`
[ ] Chạy được `npm run dev`
[ ] Có file `.env.example`
[ ] Có cấu trúc module đúng quy định
[ ] Có Drizzle schema trong `src/db/schema`
[ ] Có seed trong `src/db/seed`
[ ] Có Repository
[ ] Có Service
[ ] Có Server Action nếu thao tác server
[ ] Có Hook nếu cần state client
[ ] Có Page trong `src/app`
[ ] Có validate bằng Zod
[ ] Có form dùng React Hook Form
[ ] Có bảng dùng Mantine DataTable
[ ] Không gọi database trực tiếp trong Client Component
[ ] Không để logic nghiệp vụ phức tạp trong page/component
[ ] Không import sâu vào nội bộ module khác
[ ] Code TypeScript không báo lỗi
```

---

## 38. Lệnh thường dùng

```bash
# Chạy dev server
npm run dev

# Build production
npm run build

# Start production
npm run start

# Generate migration
npm run db:generate

# Run migration
npm run db:migrate

# Push schema trực tiếp vào DB
npm run db:push

# Seed dữ liệu
npm run db:seed

# Mở Drizzle Studio
npm run db:studio
```

---

## 39. Tài liệu tham khảo

- Next.js: https://nextjs.org/docs
- Mantine UI: https://mantine.dev/
- Mantine DataTable: https://icflorescu.github.io/mantine-datatable/
- Drizzle ORM: https://orm.drizzle.team/
- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
- Zustand: https://zustand-demo.pmnd.rs/

---

## 40. Ghi chú cho học viên

Khi làm bài, nên đi theo thứ tự:

```txt
1. Xác định nghiệp vụ thuộc module nào
2. Tạo module trong `src/modules`
3. Tạo Drizzle schema trong `src/db/schema`
4. Tạo seed trong `src/db/seed`
5. Tạo type
6. Tạo validation bằng Zod
7. Tạo repository
8. Tạo service
9. Tạo server action
10. Tạo hook nếu cần state client
11. Tạo component
12. Tạo page trong `src/app`
13. Test lại toàn bộ flow
```

Luồng cần nhớ:

```txt
User thao tác trên Page
→ Page gọi Component/Hook
→ Hook gọi Server Action
→ Server Action gọi Service
→ Service gọi Repository
→ Repository truy vấn Database
→ Dữ liệu trả về giao diện
```

Cấu trúc này giúp dự án:

```txt
- Dễ đọc
- Dễ sửa
- Dễ mở rộng
- Dễ chia việc nhóm
- Dễ kiểm thử
- Dễ thay thế UI hoặc database sau này
```
