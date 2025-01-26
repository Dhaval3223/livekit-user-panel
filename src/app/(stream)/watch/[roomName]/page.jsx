import { redirect } from 'next/navigation';

import WatchPageImpl from './page.client';

export default async function WatchPage({ params: { roomName } }) {
  if (!roomName) {
    redirect('/');
  }

  const serverUrl = process.env.LIVEKIT_WS_URL.replace('wss://', 'https://').replace(
    'ws://',
    'http://'
  );

  return <WatchPageImpl roomName={roomName} serverUrl={serverUrl} />;
}
