import { redirect } from "next/navigation";

export default function PublicProfilePage({ params }: { params: { slug: string } }) {
  redirect(`https://sweetdreamsmusic.com/profiles/${params.slug}`);
}
