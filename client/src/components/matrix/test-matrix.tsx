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

import { useTableDataMatrix } from '@/hooks/useTableData';

export const TestMatrixDynamic = () => {
  const { tableData, levels, questionTypes, subjects } = useTableDataMatrix();

  const levelQuestionMap: Record<string, string[]> = {};

  levels.forEach((level) => {
    levelQuestionMap[level] = questionTypes.filter((qt) =>
      tableData.some((row) => row[`${level}_${qt}`] !== undefined)
    );
  });

  const toNumber = (value: unknown) => {
    if (typeof value === 'number') return value;

    return 0;
  };

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
            {levels.map((level) => (
              <th
                key={level}
                className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
                colSpan={questionTypes.length}
              >
                {level}
              </th>
            ))}
            {/* dynamic question types */}

            {questionTypes.map((qt) => (
              <th
                key={`${qt}`}
                className='border border-table-border bg-table-header px-4 py-2 text-center font-bold text-table-header-foreground'
                rowSpan={2}
              >
                {qt}
              </th>
            ))}
          </tr>
          {/* dynamic level question type */}
          <tr>
            {levels.map((level) =>
              questionTypes.map((qt) => (
                <th
                  key={`${level}_${qt}`}
                  className='border border-table-border bg-table-header px-3 py-2 text-center font-bold text-xs text-table-header-foreground'
                >
                  {qt}
                </th>
              ))
            )}
          </tr>
        </thead>

        {/* Body */}

        {/* test */}
        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {/* Chapter */}
              {!row.isSubRow && row.rowSpan && row.content !== 'TỔNG' && (
                <td
                  className='border border-table-border px-4 py-3 text-center align-middle'
                  rowSpan={row.rowSpan}
                >
                  {row.chapter}
                </td>
              )}
              {/* Content */}
              <td
                className={`border border-table-border px-4 py-3 text-left ${
                  row.content === 'TỔNG'
                    ? 'bg-table-header font-bold text-table-header-foreground'
                    : ''
                }`}
              >
                {row.content}
              </td>
              {/* Dynamic level_questionType */}
              {levels.map((level) =>
                questionTypes.map((qt) => (
                  <td
                    key={`${level}_${qt}_${idx}`}
                    className={`border border-table-border px-3 py-2 text-center ${
                      row.content === 'TỔNG' ? 'bg-table-total font-bold' : ''
                    }`}
                  >
                    {row[`${level}_${qt}`] ?? ''}
                  </td>
                ))
              )}
              {/* Subjects */}
              {/* {subjects.map((sub) => (
                <td
                  key={`${sub}_${idx}`}
                  className={`border border-table-border px-3 py-2 text-center ${
                    row.content === 'TỔNG' ? 'bg-table-total font-bold' : ''
                  }`}
                >
                  {row[sub] ?? ''}
                </td>
              ))} */}
              {/* Tổng số câu hỏi (TN, D-S, TL-N) */}
              <td
                className={`border border-table-border px-3 py-2 text-center font-bold ${
                  row.content === 'TỔNG' ? 'bg-table-total' : ''
                }`}
              >
                {row.total_tn ?? ''}
              </td>
              <td
                className={`border border-table-border px-3 py-2 text-center font-bold ${
                  row.content === 'TỔNG' ? 'bg-table-total' : ''
                }`}
              >
                {row.total_ds ?? ''}
              </td>
              <td
                className={`border border-table-border px-3 py-2 text-center font-bold ${
                  row.content === 'TỔNG' ? 'bg-table-total' : ''
                }`}
              >
                {row.total_tln ?? ''}
              </td>
              {/* Tổng điểm */}
              <td className='border border-table-border px-3 py-2 text-center font-bold'>
                {row.totalScore ?? ''}
              </td>
            </tr>
          ))}
          <tr>
            <td
              className='border border-table-border bg-table-header px-4 py-3 text-center font-bold text-table-header-foreground'
              colSpan={2}
            >
              TỔNG
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              7
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              0
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              0
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              5
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              4
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              0
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              0
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              0
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold'>
              6
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold text-destructive'>
              12
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold text-destructive'>
              4
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold text-destructive'>
              6
            </td>
            <td className='border border-table-border bg-table-total px-3 py-3 text-center font-bold text-destructive'>
              10
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
