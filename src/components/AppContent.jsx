import Invoices from "../views/Invoices";

function AppContent() {
  return (
    <div className="h-full flex-grow text-center py-16 scrollbar-hide">
      <Invoices />
    </div>
  );
}

export default AppContent;
