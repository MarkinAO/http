import TicketService from './TicketService';
import Ticket from './Ticket';
import TicketView from './TicketView';
import TicketForm from './TicketForm';

/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = new TicketService();
    this.ticketView = new TicketView(container);
    this.ticketForm = new TicketForm();

    this.contentBox = null;
  }

  async init() {
    this.ticketView.init();
    const tickets = await this.ticketService.list();
    this.ticketView.renderTickets(tickets);

    const contentBox = document.querySelector('.contentBox');
    contentBox.addEventListener('click', (e) => {
      this.editOrDelete(e);
    });

    const addTicketBtn = document.querySelector('.btn');
    addTicketBtn.addEventListener('click', () => {
      this.showPopup();
    });

    this.ticketView.tickets.forEach((ticket) => {
      ticket.addEventListener('click', async (e) => {
        const element = e.target;
        if (!element.classList.contains('mini-btn')
          && !element.classList.contains('.label')) {
          const ticketWrap = element.closest('.ticketWrap');
          const descriptionField = ticketWrap.querySelector('.description');
          const id = ticketWrap.getAttribute('data-id');
          const ticket = await this.ticketService.get(id);
          descriptionField.textContent = ticket.description;
          descriptionField.classList.toggle('hidden');
        } else {

        }
      });
    });

    const checkboxes = document.querySelectorAll('.custom-checkbox');
    checkboxes.forEach((el) => {
      el.addEventListener('change', (e) => {
        const element = e.target;
        const ticketWrap = element.closest('.ticketWrap');
        const id = ticketWrap.getAttribute('data-id');
        const checkedStatus = ticketWrap.querySelector('.custom-checkbox').checked;
        const data = { status: checkedStatus };
        this.ticketService.update(id, data);
      });
    });
  }

  editOrDelete(e) {
    if (e.target.classList.contains('delete')) {
      const perentEl = e.target.closest('.ticketWrap');
      const id = perentEl.getAttribute('data-id');
      this.showPopup(id, 'verification');
    }

    if (e.target.classList.contains('edit')) {
      const perentEl = e.target.closest('.ticketWrap');
      const id = perentEl.getAttribute('data-id');
      this.showPopup(id);

      const shortDescription = perentEl.querySelector('.shortDescription').textContent;
      this.ticketForm.popup.querySelector('[name="shortDescription"]').value = shortDescription;

      const fullDescription = perentEl.querySelector('.description').textContent;
      this.ticketForm.popup.querySelector('[name="fullDescription"]').value = fullDescription;
    }
  }

  async editTodo(formData, id) {
    const tickets = [...document.querySelectorAll('.ticketWrap')];
    const ticket = tickets.find((el) => el.getAttribute('data-id') === id);
    const data = { id };

    const shortDescription = formData.get('shortDescription');
    if (shortDescription.length > 0) {
      data.name = formData.get('shortDescription');
      ticket.querySelector('.shortDescription').textContent = formData.get('shortDescription');
    } else {
      const errore = {
        message: 'Заполните описание задачи!',
        type: 'shortDescription',
      };
      this.renderErrore(errore);
      return;
    }

    const fullDescription = formData.get('fullDescription');
    if (fullDescription.length > 0) {
      data.description = formData.get('fullDescription');
      ticket.querySelector('.description').textContent = formData.get('fullDescription');
    }

    this.ticketService.update(id, data);
    this.ticketForm.deletePopup();
  }

  async showPopup(id, type = 'main') {
    if (type === 'main') {
      this.ticketForm.createPopup();
      if (id && id !== '') {
        const ticket = await this.ticketService.get(id);
        const description = document.querySelector('[name="fullDescription"]');
        description.value = ticket.description;
        this.ticketForm.popup.setAttribute('data-id', id);
      }
    }
    if (type === 'verification') {
      this.ticketForm.createPopup('verificationPopup');
      if (id && id !== '') this.ticketForm.popup.setAttribute('data-id', id);
    }
    this.addPopupEventHendler();
  }

  clearPopup() {
    const inputs = [...this.popup.querySelectorAll('.popupInput')];
    inputs.forEach((el) => el.value = '');
    this.popup.removeAttribute('data-id');
  }

  hiddenPopup() {
    this.popup.classList.add('hidden');
    this.verificationPopup.classList.add('hidden');
    this.clearPopup();
    this.renderErrore();
  }

  renderErrore(errore) {
    const oldErrore = [...document.querySelectorAll('.errore')];
    oldErrore.forEach((el) => el.remove());
    if (!errore) return;

    const errPanel = document.createElement('span');
    errPanel.classList.add('errore');
    errPanel.textContent = errore.message;
    const errPosition = document.querySelector(`[name="${errore.type}"]`);
    errPosition.after(errPanel);
  }

  addPopupEventHendler() {
    const popupWrap = document.querySelector('.popupWrap');
    const btnCancel = popupWrap.querySelector('.btn-cancel');
    btnCancel.addEventListener('click', (e) => {
      e.preventDefault();
      this.ticketForm.deletePopup();
    });

    const btnSave = popupWrap.querySelector('.btn-save');
    if (btnSave) {
      btnSave.addEventListener('click', async (e) => {
        e.preventDefault();
        const data = new FormData(document.forms.popup);
        if (popupWrap.hasAttribute('data-id')) {
          const id = popupWrap.getAttribute('data-id');
          this.editTodo(data, id);
        } else {
          this.addTicket(data);
        }
      });
    }

    const btnDelete = popupWrap.querySelector('.btn-delete');
    if (btnDelete) {
      btnDelete.addEventListener('click', (e) => {
        e.preventDefault();
        const id = popupWrap.getAttribute('data-id');
        this.ticketService.delete(id);
        this.init();
        this.ticketForm.deletePopup();
      });
    }
  }

  async addTicket(data) {
    const ticketData = {
      id: null,
      name: data.get('shortDescription'),
      description: data.get('fullDescription'),
      status: false,
      created: null,
    };
    const ticket = new Ticket(ticketData);
    this.ticketService.create(ticket);
    this.init();
    this.ticketForm.deletePopup();
  }
}
