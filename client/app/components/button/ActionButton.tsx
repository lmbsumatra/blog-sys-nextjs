"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ButtonNavigationProps {
  label?: string;
  path?: string;
}

export const ActionButton = ({
  label = "",
  path = "",
}: ButtonNavigationProps) => {
  const router = useRouter();

  const handleNavigate = () => {
    if (label === "Back") {
      if (window.history.state && window.history.state.idx > 0) {
        router.back();
      } else {
        router.push(`/user`);
      }
    } else {
      router.push(`http://localhost:3000/user/${path}`);
    }
  };

  return (
    <Button type="button" variant="outline" onClick={() => handleNavigate()}>
      {label}
    </Button>
  );
};
