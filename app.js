let userMail

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      console.log(email);
      userMail = email;
      console.log(userMail);
      document.getElementById("content").style= "display: block;";
      onLoad();
      
      
      // ...
        document.getElementById("btn-login").style = "display: none;"
        document.getElementById("btn-registo").style = "display: none;"
        document.getElementById("btn-logout").style = "display: block;"
        document.getElementById("textInfo").style = "display: none;"
        document.getElementById("email").value = ""
        document.getElementById("password").value = ""

    } else {
      // User is signed out.
      // ...
        document.getElementById("btn-login").style = "display: block;"
        document.getElementById("btn-registo").style = "display: block;"
        document.getElementById("btn-logout").style = "display: none;"
        document.getElementById("textInfo").style = "display: block;"
        document.getElementById("email").value = ""
        document.getElementById("password").value = ""
        document.getElementById("content").style= "display: none;"
    }
  });

// Função chamada no botão de submissão
function addOrEditUser () {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const phone = document.getElementById('phone').value;
    const idToBeEdited = document.getElementById('idToBeEdited').value;


    if(idToBeEdited === '') {
        // Caso não haja id para editar, deve ser adicionado um novo utilizador à base de dados
        db.collection(userMail).doc().set({
            name: name,
            surname: surname,
            phone: phone,
            urlImage: "https://firebasestorage.googleapis.com/v0/b/sgbd-ficha-4.appspot.com/o/users%2Fperson.png?alt=media&token=cdb3b48e-0b27-4548-a24e-fa1d00e5d6b1"
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

    } else {
        // Caso haja um id para editar, deve ser editado esse utilizador com os novos dados do formulário
        db.collection(userMail).doc(idToBeEdited).set({
            name: name,
            surname: surname,
            phone: phone
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

};

// Função usada para apagar o utilizador com o id introduzido
function deleteUser() {
    const idToBeDeleted = document.getElementById('idToBeDeleted').value;
    const listElement = document.getElementById('list');

    db.collection(userMail).doc(idToBeDeleted).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

}

// Função usada para mostrar na consola a lista de utilizadores ordenada
function getOrderedUsers() {
    let users = []
    db.collection(userMail).orderBy("surname", "asc").get().then(snapshot => {
        // Ciclo que percorre cada user para o adicionar à lista
        snapshot.forEach(doc => {
            // Criação de um objeto que armazena os dados de cada documento
            const userObject = doc.data();

            users.push({"ID": doc.id, "Name": userObject.name, "Surname": userObject.surname});

        });
    });
    console.log('Utilizadores ordenados: ', users);
    
};
// Função chamada para correr no loading da página html
function onLoad() {
    // Instância do elemento html com o id 'list'
    const listElement = document.getElementById('list');
    
    // Pedido GET à base de dados que retorna todos os users
    /*db.collection('users').orderBy("surname", "asc").limit(5).get().then(snapshot => {
        // Ciclo que percorre cada user para o adicionar à lista
        snapshot.forEach(doc => {
            // Criação de um objeto que armazena os dados de cada documento
            const userObject = doc.data();

            // Criação da instância de elemento list item (li) para colocar na lista
            const listItem = document.createElement("li");
            // Acrescento da class 'list-group-item' do Bootstrap (apenas estético)
            listItem.setAttribute('class', 'list-group-item');
            listItem.setAttribute('id', doc.id);

            // Texto a ser visualizado na lista
            const listItemText = 'Utilizador com o id ' + doc.id + ': ' + userObject.name +' ' + userObject.surname;

            // Acrescento do texto a apresentar na lista
            listItem.appendChild(document.createTextNode(listItemText));

            // Acrescentar o listItem à lista
            listElement.appendChild(listItem);
        });
    });*/

    db.collection(userMail).onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            const doc = change.doc.data(); 
            if (change.type === "added") {
               /* // Criação da instância de elemento list item (li) para colocar na lista
                const listItem = document.createElement("li");
                // Acrescento da class 'list-group-item' do Bootstrap (apenas estético)
                listItem.setAttribute('class', 'list-group-item');
                listItem.setAttribute('id', change.doc.id);

                // Texto a ser visualizado na lista
                const listItemText = 'Utilizador com o id ' + change.doc.id + ': ' + doc.name +' ' + doc.surname;

                // Acrescento do texto a apresentar na lista
                
                listItem.appendChild(document.createTextNode(listItemText));
                

                // Acrescentar o listItem à lista
                listElement.appendChild(listItem);  */
            
                document.getElementById("list").innerHTML += '<li class="list-group-item" id=' + change.doc.id + '><img src=' + doc.urlImage +' height="42" width="42">' + doc.name + ' ' + doc.surname + ' <a href="tel:'+ doc.phone +'">'+ doc.phone +'</a> (id - ' + change.doc.id + ')</li>';
            }
            if (change.type === "modified") {
                document.getElementById(change.doc.id).innerHTML = '<img src=' + doc.urlImage +' height="42" width="42">' + doc.name + ' ' + doc.surname + ' <a href="tel:'+ doc.phone +'">'+ doc.phone +'</a> (id - ' + change.doc.id + ')';
            }
            if (change.type === "removed") {
                document.getElementById(change.doc.id).remove();
            }
        });
    });

}

function getUsersBySurname() {
    // Instância do elemento html com o id 'list'
    const listElement = document.getElementById('list');
    const surnameQ = document.getElementById('surnameQuery').value;
    
    // Pedido GET à base de dados que retorna todos os users
    listElement.innerHTML = ""
    db.collection(userMail).where("surname", "==", surnameQ).get().then(snapshot => {
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

function logChanges() {
    db.collection(userMail)
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("Novo user ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("User modificado: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("User modificado: ", change.doc.data());
            }
        });
    });
}


// Upload Image

 const upload = document.getElementById('fileButton');

 upload.addEventListener('change', (e) => {
    userID = document.getElementById("userID").value;

     var file = e.target.files[0];

     var ref = storage.ref('users/' + userID + ".jpg");

     var task = ref.put(file);

     task.on('state_changed',
        function progress(snapshot) {
            console.log('indo: ', (snapshot.bytesTranfered / snapshot.totalBytes) * 100 + '%');
            console.log("Test Function");
            
        },
        function error(err){

        },
        
        function complete() {
            console.log('done');
            
        }),

        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            db.collection(userMail).doc(userID).update({
                urlImage: downloadURL
            })
            .then(function() {
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
          });


            

 })

 function deleteFile(){
    var storageRef = storage.ref();
    const userID = document.getElementById("userID").value;
    var desertRef = storageRef.child("users/" + userID + ".jpg");

    // Delete the file
    desertRef.delete().then(function() {
      // File deleted successfully
    }).catch(function(error) {
      // Uh-oh, an error occurred!
    });

    db.collection(userMail).doc(userID).update({
        urlImage: "https://firebasestorage.googleapis.com/v0/b/sgbd-ficha-4.appspot.com/o/users%2Fperson.png?alt=media&token=cdb3b48e-0b27-4548-a24e-fa1d00e5d6b1"
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
 }

 function listFiles(){
    const path = document.getElementById("path").value;
     const storageRef = storage.ref();
    // Create a reference under which you want to list
    var listRef = storageRef.child(path);

    // Find all the prefixes and items.
    listRef.listAll().then(function(res) {
    res.prefixes.forEach(function(folderRef) {
        // All the prefixes under listRef.
        // You may call listAll() recursively on them.
    });
    res.items.forEach(function(itemRef) {
        // All the items under listRef.
        console.log(itemRef.location.path);
        
    });
    }).catch(function(error) {
    // Uh-oh, an error occurred!
    });
 }

 function login(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(error) {
        console.log("Login com sucesso");       
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
 }

 function registo(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if(email != "" && password != ""){
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            
            /* var user = firebase.auth().currentUser;
            user.sendEmailVerification().then(function() {
            // Email sent.
            }).catch(function(error) {
            // An error happened.
                console.log(error);
            
            }); */

            
        });
        
    }
    
 }

 function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        document.getElementById("list").innerHTML="";
      }).catch(function(error) {
        // An error happened.
      });
 }
// Chamada da função onLoad

logChanges();