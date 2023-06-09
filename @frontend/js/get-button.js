const listall = document.querySelector('#listall');
listall.addEventListener('click', fetchMeals);

async function fetchMeals() {
  const response = await fetch('http://localhost:3333/meals', {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
  });

  const data = await response.json();

  if (response.ok) {
    const meals = data.meals;

    const tableBody = document.querySelector('#meal-table tbody');

    meals.forEach(meal => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${meal.id}</td>
        <td>${meal.name}</td>
        <td>${meal.description}</td>
        <td>${meal.isDiet}</td>
        <td>${meal.created_at}</td>
        <td>${meal.updated_at}</td>
      `;
      tableBody.appendChild(row);
    });
  } else {
    console.error(data.error);
  }
}









// const listall = document.querySelector('#listAll')
// const listmeals = document.querySelector('#listmeals')

// listall.addEventListener('click', async () => {
//   const data = await getDataAPI()

//   for (const meal of data.meals) {
//     listmeals.innerHTML += `<h1>${meal.name}</h1>`
//   }
// })

// async function getDataAPI() {
//   try {
//     const response = await fetch('http://localhost:3333/meals', {
//       method: 'GET', //Nao precisaria
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json'
//       },
//       credentials: 'same-origin'
//     })

//     return response.json()
//   } catch (erro) {
//     console.error(erro)
//   }
// }
