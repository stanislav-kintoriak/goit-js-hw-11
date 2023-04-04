
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a');

import './css/styles.css';

import Notiflix from 'notiflix';
Notiflix.Notify.init();

import throttle from 'lodash.throttle';

import ApiService from './js/API';
const apiService = new ApiService();

export const refs = {
  searchForm: document.querySelector('form'),
  picturesContainer: document.querySelector('.gallery'),};


  // const searchBtn = document.querySelector('[type="submit"]');
  // searchBtn.classList.add('search-button');

  // const input = document.querySelector('[name="searchQuery"]');
  // input.classList.add('search-field');


//   //STATIC MARKUP CREATING
// inputField.classList.add('search-field');
// searchBtn.classList.add('search-btn');

// const header = document.createElement('header');
// header.classList.add('page-header');
// const section = document.createElement('section');
// section.classList.add('section');
// const container = document.createElement('div');
// container.classList.add('container');

// body.prepend(header, section);
// header.prepend(refs.searchForm);
// section.prepend(container);
// container.prepend(refs.picturesContainer);



refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(evt) {
  evt.preventDefault();
  clearMarkup();
  apiService.currentQuery = evt.currentTarget.elements.searchQuery.value.trim();
  apiService.resetPage();
  if (!apiService.query) {
    Notiflix.Notify.failure('Sorry, incorect query. Please try again.');
    return;
  }

  await fetchPictures();

  if (apiService.totalHits > 0) {
    Notiflix.Notify.info(`"Hooray! We found ${apiService.totalHits} images."`);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
let isLoading = false;

async function fetchPictures() {
  if (isLoading) return;
  isLoading = true;
  const pictures = await apiService.getPictures();
  appendPictures(pictures);
  isLoading = false;
}

function appendPictures(pictures) {
  if (!pictures) return;

  const markup = pictures
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                ${likes}
              </p>
              <p class="info-item">
                <b>Views</b>
                ${views}
              </p>
              <p class="info-item">
                <b>Comments</b>
                ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b>
                ${downloads}
              </p>
            </div>
          </a>      
        </div>`;
      }
    )
    .join('');

  refs.picturesContainer.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearMarkup() {
  refs.picturesContainer.innerHTML = '';
}
//////// scroll /////////
window.addEventListener('scroll', throttle(checkPosition, 350));
window.addEventListener('resize', throttle(checkPosition, 350));

async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;

  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;

  const position = scrolled + screenHeight;
  if (position >= threshold && apiService.downloaded < apiService.totalHits) {
    await fetchPictures();
  }

  if (document.body.scrollHeight === scrolled + screenHeight) {
    if (apiService.downloaded >= apiService.totalHits) {
      Notiflix.Notify.warning('Sorry, there are no more images to show.');
    } else {
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  }
}

refs.picturesContainer.addEventListener('scrollend', () => {
  if (apiService.downloaded >= apiService.totalHits) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
});
