function createForm() {

  var index = $("#mainDiv div.container").length + 1;
  var corpoDiv = `
        <div id="div${index}" class="container" data-info="${index}" >
            <div class="row mt-3">
                <div class="col">
                    <label for="produto">Produto</label>
                    <div class="input-group">
                        <input type="text" id="produto" class="form-control">
                        <button id="prodButton" class="btn btn-primary" type="button">+</button>
                    </div>
                </div>
                <div class="col">
                    <label for="natureza">Natureza Orçamentária</label>
                    <input type="text" id="natureza" class="form-control">
                </div>
            </div>
            <div id="divRow" class="row mt-3">
                <div class="col">
                    <label for="unidade">Unidade</label>
                    <input type="text" id="unidade" class="form-control">
                </div>
                <div class="col">
                    <label for="quantidade">Quantidade</label>
                    <input type="text" id="quantidade" class="form-control">
                </div>
                <div class="col">
                    <label for="precoUnitario">Preço Unitário</label>
                    <input type="text" id="precoUnitario" class="form-control precoUnitario">
                </div>
                <div class="col">
                    <label for="preco_total">Preço Total</label>
                    <input type="text" id="precoTotal" class="form-control precoTotal">
                </div>
                <div class="col">
                    <label for="classificacao">Classificação Contábil</label>
                    <input type="text" id="classificacao" class="form-control">
                </div>
                <div class="col">
                    <label for="rateio"></label>
                    <div>
                        <button id="ratButton" class="btn btn-primary" type="button" data-info>Rateio</button>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col">
                    <label for="centroCusto">Centro de Custo</label>
                    <div class="input-group">
                        <input type="text" id="centroCusto" class="form-control" data-info="">
                        <button id="custoButton" class="btn btn-primary" type="button">+</button>
                    </div>
                </div>
                <div class="col">
                    <label for="grupo_servico">Grupo de Serviço</label>
                    <div class="input-group">
                        <input type="text" id="grupoServico" class="form-control" data-info="">
                        <button id="grupoProdButton" class="btn btn-primary" type="button">+</button>
                    </div>
                </div>
                <div class="col">
                    <label for="grupo_orcamentario">Grupo Orçamentário</label>
                    <div class="input-group">
                        <input type="text" id="grupoOrcamentario" class="form-control" data-info="">
                        <button id="grupoOrcButton" class="btn btn-primary" type="button">+</button>
                    </div>
                </div>
            </div>
        </div>
        <hr>`;

  $("#mainDiv").append(corpoDiv);
  maskCreate()
  return $(`#mainDiv #div${index}`);
};
function createModals(title, body) {
  modal = new bootstrap.Modal($("#mainModal"));
  $("#modalTitle").html(title);
  $("#modalBody").html(body);
  save = $("#modalSave")
    .off("click")
    .on("click", function () {
      modal.toggle();
    });
  modal.toggle();
  return modal;
};
function openModal(arrayInput, inputFieldSelector) {
  body = `<table class="table">
    <thead>
      <tr>
        <th scope="col">id</th>
        <th scope="col">Centro</th>
      </tr>
    </thead>
    <tbody>`
  // let selectedArray = arrayInput
  arrayInput.forEach((id) => {
    body += `
      <tr data-info='{"name": "${id.valor}", "id": ${id.id}}'>
        <th scope="row">${id.id}</th>
        <td>${id.valor}</td>
      </tr>`;
  })
  body += `</tbody></table>`;
  let title = $(this).closest("div.col").find("label").html();

  createModals(title, body)

  var selectedItem = null;
  $("#mainModal").find(".table   tbody tr").on("click", function () {
    $("#mainModal").find(".table tbody tr").removeClass("table-active");
    $(this).addClass("table-active");
    selectedItem = JSON.parse($(this).attr("data-info"));
  });

  $("#mainModal").find("#modalSave").on("click", function () {
    if (selectedItem !== "") {
      $(inputFieldSelector).attr('data-info', JSON.stringify(selectedItem))
      $(inputFieldSelector).val(selectedItem.name).trigger('change')
    }
  });
  $("#mainModal").find(".modal-title").text(title);
}
function parseMoney(value) {
  var format = Number(value.replace(/[.]/g, "").replace(",", ".").replace("R$", ""))
  return format
}
function sumPercent() {
  let sum = 0;
  $('.percentageInpt').each(function () {
    let value = parseFloat($(this).val()) || 0;
    sum += value;
  });
  return sum.toFixed(2)
}
function handlePercent() {
  let totalValue = parseMoney($("#valorTotalRat").val())
  let totalSum = sumPercent();
  if (totalSum < 100) {
    let percent = parseFloat($(this).val())
    let result = (percent / 100) * totalValue
    $(this).closest("tr").find(".totalInpt").maskMoney("mask", result)
  } else {
    alert("A soma total da porcentagem não pode exceder os 100%!")
  }
}
function handleAuto() {
  totalValue = parseMoney($("#valorTotalRat").val())
  let sum = sumPercent();
  let magicWand = 100 - sum
  let result = (magicWand / 100 || 0) * totalValue
  let calcVal = result
  if (magicWand > 0) {
    let formatedMagicWand = (magicWand.toFixed(2).toString())
    $(this).closest("tr").find(".percentageInpt").val(formatedMagicWand + " %")
    $(this).closest("tr").find(".totalInpt").maskMoney("mask", calcVal)
  } else {
    alert("Não há porcentagem excedente!")
  }
}
function handleVal() {
  let totalValue = parseMoney($("#valorTotalRat").val())
  let sum = sumPercent();
  if (sum < 100) {
    let part = parseMoney($(this).val())
    let calc = (part / totalValue) * 100
    let percent = calc.toFixed(2)
    $(this).closest("tr").find(".percentageInpt").val(percent + " %")
  } else {
    alert("Não há sobra do valor a ser rateada!")
  }
}
function addModalRow() {
  const modalRow =
    `<tr id='rowIndex' class="rowIndex" data-info=''>
    <td>
       <select class="form-select" aria-label="Default select example">
          <option selected>Selecione Centro</option>
          <option value="1">Centro 1</option>
          <option value="2">Centro 2</option>
          <option value="3">Centro 3</option>
        </select>
    </td>
    <td>
      <input class="form-control small-input percentageInpt" type="text" name="" id="percentageInpt">
    </td>
    <td>
      <input class="form-control totalInpt" type="text" name="" id="totalInpt">
    </td>
    <td>
      <button id="autoRateio" type="button" class="btn btn-primary autoRateio">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-magic" viewBox="0 0 16 16">
          <path
          d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707zM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1zM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707zM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0z" />
        </svg>
      </button>
    </td>
    <td> 
      <button id="deleteBtn" type="button" class="btn btn-danger">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 1 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>
    </td>
  </tr>`
  $("#ratRow").append(modalRow)
  $("#ratRow tr:last").find(".totalInpt").maskMoney({ prefix: 'R$ ', thousands: '.', decimal: ',', affixesStay: true })
  $("#ratRow tr:last").find(".percentageInpt").maskMoney({ suffix: ' %', decimal: '.', affixesStay: true })
}
const bodyRat =
  ` <div id="corpoDiv" class="container-fluid">
    <div class="row pb-2 ps-2">
      <div class="col-md-6">
        <label for="valorTotalRat">Valor Total:</label>
        <input id="valorTotalRat" class="form-control small-input" type="text">
      </div>
      <div class="col-md-auto">
        <button id="addRow" type="button" class="btn btn-primary ml-auto">ADICIONAR</button>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Centro</th>
          <th scope="col">Percentagem</th>
          <th scope="col">Valor Rateado</th>
          <th scope="col">Auto</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody id="ratRow">

      </tbody>
    </table>
  </div>`
function modalRat(totalValue, ultimaLinha) {



  $("#bodyRat").html(bodyRat)
  var modalRateio = new bootstrap.Modal($("#modalRat"));


  // addModalRow()
  modalRateio.toggle();

  $('#addRow').on("click", function () {
    addModalRow()
  })

  data = ultimaLinha.find("#ratButton").attr("data-info")
  if (data != '') {
    data = JSON.parse(data)
    data.forEach(function () {
      addModalRow()
    })
    $('#ratRow #rowIndex').each(function(index, item){
      $(item).find('input').each(function(){
          $(this).val(data[index][$(this).attr('id')])
      })
   })
  } else {
    addModalRow()
  }

  $("#ratRow").on("change", ".percentageInpt", handlePercent)

  $("#ratRow").on("click", ".autoRateio", handleAuto)

  $("#ratRow").on("change", ".totalInpt", handleVal)

  $('#ratRow').on("click", "#dropBtn", function () {
    $('.dropdown-item').click(function () {
      var selectedText = $(this).text().trim();
      $(this).closest("div").find("#dropBtn").text(selectedText);
    })
  });
  $("#ratRow").on("click", "#deleteBtn", function () {
    $(this).closest("tr").remove()
  })
  // $(this).find('input').each(function () {
  //   ratInputId = $(this).attr('id')
  //   ratInputValue = $(this).val()
  //   ratObj[ratInputId] = ratInputValue
  // })
  $("#modalRat #modalSaveRat").off('click').on("click", function () {
    let dataRat = [
    ]
    $('#ratRow #rowIndex').each(function () {
      let ratObj = {}
      $(this).find('input').each(function () {
        let inputVal = $(this).val()
        let inputId = $(this).attr('id')
        ratObj[inputId] = inputVal
      })
      dataRat.push(ratObj)
    })
    ultimaLinha.find("#ratButton").attr('data-info', JSON.stringify(dataRat))
  })

  $("#modalRat #valorTotalRat").val(totalValue)

  return modalRateio;
};
const centroCustoArray = [{
  id: 1,
  valor: 'RecursosHumanos'
},
{
  id: 2,
  valor: 'Administrativo'
},
{
  id: 3,
  valor: 'Diretoria'
},
]
const grupoServicoArray = [
  {
    centroId: 1,
    id: 10,
    valores: [
      {
        id: 10,
        valor: "RHGS1"
      },
      {
        id: 20,
        valor: "RHGS2"
      }
    ]
  },
  {
    centroId: 2,
    id: 20,
    valores: [
      {
        id: 30,
        valor: "AdministrativoGS3"
      },
      {
        id: 40,
        valor: "ADMGS4"
      }
    ]
  },
  {
    centroId: 3,
    id: 30,
    valores: [
      {
        id: 50,
        valor: "DiretoriaGS5"
      },
      {
        id: 60,
        valor: "DiretoriaGS6"
      }
    ]
  }
];
const grupoOrcamentarioArray = [
  {
    centroId: 10,
    id: 1,
    valores: [
      { id: 10, valor: "Test Rh1" },
      {
        id: 20,
        valor: "Test Rh2"
      }
    ]
  },
  {
    centroId: 20,
    id: 20,
    valores: [
      {
        id: 3,
        valor: "Test Rh3"
      },
      {
        id: 4,
        valor: "Test Rh4"
      }
    ]
  },
  {
    centroId: 30,
    id: 30,
    valores: [
      {
        id: 5,
        valor: "ADM5"
      },
      {
        id: 6,
        valor: "ADM6"
      }
    ]
  },
  {
    centroId: 40,
    id: 40,
    valores: [
      {
        id: 7,
        valor: "ADM7"
      },
      {
        id: 8,
        valor: "ADM8"
      }
    ]
  },
  {
    centroId: 50,
    id: 50,
    valores: [
      {
        id: 9,
        valor: "DIR9"
      },
      {
        id: 10,
        valor: "DIR10"
      }
    ]
  },
  {
    centroId: 60,
    id: 6,
    valores: [
      {
        id: 11,
        valor: "DIR11"
      },
      {
        id: 12,
        valor: "DIR12"
      }
    ]
  }

];
function filterArray(centro, last) {
  var centroArray = centro
  var x = last.id
  var filter = centroArray.find(item => item.centroId === x)
  return filter
}


function bindEvents(ultimaLinha) {

  ultimaLinha.find('#custoButton').on('click', function () {
    $('#centroCusto').on('change', function () {
      ultimaLinha.find("#grupoServico, #grupoOrcamentario").val("")
    })
    let centroCustoFiltrado = centroCustoArray
    openModal(centroCustoFiltrado, ultimaLinha.find('#centroCusto'))
   
  })

  ultimaLinha.find('#grupoProdButton').on('click', function () {
    
    ultimaLinha.find("#grupoOrcamentario").val("")
    let lastSelect = JSON.parse(ultimaLinha.find("#centroCusto").attr("data-info"))
    var filter = filterArray(grupoServicoArray, lastSelect)
    openModal(filter.valores, ultimaLinha.find("#grupoServico"))
  })

  ultimaLinha.find('#grupoOrcButton').on('click', function () {
    let lastSelect = JSON.parse(ultimaLinha.find('#grupoServico').attr("data-info"))
    var filter = filterArray(grupoOrcamentarioArray, lastSelect)
    openModal(filter.valores, ultimaLinha.find('#grupoOrcamentario'))
  })

  ultimaLinha.find("#quantidade, #precoUnitario").on("change", () => {
    calculoUnidade(ultimaLinha);
  });



  ultimaLinha.find("#ratButton").on("click", function () {
    totalValue = ultimaLinha.find("#precoTotal").val()
    // saveInHtml(ultimaLinha)

    // $('#addRow').off("click").on("click", function () {
    //   $("#ratRow").append(modalRow)
    // })
    modalRat(totalValue, ultimaLinha);

  })
};

// function saveInHtml(ultimaLinha) {
//   let formDataArray = []
//   let formData = {
//     rat: []
//   }
//   $('div .container').find("input").each(function () {
//     let inputId = $(this).attr("id")
//     let inputValue = $(this).val()
//     formData[inputId] = inputValue
//   })
//   formDataArray.push(formData)
//   ultimaLinha.find("#ratButton").attr('data-info', JSON.stringify(formDataArray))
// }
function getDados() {
  return JSON.parse(localStorage.getItem("localStorageSave"));
};
function valueFill(dado) {
  $("#mainDiv div.container:last")
    .find("input").each(function () {
      var inputId = $(this).attr("id");
      if (dado != null) {
        $(this).val(dado[inputId]);
      }
    });
    
};
function calculoUnidade(ultimaLinha) {
  var unidade = ultimaLinha.find("#quantidade").val();
  var precoUnidade = Number(ultimaLinha.find("#precoUnitario").val().replace(/[.]/g, "").replace(",", ".").replace("R$", ""));
  var precoTotal = unidade * precoUnidade;
  ultimaLinha.find("#precoTotal").val(precoTotal.toFixed(2));
};
function autoLoadForm() {
  var dados = getDados();
  if (dados != null) {
    dados.forEach(function (dado, index) {
      bindEvents(createForm(index, dado));
      valueFill(dado, index);
      $('#mainDiv div.container:last').find("#ratButton").attr('data-info', JSON.stringify(dados[index].arrModal))
    });
    maskCreate()
  }
}
function saveForm() {
  var formDataArray = [];
  $("#mainDiv div.container").each(function (index, item) {
    var formData = {
      arrModal: [],
    };
    let storage = JSON.parse($(item).find("#ratButton").attr("data-info"))
    storage.forEach(function (item, index){ // pode usar ... para ignorar o array e pegar os objetos.
      formData.arrModal.push(storage[index])
    })
    $(this).find("input").each(function () {
        var inputId = $(this).attr("id");
        var inputValue = $(this).val();
        formData[inputId] = inputValue;
      });
    formDataArray.push(formData);
  });
  localStorage.setItem("localStorageSave", JSON.stringify(formDataArray));



  // $('#mainDiv div.container').each(function () {
  //   
  //   if (storage !== '') {
  //     storage = JSON.parse(storage)
      // localStorage.setItem("localStorageSave", JSON.stringify(storage));
  //   }
  // })
}
function maskCreate () {
  $(".precoUnitario").maskMoney({ prefix: 'R$ ', thousands: '.', decimal: ',', affixesStay: true });
  $(".precoTotal").maskMoney({ prefix: "R$", thousands: ".", decimal: ",", affixesStay: true });
}
$(document).ready(function () {

  autoLoadForm()

  $("#addButton").on("click", function (ultimaLinha) {
    bindEvents(createForm(ultimaLinha));
   
  });
  
  
  $("#saveButton").on("click", function (ultimaLinha) {
    saveForm(ultimaLinha)
  });
})