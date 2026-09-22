# Hướng dẫn xây dựng REST API với Next.js, MySQL và Drizzle ORM

Tài liệu này hướng dẫn xây dựng REST API trong dự án sử dụng:

- Next.js 16+ App Router
- TypeScript
- MySQL
- Drizzle ORM
- Zod
- React Hook Form
- Mantine UI
- Mantine DataTable

Kiến trúc áp dụng:

```txt
Client Component / Mobile App / Hệ thống khác
                ↓ HTTP
        Next.js Route Handler
                ↓
              Service
                ↓
            Repository
                ↓
          Drizzle ORM + MySQL
```

Tài liệu phù hợp để sử dụng làm giáo trình thực hành cho sinh viên.

---

# 41. Xây dựng REST API trong dự án Next.js + MySQL + Drizzle

Phần này hướng dẫn xây dựng API theo đúng kiến trúc module hóa của dự án.

Mục tiêu:

```txt
Client Component / Mobile App / Hệ thống khác
                ↓ HTTP
        Next.js Route Handler
                ↓
              Service
                ↓
            Repository
                ↓
          Drizzle ORM + MySQL
```

Luồng đầy đủ khi gọi API từ giao diện:

```txt
Page / Component
      ↓
Hook
      ↓
Client API Service
      ↓ fetch()
Route Handler: app/api/v1/...
      ↓
Business Service
      ↓
Repository
      ↓
MySQL
```

## 41.1. Khi nào dùng API Route, khi nào dùng Server Action?

### Dùng Route Handler API khi:

```txt
- Client Component cần gọi dữ liệu bằng fetch.
- Xây API cho mobile app.
- Cho hệ thống khác tích hợp.
- Muốn sinh viên học REST API.
- Muốn kiểm thử API bằng Postman, Bruno hoặc curl.
- Muốn frontend và backend giao tiếp rõ ràng qua HTTP.
```

### Dùng Server Action khi:

```txt
- Chức năng chỉ được sử dụng nội bộ trong ứng dụng Next.js.
- Form phía web gọi trực tiếp một hành động trên server.
- Không cần cung cấp endpoint cho mobile hoặc hệ thống ngoài.
```

### Quy tắc đề xuất trong dự án này

```txt
Server Component
→ ưu tiên gọi Service trực tiếp.

Client Component
→ gọi Client API Service hoặc Server Action.

Mobile App / hệ thống bên ngoài
→ gọi REST API.
```

Không nên để Server Component gọi API của chính ứng dụng bằng `fetch("http://localhost...")`, vì sẽ tạo thêm một vòng HTTP không cần thiết.

---

# 42. Quy ước thiết kế API

Dùng tiền tố phiên bản:

```txt
/api/v1
```

API quản lý sản phẩm:

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| GET | `/api/v1/products` | Danh sách sản phẩm |
| GET | `/api/v1/products/:id` | Chi tiết sản phẩm |
| POST | `/api/v1/products` | Tạo sản phẩm |
| PATCH | `/api/v1/products/:id` | Cập nhật một phần |
| DELETE | `/api/v1/products/:id` | Xóa sản phẩm |

Ví dụ:

```txt
GET /api/v1/products?page=1&limit=10&keyword=next
GET /api/v1/products/15
POST /api/v1/products
PATCH /api/v1/products/15
DELETE /api/v1/products/15
```

## 42.1. Quy ước HTTP status

| Status | Ý nghĩa |
|---:|---|
| 200 | Thành công |
| 201 | Tạo mới thành công |
| 204 | Thành công, không trả body |
| 400 | Request sai định dạng |
| 401 | Chưa đăng nhập |
| 403 | Không có quyền |
| 404 | Không tìm thấy dữ liệu |
| 409 | Dữ liệu bị trùng hoặc xung đột |
| 422 | Dữ liệu không vượt qua validation |
| 500 | Lỗi hệ thống |

## 42.2. Cấu trúc JSON trả về

Thành công:

```json
{
  "success": true,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": []
}
```

Danh sách có phân trang:

```json
{
  "success": true,
  "message": "Lấy danh sách sản phẩm thành công",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

Thất bại:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": []
  }
}
```

Không trả stack trace, câu SQL, mật khẩu hoặc thông tin nội bộ cho client.

---

# 43. Cấu trúc thư mục API đề xuất

Bổ sung các thư mục sau:

```txt
src/
├── app/
│   └── api/
│       └── v1/
│           └── products/
│               ├── route.ts
│               └── [id]/
│                   └── route.ts
│
├── modules/
│   └── products/
│       ├── api/
│       │   └── product.api.ts
│       ├── components/
│       ├── hooks/
│       │   └── useProductsApi.ts
│       ├── repositories/
│       │   └── product.repository.ts
│       ├── services/
│       │   └── product.service.ts
│       ├── types/
│       │   └── product.type.ts
│       ├── validations/
│       │   └── product.schema.ts
│       └── index.ts
│
└── shared/
    ├── errors/
    │   └── app-error.ts
    ├── http/
    │   ├── api-client.ts
    │   ├── api-response.ts
    │   └── route-error-handler.ts
    └── types/
        └── api.type.ts
```

Vai trò:

```txt
route.ts
→ nhận HTTP request và trả HTTP response.

product.api.ts
→ hàm fetch chạy phía client.

product.service.ts
→ xử lý nghiệp vụ.

product.repository.ts
→ truy vấn database.

product.schema.ts
→ validate body, params và query.

shared/http
→ chuẩn hóa response và xử lý lỗi.
```

---

# 44. Tạo kiểu dữ liệu dùng chung cho API

Tạo file `src/shared/types/api.type.ts`:

```ts
export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorDetail = {
  path?: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    details?: ApiErrorDetail[];
  };
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedData<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type ApiResponse<T> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;
```

---

# 45. Tạo hàm chuẩn hóa API response

Tạo file `src/shared/http/api-response.ts`:

```ts
import { NextResponse } from "next/server";
import type {
  ApiErrorDetail,
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/shared/types/api.type";

export function apiSuccess<T>(
  data: T,
  message = "Thao tác thành công",
  status = 200
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };

  return NextResponse.json(body, { status });
}

export function apiError(
  message: string,
  code: string,
  status: number,
  details?: ApiErrorDetail[]
) {
  const body: ApiErrorResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details?.length ? { details } : {}),
    },
  };

  return NextResponse.json(body, { status });
}
```

---

# 46. Tạo lớp lỗi nghiệp vụ

Tạo file `src/shared/errors/app-error.ts`:

```ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly code = "INTERNAL_ERROR",
    public readonly details?: Array<{
      path?: string;
      message: string;
    }>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Request không hợp lệ") {
    super(message, 400, "BAD_REQUEST");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Không tìm thấy dữ liệu") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Dữ liệu đã tồn tại") {
    super(message, 409, "CONFLICT");
  }
}
```

---

# 47. Tạo bộ xử lý lỗi cho Route Handler

Tạo file `src/shared/http/route-error-handler.ts`:

```ts
import { ZodError } from "zod";
import { AppError } from "@/shared/errors/app-error";
import { apiError } from "./api-response";

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(
      "Dữ liệu không hợp lệ",
      "VALIDATION_ERROR",
      422,
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
  }

  if (error instanceof AppError) {
    return apiError(
      error.message,
      error.code,
      error.statusCode,
      error.details
    );
  }

  console.error("Unhandled route error:", error);

  return apiError(
    "Hệ thống đang gặp lỗi. Vui lòng thử lại sau.",
    "INTERNAL_ERROR",
    500
  );
}
```

Không trả trực tiếp nội dung của lỗi chưa xác định cho client:

```ts
// Không nên
return NextResponse.json({
  error: String(error),
});
```

---

# 48. Bổ sung validation cho API sản phẩm

Cập nhật `src/modules/products/validations/product.schema.ts`:

```ts
import { z } from "zod";

const productBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên sản phẩm")
    .max(255, "Tên sản phẩm không được quá 255 ký tự"),

  slug: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập slug")
    .max(255, "Slug không được quá 255 ký tự")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug chỉ gồm chữ thường, số và dấu gạch ngang"
    ),

  // MySQL DECIMAL nên được truyền dưới dạng string.
  price: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập giá sản phẩm")
    .refine(
      (value) =>
        !Number.isNaN(Number(value)) &&
        Number(value) >= 0,
      "Giá sản phẩm phải là số không âm"
    ),

  description: z
    .string()
    .trim()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional()
    .nullable(),
});

// Form và API dùng chung quy tắc dữ liệu cơ bản.
export const productFormSchema =
  productBaseSchema;

export const productCreateSchema =
  productBaseSchema;

export const productUpdateSchema =
  productBaseSchema
    .partial()
    .refine(
      (value) => Object.keys(value).length > 0,
      "Cần gửi ít nhất một trường để cập nhật"
    );

export const productIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int("ID phải là số nguyên")
    .positive("ID phải lớn hơn 0"),
});

export const productListQuerySchema = z.object({
  keyword: z
    .string()
    .trim()
    .optional()
    .default(""),

  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  sortBy: z
    .enum(["id", "name", "price", "createdAt"])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});

export type ProductFormValues = z.infer<
  typeof productFormSchema
>;

export type ProductCreateInput = z.infer<
  typeof productCreateSchema
>;

export type ProductUpdateInput = z.infer<
  typeof productUpdateSchema
>;

export type ProductListQuery = z.infer<
  typeof productListQuerySchema
>;
```

Lưu ý:

```txt
- Dùng z.coerce.number() cho query string và route param.
- Body POST/PATCH phải được validate lại ở server.
- Không được tin dữ liệu đã validate ở form phía client.
- Giá DECIMAL của MySQL nên truyền dưới dạng string để hạn chế sai số.
```

---

# 49. Cập nhật type của module Products

Cập nhật `src/modules/products/types/product.type.ts`:

```ts
export type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ProductFilter = {
  keyword?: string;
  page?: number;
  limit?: number;
  sortBy?: "id" | "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type CreateProductInput = {
  name: string;
  slug: string;
  price: string;
  description?: string | null;
};

export type UpdateProductInput = Partial<CreateProductInput>;
```

Có thể lấy type trực tiếp từ Drizzle schema:

```ts
import { products } from "@/db/schema";

export type ProductRow = typeof products.$inferSelect;
export type NewProductRow = typeof products.$inferInsert;
```

Tuy nhiên, type nghiệp vụ và type database không phải lúc nào cũng giống nhau. Vì vậy không nên phụ thuộc toàn bộ module vào type database.

---

# 50. Viết Repository có tìm kiếm, sắp xếp và phân trang

Cập nhật `src/modules/products/repositories/product.repository.ts`:

```ts
import {
  and,
  asc,
  desc,
  eq,
  like,
  type SQL,
} from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import type {
  CreateProductInput,
  ProductFilter,
  UpdateProductInput,
} from "../types/product.type";

function getOrderBy(
  sortBy: NonNullable<ProductFilter["sortBy"]>,
  sortOrder: NonNullable<ProductFilter["sortOrder"]>
) {
  const columnMap = {
    id: products.id,
    name: products.name,
    price: products.price,
    createdAt: products.createdAt,
  };

  const column = columnMap[sortBy];

  return sortOrder === "asc"
    ? asc(column)
    : desc(column);
}

export const productRepository = {
  async findPaginated(filter: ProductFilter) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const keyword = filter.keyword?.trim() ?? "";
    const sortBy = filter.sortBy ?? "createdAt";
    const sortOrder = filter.sortOrder ?? "desc";
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];

    if (keyword) {
      conditions.push(
        like(products.name, `%${keyword}%`)
      );
    }

    const whereCondition = conditions.length
      ? and(...conditions)
      : undefined;

    const [items, total] = await Promise.all([
      db
        .select()
        .from(products)
        .where(whereCondition)
        .orderBy(getOrderBy(sortBy, sortOrder))
        .limit(limit)
        .offset(offset),

      db.$count(products, whereCondition),
    ]);

    return {
      items,
      total,
    };
  },

  async findById(id: number) {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return rows[0] ?? null;
  },

  async findBySlug(slug: string) {
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    return rows[0] ?? null;
  },

  async create(data: CreateProductInput) {
    await db.insert(products).values(data);

    const rows = await db
      .select()
      .from(products)
      .where(eq(products.slug, data.slug))
      .limit(1);

    return rows[0] ?? null;
  },

  async update(
    id: number,
    data: UpdateProductInput
  ) {
    await db
      .update(products)
      .set(data)
      .where(eq(products.id, id));

    const rows = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return rows[0] ?? null;
  },

  async delete(id: number) {
    return db
      .delete(products)
      .where(eq(products.id, id));
  },
};
```

Giải thích:

```txt
findPaginated()
→ chỉ truy vấn database.

Repository không trả HTTP response.
Repository không biết status 404, 409 hay 422.
Repository không chứa thông báo giao diện.
Repository không nhận Request hoặc NextRequest.
```

---

# 51. Viết Service xử lý nghiệp vụ

Cập nhật `src/modules/products/services/product.service.ts`:

```ts
import {
  ConflictError,
  NotFoundError,
} from "@/shared/errors/app-error";
import { productRepository } from "../repositories/product.repository";
import type {
  CreateProductInput,
  ProductFilter,
  UpdateProductInput,
} from "../types/product.type";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase();
}

export const productService = {
  async getProducts(filter: ProductFilter) {
    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;

    const result =
      await productRepository.findPaginated({
        ...filter,
        page,
        limit,
      });

    return {
      items: result.items,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    };
  },

  async getProductById(id: number) {
    const product =
      await productRepository.findById(id);

    if (!product) {
      throw new NotFoundError(
        "Không tìm thấy sản phẩm"
      );
    }

    return product;
  },

  async createProduct(data: CreateProductInput) {
    const normalizedData = {
      ...data,
      name: data.name.trim(),
      slug: normalizeSlug(data.slug),
      description:
        data.description?.trim() || null,
    };

    const existed =
      await productRepository.findBySlug(
        normalizedData.slug
      );

    if (existed) {
      throw new ConflictError(
        "Slug sản phẩm đã tồn tại"
      );
    }

    const created =
      await productRepository.create(
        normalizedData
      );

    if (!created) {
      throw new Error(
        "Không thể đọc lại sản phẩm vừa tạo"
      );
    }

    return created;
  },

  async updateProduct(
    id: number,
    data: UpdateProductInput
  ) {
    const current =
      await this.getProductById(id);

    const normalizedData: UpdateProductInput = {
      ...data,
    };

    if (data.name !== undefined) {
      normalizedData.name = data.name.trim();
    }

    if (data.slug !== undefined) {
      normalizedData.slug =
        normalizeSlug(data.slug);

      const existed =
        await productRepository.findBySlug(
          normalizedData.slug
        );

      if (existed && existed.id !== current.id) {
        throw new ConflictError(
          "Slug sản phẩm đã tồn tại"
        );
      }
    }

    if (data.description !== undefined) {
      normalizedData.description =
        data.description?.trim() || null;
    }

    const updated =
      await productRepository.update(
        id,
        normalizedData
      );

    if (!updated) {
      throw new NotFoundError(
        "Không tìm thấy sản phẩm"
      );
    }

    return updated;
  },

  async deleteProduct(id: number) {
    const current =
      await this.getProductById(id);

    await productRepository.delete(id);

    return current;
  },
};
```

Service chịu trách nhiệm:

```txt
- Chuẩn hóa dữ liệu.
- Kiểm tra dữ liệu trùng.
- Kiểm tra bản ghi tồn tại.
- Áp dụng quy tắc nghiệp vụ.
- Gọi một hoặc nhiều Repository.
- Phát sinh lỗi nghiệp vụ phù hợp.
```

Service không nên:

```txt
- Nhận NextRequest.
- Trả NextResponse.
- Đọc query string trực tiếp.
- Chứa code giao diện.
```

---

# 52. Viết API danh sách và tạo sản phẩm

Tạo file `src/app/api/v1/products/route.ts`:

```ts
import type { NextRequest } from "next/server";
import {
  productCreateSchema,
  productListQuerySchema,
} from "@/modules/products/validations/product.schema";
import { productService } from "@/modules/products/services/product.service";
import {
  apiError,
  apiSuccess,
} from "@/shared/http/api-response";
import {
  handleRouteError,
} from "@/shared/http/route-error-handler";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest
) {
  try {
    const rawQuery = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const query =
      productListQuerySchema.parse(rawQuery);

    const result =
      await productService.getProducts(query);

    return apiSuccess(
      result,
      "Lấy danh sách sản phẩm thành công"
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError(
        "Body JSON không hợp lệ",
        "INVALID_JSON",
        400
      );
    }

    const data =
      productCreateSchema.parse(body);

    const created =
      await productService.createProduct(data);

    return apiSuccess(
      created,
      "Tạo sản phẩm thành công",
      201
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
```

Giải thích:

```txt
Route Handler chỉ làm 5 việc:

1. Đọc request.
2. Parse params, query hoặc body.
3. Validate bằng Zod.
4. Gọi Service.
5. Chuyển kết quả thành HTTP response.
```

---

# 53. Viết API chi tiết, cập nhật và xóa sản phẩm

Tạo file `src/app/api/v1/products/[id]/route.ts`:

```ts
import type { NextRequest } from "next/server";
import {
  productIdParamSchema,
  productUpdateSchema,
} from "@/modules/products/validations/product.schema";
import { productService } from "@/modules/products/services/product.service";
import {
  apiError,
  apiSuccess,
} from "@/shared/http/api-response";
import {
  handleRouteError,
} from "@/shared/http/route-error-handler";

export const runtime = "nodejs";

type ProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: ProductRouteContext
) {
  try {
    const rawParams = await context.params;

    const { id } =
      productIdParamSchema.parse(rawParams);

    const product =
      await productService.getProductById(id);

    return apiSuccess(
      product,
      "Lấy chi tiết sản phẩm thành công"
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: ProductRouteContext
) {
  try {
    const rawParams = await context.params;

    const { id } =
      productIdParamSchema.parse(rawParams);

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError(
        "Body JSON không hợp lệ",
        "INVALID_JSON",
        400
      );
    }

    const data =
      productUpdateSchema.parse(body);

    const updated =
      await productService.updateProduct(
        id,
        data
      );

    return apiSuccess(
      updated,
      "Cập nhật sản phẩm thành công"
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: ProductRouteContext
) {
  try {
    const rawParams = await context.params;

    const { id } =
      productIdParamSchema.parse(rawParams);

    const deleted =
      await productService.deleteProduct(id);

    return apiSuccess(
      deleted,
      "Xóa sản phẩm thành công"
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
```

Trong Next.js 16, `params` của dynamic Route Handler là Promise nên phải dùng:

```ts
const rawParams = await context.params;
```

---

# 54. Tạo HTTP client dùng chung phía frontend

Tạo file `src/shared/http/api-client.ts`:

```ts
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "@/shared/types/api.type";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly details?: Array<{
      path?: string;
      message: string;
    }>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export async function apiRequest<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...init?.headers,
    },
  });

  const contentType =
    response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new ApiClientError(
      "Server không trả về JSON hợp lệ",
      response.status,
      "INVALID_RESPONSE"
    );
  }

  const payload = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse;

  if (!response.ok || !payload.success) {
    const errorPayload =
      payload as ApiErrorResponse;

    throw new ApiClientError(
      errorPayload.message ||
        "Không thể thực hiện yêu cầu",
      response.status,
      errorPayload.error?.code ??
        "REQUEST_FAILED",
      errorPayload.error?.details
    );
  }

  return payload.data;
}
```

Lợi ích:

```txt
- Không lặp fetch ở nhiều component.
- Chuẩn hóa cách đọc lỗi.
- Chuẩn hóa Content-Type.
- Component chỉ nhận dữ liệu đã bóc khỏi response.
```

---

# 55. Viết Client API Service cho module Products

Tạo file `src/modules/products/api/product.api.ts`:

```ts
import {
  apiRequest,
} from "@/shared/http/api-client";
import type {
  PaginatedData,
} from "@/shared/types/api.type";
import type {
  CreateProductInput,
  Product,
  ProductFilter,
  UpdateProductInput,
} from "../types/product.type";

const PRODUCT_API_URL = "/api/v1/products";

function buildQueryString(
  filter: ProductFilter
) {
  const params = new URLSearchParams();

  if (filter.keyword) {
    params.set("keyword", filter.keyword);
  }

  if (filter.page) {
    params.set("page", String(filter.page));
  }

  if (filter.limit) {
    params.set("limit", String(filter.limit));
  }

  if (filter.sortBy) {
    params.set("sortBy", filter.sortBy);
  }

  if (filter.sortOrder) {
    params.set(
      "sortOrder",
      filter.sortOrder
    );
  }

  const query = params.toString();

  return query ? `?${query}` : "";
}

export const productApi = {
  getList(filter: ProductFilter = {}) {
    return apiRequest<PaginatedData<Product>>(
      `${PRODUCT_API_URL}${buildQueryString(
        filter
      )}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
  },

  getById(id: number) {
    return apiRequest<Product>(
      `${PRODUCT_API_URL}/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
  },

  create(data: CreateProductInput) {
    return apiRequest<Product>(
      PRODUCT_API_URL,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  update(
    id: number,
    data: UpdateProductInput
  ) {
    return apiRequest<Product>(
      `${PRODUCT_API_URL}/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  },

  delete(id: number) {
    return apiRequest<Product>(
      `${PRODUCT_API_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
```

Không nên viết như sau trong Component:

```ts
// Không nên lặp lại ở nhiều nơi
const response = await fetch(
  "/api/v1/products"
);
const json = await response.json();
```

Thay vào đó:

```ts
const result =
  await productApi.getList();
```

---

# 56. Tạo Hook gọi API danh sách sản phẩm

Tạo file `src/modules/products/hooks/useProductsApi.ts`:

```ts
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  productApi,
} from "../api/product.api";
import type {
  Product,
  ProductFilter,
} from "../types/product.type";
import type {
  PaginationMeta,
} from "@/shared/types/api.type";

const defaultPagination: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export function useProductsApi(
  initialFilter: ProductFilter = {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  }
) {
  const [items, setItems] =
    useState<Product[]>([]);

  const [filter, setFilter] =
    useState<ProductFilter>(
      initialFilter
    );

  const [pagination, setPagination] =
    useState<PaginationMeta>(
      defaultPagination
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const fetchProducts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await productApi.getList(filter);

        setItems(result.items);
        setPagination(result.pagination);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Không thể tải sản phẩm"
        );
      } finally {
        setLoading(false);
      }
    }, [filter]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  function changePage(page: number) {
    setFilter((current) => ({
      ...current,
      page,
    }));
  }

  function changeKeyword(keyword: string) {
    setFilter((current) => ({
      ...current,
      keyword,
      page: 1,
    }));
  }

  return {
    items,
    filter,
    pagination,
    loading,
    error,
    setFilter,
    changePage,
    changeKeyword,
    fetchProducts,
  };
}
```

Lưu ý:

```txt
Khi filter thay đổi, useEffect gọi lại API.

Khi đổi keyword:
→ đưa page về 1.

Khi đổi trang:
→ chỉ cập nhật page.

Hook quản lý:
→ data, loading, error, filter, pagination.
```

---

# 57. Sử dụng Hook API trong Page danh sách

Ví dụ `src/app/products/page.tsx`:

```tsx
"use client";

import {
  Alert,
  Button,
  Group,
  Paper,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { DataTable } from "mantine-datatable";
import {
  useProductsApi,
} from "@/modules/products/hooks/useProductsApi";

export default function ProductListPage() {
  const {
    items,
    filter,
    pagination,
    loading,
    error,
    changePage,
    changeKeyword,
  } = useProductsApi();

  return (
    <Paper p="lg" radius="md" shadow="sm">
      <Group
        justify="space-between"
        mb="lg"
      >
        <Title order={2}>
          Quản lý sản phẩm
        </Title>

        <Button
          component={Link}
          href="/products/create"
        >
          Thêm sản phẩm
        </Button>
      </Group>

      <TextInput
        mb="md"
        placeholder="Tìm theo tên sản phẩm"
        value={filter.keyword ?? ""}
        onChange={(event) =>
          changeKeyword(
            event.currentTarget.value
          )
        }
      />

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      <DataTable
        withTableBorder
        striped
        highlightOnHover
        fetching={loading}
        records={items}
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
        totalRecords={pagination.total}
        recordsPerPage={pagination.limit}
        page={pagination.page}
        onPageChange={changePage}
      />
    </Paper>
  );
}
```

Trong dự án thật nên debounce ô tìm kiếm khoảng 300–500 ms để tránh gọi API sau mỗi ký tự.

---

# 58. Gọi API khi tạo sản phẩm

Ví dụ `src/app/products/create/page.tsx`:

```tsx
"use client";

import {
  Alert,
  Paper,
  Title,
} from "@mantine/core";
import {
  useState,
} from "react";
import {
  useRouter,
} from "next/navigation";
import {
  ProductForm,
  type ProductFormValues,
} from "@/modules/products";
import {
  productApi,
} from "@/modules/products/api/product.api";

export default function ProductCreatePage() {
  const router = useRouter();

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    values: ProductFormValues
  ) {
    try {
      setError(null);

      await productApi.create(values);

      router.push("/products");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Không thể tạo sản phẩm"
      );
    }
  }

  return (
    <Paper p="lg" radius="md" shadow="sm">
      <Title order={2} mb="lg">
        Thêm sản phẩm
      </Title>

      {error && (
        <Alert color="red" mb="md">
          {error}
        </Alert>
      )}

      <ProductForm onSubmit={handleSubmit} />
    </Paper>
  );
}
```

---

# 59. Gọi API cập nhật sản phẩm

Ví dụ xử lý submit trong trang sửa:

```ts
async function handleSubmit(
  values: ProductFormValues
) {
  try {
    await productApi.update(
      productId,
      values
    );

    router.push("/products");
    router.refresh();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Không thể cập nhật sản phẩm"
    );
  }
}
```

Nạp chi tiết:

```ts
const product =
  await productApi.getById(productId);
```

Với trang sửa là Client Component, nên nạp dữ liệu trong hook riêng:

```txt
useProductDetail(id)
```

Không nên để toàn bộ loading, error và fetch logic trực tiếp trong Page nếu chức năng bắt đầu phức tạp.

---

# 60. Gọi API xóa sản phẩm

Ví dụ:

```ts
async function handleDelete(id: number) {
  const accepted = window.confirm(
    "Bạn có chắc muốn xóa sản phẩm này?"
  );

  if (!accepted) {
    return;
  }

  try {
    await productApi.delete(id);
    await fetchProducts();
  } catch (error) {
    console.error(error);
  }
}
```

Trong giao diện thật nên dùng `ConfirmDeleteModal` thay cho `window.confirm`.

---

# 61. Kiểm thử API bằng curl

## 61.1. Lấy danh sách

```bash
curl "http://localhost:3000/api/v1/products?page=1&limit=10"
```

## 61.2. Tìm kiếm

```bash
curl "http://localhost:3000/api/v1/products?keyword=next&page=1&limit=5"
```

## 61.3. Xem chi tiết

```bash
curl "http://localhost:3000/api/v1/products/1"
```

## 61.4. Tạo mới

```bash
curl -X POST "http://localhost:3000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Khóa học Next.js API",
    "slug": "khoa-hoc-nextjs-api",
    "price": "599000",
    "description": "Học Route Handler và Drizzle ORM"
  }'
```

PowerShell:

```powershell
$body = @{
  name = "Khóa học Next.js API"
  slug = "khoa-hoc-nextjs-api"
  price = "599000"
  description = "Học Route Handler và Drizzle ORM"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/v1/products" `
  -ContentType "application/json" `
  -Body $body
```

## 61.5. Cập nhật

```bash
curl -X PATCH "http://localhost:3000/api/v1/products/1" \
  -H "Content-Type: application/json" \
  -d '{
    "price": "699000"
  }'
```

## 61.6. Xóa

```bash
curl -X DELETE \
  "http://localhost:3000/api/v1/products/1"
```

---

# 62. Các trường hợp sinh viên phải kiểm thử

## GET danh sách

```txt
[ ] Không truyền query.
[ ] page=1, limit=10.
[ ] Tìm kiếm có kết quả.
[ ] Tìm kiếm không có kết quả.
[ ] page=0.
[ ] limit=0.
[ ] limit lớn hơn 100.
[ ] sortBy không hợp lệ.
```

## GET chi tiết

```txt
[ ] ID tồn tại.
[ ] ID không tồn tại.
[ ] ID bằng 0.
[ ] ID âm.
[ ] ID không phải số.
```

## POST

```txt
[ ] Dữ liệu hợp lệ.
[ ] Thiếu name.
[ ] Thiếu slug.
[ ] Giá âm.
[ ] Giá không phải số.
[ ] Slug sai định dạng.
[ ] Slug bị trùng.
[ ] Body không phải JSON.
```

## PATCH

```txt
[ ] Cập nhật một trường.
[ ] Cập nhật nhiều trường.
[ ] Body rỗng.
[ ] ID không tồn tại.
[ ] Đổi sang slug bị trùng.
```

## DELETE

```txt
[ ] Xóa ID tồn tại.
[ ] Xóa ID không tồn tại.
[ ] Xóa ID không hợp lệ.
```

---

# 63. Gợi ý kiểm thử tự động Route Handler

Có thể kiểm thử theo hai mức.

## Mức 1: Test Service

Mock Repository:

```txt
product.service.test.ts
```

Kiểm thử:

```txt
- Tạo thành công.
- Slug trùng sinh ConflictError.
- Không tìm thấy sinh NotFoundError.
- Chuẩn hóa slug.
- Tính totalPages chính xác.
```

## Mức 2: Test API tích hợp

Chạy ứng dụng với database test rồi gọi:

```txt
POST /api/v1/products
GET /api/v1/products/:id
PATCH /api/v1/products/:id
DELETE /api/v1/products/:id
```

Nên dùng một database riêng:

```env
DATABASE_URL_TEST="mysql://root:password@localhost:3306/my_app_test"
```

Không chạy test xóa dữ liệu trên database thật.

---

# 64. Sử dụng transaction khi nghiệp vụ có nhiều bước

Ví dụ tạo đơn hàng gồm:

```txt
1. Tạo order.
2. Tạo order_items.
3. Trừ tồn kho.
4. Ghi lịch sử giao dịch.
```

Các bước này phải cùng thành công hoặc cùng thất bại.

Ví dụ:

```ts
await db.transaction(async (tx) => {
  await tx.insert(orders).values(orderData);

  await tx
    .insert(orderItems)
    .values(itemData);

  await tx
    .update(products)
    .set({
      stock: sql`${products.stock} - ${quantity}`,
    })
    .where(eq(products.id, productId));
});
```

Không cần transaction cho một câu lệnh SELECT đơn giản.

Transaction thường được đặt ở:

```txt
Service
```

hoặc một Repository chuyên xử lý cả một đơn vị công việc.

---

# 65. Thêm xác thực và phân quyền cho API

Trước khi gọi Service, Route Handler cần kiểm tra người dùng.

Pseudo code:

```ts
const session = await getCurrentSession();

if (!session) {
  return apiError(
    "Vui lòng đăng nhập",
    "UNAUTHORIZED",
    401
  );
}

if (
  !session.permissions.includes(
    "products.create"
  )
) {
  return apiError(
    "Bạn không có quyền tạo sản phẩm",
    "FORBIDDEN",
    403
  );
}
```

Không được tin các thông tin sau do client gửi lên:

```txt
userId
role
permission
isAdmin
createdBy
```

Các thông tin này phải lấy từ session hoặc access token đã xác thực.

---

# 66. CORS

Nếu frontend và API chạy cùng domain:

```txt
https://app.example.com
https://app.example.com/api/v1/products
```

thì thường không cần cấu hình CORS riêng.

Chỉ thêm CORS khi API được gọi từ origin khác:

```txt
https://mobile-web.example.com
→ gọi
https://api.example.com
```

Không nên dùng:

```txt
Access-Control-Allow-Origin: *
```

cho API có cookie hoặc dữ liệu riêng tư.

---

# 67. Các lỗi kiến trúc sinh viên thường mắc

## Sai 1: Query database trong Route Handler

```ts
// Không nên
export async function GET() {
  return db.select().from(products);
}
```

Đúng:

```ts
export async function GET() {
  const data =
    await productService.getProducts({});
  return apiSuccess(data);
}
```

## Sai 2: Query database trong Client Component

```ts
"use client";

import { db } from "@/db";
```

Đây là sai nghiêm trọng. Client Component không được kết nối trực tiếp database.

## Sai 3: Không validate body ở server

Form phía client có validation không có nghĩa API an toàn.

Người dùng vẫn có thể gọi API bằng:

```txt
Postman
curl
DevTools
script tự động
```

## Sai 4: Trả status 200 cho mọi trường hợp

Không nên:

```json
{
  "success": false,
  "message": "Không tìm thấy"
}
```

nhưng HTTP status vẫn là `200`.

Nên trả `404`.

## Sai 5: Service trả NextResponse

Service cần độc lập với HTTP để có thể tái sử dụng cho:

```txt
Route Handler
Server Action
Cron job
Queue worker
Unit test
```

## Sai 6: Tin ID do client gửi trong body

Endpoint:

```txt
PATCH /products/15
```

thì ID chính phải lấy từ URL, không lấy từ:

```json
{
  "id": 99
}
```

## Sai 7: Trả toàn bộ object database

Không trả các trường nhạy cảm:

```txt
passwordHash
refreshToken
secretKey
internalNote
deletedAt
```

Nên tạo DTO hoặc chọn rõ các cột cần trả.

---

# 68. Checklist hoàn thành một API mới

Ví dụ module `categories`:

```txt
[ ] Xác định endpoint.
[ ] Xác định request body.
[ ] Xác định query params.
[ ] Xác định response JSON.
[ ] Xác định HTTP status.
[ ] Tạo Zod schema.
[ ] Tạo type.
[ ] Tạo Repository.
[ ] Tạo Service.
[ ] Tạo app/api/v1/categories/route.ts.
[ ] Tạo app/api/v1/categories/[id]/route.ts.
[ ] Tạo Client API Service.
[ ] Tạo Hook nếu giao diện cần state.
[ ] Test bằng curl hoặc Postman.
[ ] Test dữ liệu sai.
[ ] Test bản ghi không tồn tại.
[ ] Test dữ liệu trùng.
[ ] Kiểm tra quyền truy cập.
[ ] Không làm lộ thông tin nhạy cảm.
```

---

# 69. Bài thực hành dành cho sinh viên

## Bài 1: API Categories cơ bản

Yêu cầu:

```txt
- GET /api/v1/categories
- GET /api/v1/categories/:id
- POST /api/v1/categories
- PATCH /api/v1/categories/:id
- DELETE /api/v1/categories/:id
```

Các trường:

```txt
id
name
slug
description
createdAt
updatedAt
```

Điều kiện:

```txt
- name bắt buộc.
- slug bắt buộc và không trùng.
- Không được xóa category đang có product.
```

## Bài 2: API Products nâng cao

Bổ sung:

```txt
- categoryId.
- status: active | inactive.
- minPrice.
- maxPrice.
- Lọc theo categoryId.
- Sắp xếp theo giá.
- Phân trang.
```

Endpoint:

```txt
GET /api/v1/products
  ?keyword=next
  &categoryId=2
  &status=active
  &minPrice=100000
  &maxPrice=1000000
  &page=1
  &limit=10
  &sortBy=price
  &sortOrder=asc
```

## Bài 3: API Orders có transaction

Yêu cầu:

```txt
- Tạo đơn hàng.
- Tạo chi tiết đơn hàng.
- Kiểm tra tồn kho.
- Trừ tồn kho.
- Rollback nếu một sản phẩm không đủ tồn.
```

Đây là bài giúp sinh viên hiểu rõ vai trò của:

```txt
Route Handler
Service
Repository
Transaction
Validation
HTTP status
```

---

# 70. Trình tự hướng dẫn sinh viên trên lớp

Nên dạy theo thứ tự:

```txt
Buổi 1
1. HTTP và REST API.
2. GET, POST, PATCH, DELETE.
3. Route Handler của Next.js.
4. Test endpoint Hello World.

Buổi 2
5. Kết nối Route Handler với Service.
6. Service gọi Repository.
7. Repository dùng Drizzle.
8. Làm GET danh sách và GET chi tiết.

Buổi 3
9. Validate bằng Zod.
10. Làm POST và PATCH.
11. Chuẩn hóa lỗi và HTTP status.
12. Làm DELETE.

Buổi 4
13. Phân trang, tìm kiếm, sắp xếp.
14. Viết Client API Service.
15. Viết Hook.
16. Hiển thị bằng Mantine DataTable.

Buổi 5
17. Authentication và permission.
18. Transaction.
19. Kiểm thử API.
20. Hoàn thiện bài tập module mới.
```

Luồng sinh viên cần thuộc:

```txt
HTTP Request
→ Route Handler
→ Zod Validation
→ Service
→ Repository
→ Drizzle ORM
→ MySQL
→ JSON Response
```

Và luồng giao diện:

```txt
User
→ Component
→ Hook
→ Client API Service
→ fetch
→ REST API
→ JSON
→ Hook cập nhật state
→ Component render lại
```

---

# 71. Quy tắc chấm bài API

Có thể chấm theo thang 10:

| Nội dung | Điểm |
|---|---:|
| Cấu trúc module đúng | 1.0 |
| Route Handler đúng REST | 1.0 |
| Zod validation đầy đủ | 1.5 |
| Service có nghiệp vụ | 1.5 |
| Repository dùng Drizzle đúng | 1.5 |
| HTTP status và lỗi đúng | 1.0 |
| Phân trang, tìm kiếm, sort | 1.0 |
| Client API Service và Hook | 0.75 |
| Test các trường hợp lỗi | 0.5 |
| Code sạch, TypeScript không lỗi | 0.25 |

Lỗi trừ điểm mạnh:

```txt
- Client Component truy cập database.
- Không validate ở server.
- Viết toàn bộ logic trong route.ts.
- Mọi response đều trả status 200.
- Làm lộ lỗi database hoặc dữ liệu nhạy cảm.
- Không kiểm tra bản ghi tồn tại.
- Không kiểm tra dữ liệu trùng.
```

---

# 72. Checklist cuối cùng cho luồng API Products

```txt
[ ] GET /api/v1/products hoạt động.
[ ] Có keyword.
[ ] Có phân trang.
[ ] Có sort.
[ ] GET /api/v1/products/:id hoạt động.
[ ] POST validate body.
[ ] POST trả 201.
[ ] Slug trùng trả 409.
[ ] PATCH validate body.
[ ] PATCH body rỗng trả 422.
[ ] DELETE ID không tồn tại trả 404.
[ ] Lỗi không xác định trả 500.
[ ] Không trả stack trace.
[ ] Client gọi qua product.api.ts.
[ ] Hook quản lý loading/error/data.
[ ] DataTable hiển thị phân trang.
[ ] Test bằng curl hoặc Postman.
```
