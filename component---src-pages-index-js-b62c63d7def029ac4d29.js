"use strict";(self.webpackChunkjasonwoitalla=self.webpackChunkjasonwoitalla||[]).push([[678],{5659:function(e,t,n){n.d(t,{Z:function(){return o}});var a=n(7294),r=n(1597),c=n(8014),l=n(7606),o=function(e){var t=e.link,n=e.buttonstyle,o=(e.onClick,e.children);return a.createElement("div",{className:"button-module--buttonContainer--Q68-w"},a.createElement(r.Link,{to:t,className:"button-module--button--BvGZT",buttonstyle:n},o,a.createElement("span",null,a.createElement(l.G,{icon:c._tD}))))}},3568:function(e,t,n){n.d(t,{Z:function(){return l}});var a=n(7294),r="columns-module--column--HxPam",c="columns-module--container--EMT3H",l=function(e){var t=e.maxColumns,n=e.children;if(t){t=parseInt(t);for(var l=[],o=0;o<t;o++){for(var i=[],s=o;s<n.length;s+=t)i.push(a.cloneElement(n[s]));l.push(a.createElement("div",{className:r},i))}return a.createElement("div",{className:c},l)}return a.createElement("div",{className:c},a.Children.map(n,(function(e){return a.createElement("div",{className:r},a.cloneElement(e))})))}},2302:function(e,t,n){n.d(t,{Z:function(){return r}});var a=n(7294),r=function(){return a.createElement("div",{className:"divider-module--divider--fcSlf"})}},2259:function(e,t,n){n.d(t,{Z:function(){return i}});var a=n(7294),r=n(7059),c="hero-image-module--backgroundImage--4dRhC",l=function(e){var t=e.image;return console.log("Hero Image: "+t),"person-typing"===t?a.createElement("div",{className:c},a.createElement(r.S,{src:"../images/person-typing.jpg",alt:"Hero Image Person Typing",quality:90,loading:"eager",__imageData:n(6214)})):"computer-code"===t?a.createElement("div",{className:c},a.createElement(r.S,{src:"../images/computer-code.jpg",alt:"Computer with code",quality:90,loading:"eager",__imageData:n(2407)})):a.createElement(a.Fragment,null)},o=n(5659),i=function(e){var t,n=e.title,r=e.sub,c=e.buttonText,i=e.link,s=e.heroImage;return c&&(t=a.createElement(o.Z,{link:i,buttonstyle:"hero"},c)),a.createElement("div",{className:"page-hero-module--container--RZEPm"},a.createElement(l,{image:s}),a.createElement("div",{className:"page-hero-module--content--wbttL"},a.createElement("h1",{className:"page-hero-module--header--V+qWD"},n),a.createElement("p",{className:"page-hero-module--subheader--eyQUr"},r),t))}},7639:function(e,t,n){n.r(t),n.d(t,{default:function(){return w},query:function(){return v}});var a=n(7294),r=n(1597),c=n(2875),l=n(2259),o=n(2302),i=n(5659),s=n(3568),m=n(7059),u=n(8014),d=n(7606),p=function(e){var t=e.title,n=e.description,c=e.linkText,l=e.href,o=e.image;return a.createElement("div",{className:"homepage-project-item-module--container--knhWb"},a.createElement(r.Link,{to:l},a.createElement("div",{className:"homepage-project-item-module--image--RkMxM"},o,a.createElement("span",null,a.createElement(d.G,{icon:u.EQ8,size:"xl"})))),a.createElement("h3",{className:"homepage-project-item-module--title--UV49Q"},a.createElement(r.Link,{to:l},t)),a.createElement("p",{className:"homepage-project-item-module--description--Q-XFT"},n),a.createElement("p",{style:{textAlign:"center"}},a.createElement(r.Link,{to:l,className:"homepage-project-item-module--link--OgJEi"},c)))},f=function(){var e=(0,r.useStaticQuery)("656714077");return a.createElement(s.Z,null,e.allHomepageProjectsJson.edges.map((function(e){return a.createElement(p,{title:e.node.title,description:e.node.description,linkText:e.node.linkText,href:e.node.href,image:a.createElement(m.G,{image:(0,m.c)(e.node.imagePath),alt:e.node.imageAlt})})})))},g=function(e,t){var n=(0,a.useState)(!1),r=n[0],c=n[1];return(0,a.useEffect)((function(){var n=new IntersectionObserver((function(e){var t=e[0];c(t.isIntersecting)}),{rootMargin:t});e.current&&n.observe(e.current);var a=e.current;return function(){return n.unobserve(a)}}),[]),r},E=function(e){var t=e.label,n=e.progress,r=a.useRef(),c=g(r,"-50px");return a.createElement("div",{ref:r,className:"progress-bar-module--container--otc8Y"},a.createElement("div",{className:"progress-bar-module--label--QKbMP"},t),a.createElement("span",{className:"progress-bar-module--background--Sp5OL"},a.createElement("span",{className:"progress-bar-module--progress--mhoOh",style:{width:c?n:"0%"}},a.createElement("span",{className:"progress-bar-module--progressLabel--iT0of"},n))))},b=function(e){var t=e.title,n=e.items;return a.createElement(a.Fragment,null,a.createElement("h3",null,t),n.map((function(e){return a.createElement("div",{className:"skill-section-module--progress--X5evg"},a.createElement(E,{label:e[0],progress:e[1]}))})))},h=function(e){var t=e.title,n=e.description,c=e.cta,l=e.link;return a.createElement("div",null,a.createElement("p",{className:"coursework-module--title--Vtrze"},t),a.createElement("p",null,n),a.createElement(r.Link,{to:l,className:"coursework-module--cta--aWTrn"},c))},v="2501350326",w=function(){var e=(0,r.useStaticQuery)(v);console.log(e);var t=e.allDataJson.edges[0].node.hero,n=e.allDataJson.edges[0].node.skills,m=e.allDataJson.edges[0].node.coursework,u=e.allDataJson.edges[0].node.experience,d=a.createElement(l.Z,{title:t.title,sub:t.sub,link:t.link,buttonText:t.buttonText,heroImage:t.heroImage});return a.createElement(c.Z,{pageTitle:"Homepage",pageHero:d},a.createElement("h2",null,"Projects / Achievements"),a.createElement(f,null),a.createElement(o.Z,null),a.createElement("div",{id:"resume"},a.createElement("h2",null,"Education & Coursework"),a.createElement("p",null,"These are courses I have completed in peruse of my undergraduate degree in computer science at the University of Minnesota."),a.createElement(s.Z,{maxColumns:"2"},a.createElement("div",null,a.createElement("p",{style:{fontWeight:"bold"}},"Bachelor of Computer Science"),a.createElement("p",null,"College of Science and Engineering, University of Minnesota Twin Cities"),a.createElement("p",{style:{fontWeight:"bold"}},"Expected Graduation: May 2023"),a.createElement("p",{style:{fontWeight:"bold"}},"GPA: 3.53 / 4.00"),a.createElement(i.Z,{link:"https://www.linkedin.com/in/jason-woitalla/"},"View Me on LinkedIn")),a.createElement("div",null,m.map((function(e){return a.createElement(h,{title:e.class,description:e.description,cta:e.cta,link:e.cta_link})}))))),a.createElement(o.Z,null),a.createElement("div",null,a.createElement("h2",null,"Experience"),a.createElement(s.Z,{maxColumns:"2"},u.map((function(e){return a.createElement("div",{className:"index-module--jobEntry--fbOUR"},a.createElement("p",null,e.job),a.createElement("p",null,e.description))})))),a.createElement(o.Z,null),a.createElement("h2",null,"Skills"),a.createElement("p",null,"English is my first language and I have strong communication skills. I have advanced computer skills and can operate Windows, macOS, and Linux efficiently."),n.map((function(e){return a.createElement(b,{title:e.title,items:e.items})})))}},2407:function(e){e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#182838","images":{"fallback":{"src":"/static/5a147418d33fc2b7c46b04381df53665/5526d/computer-code.jpg","srcSet":"/static/5a147418d33fc2b7c46b04381df53665/ae285/computer-code.jpg 1500w,\\n/static/5a147418d33fc2b7c46b04381df53665/c0a7f/computer-code.jpg 3000w,\\n/static/5a147418d33fc2b7c46b04381df53665/5526d/computer-code.jpg 6000w","sizes":"(min-width: 6000px) 6000px, 100vw"},"sources":[{"srcSet":"/static/5a147418d33fc2b7c46b04381df53665/a5760/computer-code.webp 1500w,\\n/static/5a147418d33fc2b7c46b04381df53665/e393f/computer-code.webp 3000w,\\n/static/5a147418d33fc2b7c46b04381df53665/de365/computer-code.webp 6000w","type":"image/webp","sizes":"(min-width: 6000px) 6000px, 100vw"}]},"width":6000,"height":4000}')},6214:function(e){e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#f8f8f8","images":{"fallback":{"src":"/static/4aefeea9954987cfc3b9f344a3cc154c/57a6f/person-typing.jpg","srcSet":"/static/4aefeea9954987cfc3b9f344a3cc154c/90bef/person-typing.jpg 1019w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/f7c89/person-typing.jpg 2038w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/57a6f/person-typing.jpg 4076w","sizes":"(min-width: 4076px) 4076px, 100vw"},"sources":[{"srcSet":"/static/4aefeea9954987cfc3b9f344a3cc154c/32195/person-typing.webp 1019w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/d2dcc/person-typing.webp 2038w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/395a5/person-typing.webp 4076w","type":"image/webp","sizes":"(min-width: 4076px) 4076px, 100vw"}]},"width":4076,"height":2712}')}}]);
//# sourceMappingURL=component---src-pages-index-js-b62c63d7def029ac4d29.js.map