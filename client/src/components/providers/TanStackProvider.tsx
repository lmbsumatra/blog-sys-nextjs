"use client";


import { TanStackProviderProps } from "@/src/types/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";


export const TanStackProvider = ({ children }: TanStackProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
