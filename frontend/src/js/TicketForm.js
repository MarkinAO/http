/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor() {
    this.popup = null;
  }

  async createPopup(type = 'main') {
    const popupWrap = document.createElement('div');
    this.popup = popupWrap;
    this.popup.classList.add('popupWrap');

    if (type === 'main') {
      this.popup.innerHTML = `        
      <form class="popup" name="popup">
          <div class="popup-title">Добавить тикет</div>
          Короткое описание
          <input class="popupInput" name="shortDescription" type="text">
          Подробное описание
          <input class="popupInput" name="fullDescription" type="text">
          <div class="btn-box">
              <button class="btn-save btn">Ok</button>
              <button class="btn-cancel btn">Отмена</button>
          </div>
      </form>`;
    } else if (type === 'verificationPopup') {
      this.popup.innerHTML = `        
      <form class="popup" name="verificationPopup">
          <div class="popup-title">Удалить тикет</div>
          Вы уверены, что хотите удалить тикет? Это действие необратимо.            
          <div class="btn-box">
              <button class="btn-delete btn">Ok</button>
              <button class="btn-cancel btn">Отмена</button>
          </div>
      </form>`;
    }

    document.body.appendChild(this.popup);

    this.popup.addEventListener('click', (e) => {
      if (!e.target.classList.contains('popup')
        && !e.target.classList.contains('popupInput')
        && !e.target.classList.contains('btn-save')
        && !e.target.classList.contains('btn-delete')) {
        this.deletePopup();
      }
    });
  }

  deletePopup() {
    this.popup && this.popup.remove();
  }
}
