import { createReactQueryHooks } from "@trpc/react";
import type { AppRouter } from '../../../src/trpcRouter'

export const trpcHooks = createReactQueryHooks<AppRouter>();