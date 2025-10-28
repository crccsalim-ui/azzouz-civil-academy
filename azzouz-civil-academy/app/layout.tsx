import '@/styles/tailwind.css';
import '@/styles/globals.css';

import {ReactNode} from 'react';

export default function RootLayout({children}: {children: ReactNode}) {
  return children;
}
