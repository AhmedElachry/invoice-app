import { Route, Routes } from "react-router-dom";

import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";
import AppContent from "../components/AppContent";
import InvoiceInfo from "../views/InvoiceInfo";

function Layout() {
  return (
    <div className="md:flex w-full duration-300 dark:bg-[#141625] bg-[#f8f8fb] ">
      <AppSidebar />
      <AppHeader />
      <div className="flex flex-col md:block min-h-screen   w-full">
        <Routes location={location} key={location.pathname}>
          <Route element={<AppContent />} path="/" />
          <Route element={<InvoiceInfo />} path="invoice" />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;
