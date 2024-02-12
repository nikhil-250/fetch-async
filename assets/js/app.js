const cl = console.log;
let formcontrol = document.getElementById(`postform`);
let submitbtn = document.getElementById(`submit`);
let updatebtn = document.getElementById(`update`);
let card2 = document.getElementById(`card`);
let titlecontrol = document.getElementById(`title`);
let bodycontrol = document.getElementById(`body`);
let useridcontrol = document.getElementById(`UserId`)
let postCardContainer = document.getElementById(`postCardContainer`);

 
 
let baseUrl = `https://crud-application-cdd06-default-rtdb.firebaseio.com/`
let postUrl = `${baseUrl}/posts.json`

const objtoarr = (obj) => {
 let postarr = [];
 for (const key in obj) {
     let obj2 = obj[key];
     obj2.id = key;
     postarr.push(obj2)
     // cl(obj2)
 }
 return postarr;
}

const apicall = async (apiurl,methodname,bodymsg = null) =>{
 let res = await fetch(apiurl,{
   method:methodname,
   body:bodymsg,
   headers:{
    "content-type" : "application/json"
   }
 })
 cl(res)
 return await res.json()
}

const getcard = async () => {
 try{
   let data = await apicall(postUrl,"GET");
   let datarr = objtoarr(data)
   cl(data)
   cl(datarr)
   datarr.forEach(ele => postobjtemplating(ele))
 }catch(err){
  cl(err)
 }
}
getcard()
const onAddpost = async (ele) => {
  ele.preventDefault()
  let newObj ={
   title:titlecontrol.value ,
   body:bodycontrol.value,
   userId:useridcontrol.value,
  }
  cl(newObj)
  try{
let res = await apicall(postUrl,`POST`,JSON.stringify(newObj));
newObj.id = res.name
postobjtemplating(newObj)
Swal.fire({
 position: "top-center",
 icon: "success",
 title: "New Card Created Successfully!!!",
 showConfirmButton: false,
});
  }catch(err){
 cl(err)
  }finally{
   formcontrol.reset()
  }
}
const onEdit = async (ele) => {
 let editId = ele.closest(`.card`).id;
 let editUrl =`${baseUrl}/posts/${editId}.json`
 localStorage.setItem(`editId`,editId)
 cl(editId)
 cl(editUrl)
 try{
  let res = await apicall(editUrl,"GET");
  titlecontrol.value = res.title,
  bodycontrol.value = res.body,
  useridcontrol.value = res.userId, 
  scrollToTop()
 }catch(err){
   cl(err)
 }finally{
   updatebtn.classList.remove(`d-none`)
   submitbtn.classList.add(`d-none`)
 }
}
const onUpdate = async(ele) => {
 let updatedId = localStorage.getItem(`editId`)
 let updatedurl = `${baseUrl}/posts/${updatedId}.json`
 let newObj ={
   title:titlecontrol.value,
   body:bodycontrol.value,
   userId:useridcontrol.value
 }
 try{
   let res = await apicall(updatedurl,"PATCH",JSON.stringify(newObj));
   let getChildren = [...document.getElementById(updatedId).children];
   getChildren[0] =`<h2>${res.title}</h2>`,
   getChildren[1] =`<P>${res.body}</p>`
   Swal.fire({
     position: "top-center",
     icon: "success",
     title: "Successfully Updated!!!",
     showConfirmButton: false,
 });
 }catch(err){
cl(err)
 }finally{
   updatebtn.classList.add(`d-none`)
   submitbtn.classList.remove(`d-none`)
   formcontrol.reset()
 }
}
// const onDelete = async(ele) => {
//   let deletId = ele.closest(`.card`).id;
//   let deleteurl = `${baseUrl}/posts/${deletId}.json`
//   Swal.fire({
//     title: "Are you sure?",
//     text: "You won't be able to revert this!",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Yes, delete it!"
//   }).then((result) => {
//     if (result.isConfirmed) {
//       try{
//         let res = await apicall(deleteurl,`DELETE`)
//         document.getElementById(deletId).remove()
//       Swal.fire({
//         title: "Deleted!",
//         text: "Your file has been deleted.",
//         icon: "success"
//       });
//     } catch(err){
//       cl(err)
//      } 
//  } });           
// }

   

let postobjtemplating = eve => {
 let card = document.createElement('div');
 card.className = 'card mb-4 background';
 card.id = eve.id
 card.innerHTML = `
                     <div class="card-header">
                         <h2>${eve.title}</h2>
                     </div>
                     <div class="card-body overflow-auto">
                         <p>${eve.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                         <button class="btn btn-outline-success" onclick="onEdit(this)"><strong>Edit</strong></button>
                         <button class="btn btn-outline-danger" onclick="onDelete(this)"><strong>Delete</strong></button>
                     </div>
                 </div>
             `
postCardContainer.append(card);
}

formcontrol.addEventListener(`submit`,onAddpost)
updatebtn.addEventListener(`click`,onUpdate)
  function scrollToTop() {
   window.scrollTo({
     top: 0,
     behavior: 'smooth'
   });
 }


//   const onDelete = eve => {
//     let deleteid = eve.closest('.card').id;
//     let deleteUrl = `${baseUrl}/posts/${deleteid}.json`;
//     Swal.fire({
//         title: "Are you sure?",
//         text: "You won't be able to revert this!",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!"
//       }).then((result) => {
//         if (result.isConfirmed) {
//             loader.classList.remove("d-none");
//             fetch(deleteUrl, {
//                 method: "delete",
//                 headers: {
//                     'content-type': 'application/json'
//                 }
//             })
//             .then(res => {
//                 loader.classList.add('d-none')
//                 return res.json();
//             })
//             .then(res => {
//                 document.getElementById(deleteid).parentNode.remove();
//                 Swal.fire({
//                     title: "Deleted!",
//                     text: "Your file has been deleted.",
//                     icon: "success",
//                     timer: 1000
//                   });
//             })
//             .catch(error => cl(error))
//             .finally(()=>{
//                 updtbtn.classList.add("d-none");
//                 submtbtn.classList.remove("d-none");
//                 postform.reset();
//             })
//         }
//       });       
// }