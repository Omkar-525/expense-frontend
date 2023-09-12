// components/Layout.js

import Nav from './nav/index';

export default function Layout({ children }) {
  return (
    <div className="flex">
      <Nav />
      <main className="ml-1/4 flex-grow">
        {children}
      </main>
    </div>
  );
}
