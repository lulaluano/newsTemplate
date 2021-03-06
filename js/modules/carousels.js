let carousels = []
let viewCarousel = []

function onChangeCarouselFile(event) {
    for (var i = 0; i < event.files.length; i++) {
        var reader = new FileReader();
        reader.onload = e => {
            var size = e.loaded / 1024; // <-- KB
            newImgViewCarousel(e.target.result, size);
        };
        reader.readAsDataURL(event.files[i]);
    }
}


function newImgViewCarousel(src, size) {
    let id = 0;
    if (viewCarousel.length !== 0) while (viewCarousel.filter(m => m.id === id)[0] !== undefined) id++;
    viewCarousel.push({id: id, tipo: 'img', conteudo: src, tamanho: size});
    renderViewCarousel();
}


function deleteCarouselImage(id) {
    viewCarousel.splice(viewCarousel.indexOf(viewCarousel.filter(value => value.id === id)[0]), 1);
    renderViewCarousel();
    if (viewCarousel.length === 0) {
        $('#carousel_contente').append('<span class="text-dark h5 my-5">Nenhuma imagem adicionada</span>')
    }
}

function cleanViewCarousel() {
    viewCarousel = [];
    $('#carousel_contente').html('').append('<span class="text-dark h5 my-5">Nenhuma imagem adicionada</span>')

}

function renderViewCarousel() {
    $('#carousel_contente').html("");
    if (viewCarousel.length !== 0) {
        viewCarousel.forEach(m => {
            var campo = $('<div class="col-lg-4 col-sm-6 my-2" id="viewCarousel_image_' + m.id + '"><div class="alert alert-dismissible img-container bg-transparent border-custom shadow p-0 py-2 m-0 flex-center"><figure class="figure m-0 text-center max-w-75"><img class="img-preview figure-img rounded-top max-w-100" src="' + m.conteudo + '" alt="" id="carousel_img_' + m.id + '"><figcaption class="figure-caption text-center text-dark bg-light-4 rounded-bottom py-1"><small id="img_size_' + m.id + '"></small><small class="font-weight-bold">' + m.tamanho.toFixed() + 'KB</small></figcaption></figure><button type="button" id="deleteCarouselImage_' + m.id + '" class="btn close material-icons text-dark" data-dismiss="alert" aria-label="Close">close</button></div></div>');
            $('#carousel_contente').append(campo);

            setTimeout(() => {
                viewCarousel.forEach(m => {
                    document.getElementById("img_size_" + m.id).innerHTML = document.getElementById("carousel_img_" + m.id).naturalWidth + " x " + document.getElementById("carousel_img_" + m.id).naturalHeight + ", ";
                })
            }, 0)

            document.getElementById('deleteCarouselImage_' + m.id).addEventListener('click', () => deleteCarouselImage(m.id))
            document.getElementById('viewCarousel_image_' + m.id).addEventListener('click', (e) => {
                viewImg(e, document.getElementById('carousel_img_' + m.id), m.conteudo)
            })
        });
    }
}

function newCarousel() {
    checkCarouselImages()
    if (viewCarousel.length > 1) {
        let id = 0;
        if (carousels.length !== 0) while (carousels.filter(m => m.id === id)[0] !== undefined) id++;
        let size = singleCarouselSize(viewCarousel)
        carousels.push({id: id, conteudo: viewCarousel, tamanho: size});
        renderReadyCarousel();
    }
}


function deleteCarousel(id) {
    carousels.splice(carousels.indexOf(carousels.filter(value => value.id === id)[0]), 1);
    renderReadyCarousel();
    if (carousels.length === 0) {
        $('#carousels_container').html('').append('<span class="text-caution nenhum">Nenhum carrossel adicionado</span>')
    }
}

function deleteAllCarousels() {
    carousels = [];
    $('#carousels_container').html('').append('<span class="text-caution nenhum">Nenhum carrossel adicionado</span>')
    $('#carousel-title').html('Carrosséis')
}

function renderReadyCarousel() {
    $('#carousels_container').html("");
    if (carousels.length !== 0) {
        $('#carousel-title').html('').append("Carrosséis (" + carousels.length + ") - " + totalCarouselSize());
        carousels.forEach(m => {
            var container = '<div class="row mx-3 mb-3 border rounded w-100 bg-light-2" id="carouselWrapper_' + m.id + '"><div class="row no-gutters w-100"><p class="lead font-weight-bold p-2 m-0 text-dark" id="carrossel_' + m.id + '"></p><div class="ml-auto align-self-start rounded bg-light-4 shadow-sm"><a class="material-icons text-danger p-2" href="javascript:void(0)" id="deleteCarousel_' + m.id + '">remove</a><a class="material-icons text-caution p-2" href="javascript:void(0)" id="previewCarousel_' + m.id + '">visibility</a></div></div></div>';
            $('#carousels_container').append(container);
            $('#carrossel_' + m.id).append(m.conteudo.length + ' imagens, ' + m.tamanho.toFixed() + ' KB');
            carousels[carousels.indexOf(m)].conteudo.forEach(n => {
                var img = '<div class="col-md-2 p-3"><div class="alert img-carousel-container border-custom shadow-sm m-0 flex-center" id="readyCarousel_image_' + m.id + '_' + n.id + '"><img class="rounded img-carousel-preview max-w-100" id="readyCarousel_img_' + m.id + '_' + n.id + '" src="' + n.conteudo + '" alt=""></div></div>';
                $('#carouselWrapper_' + m.id).append(img)

                document.getElementById('readyCarousel_image_' + m.id + '_' + n.id).addEventListener('click', (e) => {
                    viewImg(e, document.getElementById('readyCarousel_img_' + m.id + '_' + n.id), n.conteudo)
                })
            });
            document.getElementById('deleteCarousel_' + m.id).addEventListener('click', () => deleteCarousel(m.id))
            document.getElementById('previewCarousel_' + m.id).addEventListener('click', () => {
                previewCarousel(m)
            })
        });
        setTimeout(cleanViewCarousel, 1000);
    } else {
        $('#carousel-title').html('Carrosséis')
    }
}


function singleCarouselSize(conteudo) {
    let tamanhos = conteudo.map(a => a.tamanho);
    return tamanhos.reduce((a, b) => a + b, 0)
}

function totalCarouselSize() {
    let tamanhos = carousels.map(a => a.tamanho);
    let size = tamanhos.reduce((a, b) => a + b, 0)

    if (size >= 1024) {
        size /= 1024;
        return size.toFixed(1).toString() + ' MB';
    } else {
        return size.toFixed(1).toString() + ' KB';
    }
}

function viewImg(event, img, src) {
    if (event.target.localName !== 'button') {
        document.querySelector('#viewImgTitle').innerHTML = `Visualizar Imagem (${img.naturalWidth} x ${img.naturalHeight})`;
        document.querySelector('#viewImgBody').innerHTML = `<figure class="figure m-0 text-center max-w-95"><img class="max-w-100 view-img" src="${src}" alt="">`
        $('#viewImg').modal()
    }
}

function previewCarousel(obj) {
    document.querySelector('.carousel-indicators').innerHTML = ''
    document.querySelector('.carousel-inner').innerHTML = ''
    carousels[carousels.indexOf(obj)].conteudo.forEach(m => {
        document.querySelector('.carousel-indicators').innerHTML += `<li data-target="#previewCarousel" id="indicator_${m.id}" data-slide-to="${m.id}"></li>`
        if (m.id === 0) {
            document.querySelector('[data-slide-to="0"]').classList.add("active")
        }

        document.querySelector('.carousel-inner').innerHTML += `<div class="carousel-item" id="item_${m.id}"><figure class="figure m-0 text-center max-w-95"><img class="max-w-100 view-img" src="${carousels[carousels.indexOf(obj)].conteudo[m.id].conteudo}" alt=""></div>`
        if (m.id === 0) {
            document.querySelector('#item_0').classList.add("active")
        }
    })

    $('#previewCarouselModal').modal()
}

function checkCarouselImages() {
    if (viewCarousel.length < 2) {
        piscar('#carousel-modal-error', 'bg-caution')
        document.getElementById('carousel-modal-error').innerHTML = '<span class="material-icons align-middle pb-1 pr-1">error</span><span>Adicione ao menos 2 imagens para poder fazer um carrossel!</span>'
        document.getElementById('newCarousel').removeAttribute('data-dismiss')

    } else {
        document.getElementById('carousel-modal-error').innerHTML = ''
        document.getElementById('newCarousel').setAttribute('data-dismiss', 'modal')
    }
}

function checkImages() {
    let imgCounter = 0
    carousels.forEach(carousel => {
        carousel.conteudo.forEach(() => {
            imgCounter += 1
        })
    })

    import('./imagens.js')
        .then((img) => {
            if (imgCounter + img.imagens.length < 2) {
                piscar('#error', 'bg-caution')
                document.getElementById('error').innerHTML = '<span class="material-icons align-middle pb-1 pr-1">error</span><span>Adicione ao menos 2 imagens para poder escolher a capa!</span>'

            } else {
                document.getElementById('error').innerHTML = ''

            }
        }
    )
}

function piscar(container, cor) {
    document.querySelector(container).classList.add(cor)
    setTimeout(function () {
        document.querySelector(container).classList.remove(cor)
        document.querySelector(container).classList.add('flash');
    }, 25);
    setTimeout(function () {
        document.querySelector(container).classList.remove('flash')
    }, 400)
}

export {onChangeCarouselFile, deleteAllCarousels, cleanViewCarousel, newCarousel, checkImages}