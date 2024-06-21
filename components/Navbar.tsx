import { NavbarProps } from "@/types/types";
import Image from "next/image";
import { memo } from "react";
import ActiveUsers from "./users/ActiveUsers";

const Navbar = ({ activeElement }: NavbarProps) => {
  return (
    <nav className="select-none gap-4 bg-primary-black px-5 py-2 text-white">
      <div className="flex items-center justify-between container">
        <Image
          src="/assets/logo.svg"
          alt="FigPro Logo"
          width={120}
          height={10}
        />
        <ActiveUsers />
      </div>
    </nav>
  );
};

export default memo(Navbar);
