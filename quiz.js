function if_checked() {
  const form_radios = document.querySelectorAll('.quiz__left-question-form-field')

  function onload_check(radios) {
    radios.forEach(radio => {
      radio.querySelector('input').checked ?
        radio.classList.add('checked') :
        radio.classList.remove('checked')
    })
  }

  onload_check(form_radios)

  form_radios.forEach(e => {
    e.onclick = () => {
      onload_check(form_radios)
    }
  })

}

async function get_answers() {
  let answers;
  await axios.get('./local_base.json')
    .then(r => r.data)
    .then(json => answers = json)

  return answers
}

async function set_answers() {
  const questions_block = document.querySelector('.js-questions-block')
  let template = ''
  const answers = await get_answers()
    .then(r => r.answers)

  answers.forEach(q => {
    if (q.answer_type === 'radio') {
      let labels = ''
      q.answers.forEach(answer => {
        labels += `
          <label class="quiz__left-question-form-field radio">
              <input name="${q.question_id}" type="radio" value="${answer.title}">
              ${answer.title}
              <span></span>
          </label>
        `
      })
      template += `
        <div class="quiz__left-question-box js-question checkbox" data-question="${q.question_id}">
          <div class="quiz__left-question-text">
              ${q.question}
          </div>
          <div class="quiz__left-question-answers">
              <div class="quiz__left-question-form">
                  ${labels}
              </div>
          </div>
      </div>
      `
    }
    else {
      let labels = ''
      q.answers.forEach(answer => {
        labels += `
          <label class="quiz__left-question-form-field checkbox">
              <input name="${q.question_id}" type="checkbox" value="${answer.title}">
              ${answer.title}
              <span></span>
          </label>
        `
      })
      template += `
        <div class="quiz__left-question-box js-question checkbox" data-question="${q.question_id}">
          <div class="quiz__left-question-text">
              ${q.question}
          </div>
          <div class="disclaimer">
              <svg viewBox="0 0 24 24" class="mdi-icon mdi-16px"><title>mdi-check-circle</title><path d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" stroke-width="0" fill-rule="nonzero"></path></svg>
              Можно выбрать несколько вариантов
          </div>
          <div class="quiz__left-question-answers">
              <div class="quiz__left-question-form">
                  ${labels}
              </div>
          </div>
      </div>
      `
    }
  })

  template += `
    <div class="quiz__left-question-progress js-question-counter">
        <div class="quiz__left-question-progress-info">
            <span class="progress-title">Готово:</span>
            <span class="progress-precents">0%</span>
            <span class="progress-animation"></span>
        </div>
        <div class="quiz__left-question-buttons">
            <div class="quiz__left-question-button-back js-prev-question disabled">
                <svg viewBox="0 0 24 24" class="mdi-icon mdi-24px"><title>mdi-arrow-right</title><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" stroke-width="0" fill-rule="nonzero"></path></svg>
            </div>
            <div class="quiz__left-question-button-next js-next-question">Далее
                <svg viewBox="0 0 24 24" class="mdi-icon mdi-24px"><title>mdi-arrow-right</title><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" stroke-width="0" fill-rule="nonzero"></path></svg>
            </div>
        </div>
    </div>
  `

  questions_block.innerHTML = template
  if_checked()
  questions_rout()
  inputs_click()
}

function page_hide_onload() {
  const pages = document.querySelectorAll('.js-page')
  
  pages.forEach(page => {
    if (page.dataset.page === 'promo') {
      page.classList.add('show')
      page.classList.remove('hide')
    }
    else {
      page.classList.remove('show')
      page.classList.add('hide')
    }
  })

}

function page_rout(rout) {
  const pages = document.querySelectorAll('.js-page')
  
  pages.forEach(page => {
    if (page.dataset.page === rout) {
      page.classList.add('show')
      page.classList.remove('hide')
    }
    else {
      page.classList.remove('show')
      page.classList.add('hide')
    }
  })

}

function questions_toggle(question) {
  const questions = document.querySelectorAll('.js-question')
  const question_counter = document.querySelector('.js-question-counter')
  questions.forEach(q => {
    if (q.dataset.question === question) {
      q.classList.add('show')
      q.classList.remove('hide')
    } else {
      q.classList.remove('show')
      q.classList.add('hide')
    }
  })
  question_counter.dataset.currentQuestion = question
  selected_check()
}

function questions_rout() {
  const next_question = document.querySelector('.js-next-question')
  const prev_question = document.querySelector('.js-prev-question')
  const counter = document.querySelector('.js-question-counter')

  function prev_disabled_check() {
    +counter.dataset.currentQuestion === 1 ?
    prev_question.classList.add('disabled') :
    prev_question.classList.remove('disabled')
  }

  next_question.onclick = () => {
    const next_question_number = +counter.dataset.currentQuestion + 1
    questions_toggle(String(next_question_number))
    prev_disabled_check()
  }
  prev_question.onclick = () => {
    const next_question_number = +counter.dataset.currentQuestion - 1
    questions_toggle(String(next_question_number))
    prev_disabled_check()
  }

}

function selected_check() {
  const questions = document.querySelectorAll('.js-question')
  const counter = document.querySelector('.js-question-counter')
  const next_question = document.querySelector('.js-next-question')
  let disabled = false

  questions.forEach(q => {
    if (q.dataset.question === counter.dataset.currentQuestion) {
      const inputs = q.querySelectorAll('input')
      inputs.forEach(i => {
        i.checked ?
          disabled = true :
          ''
      })
    }
  })

  disabled ?
    next_question.classList.remove('disabled') :
    next_question.classList.add('disabled')
}

function inputs_click() {
  const inputs = document.querySelectorAll('.js-questions-block input')
  console.log(inputs)
  inputs.forEach(i => {
    i.onclick = () => {
      selected_check()
    }
  })
}


// routes
const questions_page = document.querySelectorAll('.js-go-questions')
questions_page.forEach(rout => {
  rout.onclick = () => {
    page_rout("questions");
    questions_toggle("1");
    selected_check();
  }
})

// functions init
if_checked()
page_hide_onload()
set_answers()