/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  constructor() {
    this.url = 'http://localhost:3000';
  }

  async list(callback) {
    const url = `${this.url}?method=allTickets`;
    const response = await fetch(url);
    if (response.ok) {
      let json = await response.json();
      json = json.filter((el) => el.name);
      return json;
    }
    console.error(`Ошибка HTTP: ${response.status}`);
  }

  async get(id, callback) {
    const url = `${this.url}?method=ticketById&id=${id}`;
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json;
    }
    console.error('Тикет не найден');
  }

  async create(data, callback) {
    const url = `${this.url}?method=createTicket`;
    const options = {
      method: 'POST',
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const result = 'Запись добавлена';
      return result;
    }
    console.error(`Ошибка HTTP: ${response.status}`);
  }

  async update(id, data, callback) {
    const ticket = await this.get(id);

    for (const key in ticket) {
      if (data.hasOwnProperty(key)
      && ticket[key] !== data[key]) {
        ticket[key] = data[key];
      }
    }

    const url = `${this.url}?method=updateById&id=${id}`;
    const options = {
      method: 'POST',
      body: JSON.stringify(ticket),
    };
    const response = await fetch(url, options);

    if (response.ok) {
      console.log('Тикет успешно обновлён');
    } else {
      console.error('Ошибка обновления тикета');
    }
  }

  async delete(id, callback) {
    const url = `${this.url}?method=deleteById&id=${id}`;
    const response = await fetch(url);
    if (response.ok) {
      console.log('Запись успешно удалена');
      return true;
    }
    console.error('Запись не найдена');
  }
}
