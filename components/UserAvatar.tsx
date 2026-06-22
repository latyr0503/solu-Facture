import React from "react";
import Link from "next/link";

export interface UserAvatarProps {
  user: {
    nom: string;
    email: string;
    initiales: string;
  };
}

export function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Link 
      href="/dashboard/settings"
      className="group flex bg-white dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl py-1.5 items-center gap-2.5 border-l-4 border-sky-500 px-2 transition-colors duration-200 cursor-pointer"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
        {user.initiales}
      </div>
      <div className="hidden sm:block">
        <p className="text-sm leading-none font-medium text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {user.nom}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">{user.email}</p>
      </div>
    </Link>
  );
}
