import React from 'react';


function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex flex-col flex-1 w-full">
        {children}
    </div>
  );
};

export default DashboardLayout;
