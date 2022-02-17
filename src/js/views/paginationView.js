import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = btn.dataset.goto;

      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currPage = Number(this._data.page);

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1 and there are other pages
    if (currPage === 1 && numPages > 1) {
      return `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev hidden">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>

      <span class="pagination__cur-page--curr-page">${currPage}</span>

      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    
    
    
    `;
    }
    // Page 1 and there no other pages
    if (currPage === 1 && numPages <= 1) {
      return ``;
    }
    // last Page
    if (currPage === numPages && numPages > 1) {
      console.log(currPage, numPages);
      return `<button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>
    
    <span class="pagination__cur-page--curr-page">${currPage}</span>

      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next hidden">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
    }
    // Other page
    if (currPage < numPages) {
      return `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>
      
    <span class="pagination__cur-page--curr-page">${currPage}</span>

    <button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${currPage + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
    }
  }
}

export default new PaginationView();
