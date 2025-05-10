"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface ButtonNavigationProps {
  label?: string;
  path?: string;
}

export const  ButtonNavigation = ({
  label = "",
  path = "",
}: ButtonNavigationProps) => {
  const router = useRouter();

  const handleNavigate = () => {
    if (label === "Back") {
      if (
        document.referrer &&
        new URL(document.referrer).origin === window.location.origin
      ) {
        router.back();
      } else {
        router.push(`/`);
      }
    } else {
      router.push(`http://localhost:3000/blog/${path}`);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={(e) => {
        e.stopPropagation();
        handleNavigate();
      }}
    >
      {label}
    </Button>
  );
};
