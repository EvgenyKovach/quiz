function close_quiz() {
  const quiz = document.querySelector('.js-quiz')
  quiz.classList.remove('show')
}

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
  let answers  = await fetch(request_get)
    .then(r => r.json())
  return answers
}

async function set_answers() {
  const questions_block = document.querySelector('.js-questions-block')
  const discount_form = document.querySelectorAll('.js-discount-form')
  let template = ''
  const request = await get_answers()
    .then(r => r)

  let count = 0

  request.quiz.forEach(q => {
    count++;
    if (q.answer_type === 'radio') {
      let labels = ''
      q.answers.forEach(answer => {
        labels += `
          <label class="quiz__left-question-form-field radio">
              <input name="${q.question_id}" 
                      type="radio" 
                      value="${answer.title}" 
                      data-order="${count}"
                      data-question="${q.question}"
              >
              ${answer.title}
              <span></span>
          </label>
        `
      })
      template += `
        <div 
            class="quiz__left-question-box js-question hide" 
            data-question="${q.question_id}"
        >
          <div 
            class="quiz__left-question-text"
          >
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
              <input 
                name="${q.question_id}" 
                type="checkbox"
                value="${answer.title}" 
                data-question="${q.question}"
              >
              ${answer.title}
              <span></span>
          </label>
        `
      })
      template += `
        <div 
          class="quiz__left-question-box js-question hide checkbox" 
          data-question="${q.question_id}"
          >
          <div 
            class="quiz__left-question-text"
            data-order="${count}"
          >
              ${q.question}
          </div>
          <div class="disclaimer">
              <svg viewBox="0 0 24 24" class="mdi-icon mdi-16px"><title>mdi-check-circle</title><path d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" stroke-width="0" fill-rule="nonzero"></path></svg>
              Можно выбрать несколько вариантов
          </div>
          <div class="quiz__left-question-answers">
              <div 
                class="quiz__left-question-form form_checkboxes" 
                data-question="${q.question}" 
                data-question-text="${q.question}"
                data-order="${count}"
              >
                  ${labels}
              </div>
          </div>
      </div>
      `
    }
  })

  template += `
    <div class="quiz__left-question-progress js-question-counter" data-questions-length="${request.quiz.length}" data-discount="${request.discount}">
        <div class="quiz__left-question-progress-info">
            <span class="progress-title">Готово:</span>
            <span class="progress-precents">0%</span>
            <span class="progress-bar"></span>
        </div>
        <div class="quiz__left-question-buttons">
            <div class="quiz__left-question-button-back js-prev-question disabled">
                <svg viewBox="0 0 24 24" class="mdi-icon mdi-24px"><title>mdi-arrow-right</title><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" stroke-width="0" fill-rule="nonzero"></path></svg>
            </div>
            <div class="quiz__left-question-button-next js-next-question">Далее
                <svg viewBox="0 0 24 24" class="mdi-icon mdi-24px"><title>mdi-arrow-right</title><path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" stroke-width="0" fill-rule="nonzero"></path></svg>
            </div>
            <div class="quiz__left-question-button-next js-last-question" style="display: none">Завершить
            </div>
        </div>
    </div>
  `
  discount_form.forEach(d => {
    d.innerHTML = request.discount
  })

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
  const precents_counter = document.querySelector('.progress-precents')
  const progress_bar = document.querySelector('.progress-bar')
  const discount = document.querySelector('.discount-precent')
  questions.forEach(q => {
    if (q.dataset.question === question && question) {
      q.classList.add('show')
      q.classList.remove('hide')
    } else {
      q.classList.remove('show')
      q.classList.add('hide')
    }
  })

  const current_procents = 100 / (+question_counter.dataset.questionsLength) * (+question - 1)

  discount.innerHTML = (+question_counter.dataset.discount / (+question_counter.dataset.questionsLength) * (+question - 1)).toFixed(1)
  precents_counter.innerHTML = current_procents.toFixed(1) + '%'
  progress_bar.style.width = "calc(" + current_procents + "% - 20px)"
  question_counter.dataset.currentQuestion = question
  selected_check()
}

function questions_rout() {
  const next_question = document.querySelector('.js-next-question')
  const prev_question = document.querySelector('.js-prev-question')
  const last_question = document.querySelector('.js-last-question')
  const counter = document.querySelector('.js-question-counter')

  function disabled_check() {
    +counter.dataset.currentQuestion === 1 ?
      prev_question.classList.add('disabled') :
      prev_question.classList.remove('disabled')

    if (counter.dataset.currentQuestion === counter.dataset.questionsLength) {
      next_question.style.display = "none"
      last_question.style.display = "flex"
    }
    else {
      next_question.style.display = "flex"
      last_question.style.display = "none"
    }
  }


  last_question.onclick = () => {
    page_rout("form")
  }
  next_question.onclick = () => {
    const next_question_number = +counter.dataset.currentQuestion + 1
    questions_toggle(String(next_question_number))
    disabled_check()
  }
  prev_question.onclick = () => {
    const next_question_number = +counter.dataset.currentQuestion - 1
    questions_toggle(String(next_question_number))
    disabled_check()
  }

}

const request_get = './local_base.json'
const request_post = './answer-quiz.json'

function selected_check() {
  const questions = document.querySelectorAll('.js-question')
  const counter = document.querySelector('.js-question-counter')
  const next_question = document.querySelector('.js-next-question')
  const last_question = document.querySelector('.js-last-question')
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
  disabled ?
    last_question.classList.remove('disabled') :
    last_question.classList.add('disabled')
}

function inputs_click() {
  const inputs = document.querySelectorAll('.js-questions-block input')
  const next_question = document.querySelector('.js-next-question')
  const last_question = document.querySelector('.js-last-question')
  const counter = document.querySelector('.js-question-counter')

  inputs.forEach(i => {
    if (i.type === 'radio') {
      i.onclick = () => {
        setTimeout(() => {
          selected_check()
          counter.dataset.questionsLength == counter.dataset.currentQuestion ?
            last_question.click() :
            next_question.click()
        }, 250)
      }
    }
    else {
      i.onclick = () => {
        setTimeout(() => {
          selected_check()
        }, 250)
      }
    }
  })
}

function maskPhone(selector, masked = '+7 (___) ___-__-__') {
	const elems = document.querySelectorAll(selector);

	function mask(event) {
		const keyCode = event.keyCode;
		const template = masked,
			def = template.replace(/\D/g, ""),
			val = this.value.replace(/\D/g, "");

		let i = 0,
			newValue = template.replace(/[_\d]/g, function (a) {
				return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
			});
		i = newValue.indexOf("_");
		if (i !== -1) {
			newValue = newValue.slice(0, i);
		}
		let reg = template.substr(0, this.value.length).replace(/_+/g,
			function (a) {
				return "\\d{1," + a.length + "}";
			}).replace(/[+()]/g, "\\$&");
		reg = new RegExp("^" + reg + "$");
		if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
			this.value = newValue;
		}
		if (event.type === "blur" && this.value.length < 5) {
			this.value = "";
		}

	}

	for (const elem of elems) {
		elem.addEventListener("input", mask);
		elem.addEventListener("focus", mask);
		elem.addEventListener("blur", mask);
	}

}

function quiz_form_errors() {
  const fields = document.querySelectorAll('.quiz-form__field.form-element')

  fields.forEach(field => {
    field.onclick = () => {
      field.classList.remove('error')
    }
  })

}

function serialize_form() {
  let form_data = new FormData()
  let not_ordered_comment = {}
  let form_comment = ''
  let form_name = ''
  let form_phone = ''

  const radios = document.querySelectorAll(".quiz input[type='radio']")
  const checkboxes = document.querySelectorAll(".js-question .form_checkboxes")
  const name = document.querySelector('.quiz-form__name-input')
  const phone = document.querySelector('.quiz-form__phone-input')
  radios.forEach(r => {
    r.checked ?
      not_ordered_comment[r.dataset.order] = r.dataset.question + '\r\n' + r.value :
      ''
  })
  checkboxes.forEach(c => {
    not_ordered_comment[c.dataset.order] = c.dataset.questionText
    c.querySelectorAll('input').forEach(i => {
       if (i.checked) {
         not_ordered_comment[c.dataset.order] += '\r\n'
        not_ordered_comment[c.dataset.order] += i.value
       }
    })
  })

  for (let order in not_ordered_comment) {
    form_comment += not_ordered_comment[order]
    form_comment += '\r\n--\r\n'
  }

  form_name = name.value
  form_phone = phone.value

  form_data.append('name', form_name)
  form_data.append('phone', form_phone)
  form_data.append('comment', form_comment)

  return form_data
}

async function send_form() {
  const request = await fetch(request_post, serialize_form())
    .then(response => response.json())
    .then(r => {
      if (r.status === 'ok') {
        page_rout('success')
        r.message !== '' ?
          document.querySelector('.js-success-text').innerHTML = r.message :
          ''
      }
      else if (r.status === 'error') {
        const fields_name = document.querySelector('.quiz-form__field.form-element.name')
        const fields_phone = document.querySelector('.quiz-form__field.form-element.phone')
        for (let message in r.message) {
          message === 'name' ? fields_name.classList.add('error') : ''
          message === 'phone' ? fields_phone.classList.add('error') : ''
        }
      }
    })
}

const form_submit = document.querySelector('.js-form_submit')

form_submit.onclick = () => {
  const name = document.querySelector('.quiz-form__name-input');
  const phone = document.querySelector('.quiz-form__phone-input');
  const fields_name = document.querySelector('.quiz-form__field.form-element.name');
  const fields_phone = document.querySelector('.quiz-form__field.form-element.phone');

  name.value === '' ? fields_name.classList.add('error') : '';
  phone.value === '' ? fields_phone.classList.add('error') : '';
  name.value && phone.value ? send_form() : '';
}

function form_private_disable() {
  const checkbox = document.querySelector('.js-private-checkbox')
  const submit = document.querySelector('.js-form_submit')

  function check () {
    !checkbox.checked ?
      submit.classList.add('disabled') :
      submit.classList.remove('disabled')
  }

  check()

  checkbox.onchange = () => {
    check()
  }
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
window.onload = function() {
  if_checked()
  page_hide_onload()
  set_answers()
  maskPhone('.js-phone-mask')
  quiz_form_errors()
  form_private_disable()

  const quiz = document.querySelector('.js-quiz')
  const close_quiz_click = document.querySelectorAll('.js-close-quiz')
  setTimeout(() => {
    quiz.classList.add('show')
  }, 5000)

  close_quiz_click.forEach(c => {
    c.onclick = () => {
      close_quiz()
    }
  })
}