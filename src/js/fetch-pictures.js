import axios from 'axios';

export default class GetPictures {
  constructor() {
    this.searchQuery = '';
    this.page = 0;
    this.perPage = 40;
    this.totalHits = 0;
  }

  async fetchPictures() {
    this.page += 1;

    const PIXABAY_API_KEY = '34931962-db4e3cf68e263d5dddbb75168';

    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}&totalHits=100`;

    console.log(url);

    const response = await axios.get(url);

    this.totalHits = response.data.totalHits;

    return response;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
    this.page = 0;
  }
}
