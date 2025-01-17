var counter = 1;
var elem = document.getElementById("h1-1");
function inc() {
    counter++; // Увеличиваем значение счетчика
    upd(); // Обновляем отображение счетчика
    elem.style.color = "black"; // Меняем цвет текста на черный
}

function upd() {
    var counterElement = document.getElementById("counter");
    counterElement.textContent = counter; // Обновляем текст счетчика
}

function inc2() {
    var elem = document.getElementById("h1-1");
    let randomValue = Math.floor(Math.random() * 17) + 1; // Генерация случайного числа от 1 до 30
    // Проверяем, если случайное число меньше или равно счетчику
    if (randomValue <= counter) {
        elem.style.color = "green"; // Меняем цвет текста на зеленый
    } else {
        elem.style.color = "red"; // Меняем цвет текста на красный
    }
    counter = 1; // Сбрасываем значение счетчика
    upd(); // Обновляем отображение счетчика
}
