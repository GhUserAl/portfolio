const mudaAno = () => {
    const ano = document.getElementById("periodos").value;
    setData(ano);
};

const setData = (ano = "") => {

    const pop_id = "6579";
    const pib_id = "21";
    const baseURL = `https://servicodados.ibge.gov.br/api/v3/agregados/`;

    let URL = `${baseURL}${localStorage.tipoConsulta === "populacao" ? pop_id : pib_id}/periodos`;
    if (document.getElementById("periodos").childElementCount === 0) {
        fetch(URL)
            .then(response => response.json())
            .then(data => {
                let periodos = data.map(periodo => periodo.id);
                for (let ano of periodos) {
                    let option = document.createElement("option");
                    option.value = ano;
                    option.text = ano;
                    document.getElementById("periodos").appendChild(option);
                }
            }).catch(error => console.error(error));
    }
    if (ano == "") {
        ano = localStorage.tipoConsulta === "populacao" ? "2021" : "2012";
    }

    const idByName = new Map([["Rondônia", "11"],
    ["Acre", "12"],
    ["Amazonas", "13"],
    ["Roraima", "14"],
    ["Pará", "15"],
    ["Amapá", "16"],
    ["Tocantins", "17"],
    ["Maranhão", "21"],
    ["Piauí", "22"],
    ["Ceará", "23"],
    ["Rio Grande do Norte", "24"],
    ["Paraíba", "25"],
    ["Pernambuco", "26"],
    ["Alagoas", "27"],
    ["Sergipe", "28"],
    ["Bahia", "29"],
    ["Minas Gerais", "31"],
    ["Espírito Santo", "32"],
    ["Rio de Janeiro", "33"],
    ["São Paulo", "35"],
    ["Paraná", "41"],
    ["Santa Catarina", "42"],
    ["Rio Grande do Sul", "43"],
    ["Mato Grosso do Sul", "50"],
    ["Mato Grosso", "51"],
    ["Goiás", "52"],
    ["Distrito Federal", "53"]]);

    const populacaoPath = `${pop_id}/periodos/${ano}/variaveis/9324?localidades=`;
    const pibPath = `${pib_id}/periodos/${ano}/variaveis/37?localidades=`;

    URL = baseURL + (localStorage.tipoConsulta === "populacao" ? populacaoPath : pibPath);

    if (localStorage.estado_a != localStorage.estado_b) {

        URL += "N3[" + idByName.get(localStorage.estado_a) + "]|N3[" + idByName.get(localStorage.estado_b) + "]";
    }
    else {
        URL += "N3[" + idByName.get(localStorage.estado_a) + "]";
    }

    const consulta = localStorage.tipoConsulta === "populacao" ? "População" : "PIB";

    document.getElementById("titulo").innerHTML = consulta;

    let resultados = [];
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            series = data[0].resultados[0].series;
            for (let i = 0; i < series.length; i++) {
                resultados.push({ "dado": series[i].serie[ano], "ano": ano, "estado": series[i].localidade["nome"] });
            }
            document.getElementById("dados").innerHTML = "";
            for (let res of resultados) {

                const x = `
                            <div class="col-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">${res.estado}</h5>
                                        <h6 class="card-subtitle mb-2 text-muted">${res.ano}</h6>

                                        <div>${consulta}: ${parseInt(res.dado, 10).toLocaleString("pt-BR")}</div>

                                    </div>
                                </div>
                            </div>
                        `

                document.getElementById("dados").innerHTML += x;

            }
            if (resultados.length > 1) {
                document.getElementById("diferenca").innerHTML = `Diferença: ${parseInt(resultados[0].dado - resultados[1].dado, 10).toLocaleString("pt-BR")}`;
            }
        })
        .catch(error => console.error(error));

};