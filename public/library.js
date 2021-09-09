const PORT = 80;
const HOST = '54.144.218.140';

const library ={
    state : {
        artworks :'',
    },
    domElements:{
        ulArtworks:document.querySelector('.library__artworksList'),
        logMessage : document.querySelector('.logMessage')
    },
    getArtworks: ()=> {
        fetch(`http://${HOST}:${PORT}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
            body: JSON.stringify({
                query: `
                   query getArtworks {
                       getArtworks {
                           name
                           author
                           pixels
                           linenumber
                           pixelnumber
                       }
                   }
              `,
                variables: {
                    now: new Date().toISOString(),
                },
            }),
        }).then((res) => res.json())
            .then(response => {
                if(response.errors){
                    localStorage.clear();
                    window.location.href='/';
                } else {
                    library.state.artworks = response.data.getArtworks;
                    library.printArtworks();
                }
            });
    },
    printArtworks: ()=> {
        for(let artwork of library.state.artworks){
        // on construit chacun des element avec un 'li'
            const li = document.createElement('li');
            li.classList.add('library__li');

            //on construit le lien correspondant à l'artwork choisi
            const a = document.createElement('a');
            a.innerText = artwork.name;
            a.addEventListener('click', ()=>{
                const selectedArtwork = library.state.artworks.find(artwork => artwork.name === a.innerText);

                localStorage.setItem("selectedArtwork", JSON.stringify(selectedArtwork));
                window.location.href='/';

            });
            // on construit le bouton delete
            const deleteArt = document.createElement('button');
            deleteArt.innerText = 'delete';
            deleteArt.id=artwork.name;
            deleteArt.classList.add('secondaryButton');
            deleteArt.onclick =(event)=>{
                library.deleteArtwork(event.target.id);
            };
            // on injecte le lien de l'artwork et le bouton delete dans le 'li'
            li.appendChild(a);   
            li.appendChild(deleteArt); 

            // on injecte chaque eleùment de liste 'li' dans le conteneur de liste 'ul'
            library.domElements.ulArtworks.appendChild(li);
        }
    },
    logStatus :()=> {
        console.log('ok status');
        if(localStorage.token){
            library.domElements.logMessage.textContent= `${localStorage.author}  logged in`;
        } 
    },
    deleteArtwork: (name)=>{
        fetch(`http://${HOST}:${PORT}/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token
            },
            body: JSON.stringify({
                query: `
             mutation deleteArtwork($name:String!){
                 deleteArtwork(name:$name) {
                     name
                     author
                     pixels
                 }
             }
        `,
                variables: {
                    now: new Date().toISOString(),
                    name : name,
                },
            }),
        })
            .then((res) => res.json())
            .then(window.location.href='/');
    }
};

library.logStatus();
library.getArtworks();

