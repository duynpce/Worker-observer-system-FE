# convention

| Category | Convention | Examples |
|----------|-----------|---------|
| React component files | `PascalCase.tsx` | `Login.tsx`, `Register.tsx`, `CallBack.tsx` |
| Service files | `camelCase.service.ts` | `login.service.ts`, `callback.service.ts` |
| Type files | `kebab-case.type.ts` | `account.type.ts`, `unique-detail.type.ts` |
| DTO files | `camelCase.dto.ts` | `common.dto.ts` |
| Utility/constant files | `camelCase.ts` | `api.ts`, `util.ts`, `constant.ts` |
| Unit test files | `camelCase.unit.test.tsx` | `login.unit.test.tsx` |
| Integration test files | `camelCase.it.test.tsx` | `register.it.test.tsx` |
| Folder names | `lowercase` | `auth/`, `shared/`, `component/` |
| Component names | `PascalCase` | `LoginForm`, `OverView` |
| Function/variable names | `camelCase` | `handleRegister`, `navigate` |
| Constants | `UPPER_SNAKE_CASE` | `ROOT_API_URL`, `CLIENT_ID` |

# folder structure

Feature-based folder structure. Each feature follows this pattern:

    src/
    ├── <feature>/              # e.g. auth/, customer/, admin/, home/
    │   ├── <sub-feature>/      # e.g. login/, register/, dashboard/
    │   │   ├── XxxPage.tsx     # Page-level component (no props, routed)
    │   │   └── xxx.service.ts  # Service: async functions for API calls
    │   └── common/             # Shared within the feature
    ├── shared/
    │   ├── component/          # Reusable UI components (Button, Card, etc.)
    │   ├── constant/           # App-wide constants (constant.ts)
    │   └── dto/                # Generic/shared response interfaces (common.dto.ts)
    ├── types/                  # Domain-specific type definitions (*.type.ts)
    ├── utils/
    │   ├── api.ts              # Axios instance (single export: `api`)
    │   └── util.ts             # Generic utility functions
    └── App.tsx                 # Centralized route definitions

    test/                       # Mirrors src/ structure
    ├── <feature>/
    ├── mocks/
    │   └── server.ts           # MSW server (no default handlers)
    └── util/


# principle

    - Only allow to change the code that I allow
    - Strictly follow the coding conventions above
    - If you think you have a better solution, discuss with me before implementing it
    - If you need more context about the project, ask me before implementing
    - Give the documentation link where you found the solution if you are not confident
    - Never change unrelated code while implementing a feature
    - read files in /shared / component and /hooks to reuse existing components and hooks before creating new ones

# shared components

| Component | Description |
|-----------|-------------|
| `BarChar` | Grouped bar chart built on Recharts. Accepts an array of bar configs (`dataKey`, `name`, `color`), a data array, and a `period` (`day`/`week`/`month`/`year`) that drives the X-axis key. |
| `Button` | Simple styled button with blue Tailwind styling. Extends all native `<button>` HTML attributes; requires a `content` prop for the label. |
| `Card` | Layout wrapper with a title heading and a rounded inner content area. Accepts `children`, `innerClassName` for the inner container, and passes remaining props to the outer `<div>`. |
| `ImgButton` | Icon button that renders an image (`src`, `alt`) instead of text. Extends all native `<button>` HTML attributes. |
| `InfoItem` | Two-line labeled data display: a small muted `title` on top and a bold `value` below. Used for account info, stats, and similar labeled fields. |
| `InputWithLabel` | Input field wrapper with a label and built-in error message display. Use for form inputs to keep label/input/error layout consistent. |
| `LineChar` | Multi-line chart built on Recharts. Same API as `BarChar` but with line configs (`dataKey`, `name`, `color`). Reuses the `Period` type from `BarChar`. |
| `LoadingSpinner` | Reusable loading indicator component for async states (query loading, mutation pending, page transition loading). |
| `PaginationBar` | Pagination navigation component for paged tables/lists. Use with `page` and `limit` query params to stay aligned with backend pagination APIs. |
| `PieChar` | Donut/pie chart with a built-in legend. Accepts an array of `{ name, value, color }` items. |
| `SearchBar` | Styled search form with a text input and an SVG search icon button. Extends React Router's `FormProps`, so it can act as a router-aware `<Form>`. Optional `placeHolder` prop (defaults to `"Search"`). |

# shared hooks

| Hook | Description |
|------|-------------|
| `useFormCustom` | Wrapper around `react-hook-form` for project forms. Use with `zodResolver(...)` and schema-first validation in feature hooks (e.g. `useRegister`, `useCustomerDashBoardCard`). |

# axios + api response behavior

- Axios client is centralized in `src/config/axios/api.ts`.
- Request interceptor behavior:
    - Adds `Authorization: Bearer <accessToken>` header when token exists.
    - Removes auth header when token is missing.
- Response interceptor behavior:
    - Always returns `ResponseDto<T>` (not raw AxiosResponse).
    - Supports `toastMessageWhenSuccess` per request:
        - `true`: toast backend `message`
        - `string`: toast that exact string
- Global error handler behavior:
    - Can be skipped per request with `skipGlobalErrorHandler: true`.
    - `401`: tries refresh token once via `/v1/auth/refresh-token` using `refreshApi`; retries original request on success.
    - second `401` / refresh failed: clear token, save `previousPath`, toast error, redirect to `/login`.
    - `403`: toast permission message.
    - `408`: toast timeout message.
    - canceled request: toast canceled message.
    - network error (`ERR_NETWORK`): toast connection message.
    - fallback: toast backend error message or generic message.

# what api return

API response shape is declared in `src/config/axios/axios.config.ts`:

```ts
export interface ResponseDto<T> {
    success: boolean;
    message?: string;
    data: T;
    metaData?: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
    };
}
```

Important usage notes:

- `api.get<T>(...)` returns `Promise<ResponseDto<T>>`.
- In service layer, use `res.data` to access the payload `T`.
- For paginated endpoints, read pagination fields from `metaData`.

# sample code

```ts
// src/feat/card/card.privilege.type.ts
import { z } from "zod";
import { AccountType } from "../account/account.type";
import { CardType } from "./card.type";

export const CreateCardPrivilegeRequestSchema = z
    .object({
        code: z.string().trim().toUpperCase().min(1, "Code: is required"),
        expirationYears: z.number().int().min(1),
        spendingLimitDaily: z.number().min(0),
        annualFee: z.number().min(0),
        cashbackRate: z.number().min(0),
        accountType: z.enum(AccountType, "Account type:invalid account type"),
        cardType: z.enum(CardType, "Card type:invalid card type"),
        effectiveFrom: z.string().refine((date) => !Number.isNaN(Date.parse(date))),
        effectiveTo: z.string().refine((date) => !Number.isNaN(Date.parse(date))),
    })
    .refine(
        (data) => new Date(data.effectiveTo).getTime() >= new Date(data.effectiveFrom).getTime(),
        {
            message: "Effective to: must be greater than or equal to effective from",
            path: ["effectiveTo"],
        }
    );

export type CreateCardPrivilegeRequest = z.infer<typeof CreateCardPrivilegeRequestSchema>;
```

```ts
// src/feat/card/card.privilege.service.ts
import { api } from "../../config/axios/api";
import type { CreateCardPrivilegeRequest, CardPrivilegeDto } from "./card.privilege.type";

export const createCardPrivilege = async (request: CreateCardPrivilegeRequest) => {
    const res = await api.post<string>("/v1/card-privileges", request, { toastMessageWhenSuccess: true });
    return res.data ?? null;
};

export const getCardPrivileges = async (params: {
    page: number;
    limit: number;
    code: string;
    accountType: "PERSONAL" | "BUSINESS" | "GOVERNMENT";
    cardType: "CREDIT" | "DEBIT";
}) => {
    const res = await api.get<CardPrivilegeDto[]>("/v1/card-privileges", { params });
    return res.data ?? [];
};
```

```ts
// src/feat/card/useCardPrivilege.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCardPrivilege, getCardPrivileges } from "./card.privilege.service";
import type { CreateCardPrivilegeRequest } from "./card.privilege.type";

export const useCreateCardPrivilege = () => {
    return useMutation({
        mutationKey: ["create-card-privilege"],
        mutationFn: (request: CreateCardPrivilegeRequest) => createCardPrivilege(request),
    });
};

export const useGetCardPrivilegesQuery = (query: {
    page: number;
    limit: number;
    code: string;
    accountType: "PERSONAL" | "BUSINESS" | "GOVERNMENT";
    cardType: "CREDIT" | "DEBIT";
}) => {
    return useQuery({
        queryKey: ["card-privileges", query.page, query.limit, query.code, query.accountType, query.cardType],
        queryFn: () => getCardPrivileges(query),
        enabled: query.code.trim().length > 0,
    });
};
```

# test principle

- Unit test (`*.unit.test.tsx`): test pure functions or service functions only. Mock `api` methods (`get/post/put/delete`) and assert endpoint, payload, and returned value.
- Integration test (`*.it.test.tsx`): test FE workflow end-to-end in UI scope: render component, type/select input, click submit, and mock backend responses using `msw`.
- E2E test (`*.e2e.*` or Playwright): test full real flow with real backend and real routing/auth boundaries. Avoid mocking business APIs in E2E.
- Every test file should contain at least 1 success case and 1 failed case.
- Every new feature should include at least unit + integration tests for the critical success path.

# integration test environment

- Shared integration test bootstrap is in `vite.setup.ts`.
    - server auto starts before all tests and resets handlers after each test.
        --> so no need to manually start/stop server or reset handlers in test files unless you want to override handlers for specific tests.

- MSW server is defined in `test/config/server.config.ts` with `setupServer()`.
- In each integration test file:
    - add handlers with `server.use(...)` for only endpoints used in that workflow.
    - render component with required providers (at least `QueryClientProvider`, and router provider if route behavior is tested).
    - assert both success and failed behavior (toast, disabled button, error message, or payload side effect).

# sample test code

```ts
// test/card/card.unit.test.tsx
import { describe, expect, test, vi, type Mock } from "vitest";
import { api } from "../../src/config/axios/api";
import { createCard } from "../../src/feat/card/card.service";

vi.mock("../../src/config/axios/api", () => ({
    api: {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        defaults: { headers: { common: {} } },
    },
}));

const mockPost = api.post as Mock;

describe("card.service unit", () => {
    test("createCard should call endpoint correctly", async () => {
        const request = {
            forAccountType: "PERSONAL",
            privilegeCode: "GOLD",
            type: "CREDIT",
            pinCode: "123456",
        };

        mockPost.mockResolvedValue({ data: "create card successfully" });

        const result = await createCard(request as never);

        expect(result).toBe("create card successfully");
        expect(mockPost).toHaveBeenCalledWith("/v1/personal-cards", request, {
            toastMessageWhenSuccess: true,
        });
    });

    test("createCard should throw when api.post fails", async () => {
        const request = {
            forAccountType: "PERSONAL",
            privilegeCode: "GOLD",
            type: "CREDIT",
            pinCode: "123456",
        };

        mockPost.mockRejectedValue(new Error("network error"));

        await expect(createCard(request as never)).rejects.toThrow("network error");
    });
});
```

```ts
// test/card/card.it.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http } from "msw";
import { server } from "../config/server.config";

describe("card integration", () => {
    it("submit form with mocked backend", async () => {
        server.use(
            http.post("/v1/personal-cards", async () => {
                return new Response(JSON.stringify({ success: true, message: "card created successfully", data: "ok" }), {
                    status: 200,
                });
            })
        );

        const user = userEvent.setup();
        render(<div />); // replace with actual component

        await user.type(screen.getByPlaceholderText("Enter 6-digit pin code"), "123456");
        await user.click(screen.getByRole("button", { name: "Add Card" }));

        expect(true).toBe(true); // replace with real assertions (toast, request payload, rendered result)
    });

    it("show error feedback when backend returns 400", async () => {
        server.use(
            http.post("/v1/personal-cards", async () => {
                return new Response(JSON.stringify({ success: false, message: "invalid pin" }), {
                    status: 400,
                });
            })
        );

        const user = userEvent.setup();
        render(<div />); // replace with actual component

        await user.type(screen.getByPlaceholderText("Enter 6-digit pin code"), "654321");
        await user.click(screen.getByRole("button", { name: "Add Card" }));

        expect(true).toBe(true); // replace with real assertions for error toast or error UI
    });
});
```

# commit
    - Use Conventional Commits (feat:, fix:, chore:, refactor:)
    - Write simple, clear, and concise commit messages that describe the changes made
    - use - to separate different points in the commit message if needed
    - If there is a conflict, tell me before resolving it and explain why your solution is the best
        - Sample commit for feature:
            `feat: add card privilege feature module`
            - Add card privilege DTO/schema with zod validation, service layer CRUD functions, and React Query hooks for create/update/delete/get/list workflows.
        - Sample commit for card-privilege tests:
            `test: update tests for card-privilege`
            - Add unit tests for card privilege service methods and integration tests for create privilege form workflow with mocked backend success/failure responses.

# context 
    - read the api.local.json for backend API details