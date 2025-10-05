// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
// } from '@heroui/table';

// import { useMatrixStore } from '@/store/matrix.store';

// export const TestMatrix = () => {
//   const { structures } = useMatrixStore();

//   return (
//     <Table>
//       <TableHeader>
//         <TableColumn>Chương</TableColumn>
//         <TableColumn>Bài học</TableColumn>
//         <TableColumn>Mức độ</TableColumn>
//         <TableColumn>Loại câu hỏi</TableColumn>
//         <TableColumn>Số câu</TableColumn>
//       </TableHeader>
//       <TableBody>
//         {structures.map((s) => (
//           <TableRow key={s.id}>
//             <TableCell>{s.chapter}</TableCell>
//             <TableCell>{s.lesson}</TableCell>
//             <TableCell>{s.level}</TableCell>
//             <TableCell>{s.questionType}</TableCell>
//             <TableCell className='text-center'>{s.questionCount}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

import { TableData, useTableDataMatrix } from '@/hooks/useTableData';

export const TestMatrix = () => {
  const tableData = useTableDataMatrix();

  return (
    <div className='w-full overflow-x-auto'>
      <table className='w-full border-collapse text-sm'>
        {/* Header */}
        <thead>
          <tr>
            <th
              className='border border-table-border bg-cyan px-4 py-3 text-center font-bold text-table-header-foreground'
              rowSpan={3}
            >
              CHƯƠNG
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-3 text-center font-bold text-table-header-foreground'
              rowSpan={3}
            >
              NỘI DUNG/ ĐƠN VỊ KIẾN THỨC
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-3 text-center font-bold text-table-header-foreground'
              colSpan={9}
            >
              MỨC ĐỘ NHẬN THỨC
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-3 text-center font-bold text-table-header-foreground'
              colSpan={3}
            >
              TỔNG SỐ CÂU HỎI
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-3 text-center font-bold text-table-header-foreground'
              rowSpan={3}
            >
              TỔNG ĐIỂM
              <br />%
            </th>
          </tr>
          <tr>
            <th
              className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
              colSpan={3}
            >
              NB
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
              colSpan={3}
            >
              TH
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
              colSpan={3}
            >
              VD
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
              rowSpan={2}
            >
              TN
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
              rowSpan={2}
            >
              D-S
            </th>
            <th
              className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
              rowSpan={2}
            >
              TL-N
            </th>
          </tr>
          <tr>
            {[
              'TN',
              'D-S',
              'TL-N',
              'TN',
              'D-S',
              'TL-N',
              'TN',
              'D-S',
              'TL-N',
            ].map((header, idx) => (
              <th
                key={idx}
                className='border border-table-border bg-table-header px-3 py-2 text-center text-xs font-bold text-table-header-foreground'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {!row.isSubRow && row.rowSpan && row.content !== 'TỔNG' && (
                <td
                  className={`border border-table-border px-4 py-3 text-center align-middle`}
                  rowSpan={row.rowSpan}
                >
                  {row.chapter}
                </td>
              )}
              <td
                className={`border border-table-border px-4 py-3 text-left ${
                  row.content === 'TỔNG'
                    ? 'bg-table-header font-bold text-table-header-foreground'
                    : ''
                }`}
                colSpan={row.content === 'TỔNG' ? 2 : 1}
              >
                {row.content}
              </td>

              {[
                'nb_tn',
                'nb_ds',
                'nb_tln',
                'th_tn',
                'th_ds',
                'th_tln',
                'vd_tn',
                'vd_ds',
                'vd_tln',
                'total_tn',
                'total_ds',
                'total_tln',
              ].map((key) => (
                <td
                  key={key}
                  className={`border border-table-border px-3 py-3 text-center font-bold ${
                    row.content === 'TỔNG'
                      ? ['total_tn', 'total_ds', 'total_tln'].includes(key)
                        ? 'text-destructive bg-table-total'
                        : 'bg-table-total'
                      : ''
                  }`}
                >
                  {row[key as keyof TableData] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
