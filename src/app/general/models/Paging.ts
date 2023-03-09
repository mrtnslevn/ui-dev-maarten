export class Paging {
  readonly page_no: number;
  readonly total_page: number;
  readonly total_row: number;
  readonly rows_per_page: number;
  readonly max_size: number;

  constructor(page_no: number, total_page: number, total_row: number, rows_per_page: number, max_size: number) {
    this.page_no = page_no;
    this.total_page = total_page;
    this.total_row = total_row;
    this.rows_per_page = rows_per_page;
    this.max_size = max_size;
  }
}
