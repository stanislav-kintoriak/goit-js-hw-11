import axios from 'axios';

export default class ApiService {
  constructor() {
    this.query = '';
    this.page = 1;
    this.totalHits = 0;
    this.downloaded = 0;
  }

  async getPictures() {
    const params = {
      key: '34931962-db4e3cf68e263d5dddbb75168',
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    };
    const response = await axios.get(`https://pixabay.com/api/`, {
      params,
    });
    this.totalHits = response.data.totalHits;
    this.incrementPage();
    this.downloaded += response.data.hits.length;
    return response.data.hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    this.downloaded = 0;
  }

  get currentQuery() {
    return this.query;
  }

  set currentQuery(newQuery) {
    this.query = newQuery;
  }
}