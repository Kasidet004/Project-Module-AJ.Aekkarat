import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="flex bg-base-950 bg-circuit-grid bg-grid min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto">
        <Outlet />
      </div>
    </div>
  )
}
