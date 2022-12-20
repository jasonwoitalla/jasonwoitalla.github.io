"use strict";(self.webpackChunkjasonwoitalla=self.webpackChunkjasonwoitalla||[]).push([[712],{5659:function(e,t,a){a.d(t,{Z:function(){return o}});var c=a(7294),n=a(1597),i=a(8014),r=a(7606),o=function(e){var t=e.link,a=e.buttonstyle,o=(e.onClick,e.children);return c.createElement("div",{className:"button-module--buttonContainer--Q68-w"},c.createElement(n.Link,{to:t,className:"button-module--button--BvGZT",buttonstyle:a},o,c.createElement("span",null,c.createElement(r.G,{icon:i._tD}))))}},2259:function(e,t,a){a.d(t,{Z:function(){return m}});var c=a(7294),n=a(7059),i="hero-image-module--backgroundImage--4dRhC",r=function(e){var t=e.image;return console.log("Hero Image: "+t),"person-typing"===t?c.createElement("div",{className:i},c.createElement(n.S,{src:"../images/person-typing.jpg",alt:"Hero Image Person Typing",quality:90,loading:"eager",__imageData:a(6214)})):"computer-code"===t?c.createElement("div",{className:i},c.createElement(n.S,{src:"../images/computer-code.jpg",alt:"Computer with code",quality:90,loading:"eager",__imageData:a(2407)})):c.createElement(c.Fragment,null)},o=a(5659),m=function(e){var t,a=e.title,n=e.sub,i=e.buttonText,m=e.link,l=e.heroImage;return i&&(t=c.createElement(o.Z,{link:m,buttonstyle:"hero"},i)),c.createElement("div",{className:"page-hero-module--container--RZEPm"},c.createElement(r,{image:l}),c.createElement("div",{className:"page-hero-module--content--wbttL"},c.createElement("h1",{className:"page-hero-module--header--V+qWD"},a),c.createElement("p",{className:"page-hero-module--subheader--eyQUr"},n),t))}},1506:function(e,t,a){a.r(t),a.d(t,{default:function(){return p}});var c=a(7294),n=a(2259),i=a(2875),r=a(1597),o=a(7059),m=a(8014),l="ludum-dare-item-module--importantInfo--tJUs6",s=a(5659),u=a(7606),d=function(e){var t=e.title,a=e.date,n=e.theme,i=e.language,o=e.description,d=e.gitHubLink,p=e.playLink,g=e.image;return c.createElement("div",{className:"ludum-dare-item-module--container--HlIb-"},c.createElement(r.Link,{to:p},c.createElement("div",{className:"ludum-dare-item-module--image--JTD8z"},g,c.createElement("span",null,c.createElement(u.G,{icon:m.zc,size:"xl"})))),c.createElement("div",{className:"ludum-dare-item-module--information--hGqH9"},c.createElement("h2",null,t),c.createElement("p",{className:"ludum-dare-item-module--date--247kd"},"Submitted: ",a),c.createElement("p",{className:l},"Theme: ",n),c.createElement("p",{className:l},"Language: ",i),c.createElement("p",{className:"ludum-dare-item-module--description--BLKtV"},o),c.createElement("p",{className:"ludum-dare-item-module--extraInfo--ZX5yO"},"Click the image if you want to play the game."),c.createElement(s.Z,{link:d},"Source Code on GitHub")))},p=function(){var e=(0,r.useStaticQuery)("3317845399"),t=c.createElement(n.Z,{title:"Ludum Dare Competition",heroImage:"computer-code",sub:"View my submissions here"});return c.createElement(i.Z,{pageTitle:"Ludum Dare",pageHero:t,active:"project"},c.createElement("p",null,"Ludum Dare is a game jam competition. This means I need to create a fully featured game that fits a given theme and submit it by a certain deadline. For Ludum Dare, I have to submit my entries within 48 hours of receiving the theme. To date, I have competed in 5 of these."),e.allLudumDareDataJson.edges.map((function(e){var t=c.createElement(o.G,{image:(0,o.c)(e.node.imagePath),alt:e.node.imageAlt});return c.createElement(d,{title:e.node.game,date:e.node.date,theme:e.node.theme,language:e.node.language,description:e.node.description,gitHubLink:e.node.githubLink,playLink:e.node.playLink,image:t})})))}},2407:function(e){e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#182838","images":{"fallback":{"src":"/static/5a147418d33fc2b7c46b04381df53665/5526d/computer-code.jpg","srcSet":"/static/5a147418d33fc2b7c46b04381df53665/ae285/computer-code.jpg 1500w,\\n/static/5a147418d33fc2b7c46b04381df53665/c0a7f/computer-code.jpg 3000w,\\n/static/5a147418d33fc2b7c46b04381df53665/5526d/computer-code.jpg 6000w","sizes":"(min-width: 6000px) 6000px, 100vw"},"sources":[{"srcSet":"/static/5a147418d33fc2b7c46b04381df53665/a5760/computer-code.webp 1500w,\\n/static/5a147418d33fc2b7c46b04381df53665/e393f/computer-code.webp 3000w,\\n/static/5a147418d33fc2b7c46b04381df53665/de365/computer-code.webp 6000w","type":"image/webp","sizes":"(min-width: 6000px) 6000px, 100vw"}]},"width":6000,"height":4000}')},6214:function(e){e.exports=JSON.parse('{"layout":"constrained","backgroundColor":"#f8f8f8","images":{"fallback":{"src":"/static/4aefeea9954987cfc3b9f344a3cc154c/57a6f/person-typing.jpg","srcSet":"/static/4aefeea9954987cfc3b9f344a3cc154c/90bef/person-typing.jpg 1019w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/f7c89/person-typing.jpg 2038w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/57a6f/person-typing.jpg 4076w","sizes":"(min-width: 4076px) 4076px, 100vw"},"sources":[{"srcSet":"/static/4aefeea9954987cfc3b9f344a3cc154c/32195/person-typing.webp 1019w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/d2dcc/person-typing.webp 2038w,\\n/static/4aefeea9954987cfc3b9f344a3cc154c/395a5/person-typing.webp 4076w","type":"image/webp","sizes":"(min-width: 4076px) 4076px, 100vw"}]},"width":4076,"height":2712}')}}]);
//# sourceMappingURL=component---src-pages-ludum-dare-index-js-d9f70e199f826e062562.js.map