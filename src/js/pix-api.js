import axios from 'axios';

const API_KEY = '38537046-1dad650a5645b155ff397a43e';
const BASE_URL = 'https://pixabay.com/api/';

export default class PixApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async fetchPictures() {
    const params = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    });
    const response = await axios.get(`${BASE_URL}?${params}`);
    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(currentQuery) {
    this.searchQuery = currentQuery;
  }
}
