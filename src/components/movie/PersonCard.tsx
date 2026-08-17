import Image from "next/image";
import { UserRound } from "lucide-react";

export type PersonCardMember = {
  id: number;
  name: string;
  role: string;
  profile: string | null;
};

export default function PersonCard({ member }: { member: PersonCardMember }) {
  return (
    <div className="flex flex-none flex-col items-center gap-2 text-center">
      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-full bg-brand-surface">
        {member.profile ? (
          <Image src={member.profile} alt={member.name} fill sizes="64px" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-text/30">
            <UserRound size={20} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="truncate font-heading text-xs font-medium leading-tight">{member.name}</div>
        <div className="mt-0.5 truncate text-[11px] text-brand-text/50">{member.role}</div>
      </div>
    </div>
  );
}
