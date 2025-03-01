'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const slider = document.querySelector('.slider');
const allSection = document.querySelectorAll('.section');


const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});



const message = document.createElement('div');

// Inserta datos al html
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class ="btn btn--close-cookie">Got it!</button>';


header.append(message);


document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });


btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current Scroll X/Y', window.scrollX, window.scrollY);

  // Actualy scroll
  section1.scrollIntoView({ behavior: 'smooth' });
});




// Header buttons scroll
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);

  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabbed component section 2
tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');

  if(!clicked) return;

  //remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
      console.log(el);
    });
    logo.style.opacity = this;
  };
};


nav.addEventListener('mouseover',handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));



// Menu sticky
const navHeight = nav.getBoundingClientRect().height;
// Function que toma los datos de interSectionObserver y los comprueba.
const stickyNav = function(entries){
  const [entry] = entries;
 if(!entry.isIntersecting){
  nav.classList.add('sticky');
 } else{
  nav.classList.remove('sticky');
 };
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});
headerObserver.observe(header);
// Menu sticky


const revealSection = function(entries, observer){
entries.forEach(entry => {
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
});
};


const sectionObserver = new IntersectionObserver(revealSection, {
  root:null,
  threshold: 0.15
});

allSection.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
// Img Borroso
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function(entries, observe){
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function(){
      entry.target.classList.remove('lazy-img');
    })
  observe.unobserve(entry.target);
  })

};

const imgObserver = new IntersectionObserver(loadImg, {
  root:null,
  threshold: 0,
  rootMargin: '100px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Img Borroso

//Slider 
let curSlide = 0;
const maxSlide = slides.length;

const createDots = function(){
  slides.forEach(function(_, i){
    dotContainer.insertAdjacentHTML('beforeend',`<button class="dots__dot" data-slide="${i}"></button>`)
  });
};


const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}




const goToSlide = function(slide){
  slides.forEach((s, i ) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
}

const nextSlide = function(){
  if(curSlide === maxSlide - 1){
    curSlide = 0
  }else{
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};



const prevSlide = function(){
  if(curSlide === 0){
    curSlide = maxSlide - 1;
  }else{
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const init = function(){
  goToSlide(0);
  createDots();
  activateDot(0);
}
init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight'){
    nextSlide()
  }else if (e.key === 'ArrowLeft'){
    prevSlide()
  };
});

dotContainer.addEventListener('click', function(e){
  if(e.target.classList.contains('dots__dot')){
    curSlide = Number(e.target.dataset.slide);
    goToSlide(curSlide);
    activateDot(curSlide);
  }
})