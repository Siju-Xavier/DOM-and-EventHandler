
const userGrid = document.getElementById('userGrid');
const viewToggleBtn = document.getElementById('viewToggleBtn');
const deleteIdInput = document.getElementById('deleteIdInput');
const deleteBtn = document.getElementById('deleteBtn');
const sortByGroupBtn = document.getElementById('sortByGroupBtn');
const sortByIdBtn = document.getElementById('sortByIdBtn');

let users = [];
const API_URL = 'https://69a25972be843d692bd14129.mockapi.io/users_api'; 

function render(usersArray) {
  if (!usersArray || usersArray.length === 0) {
    userGrid.innerHTML = 'No users loaded.';
    return;
  }
  let html = '';
  usersArray.forEach(user => {
    html += `
      <article class="user-card">
        <h3>${user.first_name ?? ''}</h3>
        <p>first_name: ${user.first_name ?? ''}</p>
        <p>user_group: ${user.user_group ?? ''}</p>
        <p>id: ${user.id ?? ''}</p>
      </article>
    `;
  });
  userGrid.innerHTML = html;
}

async function retrieveData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error!status: ${response.status}`);
    users = await response.json();
    console.log('Users loaded:', users);
    render(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    userGrid.innerHTML = 'Error loading users. Check console.';
  }
}
retrieveData();

viewToggleBtn.addEventListener('click', () => {
  if (userGrid.classList.contains('grid-view')) {
    userGrid.classList.remove('grid-view');
    userGrid.classList.add('list-view');
  } else {
    userGrid.classList.remove('list-view');
    userGrid.classList.add('grid-view');
  }
});

sortByGroupBtn.addEventListener('click', () => {
  const sorted = [...users].sort((a, b) => (a.user_group || 0) - (b.user_group || 0));
  render(sorted);
});


sortByIdBtn.addEventListener('click', () => {
  const sorted = [...users].sort((a, b) => Number(a.id) - Number(b.id));
  render(sorted);
});

deleteBtn.addEventListener('click', async () => {
  const idToDelete = deleteIdInput.value.trim();
  if (!idToDelete) {
    console.error('No ID entered.');
    return;
  }
  try {
    const response = await fetch(`${API_URL}/${idToDelete}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Delete failed with status: ${response.status}`);
    users = users.filter(user => String(user.id) !== idToDelete);
    render(users);
    deleteIdInput.value = '';
    console.log(`User with ID ${idToDelete} deleted.`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
});