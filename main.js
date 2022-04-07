const API_URL = "https://api.github.com/search/repositories?sort=stars&order=desc&q=in%3Ain%3Aname%2Cdescription%2Creadme+" // com essa chamada conseguesse pesquisar os repo por nome, descrição ou conteudo do arquivo README. O conteúdo é rankeado pelo numero de estrelas em ordem decrescente.

const main = document.getElementById("main");
const form = document.getElementById("form");
const pesquisa = document.getElementById("pesquisa");

getRepo("tetris")

async function getRepo(termo_pesquisa) {
    const resp = await fetch(API_URL + termo_pesquisa);
    const respJSON = await resp.json();

    respJSON.items.forEach(criarCard);
}

function criarCard(repo) {
    const data_nao_formatada = new Date(repo.updated_at);
    const offsetMs = data_nao_formatada.getTimezoneOffset() * 60 * 1000;
    const data_local = new Date(data_nao_formatada.getTime() - offsetMs);
    const data = data_local.toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ");

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
        <p>${descri_formatada} por ${repo.owner.login}</p>
        <h3>${repo.language}</h3>
        <h4>${repo.stargazers_count} stars ${repo.forks_count} forks</h4>
        <p> editado em: ${data} <\p>
    </div>
  `

  main.innerHTML += cardHTML;
}