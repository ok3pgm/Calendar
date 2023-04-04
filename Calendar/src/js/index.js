const dom = {
    year: document.getElementById('year'),
    calendar: document.getElementById('calendar'),
}

const year = new Date().getFullYear();
dom.year.innerHTML = year;

function leep_year(year) { //високосный год
    if ((year %4 == 0) && ((year %100 !== 0) || (year %400 == 0))) {
        return 1; // то бишь условие выше определяет true or false and return +1 day (2000,2004,2008,2400,2800...)
    } else {    
        return 0;
    }
}

const months = [
    {
        title: 'Новый год',
        name: 'Январь',
        days: 31
    },
    {
        title: 'Холод',
        name: 'Февраль',
        days: 28 + leep_year(year),
    },
    {
        title: 'Грязь',
        name: 'Март',
        days: 31
    },
    {
        title: 'Шутники',
        name: 'Апрель',
        days: 30
    },
    {
        title: 'День труда',
        name: 'Май',
        days: 31
    },
    {
        title: 'Школьники',
        name: 'Июнь',
        days: 30
    },
    {
        title: 'Жара',
        name: 'Июль',
        days: 31
    },
    {
        title: 'Отпуск',
        name: 'Август',
        days: 31
    },
    {
        title: '3 Сентября',
        name: 'Сентябрь',
        days: 30
    },
    {
        title: 'Дождь',
        name: 'Октябрь',
        days: 31
    },
    {
        title: 'Скидки',
        name: 'Ноябрь',
        days: 30
    },
    {
        title: 'Подарки',
        name: 'Декабрь',
        days: 31
    }
];

const weekDayNames = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];

// в DOM HTML получается общий div month , далее дочерний month__content, далее по порядку дочерние назв дней недели и после числа месяца
function renderMonth(monthIdx, year) {
    const month = months[monthIdx];
    const monthBox = document.createElement('div');
    monthBox.className = 'month'; //родительский элем
    let monthHeadHTML = [];
    monthHeadHTML.push(buildTitleHTML(month.title));
    monthHeadHTML.push(buildNameHTML(month.name));
    let monthContentHTML = ['<div class="month__content">']; 
    monthContentHTML.push(renderWeekDaysNames()); 
    monthContentHTML.push(renderDates(year, monthIdx, month.days)); 
    monthContentHTML.push('</div>'); 
    monthBox.insertAdjacentHTML('afterbegin',monthContentHTML.join(''));
    monthBox.insertAdjacentHTML('afterbegin', monthHeadHTML.join(''));
    dom.calendar.appendChild(monthBox); // привязываем дочерний el к calendar
};

function buildTitleHTML(arg) {
    let TitleHTML = `<div class="month__title">${arg}</div>`;
    return TitleHTML;
}
function buildNameHTML(arg) {
    let NameHTML = `<div class="month__name">${arg}</div>`;
    return NameHTML;
}

//weekend day or not
function renderDate (content, isAccent = false) {
    const cls = isAccent ? "month__date month__date_accent" : "month__date";
    return `<div class="${cls}">${content}</div>`  
}

function renderWeekDaysNames () {
    const weekDayNames = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
    const daysNames = [];
    for (let i = 0; i<=6; i ++) {
        const dayNameTag = `<div class="month__date month__date_accent">${weekDayNames[i]}</div>`; 
        daysNames.push(dayNameTag);
    }
    return daysNames.join('');
};

const monthIdx = 0;
const monthDatesCount = months[monthIdx].days; //забираем кол-во дней в каждом месяце 28-31

function renderDates(year, month, daysCount) { // ф-я чтобы по полученным arg сформировать cell 
    const date = new Date(year, month, 1); // с необх. кол-вом дней в месяце и передать
    const datesHTML = []; 
    const weekDayStart = date.getDay(); //день начала недели 0(вс), 1(пн), 2(вт) и т.д.
    let i = 1; //idx дней недели
    let day = 1;
    while(day<=daysCount) {
        let dateHTML;
        if((i < weekDayStart) || ((weekDayStart == 0) && (i < 7))) { // второе условие после || в случае с ВС(0)
            dateHTML = renderDate(''); //рендерим пустую ячейку по дням недели
            datesHTML.push(dateHTML);// и увеличиваем i,идём дальше от пн до вс
        } else {
            const isHolly = isHoliday(day, month, year, i);
            dateHTML = renderDate(day, isHolly);
            datesHTML.push(dateHTML);
            day++;
        } i++;
    } 
    return datesHTML.join('');
};

const holidays = [
    [1, 0, 2023],[2, 0, 2023],[3, 0, 2023],[4, 0, 2023],[5, 0, 2023],[6, 0, 2023],[7, 0, 2023],
    [23, 1, 2023],[24, 1, 2023],[25, 1, 2023],[26, 1, 2023],[8, 2, 2023],[6, 4, 2023],
    [7, 4, 2023],[8, 4, 2023],[9, 4, 2023],[10, 5, 2023],[11, 5, 2023],[12, 5, 2023],[4, 10, 2023],
    [5, 10, 2023],[6, 10, 2023],
];

function isHoliday (day, month, year, i) {
    let isHollyday = false;
    holidays.forEach((date) =>{
        if((date[0] == day && date[1] == month && date[2] == year) || ((i % 7 ==0) || ((i+1) % 7 ==0))) { // передаём ф-ю дальше и проверяем idx дней недели
            // 7 - ВС, 6 (i+1) СБ, + проверка массива с праздниками
        isHollyday = true; 
        } 
    })
    return isHollyday;
}

function init(year) {
    for(let i = 0; i<=11;i++) { //цикл для выведения 12ти месяцев вызываем ф-ю ниже
    renderMonth(i ,year);
};
};

window.onload = init(year);
