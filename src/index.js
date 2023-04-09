import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';

import { getData } from './js/api';
import { createMarkup } from './js/markup';

import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '34720364-25bd7ca6aede9db569324b321';
const PER_PAGE = 40;

let page = 1;
let value = '';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const btnRef = document.querySelector('.btn-load-more');
const lightbox = new SimpleLightbox('.gallery a', {});

formRef.addEventListener('submit', onSubmit);
btnRef.addEventListener('click', onClick);

async function onSubmit(event) {
  try {
    event.preventDefault();
    value = event.target.searchQuery.value.trim();

    if (!value) {
      return;
    }

    page = 1;

    const params = createUrlParams(value, page);
    const { hits, totalHits } = await getData(params);
    const markup = createMarkup(hits);
    addMarkup(markup);

    lightbox.refresh();
    showMessage('success', `Hooray! We found totalHits ${totalHits} images.`);

    if (totalHits <= PER_PAGE) {
      btnRef.classList.add('is-hidden');
      showMessage();
    } else {
      btnRef.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error.message);
  }
}

function createUrlParams(value, page) {
  return new URLSearchParams({
    q: value,
    page: page,
    per_page: PER_PAGE,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    key: API_KEY,
  });
}

function addMarkup(markup = '') {
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

async function onClick() {
  try {
    page += 1;
    const params = createUrlParams(value, page);
    const { hits, totalHits } = await getData(params);
    const markup = createMarkup(hits);
    addMarkup(markup);
    lightbox.refresh();
    if (page * PER_PAGE >= totalHits) {
      btnRef.classList.add('is-hidden');
      showMessage();
    }
    galleryRef.lastElementChild.scrollIntoView({
      behavior: 'smooth',
    });
  } catch (error) {
    console.log(error.message);
  }
}

function showMessage(
  method = 'warning',
  message = "We're sorry, but you've reached the end of search results."
) {
  Notify[method](message);
}
