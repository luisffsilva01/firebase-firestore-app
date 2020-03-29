// Função chamada no botão de submissão
function addNewUser () {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const idToBeEdited = document.getElementById('idToBeEdited').value;

    if(idToBeEdited === '') {
        // Caso não haja id para editar, deve ser adicionado um novo utilizador à base de dados

    } else {
        // Caso haja um id para editar, deve ser editado esse utilizador com os novos dados do formulário

    }

};

// Função usada para apagar o utilizador com o id introduzido
function deleteUser() {
    const idToBeDeleted = document.getElementById('idToBeDeleted').value;

}

// Função usada para mostrar na consola a lista de utilizadores ordenada
function getOrderedUsers() {
    let users = [];
    console.log('Utilizadores ordenados: ', users);
}

// Função chamada para correr no loading da página html
function onLoad() {
    // Instância do elemento html com o id 'list'
    const listElement = document.getElementById('list');
    
    // Pedido GET à base de dados que retorna todos os users
    db.collection('users').get().then(snapshot => {
        // Ciclo que percorre cada user para o adicionar à lista
        snapshot.forEach(doc => {
            // Criação de um objeto que armazena os dados de cada documento
            const userObject = doc.data();

            // Criação da instância de elemento list item (li) para colocar na lista
            const listItem = document.createElement("li");
            // Acrescento da class 'list-group-item' do Bootstrap (apenas estético)
            listItem.setAttribute('class', 'list-group-item');

            // Texto a ser visualizado na lista
            const listItemText = 'Utilizador com o id ' + doc.id + ': ' + userObject.name +' ' + userObject.surname;

            // Acrescento do texto a apresentar na lista
            listItem.appendChild(document.createTextNode(listItemText));

            // Acrescentar o listItem à lista
            listElement.appendChild(listItem);
        });
    });
}

// Chamada da função onLoad
onLoad();