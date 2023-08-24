import React from 'react'
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, NavLink } from "react-router-dom";

function Layout() {
    const queryClient = new QueryClient();
  return (
    <>
    <nav>
      <NavLink className="" to="/">
        Home
      </NavLink>
      
    </nav>

    <main>
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </main>
  </>
  
  )
}

export default Layout