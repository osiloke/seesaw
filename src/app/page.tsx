import InspectorPage from '@/components/inspector-page';
import InspectorPageSkeleton from '@/components/inspector-page-skeleton';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<InspectorPageSkeleton />}>
      <InspectorPage />
    </Suspense>
  );
}
