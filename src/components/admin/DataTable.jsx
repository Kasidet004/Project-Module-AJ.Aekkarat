import { TableRowSkeleton } from '@/components/common/Skeletons'
import EmptyState from '@/components/common/EmptyState'
import { Inbox } from 'lucide-react'

export default function DataTable({ columns, data, isLoading, renderRow, emptyMessage = 'ยังไม่มีข้อมูล' }) {
  return (
    <div className="card-surface overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-600 text-left">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3 label-eyebrow whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-base-700">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={columns.length} />)
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState icon={Inbox} title={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((row) => renderRow(row))
          )}
        </tbody>
      </table>
    </div>
  )
}
