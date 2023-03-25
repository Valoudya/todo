const $ = (el) => document.querySelector(el)
const All = (el) => document.querySelectorAll(el)
const id = (el) => document.getElementById(el)

let arrayTasks = JSON.parse(localStorage.getItem('tasks')) ?? [],
    editTaskKey = null,
    createdDate = '',
    deathLineDate = [],
    timeStampDate = 0,
    taskStatus = '',
    filterTask = ''


function createTask() {
    createDeathLine('.input-date')
    createDate()
    arrayTasks.push(
        {
            title: $('.input-title').value,
            text: $('.input-text').value,
            status: false,
            date: createdDate,
            deathLineDate: deathLineDate,
            timeStampDate: timeStampDate
        }
    )
    render(arrayTasks)
    $('.modal-create').classList.toggle('hidden')
} // Создать задачу

function defineListener() {
    All('.delete').forEach((item, key) => {
        item.addEventListener('click', (e) => removeTask(+e.target.dataset.id))
    })
    All('.done').forEach((item, key) => {
        item.addEventListener('click', (e) => doneTask(+e.target.dataset.id))
    })
    All('.edit').forEach((item, key) => {
        item.addEventListener('click', (e) => showEditModal(+e.target.dataset.id))
    })
} // Повесить на кнопки слушатель событий

function removeTask(key) {
    arrayTasks.splice(key, 1)
    render(arrayTasks)
} // Удаление задачи

function doneTask(key) {
    if (arrayTasks[key].status == false) {
        arrayTasks[key].status = true
    } else {
        arrayTasks[key].status = false
    }
    render(arrayTasks)
} // Задача выполнена

function showEditModal(key) {
    modalState('.modal-edit')
    $('.input-title-edit').value = arrayTasks[key].title
    $('.input-text-edit').value = arrayTasks[key].text
    editTaskKey = key
}

function modalState(className) {
    $(className).classList.toggle('hidden')
}

function createDate() {
    let newDate = new Date().toString().split(' '),
        transformedDate = []
    transformedDate.push(newDate[2], newDate[1], newDate[3], newDate[4])
    createdDate = transformedDate.join(' ').toString()
}

function createDeathLine(className) {
    deathLineDate = []
    timeStampDate = Date.parse(new Date($(className).value)) ?? arrayTasks(key)
    let deathLine = $(className).value.split('-')
    deathLineDate.push(deathLine[2], deathLine[1], deathLine[0])
    deathLineDate = deathLineDate.join('.').toString()
}

function editTask(key) {
    createDeathLine('.input-date-edit')
    arrayTasks.splice(key, 1, {
        title: $('.input-title-edit').value,
        text: $('.input-text-edit').value,
        date: arrayTasks[key].date,
        deathLineDate: deathLineDate ?? arrayTasks[key].deathLineDate,
        timeStampDate: timeStampDate,
        status: false
    })
    modalState('.modal-edit')
    render(arrayTasks)
} // Редактирование задачи

render(JSON.parse(localStorage.getItem('tasks')))

function render(array) {
    if (!array || array.length == 0) {
        $('.workspace__content').innerHTML = `<div class="workspace__content__noTask">
                                                        <p>Нет ни одной задачи</p>
                                                 </div>`
    } else {
        filter(array)
        $('.workspace__content').innerHTML = ''
        for (let i = 0; i < array.length; i++) {
            let taskTitle = array[i].title,
                taskText = array[i].text,
                taskDate = array[i].date,
                taskDeathLine = array[i].deathLineDate
            statusTask(i)
            $('.workspace__content').innerHTML += `
        <div class="workspace__content__tasks">
            <div class="workspace__content__tasks__title">${taskTitle}</div>
            <div class="workspace__content__tasks__task">
                <div class="workspace__content__tasks__task__text">
                    ${taskText}
                </div>
                <div class="workspace__content__tasks__task__status">
                    Статус задачи: ${taskStatus}
                </div>
                <div class="workspace__content__tasks__task__deathLine">
                    Дата выполнения: ${taskDeathLine}
                </div>
                <div class="workspace__content__tasks__task__activity">
                    <div class="workspace__content__tasks__task__activity__date">
                        ${taskDate}</div>
                    <div class="buttons">
                        <img src="img/check-mark(1).png" class="done" data-id="${i}" alt="">
                        <img src="img/edit.png" class="edit" data-id="${i}" alt="">
                        <img src="img/delete(1).png" class="delete" data-id="${i}" alt="">
                    </div>
                </div>
            </div>
        </div>`
        }
        localStorage.setItem('tasks', JSON.stringify(arrayTasks))
        defineListener()
    }
} // Рендер страницы

function statusTask(i) {
    let nowTime = Date.now()
    if (arrayTasks[i].status == false) {
        if (nowTime > arrayTasks[i].timeStampDate) {
            taskStatus = 'Просрочено'
        } else {
            taskStatus = 'Не выполнено'
        }
    } else if (arrayTasks[i].status == true) {
        taskStatus = 'Выполнено'
    }
    localStorage.setItem('tasks', JSON.stringify(arrayTasks))
}

function arraySort(fieId) {
    return (a, b) => a[fieId] > b[fieId] ? 1 : -1
}

function filter(array) {
    if (filterTask == 'filterDone') {
        array = array.sort(arraySort('status'))
    } else if (filterTask == 'filterTime') {
        array = array.sort(arraySort('deathLineDate'))
    }
}

$('.settings-date').addEventListener('click', () => {
    filterTask = 'filterTime'
    render(arrayTasks)
})
$('.settings-done').addEventListener('click', () => {
    filterTask = 'filterDone'
    render(arrayTasks)
})
$('.taskEdit').addEventListener('click', () => editTask(editTaskKey))
$('.createTask').addEventListener('click', () => {
    createTask()
}) // Создать новую задачу
$('.newTask').addEventListener('click', () => {
    $('.modal-create').classList.toggle('hidden')
}) // Открыть окно создания задачи
$('.modal-create').addEventListener('click', () => {
    $('.modal-create').classList.toggle('hidden')
})
$('.modal-create__task-create').addEventListener('click', event => {
    event.stopPropagation()
})
$('.modal-edit').addEventListener('click', () => {
    $('.modal-edit').classList.toggle('hidden')
})
$('.modal-edit__task-edit').addEventListener('click', event => {
    event.stopPropagation()
})