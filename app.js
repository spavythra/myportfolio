// links

const links = document.querySelectorAll('.link');

links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(ele => ele.classList.remove('active'));
        link.classList.add('active');
    })
})

// creating dynamic project card

// const projectContainer = document.querySelector('.project-container');

// projects.forEach(project => {
//     projectContainer.innerHTML += `
//     <div class="project-card" data-tags="#all, ${project.tags}">
//         <img src="/img/${project.image}" alt="">
//         <div class="content">
//             <h1 class="project-name">${project.name}</h1>
//             <span class="tags">${project.tags}</span>
//         </div>
//     </div>
//     `;
// })

// filters

// const filters = document.querySelectorAll('.filter-btn');

// filters.forEach(filterBtn => {
//     filterBtn.addEventListener('click', () => {
//         let id = filterBtn.getAttribute('id');
//         let projectCards = document.querySelectorAll('.project-card');
//         projectCards.forEach(card => {
//             if(card.getAttribute('data-tags').includes(id)){
//                 card.classList.remove('hide');
//             } else{
//                 card.classList.add('hide');
//             }
//         })

//         filters.forEach(btn => btn.classList.remove('active'));
//         filterBtn.classList.add('active');
//     })
// })

//contact form
// const contactBtn = document.querySelector('.contact-btn');
// const firstName = document.querySelector('.first-name');
// const lastName = document.querySelector('.last-name');
// const email = document.querySelector('.email');
// const msg = document.querySelector('.message');

// contactBtn.addEventListener('click', () => {
//     if(firstName.value.length && lastName.value.length && email.value.length && msg.value.length){
//         fetch('/mail', {
//             method: 'post',
//             headers: new Headers({'Content-Type': 'application/json'}),
//             body: JSON.stringify({
//                 firstname: firstName.value,
//                 lastname: lastName.value,
//                 email: email.value,
//                 msg: msg.value,
//             })
//         })
//         .then(res => res.json())
//         .then(data => {
//             alert(data);
//         })
//     }
// })

//toggle button
// const toggleBtn = document.querySelector('.toggle-btn');
// const linkContainer = document.querySelector('.links-container');

// toggleBtn.addEventListener('click', () => {
//     toggleBtn.classList.toggle('active');
//     linkContainer.classList.toggle('show');
// })

// document.querySelector('#contact-form').addEventListener('submit', (e) => {
//     e.preventDefault();
//     e.target.elements.name.value = '';
//     e.target.elements.email.value = '';
//     e.target.elements.message.value = '';
//   });

$(document).ready(function () {
    var silder = $(".owl-carousel");
    silder.owlCarousel({
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: false,
    items: 1,
    stagePadding: 20,
    center: true,
    nav: false,
    margin: 50,
    dots: true,
    loop: true,
    responsive: {
    0: { items: 1 },
    480: { items: 1 },
    575: { items: 1 },
    768: { items: 2 },
    991: { items: 2 },
    1200: { items: 2 }
    }
    });
    });
