import { refs } from '../index';
let lastScroll = 0;
const defaultOffset = 200;

const scrollPosition = () =>
  window.pageYOffset || document.documentElement.scrollTop;
const containHide = () => refs.searchForm.classList.contains('hide');

window.addEventListener('scroll', () => {
  if (
    scrollPosition() > lastScroll &&
    !containHide() &&
    scrollPosition() > defaultOffset
  ) {
    refs.searchForm.classList.add('hide');
  } else if (scrollPosition() < lastScroll && containHide()) {
    refs.searchForm.classList.remove('hide');
  }

  lastScroll = scrollPosition();
});