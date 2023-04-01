// imports
import SimpleLightbox from '../node_modules/simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import GetPictures from './js/fetch-pictures';
import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

// querySelectors
const body = document.querySelector('body');
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const input = document.querySelector('[name="searchQuery"]');
const searchBtn = document.querySelector('[type="submit"]');

let isScrollListenerRegistered = false;

// additional markup

input.classList.add('search-field');
searchBtn.classList.add('search-button');

const header = document.createElement('header');
header.classList.add('header');
const section = document.createElement('section');
section.classList.add('section');
const container = document.createElement('div');
container.classList.add('container');

body.prepend(header, section);
header.prepend(form);
section.prepend(container);
container.prepend(gallery);

// header fixation

const { height: headerHeight } = header.getBoundingClientRect();
document.body.style.paddingTop = `${headerHeight}px`;

// Search listener

let searchQuery = '';

const getPictures = new GetPictures();

form.addEventListener('submit', onSubmitBtnClick);

// get data from api
function onSubmitBtnClick(e) {
  gallery.innerHTML = '';

  e.preventDefault();

  getPictures.query = e.currentTarget.elements.searchQuery.value;

  getPictures
    .fetchPictures(searchQuery)
    .then(createMarkup)
    .catch(error => console.error(error));
}

// creating markup

function createMarkup(pictures) {
  const arrayOfPictures = pictures.data.hits;


// info massages code

if (arrayOfPictures.length === 0) {
    Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
} else if (arrayOfPictures.length === 1) {
  Notify.failure(`Hooray! We found ${pictures.data.hits} images.`);
}

const galleryMarkup = arrayOfPictures
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
            <a class="link card-item" href="${largeImageURL}">
                <div class="photo-card">
                    <img class="card-img" src="${webformatURL}" alt="${tags}" width="300" loading="lazy">
                
                <div class="info">
                    <p class="info-item"><b>Likes</b>${likes}</p>
                    <p class="info-item"><b>Views</b>${views}</p>
                    <p class="info-item"><b>Comments</b>${comments}</p>
                    <p class="info-item"><b>Downloads</b>${downloads}</p>
                </div>
                </div>
            </a>`;
    }
  )
  .join('');

gallery.insertAdjacentHTML('beforeend', galleryMarkup);



 //SIMPLELIGHTBOX
 const lightbox = new SimpleLightbox('.gallery a');
 lightbox.refresh();
 

if (getPictures.totalHits <= getPictures.perPage && arrayOfPictures.length !== 0) {

    noPictures();
    return;
};

function noPictures() {

    Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);

    if (Math.ceil(getPictures.totalHits / getPictures.perPage) === 1) {
        return;
    }

    document.removeEventListener('scroll', onScroll);}


if (getPictures.page <= Math.floor(getPictures.totalHits / getPictures.perPage)) {
    loadMorePictures();
};
};



function loadMorePictures() {

    const onScroll = function() {
        
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2 + 30,
        behavior: 'smooth',
    });

        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;
        
        if (scrollTop + clientHeight >= scrollHeight - 200) {
            
            getPictures.fetchPictures(searchQuery)
                .then(createMarkup)
                .catch(error => console.error(error));
        };
    };
    
    if (!isScrollListenerRegistered) {
        isScrollListenerRegistered = true;
        document.addEventListener('scroll', throttle(onScroll, 3000));
    };
};

function noMorePictures() {

    Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);

    if (Math.ceil(getPictures.totalHits / getPictures.perPage) === 1) {
        return;
    }

    document.removeEventListener('scroll', onScroll);
};







