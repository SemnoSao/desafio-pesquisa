const API_URL = "https://api.github.com/search/repositories?sort=stars&order=desc&q=in%3Ain%3Aname%2Cdescription%2Creadme+" // com essa chamada conseguesse pesquisar os repo por nome, descrição ou conteudo do arquivo README. O conteúdo é rankeado pelo numero de estrelas em ordem decrescente.

const main = document.getElementById("main");
const form = document.getElementById("form");
const pesquisa = document.getElementById("pesquisa");

getRepo("Grimorio+TRPG")

async function getRepo(termo_pesquisa) {
    const resp = await fetch(API_URL + termo_pesquisa);
    const respJSON = await resp.json();

    criarCard(respJSON.items[0]);
}

function criarCard(repo) {
    const cardHTML = `
    <div class="card">
        <h2>${repo.full_name}</h2>
        <p>${repo.description}</p>
        <h3>${repo.language}</h3>
        <h4>${repo.stargazers_count} stars ${repo.forks_count} forks</h4>
        <p> editado em: ${repo.updated_at} <\p>
    </div>
  `

  main.innerHTML += cardHTML;
}