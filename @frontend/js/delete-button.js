const deleteMeal = document.querySelector('#Save')
deleteMeal.addEventListener('click', () => {
  
  const idMeal = getIdForm()

  sendIDAPI(idMeal)
})

function geIdForm() {
  const inputId = document.querySelector('#idMeal')

  const idMeal = {
    Id: inputId.value,
  }
  return idMeal
}



async function sendIDAPI(idMeal) {
  try {
    const response = await fetch('http://localhost:3333/meals/:id', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(idMeal)
    })

    if (response.status === 200) {
      clean()
      window.location.href = '../@frontend/index.html'
    } else {
      console.log('erro to delete meal')
    }
  } catch (erro) {
    console.error(erro)
  }
}

function clean() {
  document.querySelector('#idMeal').value = ''
}
