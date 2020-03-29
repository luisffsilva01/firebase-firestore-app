// Função chamada no botão de submissão
function submit() {
    
};

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
            const listItemText = 'Utilizador: ' + userObject.name +' ' + userObject.surname;
            console.log(listItemText);

            // Acrescento do texto a apresentar na lista
            listItem.appendChild(document.createTextNode(listItemText));

            // Acrescentar o listItem à lista
            listElement.appendChild(listItem);
        });
    });
}

// Chamada da função onLoad
onLoad();