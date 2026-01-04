import { Sort } from '../interfaces/sort.interface';

export function SortTansform(sort: Sort[]) {
  const order: any = {};
  if (sort) {
    sort.forEach((item: Sort) => {
      order[item.by] = item.order.toUpperCase();
    });
  }
  return order;
}
