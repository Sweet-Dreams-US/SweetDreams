import { redirect } from "next/navigation";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  redirect("https://sweetdreamsmusic.com/profile");
}
