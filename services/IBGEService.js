class IBGEService{
    async getEstados(callback){
        return await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => response.json())
            .then(json => {
                // console.log(json)
                const estados = []
                json.forEach((estado) => {
                    // console.log(estado.nome)
                    // estados.push(estado.nome)
                    estados.push({
                        label: estado.nome,
                        value: estado.id
                    })
                });
                // console.log(estados)
                callback(estados)
            }
        )
        .catch(error => {
            console.error("ERRO AO BUSCAR ESTADOS:"+ error);
        });
    }

    async getCidadesPorEstado(uf, callback){
        return await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`)
            .then(response => response.json())
            .then(json => {
                // console.log(json)
                const cidades = []
                json.forEach((cidade) => {
                    // console.log(estado.nome)
                    // estados.push(estado.nome)
                    cidades.push({
                        label: cidade.nome,
                        value: cidade.id
                    })
                });
                // console.log(estados)
                callback(cidades)
            }
        )
        .catch(error => {
            console.error("ERRO AO BUSCAR CIDADES:"+ error);
        });
    }

    async getEstadoPorId(id, callback){
        return await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}`)
            .then(response => response.json())
            .then(json => {
                // console.log(json.nome)
                callback(json.nome)
            }
        )
        .catch(error => {
            console.error("ERRO AO BUSCAR ESTADO:"+ error);
        });
    }

    async getCidadePorId(id, callback){
        return await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/distritos/${id}`)
            .then(response => response.json())
            .then(json => {
                // console.log(json.nome)
                callback(json[0].nome)
            }
        )
        .catch(error => {
            console.error("ERRO AO BUSCAR CIDADE:"+ error);
        });
    }
}

export default IBGEService