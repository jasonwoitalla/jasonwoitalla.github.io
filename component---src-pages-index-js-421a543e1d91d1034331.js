"use strict";(self.webpackChunkjasonwoitalla=self.webpackChunkjasonwoitalla||[]).push([[678],{3568:function(e,t,n){n.d(t,{Z:function(){return o}});var r=n(7294),a="columns-module--column--HxPam",l="columns-module--container--EMT3H",o=function(e){var t=e.maxColumns,n=e.children;if(t){t=parseInt(t);for(var o=[],i=0;i<t;i++){for(var c=[],s=i;s<n.length;s+=t)c.push(r.cloneElement(n[s]));o.push(r.createElement("div",{className:a},c))}return r.createElement("div",{className:l},o)}return r.createElement("div",{className:l},r.Children.map(n,(function(e){return r.createElement("div",{className:a},r.cloneElement(e))})))}},2302:function(e,t,n){n.d(t,{Z:function(){return a}});var r=n(7294),a=function(){return r.createElement("div",{className:"divider-module--divider--fcSlf"})}},2965:function(e,t,n){n.r(t),n.d(t,{default:function(){return h},query:function(){return v}});var r=n(7294),a=n(1597),l=n(5659),o=n(3568),i=function(e){var t=e.title,n=e.description,l=e.cta,o=e.link;return r.createElement("div",null,r.createElement("p",{className:"coursework-module--title--Vtrze"},t),r.createElement("p",null,n),r.createElement(a.Link,{to:o,className:"coursework-module--cta--aWTrn"},l))},c=n(2302),s=n(2875),m=n(2641);var u=n(7059),d=function(e){var t=e.projectName,n=e.tagLine,l=e.link,o=e.image,i=e.gridWidth;return r.createElement("div",{className:"project_grid-module--gridComponent--KuFra",style:{gridColumn:"span "+i}},r.createElement(a.Link,{to:l},r.createElement("div",{className:"project_grid-module--gridComponentOverlay--gkCXK"},r.createElement("div",{className:"project_grid-module--image--QbOJe",style:{width:"100%",height:"100%"}},o),r.createElement("div",{className:"project_grid-module--gridComponentData--9-2mJ"},r.createElement("div",{className:"project_grid-module--gridComponentDataName--wRf5k"},t),r.createElement("div",{className:"project_grid-module--gridComponentDataTagline--ey2nu"},n)))))},p=function(e){!function(e){if(null==e)throw new TypeError("Cannot destructure undefined")}(e);var t=(0,a.useStaticQuery)("2249322788");return r.createElement("div",{className:"project_grid-module--projectGrid--ZJbCC"},t.allProjectGridDataJson.edges.map((function(e){return r.createElement(d,{projectName:e.node.project,tagLine:e.node.tagLine,link:e.node.link,image:r.createElement(u.G,{image:(0,u.c)(e.node.bgImage),alt:e.node.imageAlt}),gridWidth:e.node.gridWidth})})))},g=function(e,t){var n=(0,r.useState)(!1),a=n[0],l=n[1];return(0,r.useEffect)((function(){var n=new IntersectionObserver((function(e){var t=e[0];l(t.isIntersecting)}),{rootMargin:t});e.current&&n.observe(e.current);var r=e.current;return function(){return n.unobserve(r)}}),[]),a},E=function(e){var t=e.label,n=e.progress,a=r.useRef(),l=g(a,"-50px");return r.createElement("div",{ref:a,className:"progress-bar-module--container--otc8Y"},r.createElement("div",{className:"progress-bar-module--label--QKbMP"},t),r.createElement("span",{className:"progress-bar-module--background--Sp5OL"},r.createElement("span",{className:"progress-bar-module--progress--mhoOh",style:{width:l?n:"0%"}},r.createElement("span",{className:"progress-bar-module--progressLabel--iT0of"},n))))},f=function(e){var t=e.title,n=e.items;return r.createElement(r.Fragment,null,r.createElement("h3",null,t),n.map((function(e){return r.createElement("div",{className:"skill-section-module--progress--X5evg"},r.createElement(E,{label:e[0],progress:e[1]}))})))},v="2501350326",h=function(){var e=(0,a.useStaticQuery)(v);console.log(e);var t=e.allDataJson.edges[0].node.hero,n=e.allDataJson.edges[0].node.skills,u=e.allDataJson.edges[0].node.coursework,d=e.allDataJson.edges[0].node.experience,g=r.createElement(m.Z,{title:t.title,sub:t.sub,link:t.link,buttonText:t.buttonText,heroImage:t.heroImage});return r.createElement(s.Z,{pageTitle:"Homepage",pageHero:g},r.createElement("h2",null,"Projects / Achievements"),r.createElement("p",{id:"resume"},"Here are some of the projects that I have completed that I would like to highlight. My skills in web development, graphics, and hobby game development are featured here. Click on a project to view more about it. There you can see what skills I used to build that project, view source code, and try out a live demo for yourself."),r.createElement(p,null),r.createElement(c.Z,null),r.createElement("div",null,r.createElement("h2",null,"Experience"),r.createElement(o.Z,{maxColumns:"2"},d.map((function(e){return r.createElement("div",{className:"index-module--jobEntry--fbOUR"},r.createElement("p",null,e.job),r.createElement("p",null,e.description))})))),r.createElement(c.Z,null),r.createElement("div",null,r.createElement("h2",null,"Education & Coursework"),r.createElement("p",null,"These are courses I have completed in peruse of my undergraduate degree in computer science at the University of Minnesota."),r.createElement(o.Z,{maxColumns:"2"},r.createElement("div",null,r.createElement("p",null,r.createElement("span",{style:{fontWeight:"bold"}},"Bachelor of Science in Computer Science"),r.createElement("br",null),r.createElement("span",{style:{fontStyle:"italic"}},"Minor in Mathematics")),r.createElement("p",null,"College of Science and Engineering, University of Minnesota Twin Cities"),r.createElement("p",{style:{fontWeight:"bold"}},"Graduated in 2023"),r.createElement("p",{style:{fontWeight:"bold"}},"GPA: 3.58 / 4.00"),r.createElement(l.Z,{link:"https://www.linkedin.com/in/jason-woitalla/",internal:!1},"View Me on LinkedIn")),r.createElement("div",null,u.map((function(e){return r.createElement(i,{title:e.class,description:e.description,cta:e.cta,link:e.cta_link})}))))),r.createElement(c.Z,null),r.createElement("h2",null,"Skills"),r.createElement("p",null,"English is my first language and I have strong communication skills. I have advanced computer skills and can operate Windows, macOS, and Linux efficiently."),n.map((function(e){return r.createElement(f,{title:e.title,items:e.items})})))}}}]);
//# sourceMappingURL=component---src-pages-index-js-421a543e1d91d1034331.js.map