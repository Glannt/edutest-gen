import { useMemo } from 'react';

/**
 * Tạo map { [id]: name } từ danh sách entity {id, name}
 */
export const useEntityNameMap = <T extends { id: number; name: string }>(
  data: T[] = []
) => {
  return useMemo(() => {
    const map: Record<number, string> = {};

    data.forEach((item) => {
      map[item.id] = item.name;
    });

    return map;
  }, [data]);
};
