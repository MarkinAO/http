/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor(container) {
    this.container = container;
    this.contentBox = null;
    this.tickets = [];
  }

  init() {
    this.clearContent();
    let box = document.querySelector('.box');

    if (!box) {
      box = document.createElement('div');
      box.classList.add('box');
      this.container.appendChild(box);
    }

    const decorPanel = document.createElement('div');
    decorPanel.classList.add('decorPanel');
    box.appendChild(decorPanel);
    for (let i = 0; i < 3; i++) {
      const cercle = document.createElement('span');
      cercle.classList.add('cercle');
      decorPanel.appendChild(cercle);
    }

    const header = document.createElement('div');
    header.classList.add('header');
    box.appendChild(header);

    const addTicketBtn = document.createElement('div');
    addTicketBtn.classList.add('btn');
    addTicketBtn.textContent = 'Добавить тикет';

    header.appendChild(addTicketBtn);

    this.contentBox = document.createElement('div');
    this.contentBox.classList.add('contentBox');
    box.appendChild(this.contentBox);
  }

  renderTickets(tickets) {
    tickets.forEach((ticket) => {
      this.createTicket(ticket);
    });
  }

  createTicket(ticketData) {
    const ticketWrap = document.createElement('div');
    ticketWrap.classList.add('ticketWrap');
    ticketWrap.setAttribute('data-id', ticketData.id);

    const preview = document.createElement('div');
    preview.classList.add('preview');

    const description = document.createElement('div');
    description.classList.add('description');
    description.classList.add('hidden');

    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('id', ticketData.id);
    checkBox.classList.add('custom-checkbox');
    checkBox.checked = ticketData.status;
    const label = document.createElement('label');
    label.classList.add('label');
    label.setAttribute('for', ticketData.id);

    const ticket = document.createElement('div');
    ticket.classList.add('shortDescription');

    const shortDescription = ticketData.name;

    if (shortDescription.length > 0) {
      ticket.textContent = shortDescription;
    } else {
      const errore = {
        message: 'Заполните описание задачи!',
        type: 'shortDescription',
      };
      this.renderErrore(errore);
      return;
    }

    this.contentBox.appendChild(ticketWrap);
    ticketWrap.appendChild(preview);
    ticketWrap.appendChild(description);
    preview.appendChild(checkBox);
    preview.appendChild(label);
    preview.appendChild(ticket);

    const date = document.createElement('div');
    date.textContent = new Date(ticketData.created).toLocaleString().slice(0, -3);
    date.classList.add('date');
    preview.appendChild(date);

    const actionBox = document.createElement('div');
    actionBox.classList.add('actionBox');

    const edit = document.createElement('span');
    edit.classList.add('edit');
    edit.classList.add('mini-btn');
    const delite = document.createElement('span');
    delite.classList.add('delete');
    delite.classList.add('mini-btn');

    actionBox.appendChild(edit);
    actionBox.appendChild(delite);

    preview.appendChild(actionBox);
    this.tickets.push(ticketWrap);
  }

  clearContent() {
    const contentBox = document.querySelector('.box');
    if (contentBox) contentBox.innerHTML = '';
  }
}
