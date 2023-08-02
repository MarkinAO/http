/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  constructor() {
    this.url = 'http://localhost:3000';
  }

  list(callback) {}

  async get(id, callback) {
    if(id) {
      const url = this.url + `?method=ticketById&id=${id}`;
      const response = await fetch(url);
      if (response.ok) {
        let json = await response.json();
        return json.description;
      } else {
        console.error('Описание не найдено');
      }
    } else {
      const url = this.url + '?method=allTickets';
      const response = await fetch(url);
      if (response.ok) {
        let json = await response.json();
        json = json.filter(el => el.name);
        return json;
      } else {
        console.error('Ошибка HTTP: ' + response.status);
      }
    }
  }

  async create(data, callback) {
    const url = this.url + '?method=createTicket';
    const options = {
      method: 'POST',
      body: JSON.stringify(data)
    }
    const response = await fetch(url, options);
    if (response.ok) {
      const result = 'Запись добавлена';
      return result;
    } else {
      console.error('Ошибка HTTP: ' + response.status);
    }
  }

  update(id, data, callback) {}

  async delete(id, callback) {
    const url = this.url + `?method=deleteById&id=${id}`;
    const response = await fetch(url);
    if (response.ok) {
      console.log('Запись успешно удалена')
      return true
    } else {
      console.error('Запись не найдена');
    }
  }
}
