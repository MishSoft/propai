import SideBar from './components/Sidebar/SideBar';
import MobileHeader from './components/MobileHeader';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col xl:flex-row bg-slate-50 min-h-screen text-slate-900">
      <SideBar />
      <div className="flex-1 w-full max-w-full overflow-x-hidden xl:pl-64 flex flex-col min-h-screen">
        <MobileHeader />
        <main className="p-4 sm:p-6 lg:p-10 w-full flex-1">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
