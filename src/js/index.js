import * as NotiflixService from './notiflix-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixApiService from './pix-api';

const pixApiService = new PixApiService();

const selectors = {
  formEl: document.getElementById('search-form'),
  searchBtn: document.getElementById('search-btn'),
  galleryEl: document.querySelector('.js-gallery'),
  loaderEl: document.querySelector('.loader-wrapper'),
  loadBtn: document.querySelector('.load-more'),
};

selectors.formEl.addEventListener('submit', onPictureSearch);
selectors.loadBtn.addEventListener('click', onLoadMore);

const galleryLightbox = new SimpleLightbox('.gallery-link');

function onPictureSearch(evt) {
  evt.preventDefault();
  pixApiService.resetPage();
  clearGalleryMarkup();

  selectors.loaderEl.classList.remove('is-hidden');
  selectors.loadBtn.classList.add('is-hidden');

  pixApiService.query = evt.currentTarget.searchQuery.value;

  pixApiService
    .fetchPictures()
    .then(({ hits, totalHits }) => {
      clearGalleryMarkup();
      if (!hits.length) {
        return NotiflixService.showMessageWarning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      createGalleryMarkup(hits);
      NotiflixService.showMessageSuccess(
        `Hooray! We found ${totalHits} images.`
      );
      pixApiService.incrementPage();
      selectors.loadBtn.classList.remove('is-hidden');
      galleryLightbox.refresh();
    })
    .catch(_ =>
      NotiflixService.showMessageFailure(
        'Oops! Something went wrong! Try reloading the page!'
      )
    )
    .finally(() => selectors.loaderEl.classList.add('is-hidden'));

  evt.currentTarget.reset();
}

function onLoadMore() {
  pixApiService
    .fetchPictures()
    .then(({ hits, totalHits }) => {
      totalPages = totalHits / pixApiService.perPage;
      if (pixApiService.page > totalPages) {
        selectors.loadBtn.classList.add('is-hidden');
        NotiflixService.showMessageInfo(
          "We're sorry, but you've reached the end of search results."
        );
      }
      createGalleryMarkup(hits);
      pixApiService.incrementPage();
      galleryLightbox.refresh();
    })
}

function createGalleryMarkup(pictures) {
  const galleryContent = pictures
    .map(
      picture =>
        `<a class="gallery-link" href="${picture.largeImageURL}">
          <div class="gallery-card">
            <img src="${picture.webformatURL}" alt="${picture.tags}" loading="lazy" width="320" height="210"/>
            <div class="card-info">
              <p class="info-item">
                <b>Likes</b>
                ${picture.likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${picture.views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${picture.comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${picture.downloads}
              </p>
            </div>
          </div>
        </a>`
    )
    .join('');
  selectors.galleryEl.insertAdjacentHTML('beforeend', galleryContent);
}

function clearGalleryMarkup() {
  selectors.galleryEl.innerHTML = '';
}
