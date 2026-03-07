// var typed = new Typed("#typed-role", {

// strings: [
// "AI Engineer",
// "Machine Learning Engineer",
// "Data Scientist"
// ],

// typeSpeed: 60,
// backSpeed: 35,
// backDelay: 1500,
// loop: true

// });

// Typed animation

var typed = new Typed("#typed-role", {

strings: [
"AI Engineer",
"Machine Learning Engineer",
"Data Scientist",
"Real World Problem Solver"
],

typeSpeed:50,
backSpeed:30,
loop:true

});



// particles background

particlesJS("particles-js", {

particles: {
number: { value: 60 },

size: { value: 3 },

move: { speed: 1 },

line_linked: {
enable: true,
distance: 150,
color: "#F4A261",
opacity: 0.4
}

}

});


window.addEventListener("load",function(){

setTimeout(function(){

document.getElementById("ai-loader").classList.add("loader-hide");

},2000);

});


particlesJS("particles-js",{
particles:{
number:{value:60},
color:{value:"#F97316"},
shape:{type:"circle"},
opacity:{value:0.4},
size:{value:3},
line_linked:{
enable:true,
distance:150,
color:"#F97316",
opacity:0.2,
width:1
},
move:{
enable:true,
speed:1.5
}
},
interactivity:{
events:{
onhover:{enable:true,mode:"grab"}
}
}
});


const counters=document.querySelectorAll(".counter");

counters.forEach(counter=>{
counter.innerText="0";

const updateCounter=()=>{
const target=+counter.getAttribute("data-target");
const count=+counter.innerText;

const increment=target/200;

if(count<target){
counter.innerText=Math.ceil(count+increment);
setTimeout(updateCounter,10);
}else{
counter.innerText=target;
}
};

updateCounter();
});


const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){
entry.target.classList.add("show");
}

});

});

document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));


const elements = document.querySelectorAll(".fade-up");

const observers = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add("show");
}
});
});

elements.forEach(el=>observer.observers(el));