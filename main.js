const API_URL_README = "https://api.github.com/search/repositories?sort=stars&order=desc&q=in%3Ain%3Aname%2Cdescription%2Creadme+" // com essa chamada consegue-se pesquisar os repo por nome, descrição ou conteudo do arquivo README. O conteúdo é rankeado pelo numero de estrelas em ordem decrescente.
const API_URL_NOREADME = "https://api.github.com/search/repositories?sort=stars&order=desc&q=in%3Ain%3Aname%2Cdescription+"        // idem porém sem a pesquisa no arquivo readme.

const main = document.getElementById("main");
const form = document.getElementById("form");
const pesquisa = document.getElementById("pesquisa");
const inclui_README = document.getElementById("inclui_README");

var pag_atual = 1;

async function getRepo(termo_pesquisa) {
    main.innerHTML = ""; // limpa o corpo para inserção de uma nova pesquisa
    var API_URL = API_URL_NOREADME;

    if(inclui_README.checked == true) API_URL = API_URL_README;

    const resp = await fetch(API_URL + termo_pesquisa + "&page=" + pag_atual);
    const respJSON = await resp.json();

    respJSON.items.forEach(criarCard);
}

function prox_pag(){
    pag_atual++;
}

function volt_pag(){
    pag_atual--;
}

function criarCard(repo) {
    // formata a data em YYYY-MM-DD HH:MM:SS para o horário local
    const data_nao_formatada = new Date(repo.updated_at);
    const offsetMs = data_nao_formatada.getTimezoneOffset() * 60 * 1000;
    const data_local = new Date(data_nao_formatada.getTime() - offsetMs);
    const data = data_local.toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ");

    // valida a descrição e atribui uma quantidade máxima de caracteres
    var descri_formatada = new String(repo.description).replace(/(\r\n|\n|\r)/gm, " ");
    if (descri_formatada.valueOf() != new String("null").valueOf()){
        if (descri_formatada.length > 280){
            descri_formatada = descri_formatada.substring(0, 280).concat("[...]");
        }
    }
    else descri_formatada = "";

    const cardHTML = `
    <div class="card">
        <h2><a href="${repo.html_url}" target="_blank" >${repo.name}</a></h2>
        <p>${descri_formatada} por <a href="${repo.owner.html_url}" target="_blank">${repo.owner.login}</a></p>
        <h3>${repo.language}</h3>
        <h4>${repo.stargazers_count} stars ${repo.forks_count} forks</h4>
        <p> editado em: ${data} <\p>
    </div>
  `

  main.innerHTML += cardHTML;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    pag_atual = 1;
    const termo_pesquisa = encodeURIComponent(pesquisa.value);
    if(termo_pesquisa){
        getRepo(termo_pesquisa);
        pesquisa.value = "";
    }
    Array.from(document.querySelectorAll('.escondido')).forEach((el) => el.classList.remove('escondido'));
})