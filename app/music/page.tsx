import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Music Studio | Sweet Dreams - Now at sweetdreamsmusic.com",
  description: "Sweet Dreams recording studio has moved to sweetdreamsmusic.com. Visit our dedicated music site for studio booking, music production, mixing, and mastering services in Fort Wayne, IN.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function MusicPage() {
  redirect("https://sweetdreamsmusic.com");
}
