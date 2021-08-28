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



// functions
if_checked()
get_answers()
  .then(r => console.log(r))