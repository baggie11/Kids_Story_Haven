// ✅ This is a Server Component — no "use client" needed

import StoryPage from "@/components/StoryPage";

export default function Page({ params, searchParams }) {
  return (
    <StoryPage
      storyId={params?.storyId}
      title={searchParams?.title ?? ''}
    />
  );
}

