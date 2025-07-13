import InspectorPage from '@/components/inspector-page';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InspectorPage />
    </Suspense>
  );
}
