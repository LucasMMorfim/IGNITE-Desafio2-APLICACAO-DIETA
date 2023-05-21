const btn = document.querySelector('#Save');

btn.addEventListener('click', () => {
  const meal = getDataForm()

  sendDataAPI(meal)
})

function getDataForm() {
  const inputName = document.querySelector('#name')
  const inputDescription = document.querySelector('#description')
  const inputIsDiet = document.querySelector('#optionDietYes')
  const inputNotIsDiet = document.querySelector('#optionDietNo')
  if(inputName.value === null || inputDescription.value === null) {
    console.log('campos vazios')
    return
  }

  let isDietValue;

  if (inputIsDiet.checked) {
    isDietValue = inputIsDiet.value;
  } else if (inputNotIsDiet.checked) {
    isDietValue = inputNotIsDiet.value;
  } else {
    console.log('Nenhuma opção selecionada');
    return;
  }

  const meal = {
    name: inputName.value,
    description: inputDescription.value,
    isDiet: isDietValue,
  }
  return meal
}

async function sendDataAPI (meal) {
try{
  const response = await fetch('http://localhost:3333/meals', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(meal)
  })

  if(response.status === 201) {
    clean()
    window.location.href = '../@frontend/index.html'
  } else {
    console.log('erro to add meal')
  }
} catch(erro){
  console.error(erro)
}
}

function clean(){
  document.querySelector('#name').value = ''
  document.querySelector('#Description').value = ''
  document.querySelector('#optionDietYes').value = ''
  document.querySelector('#optionDietNo').value = ''
}