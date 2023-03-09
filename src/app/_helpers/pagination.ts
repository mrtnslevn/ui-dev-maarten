import { PagesModel, PaginationComponent } from "ngx-bootstrap/pagination";

export class Pagination{
   static setPaginationComp(paging: any, paginationComp: PaginationComponent){
      paginationComp.pages = []
      let max = paging.total_page < paging.max_size ? paging.total_page : paging.max_size + 1;
      
      if (paging.total_page == 1) {
         paginationComp.noNext()
         paginationComp.noPrevious()
      }
      for (let i = paging.page_no; i <= max; i++) {
         let page: PagesModel = { text: `${i}`, number: i, active: i == paging.page_no }
         if (i == max && paging.total_page > paging.max_size) {
            page = { text: '...', number: i, active: false }
         }
         paginationComp.pages.push(page)
      }

      return paging
   }
}