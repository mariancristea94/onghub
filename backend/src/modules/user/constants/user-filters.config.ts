import { OrderDirection } from 'src/common/enums/order-direction.enum';

export const USER_FILTERS_CONFIG = {
  selectColumns: ['name', 'email', 'created_on', 'role'],
  searchableColumns: ['name'],
  defaultSortBy: 'name',
  defaultOrderDirection: OrderDirection.ASC,
  relations: [],
  rangeColumn: 'created_on',
};
